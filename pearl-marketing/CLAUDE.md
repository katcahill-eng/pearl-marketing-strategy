# Pearl Marketing Project Instructions

## Behavior Preferences

- **Proactively suggest applicable skills** - When a task matches an available skill, mention it. Available skills:
  - `/seo-llm-ranking` - SEO analysis, keyword research, LLM citation optimization
  - `/client-deck` - Creating Pearl presentations and pitch decks
  - `/campaign-brief` - Marketing campaign planning and briefs
  - `/competitive-analysis` - Competitor research and positioning
  - `/apple-iwork-converter` - Convert Pages/Numbers/Keynote files

- **Handle context management silently** - Never ask about compaction or context limits

## Pearl Brand Context

- **Mission:** Make home performance matter
- **Core Messaging (Q1 2026):** "Performance on Rails"
- **Clarifying Statement:** The Pearl app helps buyers and sellers get on the same page, prioritize what's most important, and achieve clarity on a home's performance—before commitment and pressure peak.

## Projects

| Project | Status | Description |
|---------|--------|-------------|
| PR Dashboard | Active | PR KPI tracking dashboard (Python/reportlab PDF generator) |
| Competitive Analysis | Complete | Q1 2026 landscape analysis, partnership tiers |
| PR & Media | Ongoing | Atkinson deliverables, media coverage, podcasts |
| Content & SEO | Ongoing | Front Page Sage SEO, content calendar, pillar content |
| Conferences | Ongoing | Event strategy, geo-fencing, sponsorship |
| Partnerships | In Planning | DOE, NAR, RESO, NASEO activation |
| Pearl App | Active | React Native homeowner app (separate dev track) |
| MarcomsBot | Complete | Slack intake bot for marketing requests |
| Content QC | Active | Automated content review against brand guidelines (TypeScript/CLI) — Pearl Marketing OS spoke |
| Pearl Marketing OS | Active | Hub-and-spoke AI marketing automation architecture |
| Social Media Coordinator | In Progress | Blog-to-social promotion workflow — Pearl Marketing OS spoke |
| GAS Automation | Ongoing | Google Apps Script trackers and doc generators |

<details><summary><strong>PR Dashboard</strong></summary>

- **Location:** `pearl-pr-dashboard/`
- **Stack:** Python, reportlab
- **Run:** `cd pearl-pr-dashboard && pip install -r requirements.txt && python3 dashboard.py`
- **Output:** `pearl-pr-dashboard/output/Pearl_PR_Dashboard.pdf`
- **Key files:** `dashboard.py`, `fonts/Lato-*.ttf`
- **Next:** Update data monthly, add Citybiz coverage when published
</details>

<details><summary><strong>PR & Media</strong></summary>

- **Key files:** `docs/messaging/Pearl_MKTG_PR Messaging Guide_Q12026.md`, `docs/strategy/90_Day_Sprint_Plan.md`
- **Assets:** `assets/pdfs/Atkinson_Expanded_Proposal_2026.pdf`, `assets/pdfs/Pearl_MKTG_SME_Document_for_PR_Pitching_Q12026.pdf`
- **Tracker:** `scripts/trackers/Pearl_MKTG_PR_Tracker_2026.js`
- **Next:** Robin LeBaron interview, Citybiz Q&A approval
</details>

<details><summary><strong>Content & SEO</strong></summary>

- **Key files:** `assets/pdfs/Front_Page_Sage_Strategic_Plan.pdf`
- **Tracker:** `scripts/trackers/Pearl_MKTG_Content_Calendar_Q12026.js`
- **Next:** Pillar content development, thought leadership articles
</details>

<details><summary><strong>Conferences</strong></summary>

- **Key files:** `docs/conferences/Conference_Analysis_Report.md`, `docs/conferences/Conference_Sponsorship_Worksheet.md`
- **Assets:** `assets/spreadsheets/Pearl_Conference_Audit.xlsx`
- **Next:** Geo-fencing execution, sponsorship follow-ups
</details>

<details><summary><strong>Partnerships</strong></summary>

- **Key files:** `docs/partnerships/Partnership_Analysis_Worksheet.md`, `docs/partnerships/Partnership_Marketing_Opportunities.md`
- **Assets:** `assets/spreadsheets/Pearl_Partnership_Audit.xlsx`
- **Next:** DOE/NAR/RESO/NASEO activation planning
</details>

