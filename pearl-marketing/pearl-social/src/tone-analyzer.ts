import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

export type Platform = 'linkedin' | 'x' | 'meta' | 'instagram' | 'bluesky';

export interface ToneProfile {
  avgLength: number;
  usesEmojis: boolean;
  hashtagStyle: string;
  ctaPatterns: string[];
  formalityLevel: 'formal' | 'conversational' | 'casual';
  examplePosts: string[];
}

export type ToneProfiles = Record<Platform, ToneProfile>;

const CACHE_PATH = join(__dirname, '..', 'tone-data', 'profiles.json');

const PLATFORM_ALIASES: Record<string, Platform> = {
  'linkedin': 'linkedin',
  'linked in': 'linkedin',
  'x': 'x',
  'twitter': 'x',
  'facebook': 'meta',
  'meta': 'meta',
  'fb': 'meta',
  'instagram': 'instagram',
  'ig': 'instagram',
  'bluesky': 'bluesky',
  'bsky': 'bluesky',
};

/**
 * Builds per-platform tone profiles from a Sprout Social export CSV.
 * Returns cached profiles if available; pass refreshToneProfiles() to force regeneration.
 */
export async function buildToneProfiles(csvPath: string): Promise<ToneProfiles> {
  // Check cache first
  if (existsSync(CACHE_PATH)) {
    const cached = JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) as ToneProfiles;
    return cached;
  }

  return refreshToneProfiles(csvPath);
}

/**
 * Forces regeneration of tone profiles from the Sprout Social export CSV.
 */
export async function refreshToneProfiles(csvPath: string): Promise<ToneProfiles> {
  if (!existsSync(csvPath)) {
    throw new Error(`Sprout Social export CSV not found: ${csvPath}`);
  }

  const csv = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csv);

  // Group posts by platform
  const postsByPlatform = groupByPlatform(rows);

  // Build a profile for each platform
  const profiles = {} as ToneProfiles;
  const allPlatforms: Platform[] = ['linkedin', 'x', 'meta', 'instagram', 'bluesky'];

  for (const platform of allPlatforms) {
    const posts = postsByPlatform[platform] || [];
    profiles[platform] = analyzePostTone(posts, platform);
  }

  // Cache the profiles
  const cacheDir = dirname(CACHE_PATH);
  if (existsSync(cacheDir)) {
    writeFileSync(CACHE_PATH, JSON.stringify(profiles, null, 2), 'utf-8');
  }

  return profiles;
}

interface CSVRow {
  [key: string]: string;
}

