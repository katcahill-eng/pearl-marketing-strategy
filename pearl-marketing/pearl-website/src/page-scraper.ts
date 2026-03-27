/**
 * Page Scraper
 *
 * Fetches page HTML using native fetch (pearlscore.com is server-rendered Craft CMS),
 * extracts structured content: title, meta description, headings with body text.
 * Strips navigation, footer, scripts, and styles.
 */

export interface PageSection {
  heading: string;
  level: number; // 1 = h1, 2 = h2, 3 = h3
  body: string;
}

export interface ScrapedPage {
  url: string;
  title: string;
  metaDescription: string;
  sections: PageSection[];
  fullText: string; // All visible text concatenated (for QC)
  scrapedAt: string;
}

/**
 * Rate-limit helper: wait a specified number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Strip HTML tags from a string.
 */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
}

/**
 * Decode common HTML entities.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

/**
 * Extract the page title from HTML.
 * Priority: og:title > <title> > first <h1>
 */
function extractTitle(html: string): string {
  // og:title
  const ogMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
    || html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i);
  if (ogMatch) return decodeEntities(ogMatch[1]);

  // <title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return decodeEntities(titleMatch[1]).replace(/\s*[\|–—]\s*Pearl.*$/i, '').trim();

  // First h1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return stripTags(h1Match[1]).trim();

  return '';
}

/**
 * Extract meta description from HTML.
 */
function extractMetaDescription(html: string): string {
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)
    || html.match(/<meta\s+content="([^"]+)"\s+property="og:description"/i);
  if (ogDesc) return decodeEntities(ogDesc[1]);

  const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)
    || html.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
  if (metaDesc) return decodeEntities(metaDesc[1]);

  return '';
}

/**
 * Remove non-content elements from HTML (nav, header, footer, scripts, styles).
 */
function stripChrome(html: string): string {
  // Remove script, style, noscript, nav, header, footer tags and their content
  let cleaned = html.replace(/<(script|style|noscript|nav|header|footer|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Remove elements with common navigation/footer classes
  cleaned = cleaned.replace(/<[^>]*class="[^"]*(?:nav|navbar|footer|menu|breadcrumb|sidebar|cookie|banner)[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, '');

  // Remove SVG elements
  cleaned = cleaned.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');

  return cleaned;
}

/**
 * Extract structured sections from HTML (headings + their body text).
 */
function extractSections(html: string): PageSection[] {
  const cleanedHtml = stripChrome(html);
  const sections: PageSection[] = [];

  // Split by heading tags to find sections
  const headingPattern = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings: { level: number; text: string; index: number }[] = [];
  let match;

  while ((match = headingPattern.exec(cleanedHtml)) !== null) {
    const level = parseInt(match[1].charAt(1), 10);
    const text = decodeEntities(stripTags(match[2])).trim();
    if (text) {
      headings.push({ level, text, index: match.index + match[0].length });
    }
  }

  if (headings.length === 0) {
    // No headings found — treat the entire body as one section
    const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const content = bodyMatch ? bodyMatch[1] : cleanedHtml;
    const text = decodeEntities(stripTags(content)).replace(/\s+/g, ' ').trim();
    if (text) {
      sections.push({ heading: '(no heading)', level: 0, body: text });
    }
    return sections;
  }

  // Extract body text between headings
  for (let i = 0; i < headings.length; i++) {
    const startIndex = headings[i].index;
    const endIndex = i + 1 < headings.length
      ? cleanedHtml.lastIndexOf(`<h`, headings[i + 1].index)
      : cleanedHtml.length;

    const bodyHtml = cleanedHtml.slice(startIndex, endIndex);
    // Replace block-level tags with newlines, strip the rest
    const bodyText = bodyHtml
      .replace(/<\/?(p|div|br|li|ul|ol|blockquote)[^>]*>/gi, '\n')
      .replace(/<(h[1-6])[^>]*>[\s\S]*?<\/\1>/gi, '') // Remove nested headings
      .replace(/<[^>]+>/g, '') // Strip remaining tags
      .split('\n')
      .map(line => decodeEntities(line).trim())
      .filter(line => line.length > 0)
      .join('\n');

    sections.push({
      heading: headings[i].text,
      level: headings[i].level,
      body: bodyText,
    });
  }

  return sections;
}

/**
 * Scrape a single page and return structured content.
 */
export async function scrapePage(url: string): Promise<ScrapedPage> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'PearlWebsiteManager/1.0 (internal audit)',
      'Accept': 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  const title = extractTitle(html);
  const metaDescription = extractMetaDescription(html);
  const sections = extractSections(html);

  // Build full text for QC: title + meta + all section content
  const textParts: string[] = [];
  if (title) textParts.push(`Page Title: ${title}`);
  if (metaDescription) textParts.push(`Meta Description: ${metaDescription}`);
  for (const section of sections) {
    if (section.heading && section.heading !== '(no heading)') {
      textParts.push(`\n## ${section.heading}`);
    }
    if (section.body) {
      textParts.push(section.body);
    }
  }

  return {
    url,
    title,
    metaDescription,
    sections,
    fullText: textParts.join('\n\n'),
    scrapedAt: new Date().toISOString(),
  };
}

/**
 * Scrape multiple pages with rate limiting and error handling.
 *
 * @param urls - List of URLs to scrape
 * @param delayMs - Delay between requests in milliseconds (default: 1000)
 * @param onProgress - Optional callback for progress reporting
 * @returns Array of results (ScrapedPage on success, error info on failure)
 */
export async function scrapePages(
  urls: string[],
  delayMs: number = 1000,
  onProgress?: (current: number, total: number, url: string, success: boolean) => void,
): Promise<{ successes: ScrapedPage[]; failures: { url: string; error: string }[] }> {
  const successes: ScrapedPage[] = [];
  const failures: { url: string; error: string }[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    try {
      const page = await scrapePage(url);
      successes.push(page);
      onProgress?.(i + 1, urls.length, url, true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      failures.push({ url, error: errorMsg });
      onProgress?.(i + 1, urls.length, url, false);
    }

    // Rate limit: wait between requests (skip after the last one)
    if (i < urls.length - 1) {
      await sleep(delayMs);
    }
  }

  return { successes, failures };
}
