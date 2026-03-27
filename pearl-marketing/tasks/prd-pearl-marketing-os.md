# PRD: Pearl Marketing OS — Architecture

## Introduction

Pearl Marketing OS is the AI-powered operating system for Pearl's marketing department. It replaces the current pattern of standalone tools (MarcomsBot, Content QC, ad-hoc scripts) with a unified hub-and-spoke system modeled after a human marketing team.

A **Director** orchestrates work across specialized **Spokes** — each spoke is an AI team member with a specific domain expertise. Spokes share access to common resources (Canva, Google Workspace, brand docs, Sprout Social) and can hand off work to each other, just like a real team.

Today, the Director is Claude Code — the interface where Pearl's marketing lead plans, delegates, and reviews work. In a future phase, a Slack interface will extend access to 2-3 additional marketing team members so they can interact with the same system without needing Claude Code.

## Goals

- Unify all marketing automation under one coherent system instead of standalone bots
- Enable spokes to share context and hand off work to each other (e.g., Content Writer → Content QC → Social Media Coordinator)
- Define a standard spoke structure so new capabilities are additive, not duplicative
- Support the current single-user workflow (Claude Code) while designing for multi-user access via Slack
- Retrofit existing tools (Content QC, MarcomsBot) into the architecture rather than rebuilding from scratch
- Provide a foundation that scales to 8+ spokes within 6 months

## The Team

### Director (Hub)

The Director is the orchestrator. It understands the full marketing context — brand positioning, active campaigns, team capacity, what's been published, what's in the pipeline. When the user makes a request, the Director decides which spoke(s) to engage, in what order, and manages handoffs between them.

**Current implementation:** Claude Code with CLAUDE.md project context, memory system, and MCP server access.

**Responsibilities:**
- Receive and interpret requests from the user
- Determine which spoke(s) to invoke and in what sequence
- Manage handoffs between spokes (e.g., pass generated content to QC before scheduling)
- Maintain shared context: brand docs, active campaigns, publishing history
- Report results back to the user
- Know what each spoke can and cannot do

**Future implementation:** Slack bot interface (Phase 2) that extends Director access to additional team members.

### Spokes (Capabilities)

Each spoke is a specialized module with a defined domain, inputs, outputs, and access to shared services. Spokes do not talk to each other directly — the Director orchestrates all handoffs.

#### Spoke Registry

| Spoke | Domain | Status | Priority |
|-------|--------|--------|----------|
| Content QC Specialist | Brand compliance review | Exists — needs retrofit | — |
| Social Media Coordinator | Social post generation, Canva graphics, Sprout Social CSV | PRD drafted | P1 |
| PR/Media Analyst | Coverage monitoring, media lists, PR reporting | Planned | P2 |
| Content Writer | Blog drafts, email copy, pillar content | Planned | P2 |
| SEO Monitor | Keyword tracking, ranking changes, LLM citation optimization | Planned | P3 |
| Campaign Manager | Multi-channel campaign coordination (geo-fencing, surges, events) | Planned | P3 |
| Analytics/Reporting | KPI dashboards, performance summaries, board deck updates | Planned | P3 |
| Contractor Monitor | Vendor deliverable tracking, SLA compliance | Planned | P3 |

## User Stories

### US-001: Define the spoke interface standard
**Description:** As a developer, I need a standard structure for spokes so that every new capability plugs into the system consistently.

**Acceptance Criteria:**
- [ ] Each spoke has a manifest file defining: name, description, capabilities (what it can do), inputs (what it accepts), outputs (what it produces), dependencies (other spokes it can call through the Director), and required shared services
- [ ] Manifest format is documented with a template
- [ ] Content QC is retrofitted to match the standard as the reference implementation

### US-002: Define shared services layer
**Description:** As a developer, I need shared services so that spokes don't duplicate auth, brand context, or asset access.

**Acceptance Criteria:**
- [ ] Shared services are defined: Canva (MCP), Google Workspace (MCP), Claude API, Brand Context (strategy docs), Asset Storage (Google Drive for public image URLs)
- [ ] Each service has a documented access pattern
- [ ] Spokes declare which shared services they need in their manifest
- [ ] Auth credentials are managed centrally, not per-spoke

