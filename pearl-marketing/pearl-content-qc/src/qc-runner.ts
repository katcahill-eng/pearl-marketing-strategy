import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserPrompt } from './prompt-builder';

// --- Types ---

export interface QCIssue {
  category: string;
  originalText: string;
  issue: string;
  suggestedFix: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface QCResult {
  rawOutput: string;
  criticalIssues: QCIssue[];
  importantIssues: QCIssue[];
  minorIssues: QCIssue[];
  positioningStressTest: string;
  bunnyDetection: string;
  brandEssenceToneCheck: string;
  dataProvenanceAudit: string;
  overallAssessment: string;
  summary: string;
  grade: string;
}

// --- Internal helpers ---

/**
 * Parse the raw JSON response from Claude into a structured QCResult.
 * Handles cases where the response may have markdown fencing or extra text.
 */
function parseQCResponse(raw: string): Omit<QCResult, 'summary' | 'grade'> {
  // Try to extract JSON from the response — Claude may wrap it in ```json fencing
  let jsonStr = raw.trim();

  // Strip markdown code fences if present
  const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  // If the response doesn't start with {, try to find the first {
  if (!jsonStr.startsWith('{')) {
    const braceIndex = jsonStr.indexOf('{');
    if (braceIndex !== -1) {
      jsonStr = jsonStr.slice(braceIndex);
    }
  }

  // Trim anything after the last closing brace
  const lastBrace = jsonStr.lastIndexOf('}');
  if (lastBrace !== -1 && lastBrace < jsonStr.length - 1) {
    jsonStr = jsonStr.slice(0, lastBrace + 1);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    // If JSON parsing fails, return a minimal result with the raw text
    console.warn('[qc-runner] Could not parse Claude response as JSON. Returning raw text as overall assessment.');
    return {
      rawOutput: raw,
      criticalIssues: [],
      importantIssues: [],
      minorIssues: [],
      positioningStressTest: '',
      bunnyDetection: '',
      brandEssenceToneCheck: '',
      dataProvenanceAudit: '',
      overallAssessment: raw,
    };
  }

  function parseIssues(arr: unknown): QCIssue[] {
    if (!Array.isArray(arr)) return [];
    return arr.map((item: Record<string, unknown>) => ({
      category: String(item.category ?? ''),
      originalText: String(item.originalText ?? ''),
      issue: String(item.issue ?? ''),
      suggestedFix: String(item.suggestedFix ?? ''),
      confidence: (['HIGH', 'MEDIUM', 'LOW'].includes(String(item.confidence))
        ? String(item.confidence)
        : 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
    }));
  }

  return {
    rawOutput: raw,
    criticalIssues: parseIssues(parsed.criticalIssues),
    importantIssues: parseIssues(parsed.importantIssues),
    minorIssues: parseIssues(parsed.minorIssues),
    positioningStressTest: String(parsed.positioningStressTest ?? ''),
    bunnyDetection: String(parsed.bunnyDetection ?? ''),
    brandEssenceToneCheck: String(parsed.brandEssenceToneCheck ?? ''),
    dataProvenanceAudit: String(parsed.dataProvenanceAudit ?? ''),
    overallAssessment: String(parsed.overallAssessment ?? ''),
  };
}

/**
 * Calculate a letter grade based on issue severity counts.
 *
 * Grading rubric:
 *   A — No critical or important issues
 *   B — No critical issues, 1–3 important issues
 *   C — No critical issues, 4+ important issues
 *   D — 1–2 critical issues
 *   F — 3+ critical issues
 */
function calculateGrade(result: Omit<QCResult, 'summary' | 'grade'>): string {
  const criticalCount = result.criticalIssues.length;
  const importantCount = result.importantIssues.length;

  if (criticalCount >= 3) return 'F';
  if (criticalCount >= 1) return 'D';
  if (importantCount >= 4) return 'C';
  if (importantCount >= 1) return 'B';
  return 'A';
}

/**
 * Generate a one-paragraph summary for quick triage.
 */
function generateSummary(result: Omit<QCResult, 'summary' | 'grade'>, grade: string): string {
  const criticalCount = result.criticalIssues.length;
  const importantCount = result.importantIssues.length;
  const minorCount = result.minorIssues.length;
  const totalCount = criticalCount + importantCount + minorCount;

  if (totalCount === 0) {
    return `Grade: ${grade}. No issues found. Content passes QC review and aligns with Pearl brand guidelines.`;
  }

  const parts: string[] = [`Grade: ${grade}.`];

  if (criticalCount > 0) {
    const categories = [...new Set(result.criticalIssues.map((i) => i.category))].join(', ');
    parts.push(`${criticalCount} critical issue${criticalCount > 1 ? 's' : ''} found (${categories}) — must fix before publishing.`);
  }

  if (importantCount > 0) {
    parts.push(`${importantCount} important issue${importantCount > 1 ? 's' : ''} should be addressed.`);
  }

  if (minorCount > 0) {
    parts.push(`${minorCount} minor issue${minorCount > 1 ? 's' : ''} noted.`);
  }

  return parts.join(' ');
}

// --- Public API ---

/**
 * Run QC review on the provided content.
 * Calls Claude with the assembled strategy-doc-based prompt and returns structured results.
 *
 * Requires ANTHROPIC_API_KEY environment variable.
 */
export async function runQC(content: string): Promise<QCResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(content);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
    ],
  });

  // Extract text from the response
  const rawOutput = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  const parsed = parseQCResponse(rawOutput);
  const grade = calculateGrade(parsed);
  const summary = generateSummary(parsed, grade);

  return {
    ...parsed,
    summary,
    grade,
  };
}
