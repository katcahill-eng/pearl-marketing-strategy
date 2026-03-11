import * as fs from 'fs';
import * as path from 'path';

const STRATEGY_DOCS_DIR = path.resolve(__dirname, '..', 'strategy-docs');

/**
 * Read all strategy docs from the strategy-docs/ directory, sorted by filename prefix.
 * Each file becomes a section of the system prompt.
 * Missing or unreadable files log a warning but don't crash.
 */
function loadStrategyDocs(): string[] {
  const docs: string[] = [];

  let files: string[];
  try {
    files = fs.readdirSync(STRATEGY_DOCS_DIR)
      .filter((f) => f.endsWith('.md'))
      .sort();
  } catch (err) {
    console.warn(`[prompt-builder] Could not read strategy-docs directory at ${STRATEGY_DOCS_DIR}:`, err);
    return docs;
  }

  for (const file of files) {
    const filePath = path.join(STRATEGY_DOCS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      if (content) {
        docs.push(content);
      }
    } catch (err) {
      console.warn(`[prompt-builder] Warning: Could not read strategy doc ${file}:`, err);
    }
  }

  if (docs.length === 0) {
    console.warn('[prompt-builder] No strategy docs loaded — QC prompts will be empty.');
  }

  return docs;
}

/**
 * Build the system prompt from all strategy reference documents.
 * This is the "who you are and what you know" portion of the QC prompt.
 */
export function buildSystemPrompt(): string {
  const docs = loadStrategyDocs();

  const preamble = `You are a quality control reviewer for Pearl, a real estate technology company that rates home performance. You review content drafts against Pearl's brand guidelines, positioning, and terminology standards.`;

  const strategyContext = docs.join('\n\n---\n\n');

  return `${preamble}\n\n${strategyContext}`;
}

/**
 * Build the user prompt that includes review instructions and the content to review.
 * The review asks Claude to return structured JSON for reliable parsing.
 */
export function buildUserPrompt(contentToReview: string): string {
  return `REVIEW THE FOLLOWING CONTENT FOR:
1. PILLAR ACCURACY — Any feature assigned to the wrong pillar?
2. PRODUCT CAPABILITY — Any false claims about what SCORE does?
3. POSITIONING VIOLATIONS — Any language that weaponizes SCORE data? Any Bunny language?
4. CONTENT QUALITY — Duplicate paragraphs? Unnatural writing? Repetitive ideas?
5. TERMINOLOGY — First-mention format? Pillar order? SCORE used as verb? Scale correct?
6. DATA PROVENANCE — Flag every statistic. State source, date, staleness risk.
7. QUACK / DUCK COMPLIANCE — Are claims honestly incomplete (not confidently wrong)? Is tone confident about value (not apologetic about data)?
8. BRAND ESSENCE ALIGNMENT — Does it sound like a Sage (not a salesperson or academic)? Benefits before features? Plain language? Optimistic pragmatism? Guide, don't criticize? Judo Approach? Audience-appropriate tone? Do any brand tensions tip too far in one direction?

You MUST respond with valid JSON matching this exact schema. Do not include any text outside the JSON object.

{
  "criticalIssues": [
    {
      "category": "string — one of: PILLAR_ACCURACY, PRODUCT_CAPABILITY, POSITIONING_VIOLATION, CONTENT_QUALITY, TERMINOLOGY, DATA_PROVENANCE, DUCK_COMPLIANCE, BRAND_ESSENCE",
      "originalText": "string — exact quote from the content",
      "issue": "string — description of the problem",
      "suggestedFix": "string — corrected version of the text",
      "confidence": "HIGH | MEDIUM | LOW"
    }
  ],
  "importantIssues": [same structure as criticalIssues],
  "minorIssues": [same structure as criticalIssues],
  "positioningStressTest": "string — rewrite the article's most aggressive paragraph from a skeptical listing agent's perspective. Does it feel threatening? Answer yes/no with explanation.",
  "bunnyDetection": "string — quote any sentences that lead with caveats, apologize for data, or undermine confidence before demonstrating value. For each, provide a Duck-compliant rewrite.",
  "brandEssenceToneCheck": "string — does this content sound like a trusted Sage or a salesperson? Flag any passages that are too academic, too preachy, too doom-and-gloom, or too jargon-heavy. For each, provide a rewrite.",
  "dataProvenanceAudit": "string — table of every statistic found, source status, and staleness risk",
  "overallAssessment": "string — does this article position Pearl correctly? Is it Duck, not Bunny? Does it match Pearl's brand personality? Would a real estate agent feel comfortable with how Pearl is presented?"
}

CONTENT TO REVIEW:

${contentToReview}`;
}
