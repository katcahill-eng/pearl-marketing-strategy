import { readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import type { VIPQuote } from './blog-scraper';

export interface GraphicResult {
  localPath: string;
  slideName: string;
  designId: string;
}

export interface GraphicSet {
  initialGraphic: GraphicResult | null;
  repostGraphic: GraphicResult | null;
  quoteGraphics: Record<string, GraphicResult>;
}

const GRAPHICS_DIR = join(__dirname, '..', 'graphics');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function isImageFile(filename: string): boolean {
  return IMAGE_EXTENSIONS.includes(extname(filename).toLowerCase());
}

/**
 * Searches the local graphics/ directory for exported Canva slides matching a blog post.
 *
 * Naming convention (any of these patterns work):
 *   [blog-slug]-initial.png       → initialGraphic
 *   [blog-slug]-repost.png        → repostGraphic
 *   [blog-slug]-quote-[name].png  → quoteGraphic
 *
 * Also matches files containing significant words from the blog title.
 * When no local graphics are found, the Director can use Canva MCP to search
 * the quarterly design deck and export slides.
 */
export async function matchAndExportGraphics(
  blogTitle: string,
  quotes: VIPQuote[]
): Promise<GraphicSet> {
  const result: GraphicSet = {
    initialGraphic: null,
    repostGraphic: null,
    quoteGraphics: {},
  };

  if (!existsSync(GRAPHICS_DIR)) {
    console.warn(`Graphics directory not found: ${GRAPHICS_DIR}`);
    console.warn('Create pearl-social/graphics/ and add exported Canva slides.');
    return result;
  }

  const files = readdirSync(GRAPHICS_DIR).filter(isImageFile);
  if (files.length === 0) {
    console.warn('No image files found in graphics/ directory.');
    return result;
  }

  const slug = slugify(blogTitle);
  const titleWords = blogTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  for (const file of files) {
    const lower = file.toLowerCase();
    const nameWithoutExt = lower.replace(/\.[^.]+$/, '');

    // Check if file relates to this blog post
    const slugBase = nameWithoutExt.replace(/-initial|-repost|-quote.*|-followup|-follow-up/, '');
    const matchesSlug = slugBase.length > 3 && (slug.includes(slugBase) || slugBase.includes(slug));
    const matchesTitle = titleWords.length > 0 &&
      titleWords.filter(w => lower.includes(w)).length >= Math.min(2, titleWords.length);

    if (!matchesSlug && !matchesTitle) continue;

    const fullPath = join(GRAPHICS_DIR, file);
    const graphic: GraphicResult = { localPath: fullPath, slideName: file, designId: '' };

    if (lower.includes('initial') || lower.includes('read-now') || lower.includes('readnow')) {
      result.initialGraphic = graphic;
    } else if (lower.includes('repost') || lower.includes('visit') || lower.includes('followup') || lower.includes('follow-up')) {
      result.repostGraphic = graphic;
    } else {
      // Check for VIP quote match
      let matched = false;
      for (const quote of quotes) {
        const attrSlug = slugify(quote.attribution);
        if (attrSlug.length > 2 && (lower.includes(attrSlug) || lower.includes('quote'))) {
          result.quoteGraphics[quote.attribution] = graphic;
          matched = true;
          break;
        }
      }
      // Use unclassified match as initial if initial is empty
      if (!matched && !result.initialGraphic) {
        result.initialGraphic = graphic;
      }
    }
  }

  if (result.initialGraphic) console.log(`   ✓ Initial graphic: ${result.initialGraphic.slideName}`);
  else console.warn('   ⚠ No initial graphic found');
  if (result.repostGraphic) console.log(`   ✓ Repost graphic: ${result.repostGraphic.slideName}`);
  else console.warn('   ⚠ No repost graphic found');

  const quoteCount = Object.keys(result.quoteGraphics).length;
  if (quotes.length > 0) {
    console.log(`   ✓ Quote graphics: ${quoteCount}/${quotes.length} matched`);
  }

  return result;
}
