# PRD: Marketing Strategy Spoke

## Introduction

The Marketing Strategy spoke is the strategic brain of the Pearl Marketing OS. It provides senior-level marketing strategy across all department activities — campaign planning, partnership negotiation, content strategy, department operations, and growth marketing. It owns the creation and maintenance of strategy documents (annual plans, sprint plans, board presentations) and acts as an on-demand strategic advisor for one-off asks like vendor negotiations.

The spoke thinks like a senior marketing strategist informed by Brian Moran (SamCart), Wes Bush (product-led growth), Jay Abraham (B2B partnerships/strategic alliances), and deep real estate industry knowledge. It combines digital marketing best practices with Pearl's specific market position in home performance.

The immediate need: Pearl is negotiating a potential contract with realtor.com and needs a negotiation brief with value-add asks to counter a discount request.

## Goals

- Provide on-demand strategic guidance for any marketing activity — partnerships, campaigns, content, operations
- Produce research-backed strategy briefs for negotiations, partnerships, and major initiatives
- Own the creation and update cycle for strategy documents (board deck, annual plan, sprint plans, campaign briefs)
- Apply proven marketing frameworks (growth loops, value stacking, PLG, category design) to Pearl's specific context
- Build institutional knowledge about Pearl's strategic position that compounds across conversations

## User Stories

### US-001: Scaffold spoke and manifest
**Description:** As the Director, I need a spoke manifest and project structure so the Strategy spoke can be registered in the Marketing OS.

**Acceptance Criteria:**
- [ ] `pearl-strategy/` directory created at project root
- [ ] `spoke.yaml` manifest with name `strategy`, aliases, capabilities, dependencies
- [ ] Spoke registered in `pearl-marketing-os/spoke-registry.yaml`
- [ ] `package.json` with dependencies (typescript, tsx, dotenv, @anthropic-ai/sdk)
- [ ] Validates with `npx tsx pearl-marketing-os/validate-spoke.ts pearl-strategy/spoke.yaml`

### US-002: Build strategy knowledge base
**Description:** As a marketing strategist, I need the spoke to have deep context on Pearl's business, market position, and strategic frameworks so its advice is specific, not generic.

**Acceptance Criteria:**
- [ ] `pearl-strategy/knowledge/` directory with reference documents:
  - `pearl-context.md` — Pearl's mission, products, market position, competitive landscape, ICP
  - `frameworks.md` — Growth marketing, partnership negotiation, PLG, category design, value stacking frameworks with definitions and when to apply each
  - `influences.md` — Key principles from Brian Moran (SamCart), Wes Bush (PLG), Jay Abraham (partnerships), digital marketing best practices
  - `real-estate-industry.md` — NAR data points, proptech landscape, housing market dynamics relevant to Pearl
- [ ] Knowledge base loaded into system prompt at runtime
- [ ] Knowledge docs are editable markdown — updating them changes the spoke's behavior without code changes

### US-003: Build strategy brief generator
**Description:** As a marketing manager, I want to request a strategy brief on any topic and get a structured, actionable document.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts brief --topic <topic>` generates a strategy brief
- [ ] Brief format: Executive Summary, Situation Analysis, Strategic Options (3+), Recommended Approach, Risks & Mitigations, Next Steps
- [ ] Each strategic option includes: description, pros, cons, estimated effort, expected impact
- [ ] Brief references specific frameworks where applicable (names them, explains the application)
- [ ] Brief tailored to Pearl's context (not generic marketing advice)
- [ ] Output: markdown file to `pearl-strategy/output/brief_<slug>_<date>.md`
- [ ] Also prints to console for quick review

### US-004: Build negotiation brief generator
**Description:** As a marketing manager, I want a negotiation brief when entering partnership or vendor discussions so I have structured asks and fallback positions.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts negotiate --partner <name> --context <description>`
- [ ] Brief includes:
  - Partner profile (who they are, what they have that Pearl wants)
  - Pearl's leverage (what Pearl brings to the table)
  - Primary asks (what Pearl wants from the deal)
  - Value-add asks (counters if partner wants to discount — things that cost them little but are high-value to Pearl)
  - Walk-away criteria (when to say no)
  - Negotiation sequence (what to ask for first, what to trade)
- [ ] Value-add asks are specific and actionable (not vague)
- [ ] Each ask includes rationale for why it's valuable to Pearl and low-cost for the partner
- [ ] Output: markdown file + console

### US-005: Build campaign strategy generator
**Description:** As a marketing manager, I want to generate a campaign strategy that ties together messaging, channels, audience, and success metrics.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts campaign --name <name> --goal <goal> --audience <B2B|B2C|both>`
- [ ] Output includes: campaign objective, target audience profile, key messages, channel strategy (which channels and why), content needs, timeline, KPIs, budget considerations
- [ ] Channels reference Pearl's actual active channels (LinkedIn, X, Facebook, Bluesky — not Instagram unless culture content)
- [ ] Messages align with brand strategy docs (loads from `pearl-content-qc/strategy-docs/`)
- [ ] Can send generated campaign messaging to Content QC spoke via Director for pre-flight check

### US-006: Strategy document updater
**Description:** As a marketing manager, I want the spoke to update strategy documents on a regular cadence so they stay current.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts update-doc --type <board-deck|annual-plan|sprint-plan>`
- [ ] For board deck: generates updated content sections based on latest data, presents for review before pushing to Google Slides
- [ ] For annual plan and sprint plan: can update directly (markdown files in `docs/strategy/`)
- [ ] Document update includes: what changed, why, and data sources
- [ ] Supports `--dry-run` to preview changes without writing
- [ ] Logs all updates for audit trail

