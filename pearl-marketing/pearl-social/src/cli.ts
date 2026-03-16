#!/usr/bin/env node

import 'dotenv/config';
import { runSocialWorkflow, type SocialWorkflowOptions } from './workflow';

function printHelp(): void {
  console.log(`
pearl-social — Social Media Coordinator for Pearl Marketing OS

Usage:
  pearl-social <blog-url>                 Generate posts from a live blog
  pearl-social --draft <file>             Use existing draft posts
  pearl-social --help                     Show this help

Options:
  --draft <file>         Read draft posts from file (text or JSON)
  --title <title>        Blog title (required with --draft)
  --dry-run              Preview posts without generating CSV
  --refresh-tone         Force tone profile regeneration from Sprout CSV
  --tone-csv <path>      Path to Sprout Social export CSV
  --spacing <days>       Days between post types (default: 4)
  --start-date <date>    First post date, YYYY-MM-DD (default: tomorrow)

Draft File Format (text):
  [linkedin]
  LinkedIn post content...

  [x followup]
  Follow-up tweet...

  [meta quote: Jane Doe]
  VIP quote post for Meta...

Examples:
  pearl-social https://www.pearlscore.com/blog/home-performance-guide
  pearl-social --draft posts.txt --title "Home Performance Guide"
  pearl-social https://www.pearlscore.com/blog/post --dry-run --spacing 5
`);
}

function parseArgs(args: string[]): SocialWorkflowOptions {
  const options: SocialWorkflowOptions = {};
  let i = 0;

  while (i < args.length) {
    const arg = args[i];
    switch (arg) {
      case '--draft':
        options.draftPath = args[++i];
        break;
      case '--title':
        options.blogTitle = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--refresh-tone':
        options.refreshTone = true;
        break;
      case '--tone-csv':
        options.toneCsvPath = args[++i];
        break;
      case '--spacing':
        options.spacingDays = parseInt(args[++i], 10);
        break;
      case '--start-date':
        options.startDate = args[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        if (!arg.startsWith('--')) {
          options.blogUrl = arg;
        } else {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
        break;
    }
    i++;
  }

  return options;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('pearl-social — Social Media Coordinator\n');
    console.log('Provide a blog URL to generate social posts, or --draft to use existing content.\n');
    printHelp();
    process.exit(0);
  }

  const options = parseArgs(args);

  if (options.draftPath && !options.blogTitle) {
    console.warn('⚠ No --title provided with --draft. Using "Draft" as blog title.');
  }

  try {
    await runSocialWorkflow(options);
  } catch (err) {
    console.error(`\nError: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}

main();
