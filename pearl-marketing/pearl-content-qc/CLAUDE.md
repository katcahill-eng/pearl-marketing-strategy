# Pearl Content QC

Automated content quality control tool that reviews marketing content against Pearl's brand guidelines, positioning standards, and terminology rules.

## Quick Start

```bash
cd pearl-content-qc
npm install
# Review a local file
npx tsx src/cli.ts --input ./path/to/draft.md
# Review a Google Doc
npx tsx src/cli.ts https://docs.google.com/document/d/DOCUMENT_ID/edit
```

## Required Environment Variables

- `ANTHROPIC_API_KEY` — Anthropic API key for running QC via Claude
- `GOOGLE_SERVICE_ACCOUNT_JSON` — (optional, for Google Docs) Full JSON contents of Google service account key

## How It Works

### Strategy Docs (source of truth)

The `strategy-docs/` directory contains the reference documents that define what "correct" means for Pearl content. Each file covers one domain:

| File | Purpose |
|------|---------|
| `00-overview.md` | Pearl context and document hierarchy |
| `01-positioning.md` | Duck positioning (vs. Bunny anti-pattern) |
| `02-brand-personality.md` | Sage/Genius voice, Judo Approach |
| `03-brand-tensions.md` | Five brand tension spectrums |
| `04-pillar-definitions.md` | SCORE pillar definitions and common errors |
| `05-product-truth-table.md` | What SCORE does and does not do |
| `06-positioning-guardrails.md` | Frame-as / never-frame-as rules |
| `07-terminology.md` | Trademark usage, naming conventions |

**To update QC behavior, edit the relevant strategy doc.** The prompt builder reads these files dynamically at runtime.

### Prompt Builder (`src/prompt-builder.ts`)

- Reads all `.md` files from `strategy-docs/` sorted by filename prefix
- Concatenates them into the system prompt
- Builds the user prompt with review instructions and JSON output schema
- If a strategy doc file is missing, logs a warning but continues

### QC Runner (`src/qc-runner.ts`)

- Calls Claude with the assembled prompts
- Parses JSON response into structured `QCResult`
- Calculates a letter grade (A/B/C/D/F) based on issue counts
- Generates a one-paragraph summary for triage

### Report Card (`src/report-card.ts`)

- Formats `QCResult` as either plain text (for terminal/Slack) or markdown (for docs)
- Shows grade, issue counts, all issues with original text and suggested fixes
- Includes positioning stress test, bunny detection, tone check results

### Excel Generator (`src/excel-generator.ts`)

- Creates an `.xlsx` workbook with two sheets: "QC Issues" and "Summary"
- Issues sheet has columns: Row #, Severity, Original Copy, Issue Category, Issue Description, Suggested Copy, Confidence, Status
- Color-coded by severity: red (critical), yellow (important), blue (minor)
- Handles the zero-issues case with a green "no issues" row

### Google Docs Reader (`src/google-docs-reader.ts`)

- Accepts a Google Docs URL or raw document ID
- Uses service account auth (same pattern as MarcomsBot)
- Extracts text from paragraphs, tables, and table of contents

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | No critical or important issues |
| B | No critical issues, 1-3 important issues |
| C | No critical issues, 4+ important issues |
| D | 1-2 critical issues |
| F | 3+ critical issues |

## Review Categories

1. **PILLAR_ACCURACY** — Features assigned to wrong SCORE pillar
2. **PRODUCT_CAPABILITY** — False claims about what SCORE does
3. **POSITIONING_VIOLATION** — Language that weaponizes SCORE or uses Bunny framing
4. **CONTENT_QUALITY** — Duplicate content, unnatural writing, repetition
5. **TERMINOLOGY** — Trademark format, pillar order, SCORE-as-verb
6. **DATA_PROVENANCE** — Unverified statistics, stale data
7. **DUCK_COMPLIANCE** — Bunny language, apologetic tone
8. **BRAND_ESSENCE** — Tone misalignment, jargon overload, wrong audience register

## Adding a New Review Category

1. Add a new strategy doc to `strategy-docs/` with the appropriate prefix number
2. Add the category name to the JSON schema in `src/prompt-builder.ts` (in the `buildUserPrompt` function's category enum)
3. Add the review instruction to the numbered list in `buildUserPrompt`

## Using as a Library

```typescript
import { runQC, generateReportCard, generateExcel, readGoogleDoc } from 'pearl-content-qc';

const content = await readGoogleDoc('https://docs.google.com/document/d/...');
const result = await runQC(content);
const report = generateReportCard(result);
const excel = await generateExcel(result);
```

## CLI Usage

```
pearl-qc <google-doc-url-or-id>       Review a Google Doc
pearl-qc --input <file>               Review a local file
pearl-qc --output-dir <dir>           Set output directory (default: ./output)
pearl-qc --help                        Show help
```

## Build

```bash
npm run build    # Compile TypeScript to dist/
npm run dev      # Run with tsx (no build needed)
npm run test     # Run tests with vitest
```
