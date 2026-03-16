import { existsSync } from 'fs';
import type { GraphicSet } from './canva-graphics';

export interface ImageURLMap {
  initialUrl: string | null;
  repostUrl: string | null;
  quoteUrls: Record<string, string>;
}

/**
 * Prepares image URLs for the Sprout Social CSV.
 *
 * Returns local file paths as placeholders. When the Director (Claude Code)
 * orchestrates the workflow, it uploads files to Google Drive via MCP and
 * replaces these paths with public URLs:
 *   1. upload_file → "Pearl Marketing OS / Social Media Assets"
 *   2. share_file → "anyone with the link can view"
 *   3. URL: https://drive.google.com/uc?export=download&id={fileId}
 *
 * For standalone CLI use, upload images manually and edit the CSV.
 */
export async function uploadGraphicsToGDrive(graphics: GraphicSet): Promise<ImageURLMap> {
  const result: ImageURLMap = {
    initialUrl: null,
    repostUrl: null,
    quoteUrls: {},
  };

  if (graphics.initialGraphic && existsSync(graphics.initialGraphic.localPath)) {
    result.initialUrl = graphics.initialGraphic.localPath;
  }

  if (graphics.repostGraphic && existsSync(graphics.repostGraphic.localPath)) {
    result.repostUrl = graphics.repostGraphic.localPath;
  }

  for (const [attribution, graphic] of Object.entries(graphics.quoteGraphics)) {
    if (existsSync(graphic.localPath)) {
      result.quoteUrls[attribution] = graphic.localPath;
    }
  }

  const hasImages = result.initialUrl || result.repostUrl || Object.keys(result.quoteUrls).length > 0;
  if (hasImages) {
    console.log('   Image URLs are local paths (placeholders).');
    console.log('   The Director uploads to Google Drive and replaces with public URLs.');
  }

  return result;
}
