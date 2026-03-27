# PRD: Website Manager Spoke

## Introduction

The Website Manager is a Marketing OS spoke that owns everything related to pearlscore.com — copy quality, landing page development, and SEO performance. It delegates brand compliance checks to the Content QC spoke via the Director (hub-and-spoke model) and combines multiple SEO data sources into actionable recommendations.

The first deliverable is a website copy QC pipeline: crawl pearlscore.com, extract copy from each page, send it to Content QC for grading, and produce a consolidated report. A new messaging guide arriving soon will become the baseline all copy is measured against.

## Goals

- Provide a single spoke for all website-related marketing tasks
- Automate website copy audits against the current messaging guide and brand strategy docs
- Generate landing page copy and layout recommendations for new pages
- Surface SEO issues and opportunities by combining Semrush data, Semrush API, and Front Page Sage deliverables
- Produce actionable reports that tell the team exactly what to fix and where

## User Stories

### US-001: Scaffold spoke and manifest
**Description:** As the Director, I need a spoke manifest and project structure so the Website Manager can be registered in the Marketing OS.

**Acceptance Criteria:**
- [ ] `pearl-website/` directory created at project root
- [ ] `spoke.yaml` manifest filled in with name, aliases, capabilities, dependencies
- [ ] Spoke registered in `pearl-marketing-os/spoke-registry.yaml`
- [ ] `package.json` with dependencies (typescript, tsx, dotenv)
- [ ] Validates with `npx tsx pearl-marketing-os/validate-spoke.ts pearl-website/spoke.yaml`

### US-002: Build sitemap crawler
**Description:** As a marketing manager, I want the spoke to discover all pages on pearlscore.com so I don't have to maintain a manual list.

**Acceptance Criteria:**
- [ ] Fetches sitemap index at `pearlscore.com/sitemap.xml`
- [ ] Recursively fetches all nested sitemaps
- [ ] Extracts all page URLs
- [ ] Filters out excluded paths: `/news/`, `/industry/`, `/events/`, `/success-stories/`
- [ ] Returns a deduplicated, sorted list of URLs with last-modified dates
- [ ] Configurable exclude patterns via CLI flag or config file

### US-003: Build page scraper
**Description:** As a marketing manager, I want copy extracted from each page so it can be sent to Content QC.

**Acceptance Criteria:**
- [ ] Uses Playwright to load each page (handles JS-rendered content)
- [ ] Extracts visible text content (headings, paragraphs, CTAs, alt text)
- [ ] Strips navigation, footer, and other chrome that repeats across pages
- [ ] Returns structured output: `{ url, title, sections: { heading, body }[], metaDescription, pageType }`
- [ ] Handles errors gracefully (404s, timeouts) without stopping the full crawl
- [ ] Rate-limits requests to avoid hammering the server

### US-004: Integrate with Content QC spoke
**Description:** As the Director, I need the Website Manager to send page content to Content QC and collect results.

**Acceptance Criteria:**
- [ ] Imports `runQC()` from `pearl-content-qc/src/qc-runner`
- [ ] Sends each page's extracted text to `runQC()`
- [ ] Collects `QCResult` for each page (grade, issues, stress tests)
- [ ] Falls back gracefully if Content QC is unavailable (logs warning, continues)
- [ ] Supports `--skip-qc` flag for crawl-only mode

### US-005: Build consolidated QC report
**Description:** As a marketing manager, I want a single report showing which pages pass/fail QC so I know where to focus.

**Acceptance Criteria:**
- [ ] Report includes: page URL, title, grade (A-F), issue count by severity
- [ ] Summary section: total pages scanned, grade distribution, top issues across the site
- [ ] Detail section: per-page issues with original text, problem, and suggested fix
- [ ] Output as Excel workbook (one sheet = summary, one sheet per page with issues)
- [ ] Output path: `pearl-website/output/website_qc_report_<date>.xlsx`
- [ ] Console output: summary table with page grades

### US-006: CLI entry point and workflow orchestrator
**Description:** As a marketing manager, I want a CLI command to run the full website QC pipeline.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts scan` — full crawl + QC + report
- [ ] `npx tsx src/cli.ts scan --skip-qc` — crawl only, output page list
- [ ] `npx tsx src/cli.ts scan --pages <url1,url2>` — scan specific pages only
- [ ] `npx tsx src/cli.ts scan --exclude <pattern>` — additional exclusions
- [ ] Progress output during scan (page N of M, current URL)
- [ ] Total runtime displayed at end

### US-007: Landing page copy and layout generator
**Description:** As a marketing manager, I want to generate copy and layout recommendations for new landing pages.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts landing-page --topic <topic> --audience <B2B|B2C>`
- [ ] Uses Claude API to generate: headline, subheadline, hero section, feature sections, CTAs, meta description
- [ ] Outputs a markdown document with layout recommendations (section order, emphasis, visual notes)
- [ ] References brand strategy docs for tone and positioning
- [ ] Sends generated copy to Content QC for pre-flight check
- [ ] Flags any QC issues in the output before delivery
- [ ] Output path: `pearl-website/output/landing_page_<slug>_<date>.md`

