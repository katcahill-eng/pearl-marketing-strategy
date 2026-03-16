import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { BlogPost, VIPQuote } from './blog-scraper';
import type { Platform, ToneProfiles, ToneProfile } from './tone-analyzer';

export interface SocialPost {
  platform: Platform;
  content: string;
  postType: 'initial' | 'followup' | 'vip_quote';
  blogTitle: string;
  characterCount: number;
  quoteAttribution?: string;
}

const CHAR_LIMITS: Record<Platform, number> = {
  x: 280,
  bluesky: 300,
  instagram: 2200,
  linkedin: 3000,
  meta: 63206,
};

const AUDIENCE_MAP: Record<Platform, 'B2B' | 'B2C'> = {
  linkedin: 'B2B',
  x: 'B2B',
  meta: 'B2C',
  instagram: 'B2C',
  bluesky: 'B2C',
};

const anthropic = new Anthropic();

function loadBrandContext(): string {
  const strategyDir = join(__dirname, '..', '..', 'pearl-content-qc', 'strategy-docs');
  if (!existsSync(strategyDir)) return '';

  const files = ['01-positioning.md', '02-brand-personality.md', '06-positioning-guardrails.md', '07-terminology.md'];
  const parts: string[] = [];

  for (const file of files) {
    const path = join(strategyDir, file);
    if (existsSync(path)) {
      parts.push(readFileSync(path, 'utf-8'));
    }
  }

  return parts.join('\n\n---\n\n');
}

function buildToneContext(profile: ToneProfile): string {
  let context = `Tone profile for this platform:\n`;
  context += `- Average post length: ${profile.avgLength} characters\n`;
  context += `- Emoji usage: ${profile.usesEmojis ? 'Yes, use emojis' : 'No emojis'}\n`;
  context += `- Hashtag style: ${profile.hashtagStyle}\n`;
  context += `- Common CTAs: ${profile.ctaPatterns.join(', ') || 'none identified'}\n`;
  context += `- Formality: ${profile.formalityLevel}\n`;

  if (profile.examplePosts.length > 0) {
    context += `\nExample posts from this platform (match this voice and style):\n`;
    for (const example of profile.examplePosts) {
      context += `---\n${example}\n`;
    }
  }

  return context;
}

/**
 * Generates one initial social post per platform from a blog post.
 */
