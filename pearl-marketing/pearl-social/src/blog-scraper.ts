export interface VIPQuote {
  text: string;
  attribution: string;
}

export interface BlogPost {
  title: string;
  body: string;
  author: string;
  publishDate: string;
  quotes: VIPQuote[];
  url: string;
}

/**
 * Scrapes a live blog post from pearl-score.com and returns structured content.
 */
export async function scrapeBlog(url: string): Promise<BlogPost> {
  if (!url.includes('pearlscore.com') && !url.includes('pearl-score.com')) {
    throw new Error(`URL must be a pearl-score.com blog post. Got: ${url}`);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch blog post: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  const title = extractTitle(html);
  const body = extractBody(html);
  const author = extractAuthor(html);
  const publishDate = extractDate(html);
  const quotes = extractVIPQuotes(html);

  if (!title) {
    throw new Error(`Could not extract title from ${url}. Is this a valid blog post?`);
  }

  return {
    title,
    body,
    author: author || 'Pearl',
    publishDate: publishDate || new Date().toISOString().split('T')[0],
    quotes,
    url,
  };
}

function extractTitle(html: string): string {
  // Try og:title first (most reliable for Craft CMS)
  const ogMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
    || html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i);
  if (ogMatch) return decodeEntities(ogMatch[1]);

  // Fall back to <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return decodeEntities(titleMatch[1]).replace(/\s*[\|–—]\s*Pearl.*$/i, '').trim();

  // Fall back to first h1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return stripTags(h1Match[1]).trim();

  return '';
}

function extractBody(html: string): string {
  // Try to find the article/entry content area (Craft CMS patterns)
  let content = '';

  // Look for article tag, entry content, or main content area
  const patterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*blog-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      content = match[1];
      break;
    }
  }

  // If no content area found, use the full body
  if (!content) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    content = bodyMatch ? bodyMatch[1] : html;
  }

  // Strip nav, header, footer, script, style tags
  content = content.replace(/<(nav|header|footer|script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Convert paragraphs and headings to text with newlines
  content = content.replace(/<\/?(h[1-6]|p|div|br|li)[^>]*>/gi, '\n');

  // Strip remaining HTML tags
  content = stripTags(content);

  // Clean up whitespace
  content = content.replace(/\n{3,}/g, '\n\n').trim();

  return content;
}

function extractAuthor(html: string): string | null {
  // Try meta author tag
  const metaMatch = html.match(/<meta\s+name="author"\s+content="([^"]+)"/i)
    || html.match(/<meta\s+content="([^"]+)"\s+name="author"/i);
  if (metaMatch) return decodeEntities(metaMatch[1]);

  // Try common author class patterns
  const classMatch = html.match(/<[^>]*class="[^"]*author[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i);
  if (classMatch) {
    const text = stripTags(classMatch[1]).trim();
    if (text.length > 0 && text.length < 100) return text;
  }

  // Try rel="author"
  const relMatch = html.match(/<a[^>]*rel="author"[^>]*>([\s\S]*?)<\/a>/i);
  if (relMatch) return stripTags(relMatch[1]).trim();

  return null;
}

function extractDate(html: string): string | null {
  // Try article:published_time meta
  const ogDateMatch = html.match(/<meta\s+property="article:published_time"\s+content="([^"]+)"/i)
    || html.match(/<meta\s+content="([^"]+)"\s+property="article:published_time"/i);
  if (ogDateMatch) return ogDateMatch[1].split('T')[0];

  // Try time tag with datetime attribute
  const timeMatch = html.match(/<time[^>]*datetime="([^"]+)"[^>]*>/i);
  if (timeMatch) return timeMatch[1].split('T')[0];

  // Try common date class patterns
  const dateClassMatch = html.match(/<[^>]*class="[^"]*(?:date|published|posted)[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i);
  if (dateClassMatch) {
    const dateText = stripTags(dateClassMatch[1]).trim();
    const parsed = Date.parse(dateText);
    if (!isNaN(parsed)) return new Date(parsed).toISOString().split('T')[0];
  }

  return null;
}

function extractVIPQuotes(html: string): VIPQuote[] {
  const quotes: VIPQuote[] = [];

  // Extract blockquotes with attribution
  const blockquotePattern = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
  let match;

  while ((match = blockquotePattern.exec(html)) !== null) {
    const blockContent = match[1];
    const quoteText = stripTags(blockContent).trim();

    if (!quoteText || quoteText.length < 20) continue;

    // Look for attribution: cite tag, footer, or text after an em dash
    let attribution = '';

    const citeMatch = blockContent.match(/<cite[^>]*>([\s\S]*?)<\/cite>/i)
      || blockContent.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
    if (citeMatch) {
      attribution = stripTags(citeMatch[1]).trim();
    }

    // Check for em dash attribution pattern in the quote text itself
    if (!attribution) {
      const dashMatch = quoteText.match(/[—–-]\s*([A-Z][a-zA-Z\s.,']+)$/);
      if (dashMatch) {
        attribution = dashMatch[1].trim();
      }
    }

    // Only include quotes with identifiable attribution (VIP quotes have names)
    if (attribution && attribution.length > 2) {
      quotes.push({
        text: quoteText.replace(/\s*[—–-]\s*[A-Z][a-zA-Z\s.,']+$/, '').trim(),
        attribution,
      });
    }
  }

  // Also look for pull-quote patterns: quoted text followed by attribution
  const pullQuotePattern = /[""\u201C]([\s\S]{20,300}?)[""\u201D]\s*[—–-]\s*([A-Z][a-zA-Z\s.,']{2,60})/g;
  while ((match = pullQuotePattern.exec(html)) !== null) {
    const text = stripTags(match[1]).trim();
    const attribution = stripTags(match[2]).trim();

    // Avoid duplicates
    if (!quotes.some(q => q.text === text)) {
      quotes.push({ text, attribution });
    }
  }

  return quotes;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
}

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
    .replace(/&nbsp;/g, ' ');
}