### US-007: Department planning advisor
**Description:** As a marketing manager, I want strategic guidance on building out the marketing department — team structure, vendor strategy, capability gaps.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts advise --topic <topic>`
- [ ] Covers: team structure recommendations, vendor vs. in-house decisions, capability gap analysis, budget allocation strategy, OKR setting
- [ ] Advice grounded in Pearl's current state (small team, OS-augmented, contractor-heavy)
- [ ] References relevant frameworks (Brian Moran's approach to lean teams, etc.)
- [ ] Output: markdown brief with recommendations and rationale

### US-008: CLI entry point and routing
**Description:** As a marketing manager, I want a single CLI that routes to the right capability.

**Acceptance Criteria:**
- [ ] `npx tsx src/cli.ts <command>` with subcommands: `brief`, `negotiate`, `campaign`, `update-doc`, `advise`
- [ ] Each command has `--help` with usage examples
- [ ] All commands support `--output-dir` to override default output path
- [ ] All commands load Pearl context + knowledge base before generating

## Functional Requirements

- FR-1: All strategic output must be grounded in Pearl's specific context — never generic marketing advice
- FR-2: The knowledge base must be editable markdown files, not hardcoded into source
- FR-3: Strategy briefs must present multiple options with tradeoffs, not a single recommendation without alternatives
- FR-4: Negotiation briefs must include specific, actionable asks — not abstract principles
- FR-5: The spoke must reference which strategic framework it's applying and why
- FR-6: Board deck updates require review before pushing; sprint plans and annual plans can be updated directly
- FR-7: All output includes date generated and knowledge base version for traceability
- FR-8: The spoke must load brand strategy docs from `pearl-content-qc/strategy-docs/` to stay aligned with current messaging

## Non-Goals (Out of Scope)

- **Execution** — the spoke advises and generates strategy; it does not execute campaigns (other spokes handle that)
- **Financial modeling** — no P&L, budget spreadsheets, or ROI calculators beyond rough estimates
- **Competitive intelligence gathering** — uses existing competitive analysis, does not scrape competitors
- **HR/recruiting** — department planning covers structure and roles, not job postings or hiring process
- **Legal review** — partnership briefs are strategic, not legal; contracts need legal review separately

## Technical Considerations

- **Claude API**: Uses `claude-sonnet-4-20250514` for strategy generation (fast, high quality for text generation); could upgrade to Opus for complex multi-factor analysis
- **Knowledge base loading**: Read all `.md` files from `pearl-strategy/knowledge/` at runtime, concatenate into system prompt (same pattern as Content QC's strategy-docs)
- **Brand alignment**: Loads strategy docs from `pearl-content-qc/strategy-docs/` to ensure messaging recommendations align with brand guidelines
- **Google Workspace integration**: Board deck updates use Google Slides MCP; strategy docs are local markdown
- **Existing strategy docs**: Annual plan at `docs/strategy/Pearl_2026_Marketing_Strategy.md`, sprint plan at `docs/strategy/90_Day_Sprint_Plan.md`
- **Token management**: Strategy briefs can be long; may need to chunk knowledge base for context window management

## Strategic Influences (Knowledge Base Sources)

The spoke's strategic thinking should be informed by:

| Source | Domain | Key Principles |
|--------|--------|---------------|
| Brian Moran (SamCart) | Growth marketing, lean teams | Focus on high-leverage activities, systematize marketing, small team with outsized output |
| Wes Bush | Product-led growth | Let the product drive acquisition, activation-focused metrics, freemium/trial strategies |
| Jay Abraham | B2B partnerships | Value stacking, strategic alliances, "strategy of preeminence," 3 ways to grow a business |
| Digital marketing best practices | Performance marketing | SEO/SEM, content marketing, social media strategy, email automation, funnel optimization |
| Real estate industry | Market context | NAR trends, proptech landscape, agent adoption curves, homeowner behavior data |

## Success Metrics

- Negotiation briefs include at least 5 specific, actionable value-add asks per partner
- Strategy briefs present 3+ distinct options with clear tradeoffs
- Campaign strategies reference and align with current brand messaging guide
- Board deck updates reduce manual preparation time by 75%
- Strategic advice is specific enough to act on without additional research

## Open Questions

- Should the spoke have access to Pearl's CRM or sales data for more informed strategy?
- How should the spoke handle conflicting strategic frameworks (e.g., PLG vs. sales-led for different segments)?
- Should strategy briefs be versioned (v1, v2) as negotiations evolve?
- What's the cadence for board deck updates — monthly, quarterly?
