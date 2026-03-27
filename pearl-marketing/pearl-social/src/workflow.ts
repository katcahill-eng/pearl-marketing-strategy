import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { scrapeBlog } from './blog-scraper';
import { buildToneProfiles, refreshToneProfiles, type ToneProfiles, type ToneProfile, type Platform } from './tone-analyzer';
import { generateInitialPosts, generateFollowupPosts, generateVIPQuotePosts, type SocialPost } from './post-generator';
import { qcPosts, regenerateFailedPosts } from './qc-integration';
import { matchAndExportGraphics } from './canva-graphics';
import { uploadGraphicsToGDrive } from './image-uploader';
import { buildPerPlatformCSVs, writeCSVToFile } from './csv-builder';

export interface SocialWorkflowOptions {
  blogUrl?: string;
  draftPath?: string;
  dryRun?: boolean;
  refreshTone?: boolean;
  spacingDays?: number;
  startDate?: string;
  toneCsvPath?: string;
  blogTitle?: string;
}

export async function runSocialWorkflow(options: SocialWorkflowOptions): Promise<void> {
  const {
    blogUrl,
    draftPath,
    dryRun = false,
    refreshTone = false,
    spacingDays = 4,
    startDate: startDateStr,
    toneCsvPath,
    blogTitle: providedTitle,
  } = options;

  // Step 1: Get blog content or drafts
  let blog: { title: string; body: string; author: string; publishDate: string; quotes: { text: string; attribution: string }[]; url: string } | null = null;
  let posts: SocialPost[] = [];

  if (draftPath) {
    console.log('📄 Reading draft posts...');
    posts = parseDraftFile(draftPath, providedTitle || 'Draft');
    console.log(`   ${posts.length} draft posts loaded\n`);
  } else if (blogUrl) {
    console.log('🔗 Scraping blog post...');
    blog = await scrapeBlog(blogUrl);
    console.log(`   "${blog.title}" by ${blog.author}`);
    console.log(`   ${blog.quotes.length} VIP quote(s) found\n`);
  } else {
    console.error('Error: Provide a blog URL or --draft <file>.');
    console.error('Run pearl-social --help for usage.');
    process.exit(1);
  }

  // Step 2: Load tone profiles
  console.log('🎨 Loading tone profiles...');
  const toneProfiles = await loadToneProfiles(toneCsvPath, refreshTone);
  console.log('   Tone profiles loaded\n');

  // Step 3: Generate posts (skip if using drafts)
  if (!draftPath && blog) {
    console.log('✍️  Generating initial posts...');
    const initialPosts = await generateInitialPosts(blog, toneProfiles);
    console.log(`   ${initialPosts.length} initial posts generated`);

    console.log('✍️  Generating follow-up posts...');
    const followupPosts = await generateFollowupPosts(blog, initialPosts, toneProfiles);
    console.log(`   ${followupPosts.length} follow-up posts generated`);

    posts = [...initialPosts, ...followupPosts];

    if (blog.quotes.length > 0) {
      console.log('✍️  Generating VIP quote posts...');
      const quotePosts = await generateVIPQuotePosts(blog, toneProfiles);
      console.log(`   ${quotePosts.length} VIP quote posts generated`);
      posts.push(...quotePosts);
    }
    console.log('');
  }

  // Step 4: Run Content QC
  console.log('🔍 Running Content QC...');
  let qcResults;
  try {
    qcResults = await qcPosts(posts);
  } catch (err) {
    console.warn(`   ⚠ QC unavailable: ${err instanceof Error ? err.message : err}`);
    console.warn('   Skipping QC — all posts passed through.\n');
    qcResults = posts.map(post => ({ post, grade: 'N/A', passed: true, issues: [] }));
  }

  const passed = qcResults.filter(r => r.passed);
  const failed = qcResults.filter(r => !r.passed);
  console.log(`   ${passed.length} passed, ${failed.length} failed\n`);

  // Step 5: Regenerate failed posts (only possible with original blog content)
  let finalPosts = passed.map(r => r.post);
  if (failed.length > 0) {
    if (blog) {
      console.log('🔄 Regenerating failed posts...');
      const regenerated = await regenerateFailedPosts(failed, blog, toneProfiles);
      finalPosts.push(...regenerated);
      console.log('');
    } else {
      console.warn('   ⚠ Cannot auto-regenerate draft posts. Including as-is for manual revision.');
      finalPosts.push(...failed.map(r => r.post));
    }
  }

  // Step 6: Match graphics
  const title = blog?.title || providedTitle || 'Draft';
  const quotes = blog?.quotes || [];
  console.log('🎨 Matching graphics...');
  const graphics = await matchAndExportGraphics(title, quotes);
  console.log('');

  // Step 7: Prepare image URLs
  console.log('📤 Preparing image URLs...');
  const imageUrls = await uploadGraphicsToGDrive(graphics);
  console.log('');

  // Step 8: Build CSV
  const startDate = startDateStr ? parseLocalDate(startDateStr) : addDays(new Date(), 1);

  if (dryRun) {
    console.log('🏃 DRY RUN — CSV not generated\n');
    printPostSummary(finalPosts, startDate, spacingDays);
    return;
  }

  console.log('📊 Building Sprout Social CSVs (one per profile)...');
  const slug = slugify(title);
  const platformCSVs = buildPerPlatformCSVs(finalPosts, imageUrls, startDate, spacingDays);
  const csvPaths: string[] = [];
  for (const [platform, csv] of Object.entries(platformCSVs)) {
    const csvPath = writeCSVToFile(csv, slug, platform);
    csvPaths.push(csvPath);
    console.log(`   ✓ ${platform}: ${csvPath}`);
  }
  console.log('');

  // Step 9: Summary
  printPostSummary(finalPosts, startDate, spacingDays);
  console.log(`\n📁 Import into Sprout Social → Publishing → Compose → Bulk Schedule`);
}