### US-003: Director invokes a spoke
**Description:** As a marketing lead, I want to ask the Director (Claude Code) to do something and have it automatically delegate to the right spoke.

**Acceptance Criteria:**
- [ ] Director can read the spoke registry to know what's available
- [ ] Director matches user requests to spoke capabilities
- [ ] Director invokes the spoke with the correct inputs
- [ ] Spoke returns structured output that the Director can interpret and present
- [ ] Director handles errors gracefully (spoke fails, spoke returns warnings)

### US-004: Director orchestrates a multi-spoke workflow
**Description:** As a marketing lead, I want to give the Director a complex request that requires multiple spokes working in sequence.

**Acceptance Criteria:**
- [ ] Director breaks the request into a sequence of spoke invocations
- [ ] Output from one spoke is passed as input to the next (e.g., Content Writer output → Content QC → Social Media Coordinator)
- [ ] Director reports progress at each step
- [ ] If a spoke fails or flags issues (e.g., QC fails), Director pauses and asks for guidance rather than continuing blindly
- [ ] The full chain is visible to the user (no black-box orchestration)

### US-005: Retrofit Content QC as a spoke
**Description:** As a developer, I need to adapt the existing Content QC tool to work as a spoke within Pearl Marketing OS.

**Acceptance Criteria:**
- [ ] Content QC has a spoke manifest following the standard template
- [ ] It can be invoked by the Director with content as input and returns a structured QCResult
- [ ] Its existing CLI interface continues to work for standalone use
- [ ] Strategy docs remain the source of truth for brand rules
- [ ] Other spokes can request QC review through the Director (e.g., Social Media Coordinator asks Director to QC generated posts)

### US-006: Slack interface for team access (Phase 2)
**Description:** As a marketing team member, I want to interact with Pearl Marketing OS via Slack so I don't need Claude Code.

**Acceptance Criteria:**
- [ ] A new Slack bot (separate from MarcomsBot) acts as a secondary Director interface
- [ ] 2 team members can invoke spokes via Slack commands or natural language
- [ ] Results are posted back to the appropriate Slack channel
- [ ] Permissions model: certain spokes or actions may be restricted by user role
- [ ] The Slack interface has the same shared context as the Claude Code Director (brand docs, campaign state)
- [ ] MarcomsBot intake requests are visible to the Director — incoming marketing requests flow into the system for triage and delegation

## Functional Requirements

### Spoke Standard

- FR-1: Every spoke must have a manifest file (`spoke.yaml` or `spoke.json`) at its root
- FR-2: Manifest must declare: name, version, description, capabilities[], inputs[], outputs[], shared_services[], dependencies[]
- FR-3: Every spoke must expose a programmatic interface (importable function or CLI command) that accepts structured input and returns structured output
- FR-4: Every spoke must handle its own errors and return structured error objects, never throw unhandled exceptions
- FR-5: Spokes must not import or call other spokes directly — all inter-spoke communication goes through the Director

### Shared Services

- FR-6: Brand Context service provides read access to strategy docs, messaging guides, terminology rules, and positioning guardrails
- FR-7: Canva service provides design search, content reading, and asset export via MCP
- FR-8: Google Workspace service provides Drive file management, Slides updates, and Docs read/write via MCP
- FR-9: Claude API service provides text generation with configurable system prompts, shared across spokes that need AI generation
- FR-10: Asset Storage service provides upload-to-public-URL capability for images that need to be referenced externally (e.g., Sprout Social CSV image URLs)

### Director

- FR-11: Director maintains a spoke registry — a list of all available spokes and their capabilities
- FR-12: Director can chain spoke invocations in sequence with output-to-input mapping
- FR-13: Director presents spoke results to the user in a consistent format
- FR-14: Director maintains conversation memory so context carries across sessions (already exists via Claude Code memory system)

### Slack Interface (Phase 2)

