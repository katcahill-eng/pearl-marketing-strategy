#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load .env from the project root
config({ path: path.resolve(__dirname, '..', '.env') });

import { runQC } from './qc-runner';
import { generateReportCard } from './report-card';
import { generateExcel } from './excel-generator';
import { readGoogleDoc } from './google-docs-reader';

// --- CLI Argument Parsing ---

interface CLIArgs {
  input?: string;       // Local file path (--input <file>)
  googleDocId?: string;  // Google Doc URL or ID (positional arg)
  outputDir: string;    // Output directory (--output-dir, defaults to ./output)
  help: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: CLIArgs = {
    outputDir: path.resolve(process.cwd(), 'output'),
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--input' || arg === '-i') {
      i++;
      if (i >= args.length) {
        console.error('Error: --input requires a file path argument');
        process.exit(1);
      }
      parsed.input = args[i];
    } else if (arg === '--output-dir' || arg === '-o') {
      i++;
      if (i >= args.length) {
        console.error('Error: --output-dir requires a directory path argument');
        process.exit(1);
      }
      parsed.outputDir = path.resolve(args[i]);
    } else if (!arg.startsWith('-')) {
      // Positional argument — treat as Google Doc URL or ID
      parsed.googleDocId = arg;
    } else {
      console.error(`Error: Unknown option: ${arg}`);
      process.exit(1);
    }
  }

  return parsed;
}

function printUsage(): void {
  console.log(`
Pearl Content QC — Review content against brand guidelines

USAGE:
  pearl-qc <google-doc-url-or-id>       Review a Google Doc
  pearl-qc --input <file>               Review a local file
  pearl-qc --help                        Show this help message

OPTIONS:
  -i, --input <file>          Path to a local file to review
  -o, --output-dir <dir>      Directory for Excel output (default: ./output)
  -h, --help                  Show this help message

EXAMPLES:
  pearl-qc https://docs.google.com/document/d/1abc123/edit
  pearl-qc 1abc123
  pearl-qc --input ./draft.md
  pearl-qc --input ./draft.txt --output-dir ./reports

ENVIRONMENT:
  ANTHROPIC_API_KEY            Required — your Anthropic API key
  GOOGLE_SERVICE_ACCOUNT_JSON  Required for Google Docs — service account JSON
`);
}

// --- Main ---

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  // Validate that we have an input source
  if (!args.input && !args.googleDocId) {
    console.error('Error: Provide either a Google Doc URL/ID or --input <file>');
    console.error('Run pearl-qc --help for usage information.');
    process.exit(1);
  }

  // Validate API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required.');
    console.error('Set it in your environment or in a .env file in the project root.');
    process.exit(1);
  }

  // Read content
  let content: string;
  let sourceName: string;

  if (args.input) {
    // Read from local file
    const filePath = path.resolve(args.input);
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }
    content = fs.readFileSync(filePath, 'utf-8');
    sourceName = path.basename(filePath, path.extname(filePath));
    console.log(`Reading content from: ${filePath}`);
  } else {
    // Read from Google Doc
    console.log(`Reading Google Doc: ${args.googleDocId}`);
    try {
      content = await readGoogleDoc(args.googleDocId!);
      sourceName = `gdoc-${args.googleDocId!.slice(0, 12)}`;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error reading Google Doc: ${message}`);
      process.exit(1);
    }
  }

  if (!content.trim()) {
    console.error('Error: Content is empty. Nothing to review.');
    process.exit(1);
  }

  console.log(`Content length: ${content.length} characters`);
  console.log('');
  console.log('Running QC review...');
  console.log('');

  // Run QC
  const result = await runQC(content);

  // Generate and display report card
  const reportCard = generateReportCard(result);
  console.log(reportCard);

  // Generate Excel workbook
  console.log('');
  console.log('Generating Excel workbook...');

  const excelBuffer = await generateExcel(result);

  // Ensure output directory exists
  if (!fs.existsSync(args.outputDir)) {
    fs.mkdirSync(args.outputDir, { recursive: true });
  }

  // Write Excel file
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const excelPath = path.join(args.outputDir, `Pearl_QC_${sourceName}_${timestamp}.xlsx`);
  fs.writeFileSync(excelPath, excelBuffer);
  console.log(`Excel report saved to: ${excelPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
