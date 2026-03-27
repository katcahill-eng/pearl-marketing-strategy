#!/usr/bin/env node

import 'dotenv/config';
import { runWebsiteScan, type ScanOptions } from './workflow';

function printHelp(): void {
  console.log(`
pearl-website — Website Manager for Pearl Marketing OS

Usage:
  pearl-website scan                     Full pipeline: crawl + scrape + QC + report
  pearl-website scan --skip-qc           Crawl and scrape only (no QC)
  pearl-website scan --pages <urls>      Scan specific pages (comma-separated)
  pearl-website scan --exclude <paths>   Additional path exclusions (comma-separated)
  pearl-website --help                   Show this help

Options:
  --skip-qc              Skip Content QC (crawl + scrape only)
  --pages <urls>         Comma-separated URLs to scan instead of full sitemap
  --exclude <paths>      Comma-separated path patterns to exclude (e.g., /blog/,/about/)

Examples:
  pearl-website scan
  pearl-website scan --skip-qc
  pearl-website scan --pages https://pearlscore.com/,https://pearlscore.com/about
  pearl-website scan --exclude /blog/,/partner/
`);
}

interface ParsedArgs {
  command: string | null;
  options: ScanOptions;
}

function parseArgs(args: string[]): ParsedArgs {
  const options: ScanOptions = {};
  let command: string | null = null;
  let i = 0;

  while (i < args.length) {
    const arg = args[i];
    switch (arg) {
      case 'scan':
        command = 'scan';
        break;
      case '--skip-qc':
        options.skipQC = true;
        break;
      case '--pages':
        options.pages = args[++i]?.split(',').map(u => u.trim()).filter(Boolean);
        break;
      case '--exclude':
        options.exclude = args[++i]?.split(',').map(p => p.trim()).filter(Boolean);
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        if (!arg.startsWith('--')) {
          if (!command) command = arg;
        } else {
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
        }
        break;
    }
    i++;
  }

  return { command, options };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('pearl-website — Website Manager\n');
    console.log('Run "pearl-website scan" to scan pearlscore.com.\n');
    printHelp();
    process.exit(0);
  }

  const { command, options } = parseArgs(args);

  if (command !== 'scan') {
    console.error(`Unknown command: ${command || '(none)'}`);
    console.error('Available commands: scan');
    console.error('Run pearl-website --help for usage.');
    process.exit(1);
  }

  try {
    await runWebsiteScan(options);
  } catch (err) {
    console.error(`\nError: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}

main();