### US-008: SEO analysis from existing Semrush data
**Description:** As a marketing manager, I want SEO insights derived from the Semrush exports we already have.

**Acceptance Criteria:**
- [ ] Reads PDF/CSV files from `assets/pdfs/` (Semrush domain overview, keyword gap, backlinks, site audit)
- [ ] Extracts key metrics: domain authority, organic traffic, top keywords, keyword gaps vs. competitors
- [ ] Cross-references with crawled page list to identify pages with weak or missing SEO signals
- [ ] Outputs recommendations: missing meta descriptions, thin content pages, keyword opportunities
- [ ] Report format: markdown summary + Excel detail sheet

### US-009: Semrush API integration
**Description:** As a marketing manager, I want live SEO data from Semrush so reports reflect current performance.

**Acceptance Criteria:**
- [ ] Connects to Semrush API with API key from `.env`
- [ ] Fetches: domain overview, organic keywords, keyword gap, backlink overview
- [ ] Caches results locally to avoid redundant API calls (TTL: 24 hours)
- [ ] Falls back to existing PDF data if API is unavailable or quota exceeded
- [ ] Can be triggered standalone: `npx tsx src/cli.ts seo --live`

### US-010: Front Page Sage integration
**Description:** As a marketing manager, I want to incorporate Front Page Sage's strategic plan into SEO recommendations.

**Acceptance Criteria:**
- [ ] Reads Front Page Sage strategic plan from `assets/pdfs/Front_Page_Sage_Strategic_Plan.pdf`
- [ ] Extracts target keywords, content recommendations, and technical SEO priorities
- [ ] Cross-references with Semrush data to show progress against FPS targets
- [ ] Includes FPS alignment score in SEO report (how well current site matches FPS strategy)

### US-011: Combined SEO report
**Description:** As a marketing manager, I want a single SEO report that combines all data sources.

**Acceptance Criteria:**
- [ ] Merges data from: Semrush PDFs, Semrush API (if available), Front Page Sage plan, crawled page data
- [ ] Page-by-page SEO scorecard: meta tags, keyword density, content length, internal links
- [ ] Site-wide summary: overall health, top opportunities, competitive gaps
- [ ] Prioritized action items ranked by expected impact
- [ ] Output: Excel workbook + markdown summary
- [ ] `npx tsx src/cli.ts seo` — run full SEO analysis

## Functional Requirements

- FR-1: The spoke must discover pages via sitemap.xml, not hardcoded URL lists
- FR-2: Page exclusions (`/news/`, `/industry/`, `/events/`, `/success-stories/`) must be configurable
- FR-3: The spoke must NOT perform QC itself — all brand compliance checks go through Content QC via the Director
- FR-4: Reports must include timestamps and the messaging guide version used for QC
- FR-5: The spoke must handle the new messaging guide by reading whatever is in `pearl-content-qc/strategy-docs/` at runtime
- FR-6: All CLI commands must support `--dry-run` for previewing without writing output
- FR-7: SEO analysis must clearly label data source (Semrush PDF, Semrush API, Front Page Sage) for each metric
- FR-8: Landing page generator must respect brand positioning docs and audience segmentation (B2B vs. B2C)

## Non-Goals (Out of Scope)

- **Direct CMS updates** — no pushing changes to Craft CMS (future capability, not scoped here)
- **Blog content** — blog QC and creation handled by other spokes
- **Design mockups** — no Figma/Canva integration; wireframes are copy + layout recs only
- **Success stories** — excluded from QC scan scope
- **Events pages** — excluded from QC scan scope (old 2021-2024 events)
- **Real-time monitoring** — no continuous crawling or alerting; runs on demand

## Technical Considerations

- **Playwright dependency**: Required for JS-rendered page scraping; already available via MCP
- **Content QC integration**: Uses `runQC()` from sibling project `pearl-content-qc/`; requires `ANTHROPIC_API_KEY`
- **Semrush API**: Requires `SEMRUSH_API_KEY` in `.env`; API has rate limits and quota
- **PDF parsing**: Semrush PDFs and Front Page Sage PDF need text extraction (pdf-parse or similar)
- **Messaging guide update**: When the new guide arrives, it gets added to `pearl-content-qc/strategy-docs/` — no code changes needed, QC picks it up automatically at runtime
- **Page count**: ~26 core pages in current scope; QC takes ~10-15 seconds per page via Claude API

## Success Metrics

- Full website QC scan completes in under 10 minutes for 26 pages
- Every core marketing page has a grade and actionable issue list
- QC report is clear enough that a content writer can fix issues without additional context
- Landing page generator produces copy that passes Content QC on first run at least 70% of the time
- SEO report surfaces at least 5 actionable opportunities per run

## Open Questions

- What format is the new messaging guide? (markdown, PDF, Google Doc?) — determines how it gets added to strategy-docs
- Does Pearl have a Semrush API key, or do we need to request one?
- Are there pages behind authentication (e.g., contractor portal) that need scanning?
- Should the QC scan compare against a previous run to show improvement over time (delta reporting)?
