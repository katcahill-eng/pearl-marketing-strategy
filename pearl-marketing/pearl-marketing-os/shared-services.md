# Pearl Marketing OS — Shared Services

Shared services are common resources that spokes access through the Director. They prevent duplicated auth, duplicated logic, and ensure all spokes work with the same brand context and external integrations.

Each spoke declares which shared services it needs in its `spoke.yaml` manifest under `shared_services`.

---

## Brand Context

**What it provides:** Read access to Pearl's brand positioning, messaging guidelines, terminology rules, and positioning guardrails — the source of truth for what "correct" content looks like.

**Where it lives:** `pearl-content-qc/strategy-docs/`

**Available documents:**

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

**Access pattern:** Read files directly from the filesystem. The prompt builder in Content QC (`src/prompt-builder.ts`) has a reference implementation for concatenating these into a system prompt.

**Auth required:** None — local filesystem.

**Example usage:**
```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

const strategyDir = join(__dirname, '../../pearl-content-qc/strategy-docs');
const positioning = readFileSync(join(strategyDir, '01-positioning.md'), 'utf-8');
```

---

## Canva

**What it provides:** Design search, content reading, and asset export. Used to find and export social media graphics organized in quarterly design decks.

**Access method:** MCP server (`mcp__Canva__*` tools), available through Claude Code.

**Key tools:**

| Tool | Purpose |
|------|---------|
| `search-designs` | Find designs by name (e.g., "Social Media_B2C Blog Announcement_Template_Q12026") |
| `get-design` | Get design metadata: title, page count, thumbnail |
| `get-design-pages` | List pages/slides with thumbnails |
| `get-design-content` | Read text content from slides (for matching by blog title) |
| `export-design` | Export a design or specific page as PNG/PDF |
| `list-folder-items` | Browse folder contents |

**Auth required:** Canva MCP server handles auth automatically via Claude Code configuration.

**Design naming convention:** Social media graphics are organized in presentation decks by quarter:
- Pattern: `Social Media_B2C Blog Announcement_Template_Q{N}{YEAR}`
- Example: `Social Media_B2C Blog Announcement_Template_Q42025`
- Slides come in pairs per blog post: initial ("Read now" CTA) + repost ("Visit the Pearl Blog" CTA)
- Match slides to blog posts by reading text content and comparing against the blog title

**Example usage (via Director):**
```
1. search-designs for "Social Media_B2C Blog Announcement_Template_Q12026"
2. get-design-content to read slide text
3. Match slide text to blog post title
4. export-design for the matched slide
```

---

## Google Workspace

**What it provides:** Google Drive file management (upload, share, organize), Google Slides updates, and Google Docs read/write.

**Access method:** MCP server (`mcp__google-workspace__*` tools), available through Claude Code.

**Key tools:**

| Tool | Purpose |
|------|---------|
| `upload_file` | Upload a local file to Google Drive |
| `share_file` | Set sharing permissions (e.g., "anyone with link") |
| `get_file_metadata` | Get file ID, URLs, sharing status |
| `create_folder` | Create a Drive folder |
| `list_folder` | List folder contents |
| `search` | Search Drive for files by name |
| `resolve_file_path` | Navigate folder paths |

**Auth required:** Google Workspace MCP server handles auth via Claude Code configuration. Uses service account or OAuth depending on setup.

**Asset storage pattern (for public image URLs):**
1. Upload image to Google Drive using `upload_file`
2. Set sharing to "anyone with the link can view" using `share_file`
3. Generate direct download URL: `https://drive.google.com/uc?export=download&id={fileId}`
4. Use the direct URL in Sprout Social CSV `public_image_url` column

**Designated folder:** `Pearl Marketing OS / Social Media Assets`

**Example usage (via Director):**
```
1. create_folder "Social Media Assets" inside "Pearl Marketing OS" folder
2. upload_file local graphic to the folder
3. share_file with "anyone with the link"
4. Use file ID to construct direct download URL
```

---

## Claude API

**What it provides:** Text generation with configurable system prompts. Used by spokes that need AI-generated content (social posts, blog drafts, summaries).

**Access method:** Direct API call via `@anthropic-ai/sdk` npm package.

**Auth required:** `ANTHROPIC_API_KEY` environment variable (already set, shared across all spokes).

**Usage pattern:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: systemPrompt, // brand context, tone profiles, etc.
  messages: [{ role: 'user', content: userPrompt }],
});
```

**Best practices:**
- Include brand context from strategy docs in the system prompt
- Use tone profiles as few-shot examples when generating platform-specific content
- Set `max_tokens` appropriately for the expected output length
- Parse structured output as JSON when the spoke needs typed results

**Reference implementation:** `pearl-content-qc/src/qc-runner.ts` shows the pattern for calling Claude API with strategy docs as context.

---

## Asset Storage

**What it provides:** The ability to host images at publicly accessible URLs for external reference (e.g., Sprout Social CSV import requires `public_image_url` entries).

**Implementation:** Uses Google Drive (see Google Workspace service above) as the hosting backend.

**Workflow:**
1. Spoke exports/generates an image locally
2. Spoke requests upload via Google Workspace shared service
3. Google Workspace MCP uploads to Drive, sets public sharing
4. Returns direct download URL for external use

**URL format:** `https://drive.google.com/uc?export=download&id={fileId}`

**Folder structure:**
```
Pearl Marketing OS/
  Social Media Assets/
    2026-03-16_comfort-blog_initial.png
    2026-03-16_comfort-blog_repost.png
    2026-03-16_comfort-blog_quote_lebaron.png
```

**Important:** URLs must point directly to the image file, not to a Drive viewer page. The `uc?export=download` format ensures this. Sprout Social CSV import will reject viewer page URLs.
