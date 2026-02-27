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
| Pearl Bot | Complete | Slack intake bot for marketing requests |
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

<details><summary><strong>Pearl Bot</strong></summary>

- **Location:** `pearl-bot/`
- **Stack:** TypeScript, Slack Bolt, Railway
- **Status:** Complete and deployed
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
├── pearl-bot/              # Slack intake bot (TypeScript/Railway)
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
│   └── pearl-bot/          # Bot PRDs
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

## Key Documents

- Strategy docs: `docs/strategy/`
- Google Apps Scripts: `scripts/` (organized by create/update/trackers)
- Reference templates: `scripts/reference/`
- PR reference materials: `assets/pdfs/`
