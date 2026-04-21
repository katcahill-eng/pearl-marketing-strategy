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

  const preamble = `You are a quality control reviewer for Pearl, an independent standards and ratings organization that defines and measures whole-home performance. You review content drafts against Pearl's Foundational Truths, brand guidelines, positioning principles, audience-specific messaging rules, and terminology standards.`;

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
2. PRODUCT CAPABILITY — Any false claims about what SCORE does? Check against the Product Truth Table and Mythbusters. Flag any use of retired claims (e.g., "low confidence," SCORE as seller marketing tool, SCORE replaces inspection).
3. POSITIONING VIOLATIONS — Any language that weaponizes SCORE data? Any apologetic positioning? Any framing of Pearl as a seller tool? Does it maintain the accuracy/completeness distinction?
4. CONTENT QUALITY — Duplicate paragraphs? Unnatural writing? Repetitive ideas?
5. TERMINOLOGY — First-mention format? Pillar order? SCORE used as verb? Scale correct? Prohibited words near SCORE output (defect, flaw, issue, problem)? "Low confidence" used anywhere?
6. DATA PROVENANCE — Flag every statistic. Check against approved statistical claims. State source, date, staleness risk.
7. POSITIONING COMPLIANCE — Does content lead with value before acknowledging data limitations? Does it treat the framework as inherently valuable? Does it maintain the accuracy/completeness distinction? Is "low confidence" language absent? Is typical score framed positively?
8. BRAND ESSENCE ALIGNMENT — Does it sound like a Sage (not a salesperson or academic)? Benefits before features? Plain language? Optimistic pragmatism? Guide, don't criticize? Judo Approach? Audience-appropriate tone? Do any brand tensions tip too far in one direction?
9. AUDIENCE MESSAGING — Is the content correctly targeted to its audience (buyers, homeowners, buy-side agents, listing agents)? Does it follow the audience-specific guardrails, timing, and value proposition? Is buyer-first positioning maintained? Does it lead with the right concerns for the audience (e.g., safety/comfort for buyers, not cost savings)?

You MUST respond with valid JSON matching this exact schema. Do not include any text outside the JSON object.

{
  "criticalIssues": [
    {
      "category": "string — one of: PILLAR_ACCURACY, PRODUCT_CAPABILITY, POSITIONING_VIOLATION, CONTENT_QUALITY, TERMINOLOGY, DATA_PROVENANCE, POSITIONING_COMPLIANCE, BRAND_ESSENCE, AUDIENCE_MESSAGING",
      "originalText": "string — exact quote from the content",
      "issue": "string — description of the problem",
      "suggestedFix": "string — corrected version of the text",
      "confidence": "HIGH | MEDIUM | LOW"
    }
  ],
  "importantIssues": [same structure as criticalIssues],
  "minorIssues": [same structure as criticalIssues],
  "positioningStressTest": "string — rewrite the article's most aggressive paragraph from a skeptical listing agent's perspective. Does it feel threatening? Answer yes/no with explanation.",
  "apologeticPositioningDetection": "string — quote any sentences that lead with caveats, apologize for data, use 'low confidence,' or undermine value before demonstrating it. For each, provide a compliant rewrite.",
  "brandEssenceToneCheck": "string — does this content sound like a trusted Sage or a salesperson? Flag any passages that are too academic, too preachy, too doom-and-gloom, or too jargon-heavy. For each, provide a rewrite.",
  "audienceAlignment": "string — which audience is this content targeting? Does it follow that audience's specific guardrails? Does it lead with the right concerns? Flag any audience mismatches.",
  "dataProvenanceAudit": "string — table of every statistic found, source status, and staleness risk. Check against approved statistical claims list.",
  "overallAssessment": "string — does this content position Pearl correctly per the Foundational Truths? Is it buyer-first? Does it maintain the accuracy/completeness distinction? Does it match Pearl's brand personality? Would a real estate agent feel comfortable with how Pearl is presented? Does it frame Pearl as an independent standards and ratings organization?"
}

CONTENT TO REVIEW:

${contentToReview}`;
}
