/**
 * Sitemap Crawler
 *
 * Fetches pearlscore.com/sitemap.xml (a sitemap index with nested sitemaps),
 * recursively fetches all nested sitemaps, extracts page URLs, filters out
 * excluded paths, and returns a deduplicated sorted list.
 */

export interface SitemapEntry {
  url: string;
  lastmod?: string;
}

/** Default paths to exclude from the crawl */
const DEFAULT_EXCLUDE_PATTERNS = [
  '/news/',
  '/news$',
  '/industry/',
  '/events/',
  '/success-stories/',
  '/success-stories$',
  '/sitemap$',
  '/sitemap/',
];

/** Sitemap section names to exclude entirely */
const EXCLUDED_SECTIONS = [
  'sitemaps-1-section-events',
  'sitemaps-1-section-news',
  'sitemaps-1-section-newsIndex',
  'sitemaps-1-section-successStories',
  'sitemaps-1-section-successStoriesIndex',
  'sitemaps-1-section-humanReadableSitemap',
];

/**
 * Fetch and parse a sitemap XML document.
 * Returns raw XML text.
 */
async function fetchSitemap(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${url} (${response.status} ${response.statusText})`);
  }
  return response.text();
}

/**
 * Extract <sitemap><loc> entries from a sitemap index XML.
 */
function extractSitemapLocs(xml: string): string[] {
  const locs: string[] = [];
  const pattern = /<sitemap>\s*<loc>([^<]+)<\/loc>/gi;
  let match;
  while ((match = pattern.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}

/**
 * Extract <url> entries from a sitemap XML.
 */
function extractUrlEntries(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const urlPattern = /<url>([\s\S]*?)<\/url>/gi;
  let match;

  while ((match = urlPattern.exec(xml)) !== null) {
    const block = match[1];

    const locMatch = block.match(/<loc>([^<]+)<\/loc>/i);
    if (!locMatch) continue;

    const url = locMatch[1].trim();
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/i);
    const lastmod = lastmodMatch ? lastmodMatch[1].trim() : undefined;

    entries.push({ url, lastmod });
  }

  return entries;
}

/**
 * Check if a sitemap URL corresponds to an excluded section.
 */
function isExcludedSection(sitemapUrl: string): boolean {
  return EXCLUDED_SECTIONS.some(section => sitemapUrl.includes(section));
}

/**
 * Check if a page URL matches any exclusion pattern.
 */
function isExcludedUrl(url: string, excludePatterns: string[]): boolean {
  const path = new URL(url).pathname;
  return excludePatterns.some(pattern => {
    if (pattern.endsWith('$')) {
      // Exact match (path equals the pattern minus the $)
      return path === pattern.slice(0, -1) || path === pattern.slice(0, -1) + '/';
    }
    return path.includes(pattern);
  });
}

/**
 * Crawl the pearlscore.com sitemap index and return all discoverable page URLs.
 *
 * @param sitemapUrl - URL of the sitemap index (default: https://pearlscore.com/sitemap.xml)
 * @param additionalExcludes - Extra path patterns to exclude beyond the defaults
 * @returns Deduplicated, sorted list of SitemapEntry objects
 */
export async function crawlSitemap(
  sitemapUrl: string = 'https://pearlscore.com/sitemap.xml',
  additionalExcludes: string[] = [],
): Promise<SitemapEntry[]> {
  const excludePatterns = [...DEFAULT_EXCLUDE_PATTERNS, ...additionalExcludes];

  // Step 1: Fetch the sitemap index
  console.log(`  Fetching sitemap index: ${sitemapUrl}`);
  const indexXml = await fetchSitemap(sitemapUrl);

  // Step 2: Extract nested sitemap URLs
  const nestedSitemapUrls = extractSitemapLocs(indexXml);

  if (nestedSitemapUrls.length === 0) {
    // Not an index — treat as a regular sitemap
    console.log('  Single sitemap detected (not an index)');
    const entries = extractUrlEntries(indexXml);
    return deduplicateAndSort(entries.filter(e => !isExcludedUrl(e.url, excludePatterns)));
  }

  console.log(`  Found ${nestedSitemapUrls.length} nested sitemaps`);

  // Step 3: Fetch each nested sitemap (skip excluded sections)
  const allEntries: SitemapEntry[] = [];

  for (const nestedUrl of nestedSitemapUrls) {
    if (isExcludedSection(nestedUrl)) {
      const sectionName = nestedUrl.split('/').pop() || nestedUrl;
      console.log(`  Skipping excluded section: ${sectionName}`);
      continue;
    }

    const sectionName = nestedUrl.split('/').pop() || nestedUrl;
    try {
      const nestedXml = await fetchSitemap(nestedUrl);
      const entries = extractUrlEntries(nestedXml);
      const filtered = entries.filter(e => !isExcludedUrl(e.url, excludePatterns));
      console.log(`  ${sectionName}: ${filtered.length} pages (${entries.length - filtered.length} excluded)`);
      allEntries.push(...filtered);
    } catch (err) {
      console.warn(`  Warning: Failed to fetch ${sectionName}: ${err instanceof Error ? err.message : err}`);
    }
  }

  return deduplicateAndSort(allEntries);
}

/**
 * Deduplicate entries by URL and sort alphabetically.
 */
function deduplicateAndSort(entries: SitemapEntry[]): SitemapEntry[] {
  const seen = new Map<string, SitemapEntry>();

  for (const entry of entries) {
    // Normalize URL: remove trailing slash for dedup
    const normalized = entry.url.replace(/\/$/, '');
    if (!seen.has(normalized)) {
      seen.set(normalized, entry);
    } else {
      // Keep the one with the more recent lastmod
      const existing = seen.get(normalized)!;
      if (entry.lastmod && (!existing.lastmod || entry.lastmod > existing.lastmod)) {
        seen.set(normalized, entry);
      }
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.url.localeCompare(b.url));
}
