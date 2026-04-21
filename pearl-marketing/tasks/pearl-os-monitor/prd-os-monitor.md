# PRD: OS Monitor — Marketing OS Health, Usage & Optimization Spoke

## Introduction

The OS Monitor is a meta-spoke that monitors the health, usage, cost, and performance of the entire Pearl Marketing OS. It generates monthly reports delivered to an admin-only Slack channel, covering errors, usage patterns, cost, model optimization recommendations, brand drift detection, capacity planning, spoke health, and a changelog. It is the system's self-awareness layer — the spoke that watches the other spokes and helps admins keep the OS running well.

This spoke is admin-only. Non-admin marketing staff cannot access its reports or configuration, but they can submit code change requests that the OS Monitor surfaces to admins.

## Goals

- Give admins (currently Kat and Grant) a single monthly report covering everything they need to know about the health and performance of Marketing OS
- Detect errors, inefficiencies, and drift before they become problems
- Recommend model swaps when better options become available from approved enterprise providers
- Track cost across all API providers so budget conversations are data-driven
- Surface brand drift trends so QC rules can be tightened proactively
- Ensure spoke manifests, strategy docs, and configurations stay current
- Route code change requests from staff to admins

## User Stories

### US-001: Error reporting
**Description:** As an admin, I want a monthly summary of all errors across the OS so I can identify patterns and fix recurring issues.

**Acceptance Criteria:**
- [ ] Captures failed API calls by spoke (which model, error type, timestamp)
- [ ] Captures QC failures — content that repeatedly fails brand checks, grouped by pattern
- [ ] Captures broken workflow handoffs (spoke A → spoke B failures)
- [ ] Captures rate limit hits by provider
- [ ] Errors grouped by severity (critical vs. warning) and frequency
- [ ] Output formatted for Slack delivery

### US-002: Usage reporting
**Description:** As an admin, I want to see how the OS is being used so I can understand volume, cost, and team adoption.

**Acceptance Criteria:**
- [ ] API calls per spoke per month (volume)
- [ ] Cost per spoke per month, broken out by provider (Claude, OpenAI, Perplexity, etc.)
- [ ] Total cost per provider
- [ ] Which staff members use which spokes most frequently
- [ ] Peak usage times (day of week, time of day)
- [ ] Month-over-month trend for all metrics
- [ ] Self-tracked call logging per spoke as primary data source
- [ ] Cross-referenced with provider billing dashboards where API access is available for cost verification

### US-003: Model optimization recommendations
**Description:** As an admin, I want to know when a better model is available for a spoke's task type so I can make informed swap decisions.

**Acceptance Criteria:**
- [ ] Monthly scan of new model releases and benchmark updates from approved enterprise providers (Anthropic, OpenAI, Perplexity, and any future approved providers)
- [ ] Light web search for significant model releases beyond current providers — flagged as "not yet approved, would require enterprise account"
- [ ] Each recommendation includes: which spoke, current model, recommended model, why (benchmark data or capability match), and estimated cost impact
- [ ] Flags whether the swap requires a code change
- [ ] Flags cost optimization opportunities (e.g., "spoke X could use a cheaper model tier with no measurable quality loss")
- [ ] Spoke performance scoring: output quality trends over time (based on QC pass rates and any available feedback signals)
- [ ] Flags underused spokes (built but low/no usage) with possible explanations

### US-004: Code change request routing
**Description:** As an admin, I want code change requests from staff and from the OS Monitor's own recommendations routed to me clearly so I can prioritize and assign them.

**Acceptance Criteria:**
- [ ] Non-admin staff can submit code change requests (via Slack command or Director interaction)
- [ ] OS Monitor's own optimization recommendations that require code changes are flagged separately
- [ ] All code change requests collected and included in the monthly report
- [ ] Each request includes: which spoke, what change is needed, who requested it (staff or OS Monitor), and priority recommendation
- [ ] Admins are the only users who can make code changes — this is enforced by repo access controls, not by the spoke

### US-005: Security and access audit
**Description:** As an admin, I want to know who accessed what so I can spot unusual patterns and maintain accountability.