- FR-15: New Slack bot (separate from MarcomsBot) authenticates 2 team members and maps them to permission roles
- FR-16: Slack bot translates natural language requests into spoke invocations via the Director
- FR-17: Slack bot posts results to the requesting channel or thread
- FR-18: MarcomsBot intake requests are forwarded to the Director for awareness and triage
- FR-19: Director supports spoke alias recognition — casual references like "QC" or "social" resolve to the correct spoke

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    PEARL MARKETING OS                     │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    DIRECTOR                          │ │
│  │                                                     │ │
│  │  ┌──────────────┐         ┌───────────────────┐    │ │
│  │  │ Claude Code   │         │ Slack Bot          │    │ │
│  │  │ (Primary)     │         │ (Phase 2)          │    │ │
│  │  └──────────────┘         └───────────────────┘    │ │
│  │                                                     │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │           Spoke Registry & Orchestrator       │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │              SHARED SERVICES LAYER                   │ │
│  │                                                     │ │
│  │  Brand Context │ Canva │ Google Workspace │ Claude  │ │
│  │  Asset Storage │ Sprout Social (CSV)                │ │
│  └─────────────────────────────────────────────────────┘ │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │                    SPOKES                            │ │
│  │                                                     │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │ │
│  │  │Content  │ │ Social  │ │PR/Media │ │Content  │  │ │
│  │  │  QC     │ │ Media   │ │Analyst  │ │ Writer  │  │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │ │
│  │  │  SEO    │ │Campaign │ │Analytics│ │Contractor│ │ │
│  │  │Monitor  │ │Manager  │ │Reporting│ │ Monitor │  │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## Example Workflows

### Workflow 1: Blog → Social Media (with existing copy)

```
User: "I have draft social posts for the new comfort blog. Here they are.
       Get them into Sprout Social."

Director:
  1. Sends drafts to Content QC Specialist → passes (Grade B)
  2. Sends blog title to Social Media Coordinator → matches Canva graphics
  3. Social Media Coordinator exports graphics → uploads to Google Drive (public URL)
  4. Social Media Coordinator generates Sprout Social CSV with copy + image URLs + dates
  5. Returns CSV to user → user imports into Sprout Social
```

### Workflow 2: Blog → Social Media (generate copy)

```
User: "New blog just went live: [URL]. Generate social posts and get them
       ready for Sprout."

Director:
  1. Sends URL to Social Media Coordinator → scrapes blog, pulls tone profiles
  2. Social Media Coordinator generates posts per platform
  3. Director sends generated posts to Content QC Specialist → Grade A
  4. Director sends blog title to Social Media Coordinator → matches Canva graphics
  5. Social Media Coordinator builds CSV
  6. Returns CSV to user → user imports into Sprout Social
```

### Workflow 3: Content Pipeline (future)

```
User: "Write a B2B blog post about how agents can use Pearl SCORE
       in listing presentations."

Director:
  1. Sends brief to Content Writer → generates draft
  2. Sends draft to Content QC Specialist → flags 2 important issues
  3. Director sends QC feedback to Content Writer → revises
  4. Sends revision to Content QC Specialist → passes (Grade A)
  5. Sends final draft to Social Media Coordinator → generates social posts
  6. Returns: blog draft for publishing + Sprout Social CSV for promotion
```

## Non-Goals

- Pearl Marketing OS does not replace Sprout Social, Canva, or Google Workspace — it orchestrates work across them
- The Director does not make autonomous publishing decisions — all external-facing actions require user approval
- Spokes do not have persistent state beyond what the Director and shared services provide (no spoke-specific databases)
- Phase 1 does not include Slack access — that is Phase 2
- This PRD does not define the implementation of individual spokes (each spoke gets its own PRD)

## Implementation Phases

### Phase 1: Foundation (Current)
- Define spoke standard (manifest template, interface contract)
- Retrofit Content QC as the reference spoke
- Build Social Media Coordinator as the first new spoke
- Document shared services access patterns
- Director = Claude Code with spoke registry in CLAUDE.md

### Phase 2: Team Access
- Build new Slack bot as the Director's Slack interface (separate from MarcomsBot)
- MarcomsBot feeds intake requests into the Director — internal marketing requests flow through to the system
- Permission model for 2 users
- Concurrent request handling

### Phase 3: Full Team
- Build remaining spokes: PR/Media Analyst, Content Writer, SEO Monitor, Campaign Manager, Analytics/Reporting, Contractor Monitor
- Inter-spoke workflows become more complex (multi-step pipelines)
- Performance dashboards and reporting automation

