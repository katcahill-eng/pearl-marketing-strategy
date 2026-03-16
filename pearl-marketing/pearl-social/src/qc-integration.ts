import Anthropic from '@anthropic-ai/sdk';
import type { SocialPost } from './post-generator';
import type { BlogPost } from './blog-scraper';
import type { Platform, ToneProfiles } from './tone-analyzer';

export interface QCPostResult {
  post: SocialPost;
  grade: string;
  passed: boolean;
  issues: string[];
}

interface QCIssue {
  category: string;
  originalText: string;
  issue: string;
  suggestedFix: string;
  confidence: string;
}

interface QCResult {
  grade: string;
  criticalIssues: QCIssue[];
  importantIssues: QCIssue[];
  minorIssues: QCIssue[];
  summary: string;
}

type RunQCFn = (content: string) => Promise<QCResult>;

let _runQC: RunQCFn | null = null;

function loadRunQC(): RunQCFn {
  if (_runQC) return _runQC;
  try {
    // pearl-content-qc is a sibling project — loaded at runtime via tsx
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../../pearl-content-qc/src/qc-runner');
    _runQC = mod.runQC as RunQCFn;
    return _runQC;
  } catch {
    throw new Error(
      'Content QC module not found. Ensure pearl-content-qc/ exists as a sibling project.\n' +
      'Run: cd ../pearl-content-qc && npm install'
    );
  }
}

const CHAR_LIMITS: Record<Platform, number> = {
  x: 280,
  bluesky: 300,
  instagram: 2200,
  linkedin: 3000,
  meta: 63206,
};

const AUDIENCE_MAP: Record<Platform, string> = {
  linkedin: 'B2B',
  x: 'B2B',
  meta: 'B2C',
  instagram: 'B2C',
  bluesky: 'B2C',
};

/**
 * Runs Content QC on each social post. Posts graded A–C pass; D–F fail.
 */
export async function qcPosts(posts: SocialPost[]): Promise<QCPostResult[]> {
  const runQC = loadRunQC();
  const results: QCPostResult[] = [];

  for (const post of posts) {
    const qcResult = await runQC(post.content);
    const grade = qcResult.grade.toUpperCase().charAt(0);
    const passed = ['A', 'B', 'C'].includes(grade);

    const issues: string[] = [];
    for (const issue of qcResult.criticalIssues) {
      issues.push(`[CRITICAL] ${issue.category}: ${issue.issue} → ${issue.suggestedFix}`);
    }
    for (const issue of qcResult.importantIssues) {
      issues.push(`[IMPORTANT] ${issue.category}: ${issue.issue} → ${issue.suggestedFix}`);
    }

    results.push({ post, grade, passed, issues });
  }

  return results;
}

const anthropic = new Anthropic();

/**
 * Regenerates posts that failed QC, injecting QC feedback as negative examples.
 * Max 2 attempts per post — after that, flags for manual revision.
 */
export async function regenerateFailedPosts(
  failures: QCPostResult[],
  blog: BlogPost,
  toneProfiles: ToneProfiles
): Promise<SocialPost[]> {
  const runQC = loadRunQC();
  const MAX_ATTEMPTS = 2;
  const results: SocialPost[] = [];

  for (const failure of failures) {
    const { post, issues } = failure;
    let currentPost = post;
    let passed = false;
    let currentGrade = failure.grade;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const issuesFeedback = issues.map(i => `  ${i}`).join('\n');
      const toneProfile = toneProfiles[post.platform];

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are Pearl's social media writer revising a ${post.platform} post that failed brand QC.

AUDIENCE: ${AUDIENCE_MAP[post.platform]}
PLATFORM: ${post.platform}
CHARACTER LIMIT: ${CHAR_LIMITS[post.platform]} (strict)

Tone: ${toneProfile.formalityLevel}. ${toneProfile.usesEmojis ? 'Use emojis.' : 'No emojis.'}

The previous version failed QC with these issues:
${issuesFeedback}

Fix ALL listed issues. Keep the same topic/angle. Include blog URL: ${blog.url}
Do not use "Bunny" framing. Do not claim SCORE recommends, diagnoses, or gives leverage.
Return ONLY the revised post text.`,
        messages: [{
          role: 'user',
          content: `Revise this ${post.platform} ${post.postType} post for "${blog.title}":\n\n${currentPost.content}`,
        }],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
      const truncated = content.slice(0, CHAR_LIMITS[post.platform]);

      const revisedPost: SocialPost = {
        platform: post.platform,
        content: truncated,
        postType: post.postType,
        blogTitle: post.blogTitle,
        characterCount: truncated.length,
      };
      if (post.quoteAttribution) {
        revisedPost.quoteAttribution = post.quoteAttribution;
      }

      const recheck = await runQC(revisedPost.content);
      currentGrade = recheck.grade.toUpperCase().charAt(0);
      passed = ['A', 'B', 'C'].includes(currentGrade);
      currentPost = revisedPost;

      if (passed) break;
    }

    if (!passed) {
      console.warn(
        `⚠ ${post.platform} ${post.postType} post failed QC after ${MAX_ATTEMPTS} attempts ` +
        `(grade: ${currentGrade}). Flagged for manual revision.`
      );
    }

    results.push(currentPost);
  }

  return results;
}
