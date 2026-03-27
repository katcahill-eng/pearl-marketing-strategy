import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import {
  loadKnowledgeBase,
  loadBrandContext,
  buildStrategySystemPrompt,
  buildNegotiationBriefPrompt,
} from './prompt-builder';

const MODEL = 'claude-sonnet-4-20250514';

export interface NegotiationOptions {
  partner: string;
  context?: string;
  outputDir?: string;
}

export interface NegotiationResult {
  markdown: string;
  filePath: string;
  durationMs: number;
}

/**
 * Slugify a string for use in filenames.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Get today's date as YYYY-MM-DD.
 */
function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Generate a negotiation brief for a given partner.
 */
export async function generateNegotiationBrief(options: NegotiationOptions): Promise<NegotiationResult> {
  const startTime = Date.now();

  // Validate API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required.');
  }

  // Load knowledge base and brand context
  const knowledgeBase = loadKnowledgeBase();
  const brandContext = loadBrandContext();

  // Build prompts
  const systemPrompt = buildStrategySystemPrompt(knowledgeBase, brandContext);
  const userPrompt = buildNegotiationBriefPrompt(options.partner, options.context);

  console.log(`\nGenerating negotiation brief for: "${options.partner}"`);
  console.log('Calling Claude API...\n');

  // Call Claude API
  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
    ],
  });

  // Extract text from response
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Claude API response.');
  }

  const markdown = textBlock.text;

  // Determine output directory
  const outputDir = options.outputDir || path.resolve(__dirname, '..', 'output');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to file
  const slug = slugify(options.partner);
  const date = todayDate();
  const fileName = `negotiate_${slug}_${date}.md`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, markdown, 'utf-8');

  const durationMs = Date.now() - startTime;

  return { markdown, filePath, durationMs };
}
