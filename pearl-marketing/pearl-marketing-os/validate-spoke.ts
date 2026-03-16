#!/usr/bin/env npx tsx

/**
 * Pearl Marketing OS — Spoke Manifest Validator
 *
 * Validates a spoke.yaml manifest against the spoke-manifest-schema.json.
 *
 * Usage: npx tsx pearl-marketing-os/validate-spoke.ts <path-to-spoke.yaml>
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';

// Simple YAML parser for flat/nested structures used in spoke manifests.
// Avoids external dependency for a validation script.
function parseYaml(content: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = content.split('\n');
  let currentKey = '';
  let currentArray: unknown[] | null = null;
  let currentObject: Record<string, string> | null = null;

  for (const rawLine of lines) {
    // Skip comments and empty lines
    if (rawLine.trim().startsWith('#') || rawLine.trim() === '') {
      continue;
    }

    const indentLevel = rawLine.search(/\S/);

    // Top-level key: value
    if (indentLevel === 0 && rawLine.includes(':')) {
      // Save previous array if any
      if (currentArray !== null && currentKey) {
        result[currentKey] = currentArray;
        currentArray = null;
      }

      const colonIdx = rawLine.indexOf(':');
      const key = rawLine.slice(0, colonIdx).trim();
      const value = rawLine.slice(colonIdx + 1).trim();

      currentKey = key;

      if (value === '' || value === '[]') {
        // Will be filled by subsequent indented lines, or empty array
        if (value === '[]') {
          result[key] = [];
          currentKey = '';
        }
      } else {
        // Inline value
        result[key] = unquote(value);
        currentKey = '';
      }
      continue;
    }

    // Nested under invoke:
    if (indentLevel >= 2 && currentKey === 'invoke') {
      if (!result['invoke']) {
        result['invoke'] = {} as Record<string, string>;
      }
      const colonIdx = rawLine.indexOf(':');
      if (colonIdx > -1) {
        const subKey = rawLine.slice(0, colonIdx).trim();
        const subValue = rawLine.slice(colonIdx + 1).trim();
        (result['invoke'] as Record<string, string>)[subKey] = unquote(subValue);
      }
      continue;
    }

    // Array item: - value or - key: value
    if (rawLine.trim().startsWith('- ')) {
      if (currentArray === null) {
        currentArray = [];
      }
      const itemContent = rawLine.trim().slice(2).trim();

      // Check if it's a key: value pair (capability/input/output style)
      const colonIdx = itemContent.indexOf(':');
      if (colonIdx > -1 && !itemContent.startsWith('"') && !itemContent.startsWith("'")) {
        const k = itemContent.slice(0, colonIdx).trim();
        const v = itemContent.slice(colonIdx + 1).trim();
        const obj: Record<string, string> = {};
        obj[k] = unquote(v);
        currentArray.push(obj);
      } else {
        currentArray.push(unquote(itemContent));
      }
      continue;
    }
  }

  // Save last array
  if (currentArray !== null && currentKey) {
    result[currentKey] = currentArray;
  }

  return result;
}

function unquote(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

interface ValidationError {
  field: string;
  message: string;
}

function validate(manifest: Record<string, unknown>, schemaPath: string, manifestPath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  const required: string[] = schema.required || [];
  const properties = schema.properties || {};

  // Check required fields
  for (const field of required) {
    if (!(field in manifest)) {
      errors.push({ field, message: `Required field "${field}" is missing` });
    }
  }

  // Validate name format
  if (typeof manifest.name === 'string') {
    if (!/^[a-z][a-z0-9-]*$/.test(manifest.name)) {
      errors.push({ field: 'name', message: `Name must be kebab-case (lowercase letters, numbers, hyphens). Got: "${manifest.name}"` });
    }
  } else if (manifest.name !== undefined) {
    errors.push({ field: 'name', message: 'Name must be a string' });
  }

  // Validate display_name
  if (manifest.display_name !== undefined && typeof manifest.display_name !== 'string') {
    errors.push({ field: 'display_name', message: 'display_name must be a string' });
  }

  // Validate version format
  if (typeof manifest.version === 'string') {
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
      errors.push({ field: 'version', message: `Version must be semver (e.g., 1.0.0). Got: "${manifest.version}"` });
    }
  } else if (manifest.version !== undefined) {
    errors.push({ field: 'version', message: 'Version must be a string' });
  }

  // Validate description length
  if (typeof manifest.description === 'string') {
    if (manifest.description.length < 10) {
      errors.push({ field: 'description', message: `Description must be at least 10 characters. Got ${manifest.description.length}` });
    }
  }

  // Validate aliases
  if (manifest.aliases !== undefined) {
    if (!Array.isArray(manifest.aliases)) {
      errors.push({ field: 'aliases', message: 'aliases must be an array' });
    } else if (manifest.aliases.length === 0) {
      errors.push({ field: 'aliases', message: 'aliases must have at least 1 entry' });
    } else {
      for (const alias of manifest.aliases) {
        if (typeof alias !== 'string') {
          errors.push({ field: 'aliases', message: `Each alias must be a string. Got: ${typeof alias}` });
        }
      }
    }
  }

  // Validate capabilities
  if (manifest.capabilities !== undefined) {
    if (!Array.isArray(manifest.capabilities)) {
      errors.push({ field: 'capabilities', message: 'capabilities must be an array' });
    } else if (manifest.capabilities.length === 0) {
      errors.push({ field: 'capabilities', message: 'capabilities must have at least 1 entry' });
    } else {
      for (const cap of manifest.capabilities) {
        if (typeof cap !== 'object' || cap === null) {
          errors.push({ field: 'capabilities', message: 'Each capability must be an object with {name: description}' });
        }
      }
    }
  }

  // Validate shared_services
  const validServices = ['claude_api', 'brand_context', 'canva', 'google_workspace', 'asset_storage'];
  if (manifest.shared_services !== undefined && Array.isArray(manifest.shared_services)) {
    for (const service of manifest.shared_services) {
      if (!validServices.includes(service as string)) {
        errors.push({ field: 'shared_services', message: `Unknown service "${service}". Valid: ${validServices.join(', ')}` });
      }
    }
  }

  // Validate invoke
  if (manifest.invoke !== undefined) {
    const invoke = manifest.invoke as Record<string, string>;
    if (!invoke.cli) {
      errors.push({ field: 'invoke.cli', message: 'invoke.cli is required' });
    }
    if (!invoke.library) {
      errors.push({ field: 'invoke.library', message: 'invoke.library is required' });
    }
  }

  // Validate invoke.cli references an existing file (best-effort check)
  if (manifest.invoke && (manifest.invoke as Record<string, string>).cli) {
    const cliCommand = (manifest.invoke as Record<string, string>).cli;
    // Extract file path from command like "npx tsx src/cli.ts --input {content}"
    const match = cliCommand.match(/(?:npx\s+tsx\s+|node\s+)([^\s{]+)/);
    if (match) {
      const spokeDir = dirname(manifestPath);
      const cliFilePath = resolve(spokeDir, match[1]);
      // Check for .ts version (source) since dist may not be built
      if (!existsSync(cliFilePath)) {
        errors.push({ field: 'invoke.cli', message: `CLI entry point not found: ${cliFilePath}` });
      }
    }
  }

  // Validate dependencies is an array
  if (manifest.dependencies !== undefined && !Array.isArray(manifest.dependencies)) {
    errors.push({ field: 'dependencies', message: 'dependencies must be an array' });
  }

  return errors;
}

// --- Main ---

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: npx tsx pearl-marketing-os/validate-spoke.ts <path-to-spoke.yaml>');
  process.exit(1);
}

const manifestPath = resolve(args[0]);

if (!existsSync(manifestPath)) {
  console.error(`File not found: ${manifestPath}`);
  process.exit(1);
}

const schemaPath = join(__dirname, 'spoke-manifest-schema.json');

if (!existsSync(schemaPath)) {
  console.error(`Schema not found: ${schemaPath}`);
  process.exit(1);
}

console.log(`Validating: ${manifestPath}\n`);

const content = readFileSync(manifestPath, 'utf-8');
const manifest = parseYaml(content);

const errors = validate(manifest, schemaPath, manifestPath);

if (errors.length === 0) {
  console.log(`PASS: ${manifest.display_name || manifest.name} (${manifest.version})`);
  console.log(`  Aliases: ${(manifest.aliases as string[]).join(', ')}`);
  console.log(`  Capabilities: ${(manifest.capabilities as Record<string, string>[]).map(c => Object.keys(c)[0]).join(', ')}`);
  console.log(`  Shared services: ${(manifest.shared_services as string[] || []).join(', ') || 'none'}`);
  console.log(`  Dependencies: ${(manifest.dependencies as string[] || []).join(', ') || 'none'}`);
  process.exit(0);
} else {
  console.log(`FAIL: ${errors.length} validation error(s)\n`);
  for (const error of errors) {
    console.log(`  [${error.field}] ${error.message}`);
  }
  process.exit(1);
}
