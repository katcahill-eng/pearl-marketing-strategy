# UX Specification: Improvement Paths & Rebate Persistence

## Pass 1: Mental Model

**Primary user intent:** "I want Pearl to tell me what to do about my home issues, step by step, starting with the cheapest and easiest things first."

**Likely misconceptions:**
- Users may think improvement paths are quotes or service orders, rather than guidance
- Users may expect paths to update automatically as they complete steps (v1 is static)
- Users may think "View Rebate" on a step means the rebate is already applied to them
- Users may confuse the ImprovementPath timeline with a to-do list that tracks completion

**UX principle to reinforce/correct:** Improvement paths are personalized guidance, not commitments. Pearl generates a roadmap based on what you told it. The value is the sequence — now/soon/later/major — so you know what's worth trying first before spending more.

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Improvement paths (personalized plans from symptoms)
- Path title and description (what it solves)
- Timeline phases (Now, Soon, Later, Major)
- Individual steps (action, cost, impact)
- Rebate links on steps (available money for that upgrade)
- Pearl Pro links on steps (find help for that step)
- Rebate programs (tax credits, rebate programs)
- Rebate details (eligibility, how to claim, savings amount)
- Total available savings (sum of all rebates)
- Saved rebates (bookmark toggle)

**Grouped structure:**

### Improve Tab - Top Level
- Page header + subtitle: Primary (always visible)
- Savings summary card: Primary (visible when rebates exist)
- Rebate explainer card: Secondary (educational, shown once)
- Rebate grid: Primary (visible when rebates exist)
- Improvement paths section: Primary (visible when paths exist)
- Pearl Pros link: Primary (always visible at bottom)

### Improvement Path (within section)
- Path title + description: Primary (always visible per path)
- Phase headers (Now/Soon/Later/Major): Primary (visible per phase)
- Step cards with action + cost + impact: Primary (visible per step)
- Rebate link on step: Secondary (visible only on steps with rebates)
- Pearl Pro link on step: Secondary (visible only on steps needing professionals)

### Rebate Detail (full screen)
- Savings hero: Primary (prominent at top)
- Program name + eligibility badge: Primary
- Program description: Primary
- Eligibility requirements list: Primary
- How-to-claim steps: Primary
- Additional info: Secondary (shown when available)
- Save + share actions: Secondary

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|--------------------------|
| View improvement path steps | ImprovementPath component with timeline dots and phase headers |
| Tap a step for more info | Step card with chevron-forward icon |
| View rebate for a step | "View Rebate" pill button (green tint, cash icon) |
| Find Pearl Pro for a step | "Find Pro" pill button (blue tint, people icon) |
| Tap a rebate card | RebateCard with savings amount and chevron |
| Save/unsave a rebate | Bookmark icon toggle in rebate detail header |
| Share a rebate | Share icon in rebate detail header |
| Go back from rebate detail | Arrow-back icon in header |
| Find Pearl Pros | Full-width accent button at bottom of Improve tab |

**Affordance rules:**
- If user sees a timeline with colored dots and phase labels, they should understand this is a sequenced plan
- If user sees a pill button with "View Rebate" or "Find Pro", they should assume it navigates to that resource
- If user sees a cost range on a step, they should assume it's an estimate, not a quote

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Understanding what improvement paths are | Uncertainty | Section subtitle: "Step-by-step guides to improve your home" |
| Seeing multiple paths (one per symptom) | Choice | Show max 3 paths, most recent first |
| Reading steps within a path | Choice | Steps grouped by phase (Now/Soon/Later/Major) with clear labels |
| Understanding cost ranges | Uncertainty | Use natural ranges ("$0–30", "~$150") not exact numbers |
| Deciding whether a rebate applies | Uncertainty | Eligibility badge (Eligible/Likely/Check) with color coding |
| Empty improve tab with no symptoms | Uncertainty | Empty state with clear CTA: "Log a symptom to get started" |

**Defaults introduced:**
- Paths auto-generated when symptoms are logged — no user decision needed
- Max 3 paths shown — prevents overwhelm
- Rebates seeded with 5 common programs — Improve tab useful from day one
- Steps pre-sequenced by phase — user doesn't choose the order

---

## Pass 5: State Design

### ImproveScreen - Improvement Paths Section

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| No symptoms logged | Empty state: "Log a symptom to get a personalized improvement plan" | Need to log a symptom first | Navigate to Home tab to log symptom |
| Symptoms logged, paths generating | Skeleton loading cards | Paths being generated | Wait |
| Has paths | ImprovementPath timeline components (max 3) | These are my personalized plans | Tap steps, view rebates, find pros |
| Error loading paths | Error state with retry | Something went wrong | Tap retry |

### ImproveScreen - Rebates Section

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Has rebates (default) | Savings summary + rebate grid | These rebates might apply to me | Tap to see details |
| No rebates | Empty state: "No Rebates Found" + equipment tip | No rebates yet, but adding equipment helps | Add equipment from My Home tab |
| Loading | Skeleton cards | Data loading | Wait |

### RebateDetailScreen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Rebate found | Full detail (hero, eligibility, requirements, claim steps) | This is how I can claim this money | Save, share, find pro, go back |
| Rebate not found | Fallback message | Something went wrong with this rebate | Go back |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User logs symptom but no path appears on Improve tab | HomeScreen → Improve tab | Auto-generate paths on Improve tab load when symptoms exist without paths |
| User taps "View Rebate" on step but rebate doesn't exist | ImprovementPath step → RebateDetail | Only show "View Rebate" on steps where hasRebate=true; rebates are seeded on first load |
| User sees empty Improve tab and doesn't know what to do | ImproveScreen with no symptoms | Clear empty state with "Log a symptom" message in paths section; rebates still show |
| Rebate detail screen accessed with invalid ID | RebateDetail | Show fallback message instead of crashing |
| User confused by ImprovementPath timeline vs to-do list | Improve tab | Path description clarifies it's a "guide" not a task list |

**Visibility decisions:**
- Must be visible: Phase labels (Now/Soon/Later/Major), step cost estimates, impact dots, rebate/pro links on relevant steps, savings total on rebates section
- Can be implied: Path generation (automatic from symptoms), rebate seeding (happens on first load), path ordering (most recent first)

**UX constraints:**
- ImprovementPath component must show phase headers with colored icons
- Steps must show cost estimate and impact indicator
- "View Rebate" and "Find Pro" pill buttons only appear on steps where relevant
- Empty paths section must still show rebates section (rebates are not dependent on symptoms)
- Max 3 paths displayed to prevent scroll fatigue
- Rebate eligibility badges must use color coding (green=eligible, yellow=likely, gray=check)

---

## Visual Specifications

### Improvement Paths Section (ImproveScreen)
- Uses existing ImprovementPath component (no new design needed)
- Section header: "Improvement Paths" h3, "Step-by-step guides to improve your home" body secondary
- Each path rendered as full ImprovementPath component with timeline
- Gap between paths: spacing.lg

### Empty Paths State
- Icon: map-outline, 48px, text.disabled color
- Title: "Your Improvement Paths"
- Description: "Log a symptom on the Home tab to get a personalized step-by-step improvement plan."
- No CTA button (user navigates to Home tab themselves)

### Rebate Detail Fallback
- Simple centered text: "This rebate is no longer available."
- Back button in header still functional