## Technical Considerations

- **Spoke runtime:** Spokes can be implemented in any language (TypeScript, Python, etc.) as long as they expose the standard interface. Content QC is TypeScript; PR Dashboard is Python. Both are valid.
- **Director implementation:** In Phase 1, the Director is Claude Code itself — the spoke registry lives in CLAUDE.md, orchestration happens through Claude's tool use and agent capabilities. No custom Director code is needed initially.
- **Shared services auth:** MCP servers (Canva, Google Workspace) are already configured in Claude Code. Spokes invoked by Claude Code inherit this access. For Phase 2 (Slack), auth will need to be managed separately.
- **Spoke isolation:** Spokes should be independently deployable and testable. A spoke failure should not break other spokes or the Director.
- **Memory and context:** The Director's memory system (Claude Code's `/memory/`) serves as the persistent shared context. Spokes don't maintain their own long-term memory — they receive what they need per invocation.

## Spoke Manifest Template

```yaml
name: content-qc
display_name: Content QC Specialist
version: 1.0.0
description: Reviews marketing content against Pearl brand guidelines and positioning standards
aliases: ["qc", "content review", "brand check", "compliance", "review"]

capabilities:
  - review_content: "Analyzes text content for brand compliance, terminology, positioning violations"
  - generate_report: "Produces a graded report card with issues and suggested fixes"
  - generate_excel: "Creates an Excel workbook with detailed QC findings"

inputs:
  - content: "Text content to review (string or file path)"
  - format: "Output format: text | markdown | excel"

outputs:
  - qc_result: "Structured QC result with grade, issues, and summary"
  - report: "Formatted report card (text or markdown)"
  - excel_path: "Path to generated Excel file (if requested)"

shared_services:
  - claude_api
  - brand_context

dependencies: []

invoke:
  cli: "npx tsx src/cli.ts --input {content}"
  library: "import { runQC } from 'pearl-content-qc'"
```

## Success Metrics

- Content QC successfully retrofitted as a spoke and invocable by the Director
- Social Media Coordinator built as a spoke and producing Sprout Social-ready CSVs
- A multi-spoke workflow (e.g., generate → QC → format CSV) completes end-to-end without manual intervention between steps
- 2 team members can access the system via Slack within Phase 2
- New spokes can be added by following the template without modifying the Director

## Resolved Questions

1. **Spoke naming:** Both. Human role names in conversation and docs (Content QC Specialist, Social Media Coordinator), functional names in code and manifests (content-qc, social-media). The Director must support keyword/alias recognition — e.g., "QC" or "content review" maps to Content QC Specialist; "social" or "scheduling" maps to Social Media Coordinator. Each spoke manifest includes an `aliases` field for this.

2. **Slack bot identity:** New bot, purpose-built as the Director's Slack interface. MarcomsBot remains separate but feeds intake requests into the Director — when internal marketing requests come in through MarcomsBot, the Director is aware and can help manage them.

3. **Contractor monitoring scope:** Both deliverable tracking AND quality monitoring, with reporting. Track whether FPS, Atkinson, and other vendors are delivering on schedule, automatically QC their output as it arrives, and produce summaries for review.

4. **SEO monitoring scope:** Both FPS report automation AND independent tracking via SEMrush. Automate FPS report summaries so they don't need to be read raw, and run independent keyword/ranking/backlink monitoring through SEMrush to verify vendor work and track progress.

5. **Phase 2 timeline:** 2 users total need access. No hard deadline — build Phase 1 foundation first, then extend to Slack when the spokes are solid.

## Resolved Questions (Continued)

6. **Spoke alias registry:** Aliases live in each spoke's manifest. The Director reads all manifests and builds its alias registry automatically — no separate config to maintain.

7. **MarcomsBot → Director handoff:** Phase 2 detail. The Slack Director bot will be present in the marketing triage channel alongside MarcomsBot. No special wiring — the Director sees incoming requests in the same channel and can act on them.

8. **SEMrush integration:** API access confirmed. SEMrush API key stored as `SEMRUSH_API_KEY` environment variable. The SEO Monitor spoke will use the SEMrush API directly for independent keyword/ranking/backlink tracking.