export async function generateInitialPosts(blog: BlogPost, toneProfiles: ToneProfiles): Promise<SocialPost[]> {
  const brandContext = loadBrandContext();
  const platforms: Platform[] = ['linkedin', 'x', 'meta', 'instagram', 'bluesky'];
  const posts: SocialPost[] = [];

  for (const platform of platforms) {
    const audience = AUDIENCE_MAP[platform];
    const charLimit = CHAR_LIMITS[platform];
    const toneProfile = toneProfiles[platform];

    const systemPrompt = `You are Pearl's social media writer. You create social media posts that promote Pearl blog content.

${brandContext}

${buildToneContext(toneProfile)}

AUDIENCE: ${audience}
${audience === 'B2B'
  ? 'Target: Real estate agents, brokers, MLS executives, and industry professionals. Frame Pearl as a tool that gives them fewer surprises, cleaner negotiations, and deals that close.'
  : 'Target: Homeowners, home buyers, and home sellers. Frame Pearl as a guide to understanding home performance — what makes a home safe, comfortable, efficient, and resilient.'}

PLATFORM: ${platform}
CHARACTER LIMIT: ${charLimit} characters (strict — do not exceed)

RULES:
- Write ONE post promoting the blog article
- Include a compelling hook or key takeaway from the blog
- Include the blog URL: ${blog.url}
- Match the tone and style shown in the example posts above
- Do not use "Bunny" framing (apologizing for data gaps before showing value)
- Do not claim SCORE recommends, diagnoses, or gives leverage
- Return ONLY the post text, nothing else`;

    const userPrompt = `Write a ${platform} post promoting this blog:

Title: ${blog.title}
Author: ${blog.author}

Content summary:
${blog.body.slice(0, 2000)}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

    // Truncate if over limit (shouldn't happen but safety net)
    const truncated = content.slice(0, charLimit);

    posts.push({
      platform,
      content: truncated,
      postType: 'initial',
      blogTitle: blog.title,
      characterCount: truncated.length,
    });
  }

  return posts;
}

/**
 * Generates follow-up posts with a different angle than the initial posts.
 */
export async function generateFollowupPosts(
  blog: BlogPost,
  initialPosts: SocialPost[],
  toneProfiles: ToneProfiles
): Promise<SocialPost[]> {
  const brandContext = loadBrandContext();
  const posts: SocialPost[] = [];

  for (const initialPost of initialPosts) {
    const platform = initialPost.platform;
    const audience = AUDIENCE_MAP[platform];
    const charLimit = CHAR_LIMITS[platform];
    const toneProfile = toneProfiles[platform];

    const systemPrompt = `You are Pearl's social media writer. You create follow-up social media posts that promote Pearl blog content from a DIFFERENT angle than the initial post.

${brandContext}

${buildToneContext(toneProfile)}

AUDIENCE: ${audience}
${audience === 'B2B'
  ? 'Target: Real estate agents, brokers, MLS executives, and industry professionals.'
  : 'Target: Homeowners, home buyers, and home sellers.'}

PLATFORM: ${platform}
CHARACTER LIMIT: ${charLimit} characters (strict — do not exceed)

RULES:
- Write ONE follow-up post promoting the same blog from a DIFFERENT angle
- Use a different takeaway, stat, or perspective than the initial post
- Do NOT repeat the same hook or opening
- Include the blog URL: ${blog.url}
- Match the tone and style shown in the example posts above
- Return ONLY the post text, nothing else

THE INITIAL POST (do NOT repeat this angle):
${initialPost.content}`;

    const userPrompt = `Write a follow-up ${platform} post for this blog, using a different angle:

Title: ${blog.title}

Content:
${blog.body.slice(0, 2000)}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
    const truncated = content.slice(0, charLimit);

    posts.push({
      platform,
      content: truncated,
      postType: 'followup',
      blogTitle: blog.title,
      characterCount: truncated.length,
    });
  }

  return posts;
}

/**
 * Generates VIP quote posts — one per platform per VIP quote found in the blog.
 * Only called when blog.quotes is non-empty.
 */
export async function generateVIPQuotePosts(
  blog: BlogPost,
  toneProfiles: ToneProfiles
): Promise<SocialPost[]> {
  if (blog.quotes.length === 0) return [];

  const brandContext = loadBrandContext();
  const platforms: Platform[] = ['linkedin', 'x', 'meta', 'instagram', 'bluesky'];
  const posts: SocialPost[] = [];

  for (const quote of blog.quotes) {
    for (const platform of platforms) {
      const audience = AUDIENCE_MAP[platform];
      const charLimit = CHAR_LIMITS[platform];
      const toneProfile = toneProfiles[platform];

      const systemPrompt = `You are Pearl's social media writer. You create social media posts that highlight a VIP quote from a Pearl blog post.

${brandContext}

${buildToneContext(toneProfile)}

AUDIENCE: ${audience}
PLATFORM: ${platform}
CHARACTER LIMIT: ${charLimit} characters (strict — do not exceed)

RULES:
- Feature the quote prominently with attribution
- Add brief context connecting the quote to the blog topic
- Include the blog URL: ${blog.url}
- Match the tone and style shown in the example posts above
- Return ONLY the post text, nothing else`;

      const userPrompt = `Write a ${platform} post highlighting this VIP quote from the blog "${blog.title}":

Quote: "${quote.text}"
Attribution: ${quote.attribution}`;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
      const truncated = content.slice(0, charLimit);

      posts.push({
        platform,
        content: truncated,
        postType: 'vip_quote',
        blogTitle: blog.title,
        characterCount: truncated.length,
        quoteAttribution: quote.attribution,
      });
    }
  }

  return posts;
}
