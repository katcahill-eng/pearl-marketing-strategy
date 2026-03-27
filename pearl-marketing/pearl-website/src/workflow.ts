/**
 * Workflow Orchestrator
 *
 * Coordinates the full website QC pipeline:
 *   1. Crawl sitemap (or use --pages)
 *   2. Scrape each page
 *   3. Run QC on each page (unless --skip-qc)
 *   4. Generate report
 *   5. Print summary
 */

import { join } from 'path';
import { crawlSitemap } from './sitemap-crawler';
import { scrapePages, type ScrapedPage } from './page-scraper';
import { runPageQC, type PageQCResult } from './qc-integration';
import { generateReport, printConsoleSummary } from './report-generator';

export interface ScanOptions {
  /** Specific pages to scan (skips sitemap crawl) */
  pages?: string[];
  /** Additional path patterns to exclude */
  exclude?: string[];
  /** Skip Content QC (crawl + scrape only) */
  skipQC?: boolean;
}

export interface ScanResult {
  pages: ScrapedPage[];
  qcResults: PageQCResult[];
  reportPath: string | null;
  totalPages: number;
  successfulScrapes: number;
  failedScrapes: number;
  durationMs: number;
}

/**
 * Run the full website scan pipeline.
 */
export async function runWebsiteScan(options: ScanOptions = {}): Promise<ScanResult> {
  const startTime = Date.now();
  const { pages: specificPages, exclude = [], skipQC = false } = options;
  const outputDir = join(__dirname, '..', 'output');

  // Step 1: Discover pages
  let urls: string[];

  if (specificPages && specificPages.length > 0) {
    console.log(`\n  Step 1: Using ${specificPages.length} specified page(s)\n`);
    urls = specificPages;
  } else {
    console.log('\n  Step 1: Crawling sitemap\n');
    const entries = await crawlSitemap('https://pearlscore.com/sitemap.xml', exclude);
    urls = entries.map(e => e.url);
    console.log(`\n  Found ${urls.length} pages to scan\n`);
  }

  // Step 2: Scrape pages
  console.log(`  Step 2: Scraping ${urls.length} page(s)\n`);
  const { successes, failures } = await scrapePages(
    urls,
    1000,
    (current, total, url, success) => {
      const status = success ? 'OK' : 'FAIL';
      const path = url.replace('https://pearlscore.com', '').replace('https://www.pearlscore.com', '') || '/';
      console.log(`  [${current}/${total}] ${status} ${path}`);
    },
  );

  if (failures.length > 0) {
    console.log(`\n  ${failures.length} page(s) failed to scrape:`);
    for (const f of failures) {
      console.log(`    ${f.url}: ${f.error}`);
    }
  }
  console.log(`\n  Scraped ${successes.length} of ${urls.length} pages\n`);

  // Step 3: Run QC
  let qcResults: PageQCResult[];
  if (skipQC) {
    console.log('  Step 3: QC skipped (--skip-qc)\n');
    qcResults = successes.map(page => ({
      url: page.url,
      title: page.title,
      qcResult: null,
      skipped: true,
    }));
  } else {
    console.log(`  Step 3: Running Content QC on ${successes.length} page(s)\n`);
    qcResults = await runPageQC(
      successes,
      false,
      (current, total, url) => {
        const path = url.replace('https://pearlscore.com', '').replace('https://www.pearlscore.com', '') || '/';
        console.log(`  [${current}/${total}] QC: ${path}`);
      },
    );
  }

  // Step 4: Generate report
  console.log('  Step 4: Generating report\n');
  let reportPath: string | null = null;
  try {
    reportPath = await generateReport({
      pages: successes,
      qcResults,
      outputDir,
    });
    console.log(`  Report saved: ${reportPath}\n`);
  } catch (err) {
    console.error(`  Error generating report: ${err instanceof Error ? err.message : err}\n`);
  }

  // Step 5: Print summary
  if (!skipQC) {
    printConsoleSummary(qcResults);
  } else {
    console.log(`\n  Crawled ${successes.length} pages (QC skipped)\n`);
    console.log('  Pages found:');
    for (const page of successes) {
      const path = page.url.replace('https://pearlscore.com', '').replace('https://www.pearlscore.com', '') || '/';
      console.log(`    ${path} — ${page.title || '(no title)'}`);
    }
    console.log('');
  }

  const durationMs = Date.now() - startTime;
  const durationSec = (durationMs / 1000).toFixed(1);
  console.log(`  Done in ${durationSec}s\n`);

  return {
    pages: successes,
    qcResults,
    reportPath,
    totalPages: urls.length,
    successfulScrapes: successes.length,
    failedScrapes: failures.length,
    durationMs,
  };
}
