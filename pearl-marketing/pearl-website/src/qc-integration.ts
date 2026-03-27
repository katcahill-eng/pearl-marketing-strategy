/**
 * Content QC Integration
 *
 * Delegates brand compliance checks to the Content QC spoke (pearl-content-qc).
 * Imports runQC() from the sibling project and sends each scraped page's text.
 */

import type { ScrapedPage } from './page-scraper';

// Types mirrored from pearl-content-qc/src/qc-runner.ts
export interface QCIssue {
  category: string;
  originalText: string;
  issue: string;
  suggestedFix: string;
  confidence: string;
}

export interface QCResult {
  grade: string;
  criticalIssues: QCIssue[];
  importantIssues: QCIssue[];
  minorIssues: QCIssue[];
  summary: string;
}

export interface PageQCResult {
  url: string;
  title: string;
  qcResult: QCResult | null;
  skipped: boolean;
  error?: string;
}

type RunQCFn = (content: string) => Promise<QCResult>;

let _runQC: RunQCFn | null = null;

/**
 * Lazily load the runQC function from the sibling pearl-content-qc project.
 * Uses require() for runtime resolution via tsx.
 */
function loadRunQC(): RunQCFn {
  if (_runQC) return _runQC;
  try {
    // pearl-content-qc is a sibling project — loaded at runtime via tsx
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../../pearl-content-qc/src/qc-runner');
    _runQC = mod.runQC as RunQCFn;
    return _runQC;
  } catch {
    throw new Error(
      'Content QC module not found. Ensure pearl-content-qc/ exists as a sibling project.\n' +
      'Run: cd ../pearl-content-qc && npm install'
    );
  }
}

/**
 * Run Content QC on a list of scraped pages.
 *
 * @param pages - Scraped pages to QC
 * @param skipQC - If true, return null results (crawl-only mode)
 * @param onProgress - Optional progress callback
 * @returns Array of PageQCResult with grades and issues for each page
 */
export async function runPageQC(
  pages: ScrapedPage[],
  skipQC: boolean = false,
  onProgress?: (current: number, total: number, url: string) => void,
): Promise<PageQCResult[]> {
  if (skipQC) {
    return pages.map(page => ({
      url: page.url,
      title: page.title,
      qcResult: null,
      skipped: true,
    }));
  }

  let runQC: RunQCFn;
  try {
    runQC = loadRunQC();
  } catch (err) {
    console.warn(`  Warning: ${err instanceof Error ? err.message : err}`);
    console.warn('  Skipping QC for all pages.\n');
    return pages.map(page => ({
      url: page.url,
      title: page.title,
      qcResult: null,
      skipped: true,
      error: 'Content QC module unavailable',
    }));
  }

  const results: PageQCResult[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    onProgress?.(i + 1, pages.length, page.url);

    try {
      const qcResult = await runQC(page.fullText);
      results.push({
        url: page.url,
        title: page.title,
        qcResult,
        skipped: false,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`  Warning: QC failed for ${page.url}: ${errorMsg}`);
      results.push({
        url: page.url,
        title: page.title,
        qcResult: null,
        skipped: false,
        error: errorMsg,
      });
    }
  }

  return results;
}