// --- Helpers ---

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Parse YYYY-MM-DD as local date (not UTC) to avoid off-by-one timezone issues */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function formatDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}/${d}/${date.getFullYear()}`;
}

async function loadToneProfiles(csvPath?: string, refresh?: boolean): Promise<ToneProfiles> {
  const defaultCsvPath = join(__dirname, '..', 'tone-data', 'sprout-export.csv');
  const effectiveCsvPath = csvPath || defaultCsvPath;

  try {
    if (refresh && existsSync(effectiveCsvPath)) {
      return await refreshToneProfiles(effectiveCsvPath);
    }
    return await buildToneProfiles(effectiveCsvPath);
  } catch {
    console.warn('   No Sprout Social export found. Using default tone profiles.');
    return getDefaultProfiles();
  }
}

function getDefaultProfiles(): ToneProfiles {
  const base = (
    avgLength: number,
    usesEmojis: boolean,
    hashtagStyle: string,
    formality: 'formal' | 'conversational' | 'casual'
  ): ToneProfile => ({
    avgLength,
    usesEmojis,
    hashtagStyle,
    ctaPatterns: ['learn more'],
    formalityLevel: formality,
    examplePosts: [],
  });

  return {
    linkedin: base(500, false, 'minimal (1-2 hashtags)', 'conversational'),
    x: base(200, false, 'minimal (1-2 hashtags)', 'conversational'),
    meta: base(300, true, 'moderate (3-5 hashtags)', 'casual'),
    instagram: base(400, true, 'heavy (6+ hashtags)', 'casual'),
    bluesky: base(250, false, 'none', 'conversational'),
  };
}

/**
 * Parses a draft file into SocialPost[].
 *
 * Text format — each section starts with a header:
 *   [linkedin]              → initial post for LinkedIn
 *   [x followup]            → follow-up post for X
 *   [meta quote: Jane Doe]  → VIP quote post for Meta
 *
 * JSON format — if file ends in .json, parsed as SocialPost[].
 */
function parseDraftFile(filePath: string, blogTitle: string): SocialPost[] {
  if (!existsSync(filePath)) {
    throw new Error(`Draft file not found: ${filePath}`);
  }

  const raw = readFileSync(filePath, 'utf-8');

  // JSON format
  if (filePath.endsWith('.json')) {
    return JSON.parse(raw) as SocialPost[];
  }

  // Text format
  const posts: SocialPost[] = [];
  const PLATFORMS: Platform[] = ['linkedin', 'x', 'meta', 'instagram', 'bluesky'];
  const headerPattern = /^\[(\w+)(?:\s+(followup|quote))?(?::\s*(.+))?\]\s*$/i;
  const sections = raw.split(/(?=^\[)/m);

  for (const section of sections) {
    const lines = section.split('\n');
    const headerLine = lines[0].trim();
    const match = headerLine.match(headerPattern);
    if (!match) continue;

    const platformRaw = match[1].toLowerCase();
    const typeRaw = (match[2] || 'initial').toLowerCase();
    const attribution = match[3]?.trim();

    const platform = PLATFORMS.find(p => p === platformRaw);
    if (!platform) {
      console.warn(`   ⚠ Unknown platform "${platformRaw}", skipping section`);
      continue;
    }

    const content = lines.slice(1).join('\n').trim();
    if (!content) continue;

    const postType = typeRaw === 'followup' ? 'followup' as const
      : typeRaw === 'quote' ? 'vip_quote' as const
      : 'initial' as const;

    const post: SocialPost = {
      platform,
      content,
      postType,
      blogTitle,
      characterCount: content.length,
    };
    if (attribution) {
      post.quoteAttribution = attribution;
    }

    posts.push(post);
  }

  return posts;
}

function printPostSummary(posts: SocialPost[], startDate: Date, spacingDays: number): void {
  console.log('┌──────────────┬───────────┬──────────────┬────────────────────────────────────────┐');
  console.log('│ Platform     │ Type      │ Scheduled    │ Preview                                │');
  console.log('├──────────────┼───────────┼──────────────┼────────────────────────────────────────┤');

  for (const post of posts) {
    const platform = post.platform.padEnd(12);
    const type = post.postType.padEnd(9);

    let schedDate: Date;
    if (post.postType === 'initial') {
      schedDate = startDate;
    } else if (post.postType === 'followup') {
      schedDate = addDays(startDate, spacingDays);
    } else {
      schedDate = addDays(startDate, spacingDays * 2);
    }
    const dateStr = formatDate(schedDate).padEnd(12);

    const preview = post.content.slice(0, 38).replace(/\n/g, ' ');
    const previewStr = (preview.length < post.content.length ? preview + '..' : preview).padEnd(38);

    console.log(`│ ${platform} │ ${type} │ ${dateStr} │ ${previewStr} │`);
  }

  console.log('└──────────────┴───────────┴──────────────┴────────────────────────────────────────┘');
  console.log(`\nTotal: ${posts.length} posts across ${new Set(posts.map(p => p.platform)).size} platforms`);
}