<details><summary><strong>Pearl App</strong></summary>

- **Location:** `pearl-app/` (separate dev track)
- **PRDs:** `tasks/pearl-app/`
- **Next:** See active PRDs in tasks/pearl-app/
</details>

<details><summary><strong>MarcomsBot</strong></summary>

- **Repo:** Separate repo — `github.com/katcahill-eng/pearl-bot` (clone to `~/pearl-bot`)
- **Stack:** TypeScript, Slack Bolt, Railway
- **Status:** Complete and deployed
- **Note:** Not included in this repo. See the standalone pearl-bot repo for source.
</details>

<details><summary><strong>Content QC</strong></summary>

- **Location:** `pearl-content-qc/`
- **Stack:** TypeScript, Anthropic SDK, ExcelJS
- **Run:** `cd pearl-content-qc && npm install && npx tsx src/cli.ts --input <file>`
- **Output:** Report card (stdout) + Excel workbook (`output/`)
- **Key files:** `src/qc-runner.ts`, `src/prompt-builder.ts`, `strategy-docs/`
- **Next:** Integrate with MarcomsBot Slack workflow
</details>

<details><summary><strong>GAS Automation</strong></summary>

- **Location:** `scripts/` (organized by create/update/trackers)
- **Key scripts:** `scripts/trackers/Pearl_MKTG_PR_Tracker_2026.js`, `scripts/trackers/Pearl_MKTG_Content_Calendar_Q12026.js`
- **Style guide:** `docs/STYLE_GUIDE_Google_Apps_Scripts.md`
</details>

<details><summary><strong>Competitive Analysis</strong></summary>

- **Key files:** `assets/decks/Competitive_Landscape_Deck_Jan2026.md`
- **Scripts:** `scripts/Create_Competitive_Analysis_Doc.js`, `scripts/competitive_analysis_slides.js`
- **Status:** Complete — Q1 2026 analysis delivered
</details>

## Project Structure

```
pearl-marketing/
├── pearl-pr-dashboard/     # PR KPI dashboard (Python/reportlab)
│   ├── dashboard.py        # Main PDF generator
│   ├── fonts/              # Lato-Regular.ttf, Lato-Bold.ttf
│   ├── output/             # Generated PDFs
│   └── requirements.txt    # reportlab
├── pearl-app/              # React Native/Expo - consumer homeowner app
├── pearl-marketing-os/      # Marketing OS architecture (hub-and-spoke)
│   ├── spoke-manifest-template.yaml  # Template for new spokes
│   ├── spoke-manifest-schema.json    # JSON Schema for validation
│   ├── spoke-registry.yaml           # All spokes and their aliases
│   ├── shared-services.md            # Shared services documentation
│   └── validate-spoke.ts             # Spoke manifest validator
├── pearl-content-qc/       # Content QC spoke (TypeScript/CLI)
│   ├── src/                # CLI, QC runner, report card, Excel generator
│   ├── strategy-docs/      # Brand reference docs (source of truth)
│   ├── spoke.yaml          # Spoke manifest
│   └── output/             # Generated Excel reports
├── pearl-social/            # Social Media Coordinator spoke (planned)
│   └── spoke.yaml          # Spoke manifest
├── docs/                   # Marketing strategy & planning documents
│   ├── strategy/           # Annual plans, sprint plans, budgets
│   ├── messaging/          # PR messaging guides
│   ├── conferences/        # Conference analysis & sponsorship
│   └── partnerships/       # Partnership opportunities & analysis
├── assets/                 # Non-code reference materials
│   ├── pdfs/               # Strategy briefs, proposals, vendor docs
│   ├── spreadsheets/       # Audit worksheets (xlsx)
│   └── decks/              # Presentation decks
├── scripts/                # Google Apps Script automation
│   ├── create/             # Scripts that create new sheets/docs
│   ├── update/             # Scripts that update existing sheets/docs
│   ├── trackers/           # Content calendar, PR, surge trackers
│   └── reference/          # Template scripts
├── tasks/                  # PRDs organized by project
│   ├── pearl-app/          # Mobile app PRDs & UX specs
│   └── marcomsbot/          # MarcomsBot PRDs
├── prd.json                # Active Ralph PRD (auto-managed)
├── progress.txt            # Ralph progress log (auto-managed)
└── CLAUDE.md               # This file
```

