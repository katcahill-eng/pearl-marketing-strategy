import * as fs from 'fs';
import * as path from 'path';

const KNOWLEDGE_DIR = path.resolve(__dirname, '..', 'knowledge');
const BRAND_CONTEXT_DIR = path.resolve(__dirname, '..', '..', 'pearl-content-qc', 'strategy-docs');

/**
 * Read all .md files from a directory, sorted by filename, concatenated with separators.
 * Missing or unreadable files log a warning but don't crash.
 */
function loadMarkdownDir(dirPath: string, label: string): string[] {
  const docs: string[] = [];

  let files: string[];
  try {
    files = fs.readdirSync(dirPath)
      .filter((f) => f.endsWith('.md'))
      .sort();
  } catch {
    console.warn(`[prompt-builder] Could not read ${label} directory at ${dirPath}`);
    return docs;
  }

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      if (content) {
        docs.push(content);
      }
    } catch {
      console.warn(`[prompt-builder] Warning: Could not read ${label} file ${file}`);
    }
  }

  return docs;
}

/**
 * Load all knowledge base documents from pearl-strategy/knowledge/.
 * Returns concatenated markdown string.
 */
export function loadKnowledgeBase(): string {
  const docs = loadMarkdownDir(KNOWLEDGE_DIR, 'knowledge base');

  if (docs.length === 0) {
    console.warn('[prompt-builder] No knowledge base docs loaded — strategy prompts will lack context.');
  } else {
    console.log(`[prompt-builder] Loaded ${docs.length} knowledge base document(s)`);
  }

  return docs.join('\n\n---\n\n');
}

/**
 * Load brand context / strategy docs from pearl-content-qc/strategy-docs/.
 * Graceful fallback if the directory doesn't exist (the content-qc spoke may not be installed).
 */
export function loadBrandContext(): string {
  const docs = loadMarkdownDir(BRAND_CONTEXT_DIR, 'brand context');

  if (docs.length === 0) {
    console.warn('[prompt-builder] No brand context docs found — running without brand alignment check.');
    return '';
  }

  console.log(`[prompt-builder] Loaded ${docs.length} brand context document(s)`);
  return docs.join('\n\n---\n\n');
}

/**
 * Build the system prompt for strategy generation.
 * Combines role instructions with knowledge base and brand context.
 */
export function buildStrategySystemPrompt(knowledgeBase: string, brandContext: string): string {
  const rolePrompt = `You are a senior VP of Marketing with 15+ years of experience in B2B/B2C technology marketing, real estate technology, and growth strategy. You serve as the chief marketing strategist for Pearl, a real estate technology company.

YOUR APPROACH:
- Apply named strategic frameworks (growth loops, value stacking, PLG, periodization, etc.) — always cite which framework you are using and why it fits
- Ground every recommendation in Pearl's specific context, market position, and competitive landscape — never give generic marketing advice
- Present multiple strategic options with honest tradeoffs — there is rarely one right answer
- Be direct and actionable — no filler, no corporate speak, no hedge words
- Challenge assumptions when you see them — the user wants a strategist, not a yes-person
- Reference real market data when available (NAR statistics, industry trends, competitive intelligence)
- Think in terms of leverage: What is the smallest action that produces the largest result?
- Consider second-order effects: If we do X, what happens to Y?

YOUR CONSTRAINTS:
- Never recommend tactics without connecting them to a strategic objective
- Never present a single option as the only path — always show alternatives
- Always consider Pearl's resource constraints (small team, AI-augmented operations)
- Flag when a recommendation requires capabilities Pearl does not currently have
- Distinguish between quick wins (this week), medium-term plays (this quarter), and long-term bets (this year)

OUTPUT STYLE:
- Write in clear, professional prose — not bullet-point soup
- Use markdown formatting for structure
- Include specific, named frameworks when they apply
- Quantify expected impact where possible (even rough estimates)
- End every section with concrete next steps`;

  const sections: string[] = [rolePrompt];

  if (knowledgeBase) {
    sections.push(`## STRATEGIC KNOWLEDGE BASE\n\n${knowledgeBase}`);
  }

  if (brandContext) {
    sections.push(`## BRAND CONTEXT & GUIDELINES\n\nThe following brand guidelines must inform all messaging recommendations. Ensure strategy recommendations align with Pearl's brand positioning, terminology, and tone.\n\n${brandContext}`);
  }

  return sections.join('\n\n---\n\n');
}

