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

## Project Structure

```
pearl-marketing/
├── pearl-app/              # React Native/Expo - consumer homeowner app
├── pearl-command-center/   # Next.js - internal project management dashboard
├── docs/                   # Marketing strategy & planning documents
│   ├── strategy/           # Annual plans, sprint plans, budgets
│   ├── messaging/          # PR messaging guides
│   ├── conferences/        # Conference analysis & sponsorship
│   └── partnerships/       # Partnership opportunities & analysis
├── assets/                 # Non-code reference materials
│   ├── pdfs/               # Strategy briefs, proposals
│   ├── spreadsheets/       # Audit worksheets (xlsx)
│   └── decks/              # Presentation decks
├── scripts/                # Google Apps Script automation
│   ├── create/             # Scripts that create new sheets/docs
│   ├── update/             # Scripts that update existing sheets/docs
│   ├── trackers/           # Content calendar, PR, surge trackers
│   └── reference/          # Template scripts
├── tasks/                  # PRDs organized by project
│   ├── pearl-app/          # Mobile app PRDs & UX specs
│   └── pearl-command-center/ # (lives in pearl-command-center/tasks/)
├── prd.json                # Active Ralph PRD (auto-managed)
├── progress.txt            # Ralph progress log (auto-managed)
└── CLAUDE.md               # This file
```

## Adding a New Project

1. Create a folder at root: `pearl-<project-name>/`
2. Add a `tasks/pearl-<project-name>/` folder for its PRDs
3. Each project manages its own dependencies (package.json, etc.)
4. Use `/prd` to create the initial PRD, then `/ralph` to generate prd.json

## Key Documents

- Strategy docs: `docs/strategy/`
- Google Apps Scripts: `scripts/` (organized by create/update/trackers)
- Reference templates: `scripts/reference/`
- Command center: `pearl-command-center/`
- Dashboard requirements: `pearl-command-center/docs/requirements/marketing-analytics-dashboards.md`