## Adding a New Project

1. Create a folder at root: `pearl-<project-name>/`
2. Add a `tasks/pearl-<project-name>/` folder for its PRDs
3. Each project manages its own dependencies (package.json, etc.)
4. Use `/prd` to create the initial PRD, then `/ralph` to generate prd.json
5. Add the project to the **Projects** table above with status and description

## Pearl Marketing OS

Pearl Marketing OS is the AI-powered hub-and-spoke system for the marketing department. The Director (Claude Code) orchestrates specialized spokes. When the user references a spoke by alias, map it to the correct spoke and invoke accordingly.

**Full architecture:** `pearl-marketing-os/` — manifest template, schema, shared services docs, spoke registry
**Architecture PRD:** `tasks/prd-pearl-marketing-os.md`

### Spoke Registry

| Spoke | Display Name | Status | Aliases | Invoke (CLI) |
|-------|-------------|--------|---------|--------------|
| content-qc | Content QC Specialist | Active | qc, content review, brand check, compliance, review | `cd pearl-content-qc && npx tsx src/cli.ts --input {content}` |
| social-media | Social Media Coordinator | Planned | social, social media, scheduling, sprout, blog promotion, posts | `cd pearl-social && npx tsx src/cli.ts {blog_url}` |
| pr-media | PR/Media Analyst | Planned | pr, media, press, coverage, atkinson | — |
| content-writer | Content Writer | Planned | writer, blog, draft, copy, content creation | — |
| seo-monitor | SEO Monitor | Planned | seo, keywords, rankings, semrush, search | — |
| campaign-manager | Campaign Manager | Planned | campaign, campaigns, geo-fencing, surge, events | — |
| analytics-reporting | Analytics & Reporting | Planned | analytics, reporting, kpi, dashboard, metrics, board deck | — |
| contractor-monitor | Contractor Monitor | Planned | contractor, contractors, vendor, fps, deliverables, sla | — |

### Director Behavior

- When the user makes a request that matches a spoke's capabilities, invoke that spoke
- When a workflow requires multiple spokes, chain them in sequence (e.g., generate content → QC → format)
- If a spoke fails or flags issues, pause and ask for guidance — don't continue blindly
- Report progress at each step of a multi-spoke workflow
- Spokes never call each other directly — all handoffs go through the Director

### Shared Services

Documented in `pearl-marketing-os/shared-services.md`:
- **Brand Context** — strategy docs in `pearl-content-qc/strategy-docs/`
- **Canva** — MCP server for design search, content reading, and export
- **Google Workspace** — MCP server for Drive, Slides, Docs
- **Claude API** — `ANTHROPIC_API_KEY` env var, shared across spokes
- **Asset Storage** — Google Drive upload with public sharing for image URLs

### Example Workflows

**Blog → Social Media (with existing copy):**
1. Send drafts to Content QC Specialist → check grade
2. Send blog title to Social Media Coordinator → match Canva graphics
3. Social Media Coordinator exports graphics → uploads to Google Drive
4. Social Media Coordinator generates Sprout Social CSV
5. Return CSV to user → user imports into Sprout Social

**Blog → Social Media (generate copy):**
1. Send blog URL to Social Media Coordinator → scrape + generate posts
2. Send generated posts to Content QC Specialist → review
3. Social Media Coordinator matches Canva graphics, builds CSV
4. Return CSV to user → user imports into Sprout Social

### Adding a New Spoke

1. Create a folder at root: `pearl-<spoke-name>/`
2. Copy `pearl-marketing-os/spoke-manifest-template.yaml` to `pearl-<spoke-name>/spoke.yaml` and fill in fields
3. Validate: `npx tsx pearl-marketing-os/validate-spoke.ts pearl-<spoke-name>/spoke.yaml`
4. Add the spoke to `pearl-marketing-os/spoke-registry.yaml`
5. Add a row to the Spoke Registry table above
6. Create a PRD in `tasks/pearl-<spoke-name>/`

## Key Documents

- Strategy docs: `docs/strategy/`
- Google Apps Scripts: `scripts/` (organized by create/update/trackers)
- Reference templates: `scripts/reference/`
- PR reference materials: `assets/pdfs/`
- Pearl Marketing OS architecture: `pearl-marketing-os/`