/**
 * Build the user prompt for a strategy brief.
 */
export function buildStrategyBriefPrompt(topic: string, context?: string): string {
  let prompt = `Generate a comprehensive strategy brief on the following topic:

**Topic:** ${topic}`;

  if (context) {
    prompt += `\n\n**Additional Context:** ${context}`;
  }

  prompt += `

**Required Format:**

# Strategy Brief: [Topic Title]

*Generated: [current date] | Pearl Marketing OS — Marketing Strategist Spoke*

## 1. Executive Summary
2-3 sentences capturing the strategic situation and recommended direction.

## 2. Situation Analysis
Pearl's current position relative to this topic. What's working, what's not, what's changed in the market. Reference specific data points from the knowledge base.

## 3. Strategic Options

Present at least 3 distinct strategic options. For each:

### Option [N]: [Name]
- **Description:** What this approach entails
- **Framework:** Which strategic framework this draws from and why
- **Pros:** Specific advantages
- **Cons:** Specific disadvantages and risks
- **Effort Estimate:** Low / Medium / High — with brief justification
- **Expected Impact:** Low / Medium / High — with brief justification

## 4. Recommended Approach
Which option (or combination) you recommend and why. Be specific about the rationale — what makes this the best fit for Pearl's current situation and resources?

## 5. Risks & Mitigations
Top 3-5 risks with this approach and how to mitigate each.

## 6. Next Steps
Specific, actionable next steps. For each:
- What needs to happen
- Who should own it (role, not person name)
- Timeline (this week, this month, this quarter)
- Dependencies or prerequisites

---
*Brief generated by Pearl Marketing OS — Marketing Strategist Spoke*`;

  return prompt;
}

/**
 * Build the user prompt for a negotiation brief.
 */
export function buildNegotiationBriefPrompt(partner: string, context?: string): string {
  let prompt = `Generate a comprehensive negotiation brief for a partnership discussion with the following partner:

**Partner:** ${partner}`;

  if (context) {
    prompt += `\n\n**Context:** ${context}`;
  }

  prompt += `

**Required Format:**

# Negotiation Brief: ${partner}

*Generated: [current date] | Pearl Marketing OS — Marketing Strategist Spoke*

## 1. Partner Profile
Who they are, their audience, their assets, their strategic goals. What do they have that Pearl wants? What market position do they hold?

## 2. Pearl's Leverage
What Pearl uniquely brings to this partnership that the partner cannot easily build or acquire. Be specific — data assets, market position, technology, audience, credibility.

## 3. Primary Asks
The main things Pearl wants from this deal. For each ask:
- **The ask:** Specific and concrete
- **Why it matters to Pearl:** Strategic value
- **What it's worth:** Rough value estimate if possible

## 4. Value-Add Asks
Counters if the partner wants to discount or pushback. These are things that cost the partner little but are high-value to Pearl. For each:
- **The ask:** Specific and concrete
- **Why it's valuable to Pearl:** What Pearl gains
- **Why it's low-cost for the partner:** Why they should say yes
- **How to frame it:** The language to use when making this ask

Include at least 5 value-add asks.

## 5. Walk-Away Criteria
Red lines — conditions under which Pearl should walk away from the deal. Be specific about what constitutes a bad deal vs. a suboptimal-but-acceptable deal.

## 6. Negotiation Sequence
What to lead with, what to trade, what to hold back:
- **Open with:** The strongest position / most compelling value proposition
- **Trade early:** Items Pearl is willing to concede
- **Hold back:** Items to introduce later as concessions or sweeteners
- **Escalation path:** What to do if negotiations stall

## 7. Talking Points
Key messages for the negotiation conversation. 5-7 concise talking points that the Pearl team can reference during the meeting. Each should be a natural sentence, not a bullet point — something someone would actually say.

---
*Brief generated by Pearl Marketing OS — Marketing Strategist Spoke*`;

  return prompt;
}