function parseCSV(csv: string): CSVRow[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: CSVRow = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function groupByPlatform(rows: CSVRow[]): Record<Platform, string[]> {
  const groups: Record<Platform, string[]> = {
    linkedin: [],
    x: [],
    meta: [],
    instagram: [],
    bluesky: [],
  };

  for (const row of rows) {
    // Sprout Social uses "Network" or "Profile" column to identify platform
    const networkRaw = (row['network'] || row['profile'] || row['platform'] || '').toLowerCase().trim();
    const platform = PLATFORM_ALIASES[networkRaw];

    // Get post text from common Sprout Social column names
    const text = row['text'] || row['message'] || row['content'] || row['post text'] || row['post content'] || '';

    if (platform && text.trim()) {
      groups[platform].push(text.trim());
    }
  }

  return groups;
}

function analyzePostTone(posts: string[], platform: Platform): ToneProfile {
  if (posts.length === 0) {
    return getDefaultProfile(platform);
  }

  // Average length
  const avgLength = Math.round(posts.reduce((sum, p) => sum + p.length, 0) / posts.length);

  // Emoji usage
  const emojiPattern = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  const postsWithEmojis = posts.filter(p => emojiPattern.test(p)).length;
  const usesEmojis = postsWithEmojis / posts.length > 0.3;

  // Hashtag style
  const hashtagCounts = posts.map(p => (p.match(/#\w+/g) || []).length);
  const avgHashtags = hashtagCounts.reduce((a, b) => a + b, 0) / posts.length;
  let hashtagStyle: string;
  if (avgHashtags === 0) hashtagStyle = 'none';
  else if (avgHashtags <= 2) hashtagStyle = 'minimal (1-2 hashtags)';
  else if (avgHashtags <= 5) hashtagStyle = 'moderate (3-5 hashtags)';
  else hashtagStyle = 'heavy (6+ hashtags)';

  // CTA patterns
  const ctaPatterns: string[] = [];
  const ctaKeywords = ['learn more', 'read more', 'check out', 'discover', 'visit', 'click', 'sign up', 'join', 'explore', 'see how', 'find out', 'get started'];
  for (const keyword of ctaKeywords) {
    const count = posts.filter(p => p.toLowerCase().includes(keyword)).length;
    if (count / posts.length > 0.15) {
      ctaPatterns.push(keyword);
    }
  }

  // Formality level
  const casualIndicators = ['!', '...', 'hey', 'wow', 'awesome', 'love', 'amazing'];
  const formalIndicators = ['therefore', 'furthermore', 'consequently', 'regarding', 'pursuant'];

  const casualScore = posts.reduce((sum, p) => {
    return sum + casualIndicators.filter(i => p.toLowerCase().includes(i)).length;
  }, 0) / posts.length;

  const formalScore = posts.reduce((sum, p) => {
    return sum + formalIndicators.filter(i => p.toLowerCase().includes(i)).length;
  }, 0) / posts.length;

  let formalityLevel: 'formal' | 'conversational' | 'casual';
  if (formalScore > casualScore) formalityLevel = 'formal';
  else if (casualScore > 2) formalityLevel = 'casual';
  else formalityLevel = 'conversational';

  // Pick 3-5 representative example posts (shortest, longest, and middle)
  const sorted = [...posts].sort((a, b) => a.length - b.length);
  const examples: string[] = [];
  if (sorted.length >= 5) {
    examples.push(sorted[0]);
    examples.push(sorted[Math.floor(sorted.length * 0.25)]);
    examples.push(sorted[Math.floor(sorted.length * 0.5)]);
    examples.push(sorted[Math.floor(sorted.length * 0.75)]);
    examples.push(sorted[sorted.length - 1]);
  } else {
    examples.push(...sorted.slice(0, 5));
  }

  return {
    avgLength,
    usesEmojis,
    hashtagStyle,
    ctaPatterns,
    formalityLevel,
    examplePosts: examples,
  };
}

function getDefaultProfile(platform: Platform): ToneProfile {
  const defaults: Record<Platform, ToneProfile> = {
    linkedin: {
      avgLength: 500,
      usesEmojis: false,
      hashtagStyle: 'minimal (1-2 hashtags)',
      ctaPatterns: ['learn more', 'read more'],
      formalityLevel: 'conversational',
      examplePosts: [],
    },
    x: {
      avgLength: 200,
      usesEmojis: false,
      hashtagStyle: 'minimal (1-2 hashtags)',
      ctaPatterns: ['check out', 'read more'],
      formalityLevel: 'conversational',
      examplePosts: [],
    },
    meta: {
      avgLength: 300,
      usesEmojis: true,
      hashtagStyle: 'moderate (3-5 hashtags)',
      ctaPatterns: ['learn more', 'visit'],
      formalityLevel: 'casual',
      examplePosts: [],
    },
    instagram: {
      avgLength: 400,
      usesEmojis: true,
      hashtagStyle: 'heavy (6+ hashtags)',
      ctaPatterns: ['check out', 'discover'],
      formalityLevel: 'casual',
      examplePosts: [],
    },
    bluesky: {
      avgLength: 250,
      usesEmojis: false,
      hashtagStyle: 'none',
      ctaPatterns: ['read more'],
      formalityLevel: 'conversational',
      examplePosts: [],
    },
  };
  return defaults[platform];
}
