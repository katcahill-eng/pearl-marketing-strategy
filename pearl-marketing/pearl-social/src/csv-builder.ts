import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { SocialPost } from './post-generator';
import type { ImageURLMap } from './image-uploader';

/**
 * Builds a Sprout Social bulk import CSV.
 *
 * Scheduling:
 *   - Initial posts: startDate, 09:00 + 15min per post
 *   - Follow-up posts: startDate + spacingDays
 *   - VIP quote posts: each set of 5 (one per platform) gets its own day,
 *     spaced spacingDays apart after follow-ups
 *
 * CSV format: date (MM/DD/YYYY), time_24hr (HH:MM), message_text, public_image_url
 * UTF-8 with BOM for emoji support.
 */
export function buildSproutCSV(
  posts: SocialPost[],
  imageUrls: ImageURLMap,
  startDate: Date,
  spacingDays: number
): string {
  const BOM = '\uFEFF';
  const header = 'date,time_24hr,message_text,public_image_url';
  const rows: string[] = [header];

  const initial = posts.filter(p => p.postType === 'initial');
  const followup = posts.filter(p => p.postType === 'followup');
  const vipQuote = posts.filter(p => p.postType === 'vip_quote');

  // Initial posts on startDate
  let timeSlot = 0;
  for (const post of initial) {
    const url = getImageUrl(post, imageUrls);
    rows.push(formatRow(startDate, timeSlot++, post.content, url));
  }

  // Follow-up posts spacingDays after initial
  if (followup.length > 0) {
    const followupDate = addDays(startDate, spacingDays);
    timeSlot = 0;
    for (const post of followup) {
      const url = getImageUrl(post, imageUrls);
      rows.push(formatRow(followupDate, timeSlot++, post.content, url));
    }
  }

  // VIP quote posts: each batch of 5 (one per platform per quote) gets its own day
  if (vipQuote.length > 0) {
    let dayOffset = spacingDays * 2;
    for (let i = 0; i < vipQuote.length; i++) {
      if (i % 5 === 0 && i > 0) {
        dayOffset += spacingDays;
      }
      if (i % 5 === 0) {
        timeSlot = 0;
      }
      const quoteDate = addDays(startDate, dayOffset);
      const url = getImageUrl(vipQuote[i], imageUrls);
      rows.push(formatRow(quoteDate, timeSlot++, vipQuote[i].content, url));
    }
  }

  return BOM + rows.join('\n') + '\n';
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatRow(date: Date, timeSlot: number, content: string, imageUrl: string | null): string {
  const dateStr = formatDate(date);
  const hour = 9 + Math.floor(timeSlot * 15 / 60);
  const minute = (timeSlot * 15) % 60;
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const escapedContent = `"${content.replace(/"/g, '""')}"`;
  return `${dateStr},${timeStr},${escapedContent},${imageUrl || ''}`;
}

function formatDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
}

function getImageUrl(post: SocialPost, imageUrls: ImageURLMap): string | null {
  switch (post.postType) {
    case 'initial':
      return imageUrls.initialUrl;
    case 'followup':
      return imageUrls.repostUrl;
    case 'vip_quote':
      if (post.quoteAttribution && imageUrls.quoteUrls[post.quoteAttribution]) {
        return imageUrls.quoteUrls[post.quoteAttribution];
      }
      return null;
    default:
      return null;
  }
}

/**
 * Writes CSV to output/ directory. Returns the file path.
 */
export function writeCSVToFile(csv: string, blogSlug: string): string {
  const date = new Date().toISOString().split('T')[0];
  const filename = `sprout_import_${blogSlug}_${date}.csv`;
  const outputDir = join(__dirname, '..', 'output');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  const filePath = join(outputDir, filename);
  writeFileSync(filePath, csv, 'utf-8');
  return filePath;
}
