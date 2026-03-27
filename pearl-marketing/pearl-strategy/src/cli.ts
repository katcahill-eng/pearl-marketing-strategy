#!/usr/bin/env node

import * as path from 'path';
import { config } from 'dotenv';

// Load .env from spoke root, then fall back to project root
config({ path: path.resolve(__dirname, '..', '.env') });
config({ path: path.resolve(__dirname, '..', '..', '.env') });

import { generateStrategyBrief } from './brief-generator';
import { generateNegotiationBrief } from './negotiation-generator';

// --- CLI Argument Parsing ---

interface CLIArgs {
  command: 'brief' | 'negotiate' | 'help';
  topic?: string;
  partner?: string;
  context?: string;
  outputDir?: string;
  help: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: CLIArgs = {
    command: 'help',
    help: false,
  };

  if (args.length === 0) {
    parsed.help = true;
    return parsed;
  }

  // First positional arg is the command
  const command = args[0];
  if (command === '--help' || command === '-h') {
    parsed.help = true;
    return parsed;
  }

  if (command === 'brief') {
    parsed.command = 'brief';
  } else if (command === 'negotiate') {
    parsed.command = 'negotiate';
  } else {
    console.error(`Error: Unknown command: ${command}`);
    console.error('Available commands: brief, negotiate');
    console.error('Run with --help for usage information.');
    process.exit(1);
  }

  // Parse remaining args
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--topic' || arg === '-t') {
      i++;
      if (i >= args.length) {
        console.error('Error: --topic requires a value');
        process.exit(1);
      }
      parsed.topic = args[i];
    } else if (arg === '--partner' || arg === '-p') {
      i++;
      if (i >= args.length) {
        console.error('Error: --partner requires a value');
        process.exit(1);
      }
      parsed.partner = args[i];
    } else if (arg === '--context' || arg === '-c') {
      i++;
      if (i >= args.length) {
        console.error('Error: --context requires a value');
        process.exit(1);
      }
      parsed.context = args[i];
    } else if (arg === '--output-dir' || arg === '-o') {
      i++;
      if (i >= args.length) {
        console.error('Error: --output-dir requires a value');
        process.exit(1);
      }
      parsed.outputDir = path.resolve(args[i]);
    } else {
      console.error(`Error: Unknown option: ${arg}`);
      process.exit(1);
    }
  }

  return parsed;
}

function printUsage(): void {
  console.log(`
pearl-strategy — Marketing Strategist for Pearl Marketing OS

USAGE:
  pearl-strategy brief --topic <topic>                     Generate a strategy brief
  pearl-strategy negotiate --partner <name> --context <desc>  Generate a negotiation brief
  pearl-strategy --help                                    Show this help message

COMMANDS:
  brief       Generate a strategy brief with multiple options and tradeoffs
  negotiate   Generate a negotiation brief with asks, leverage, and sequencing

OPTIONS:
  -t, --topic <topic>         Topic for strategy brief (required for brief)
  -p, --partner <name>        Partner name for negotiation brief (required for negotiate)
  -c, --context <description> Additional context for the brief (optional)
  -o, --output-dir <dir>      Override output directory (default: ./output)
  -h, --help                  Show this help message

EXAMPLES:
  pearl-strategy brief --topic "Q2 content strategy for B2B audience"
  pearl-strategy brief --topic "Product-led growth for Pearl App" --context "Focus on free SCORE lookup as acquisition channel"
  pearl-strategy negotiate --partner "realtor.com" --context "Potential data licensing deal, they want a discount on API access"
  pearl-strategy negotiate --partner "NAR" --context "Co-marketing partnership for agent adoption campaign"

ENVIRONMENT:
  ANTHROPIC_API_KEY            Required — your Anthropic API key
`);
}

function printBriefHelp(): void {
  console.log(`
pearl-strategy brief — Generate a strategy brief

USAGE:
  pearl-strategy brief --topic <topic> [--context <description>] [--output-dir <dir>]

The brief includes:
  1. Executive Summary
  2. Situation Analysis
  3. Strategic Options (3+ with pros, cons, effort, impact)
  4. Recommended Approach
  5. Risks & Mitigations
  6. Next Steps

EXAMPLES:
  pearl-strategy brief --topic "Q2 content strategy"
  pearl-strategy brief --topic "Agent adoption strategy" --context "Post-NAR settlement landscape"
`);
}

function printNegotiateHelp(): void {
  console.log(`
pearl-strategy negotiate — Generate a negotiation brief

USAGE:
  pearl-strategy negotiate --partner <name> [--context <description>] [--output-dir <dir>]

The brief includes:
  1. Partner Profile
  2. Pearl's Leverage
  3. Primary Asks
  4. Value-Add Asks (5+ low-cost/high-value counters)
  5. Walk-Away Criteria
  6. Negotiation Sequence
  7. Talking Points

EXAMPLES:
  pearl-strategy negotiate --partner "realtor.com" --context "Data licensing deal negotiation"
  pearl-strategy negotiate --partner "NAR" --context "Co-marketing partnership for agent tools"
`);
}

/**
 * Format duration in seconds with one decimal.
 */
function formatDuration(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

// --- Main ---

async function main(): Promise<void> {
  const args = parseArgs();

  // Handle help for specific commands
  if (args.help) {
    if (args.command === 'brief') {
      printBriefHelp();
    } else if (args.command === 'negotiate') {
      printNegotiateHelp();
    } else {
      printUsage();
    }
    process.exit(0);
  }

  // Validate required arguments per command before checking API key
  if (args.command === 'brief' && !args.topic) {
    console.error('Error: --topic is required for the brief command.');
    console.error('Run "pearl-strategy brief --help" for usage.');
    process.exit(1);
  }

  if (args.command === 'negotiate' && !args.partner) {
    console.error('Error: --partner is required for the negotiate command.');
    console.error('Run "pearl-strategy negotiate --help" for usage.');
    process.exit(1);
  }

  // Validate API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required.');
    console.error('Set it in your environment or in a .env file in the project root.');
    process.exit(1);
  }

  if (args.command === 'brief') {
    const result = await generateStrategyBrief({
      topic: args.topic!,
      context: args.context,
      outputDir: args.outputDir,
    });

    console.log(result.markdown);
    console.log(`\n---`);
    console.log(`Saved to: ${result.filePath}`);
    console.log(`Generation time: ${formatDuration(result.durationMs)}`);
  } else if (args.command === 'negotiate') {
    const result = await generateNegotiationBrief({
      partner: args.partner!,
      context: args.context,
      outputDir: args.outputDir,
    });

    console.log(result.markdown);
    console.log(`\n---`);
    console.log(`Saved to: ${result.filePath}`);
    console.log(`Generation time: ${formatDuration(result.durationMs)}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