**Acceptance Criteria:**
- [ ] Monthly log of which staff accessed which spokes
- [ ] Flags unusual access patterns (e.g., spike in usage, access outside normal hours, access to spokes outside a user's typical pattern)
- [ ] No PII beyond staff name and spoke accessed
- [ ] Output includes only Marketing OS access — does not monitor Sage or other systems

### US-006: Brand drift detection
**Description:** As an admin, I want to see whether brand compliance is improving, declining, or holding steady so I can adjust QC rules or training proactively.

**Acceptance Criteria:**
- [ ] QC pass/fail rates tracked per content type (blog posts, social posts, website copy, ad copy, etc.)
- [ ] Most-violated brand rules ranked by frequency
- [ ] Content types that consistently fail identified
- [ ] Trends surfaced over time (improving, declining, steady)
- [ ] No target thresholds set initially — just surface the data and trends for admins to interpret
- [ ] If a specific brand rule is violated more than X times in a month, flag it prominently

### US-007: Capacity planning
**Description:** As an admin, I want to understand growth trends so I can forecast API budget and seat needs.

**Acceptance Criteria:**
- [ ] Current month usage extrapolated to quarterly and annual projections
- [ ] Cost projection per provider at current growth rate
- [ ] Flag if usage is approaching any known rate limits or plan thresholds
- [ ] Recommend when additional seats or budget increases should be requested
- [ ] Factor in planned staff growth (configurable — currently "1-2 additional staff this year")

### US-008: Spoke health check
**Description:** As an admin, I want to know whether the OS itself is well-maintained — are docs current, are manifests accurate, is anything stale.

**Acceptance Criteria:**
- [ ] Last-updated date for each strategy doc in pearl-content-qc/strategy-docs/
- [ ] Flag any strategy doc not updated in 90+ days
- [ ] Last-updated date for each spoke manifest (spoke.yaml)
- [ ] Flag any spoke manifest whose declared capabilities don't match what the spoke code actually does (if detectable)
- [ ] Flag any spoke listed in the registry that has no corresponding folder or code
- [ ] CLAUDE.md freshness check — flag if project instructions reference deleted or renamed items

### US-009: Changelog
**Description:** As an admin, I want a summary of what changed in the repo this month so I don't have to read git logs.

**Acceptance Criteria:**
- [ ] Auto-generated monthly summary from git history
- [ ] Grouped by: new spokes/features, updated spokes, updated strategy docs, updated configuration, deleted items
- [ ] Commit count and contributors listed
- [ ] Written in plain language, not commit message dumps

### US-010: Monthly report delivery
**Description:** As an admin, I want all of the above delivered to a dedicated admin-only Slack channel on a predictable schedule.

**Acceptance Criteria:**
- [ ] All report sections (US-001 through US-009) compiled into a single monthly report
- [ ] Delivered to a dedicated admin-only Slack channel (to be created)
- [ ] Report delivered on the 1st of each month covering the prior month
- [ ] Report formatted for Slack readability (sections, headers, bullet points — not a wall of text)
- [ ] Critical items (errors, security flags, high-priority recommendations) surfaced at the top
- [ ] Full report also saved as a markdown file in the repo for historical reference

## Functional Requirements

- FR-1: Each spoke must log its own API calls (model, provider, timestamp, success/fail, token count) to a shared log format defined by the OS Monitor
- FR-2: OS Monitor reads all spoke logs plus git history plus QC output history to compile reports
- FR-3: OS Monitor has read access to provider billing/usage APIs where available (Anthropic, OpenAI) for cost cross-referencing
- FR-4: OS Monitor performs a monthly web scan for new model releases from approved providers, plus a light scan for significant releases from non-approved providers
- FR-5: OS Monitor posts compiled report to designated admin-only Slack channel
- FR-6: OS Monitor saves each monthly report as a markdown file in the repo (e.g., pearl-os-monitor/reports/2026-04.md)
- FR-7: Non-admin staff can submit code change requests via Slack or Director interaction; OS Monitor collects and includes them in the monthly report
- FR-8: OS Monitor does not modify any spoke code, configuration, or strategy docs — it only observes and recommends
- FR-9: Admin-only access enforced — non-admin staff cannot view OS Monitor reports or configuration

## Non-Goals

- Does not make code changes — only recommends them
- Does not automatically swap models — admins approve all changes
- Does not monitor Sage (separate system)
- Does not set brand compliance targets (Phase 1) — surfaces data only
- Does not monitor individual staff productivity — tracks spoke usage, not individual performance
- Does not have write access to any other spoke's code or configuration

## Technical Considerations

- Spoke logging format must be standardized across all spokes before OS Monitor can read them — this is a prerequisite that may require updates to existing spokes
- Slack channel creation requires workspace admin (coordinate with Technology)
- Provider billing API access may require enterprise account admin credentials — coordinate with Technology
- Git history analysis uses standard git log commands against the shared repo
- Monthly scheduling can be handled via cron, Claude Code scheduled triggers, or manual invocation initially
- Report markdown files in the repo provide an audit trail

## Success Metrics

- Admins receive a complete monthly report by the 1st of each month
- At least one actionable model optimization recommendation within the first 3 months
- Error patterns identified and resolved within one reporting cycle
- Brand drift trends visible within 2 months of data collection
- Zero instances of non-admin staff accessing OS Monitor reports

## Open Questions

- Which provider billing APIs are available under Pearl's enterprise accounts? (Affects US-002 cost verification)
- Should the OS Monitor run on a schedule (cron/trigger) or be manually invoked each month initially?
- What Slack channel naming convention should be used for the admin report channel?
- Should the OS Monitor also track Sage usage in a future phase, or will Sage always be monitored separately?
- What constitutes "unusual" access patterns for the security audit? (Needs baseline data before thresholds can be set)
