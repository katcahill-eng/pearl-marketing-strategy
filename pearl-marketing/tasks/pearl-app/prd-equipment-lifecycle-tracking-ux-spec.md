# UX Specification: Equipment Lifecycle Tracking

## Pass 1: Mental Model

**Primary user intent:** "I want to know the status and remaining life of my home equipment so I can plan ahead."

**Likely misconceptions:**
- Users may expect equipment data to persist after seeing it on screen — currently it's hardcoded mock data that doesn't save. The transition to real persistence must be invisible; users should never know mocks existed.
- Users may think "aging" means broken — status language needs to convey "approaching end of useful life" not "currently failing."
- Free-tier users may expect full lifecycle features since basic equipment info is visible — the premium gate needs to clearly communicate what's locked without frustrating users who just want to see their equipment list.
- Users may think replacement cost estimates are quotes or guarantees — ranges need to be framed as "typical budget range" not "your cost."

**UX principle to reinforce/correct:** Equipment tracking is a planning tool, not a diagnostic tool. The system tells you what to watch, not what's wrong. Premium features unlock proactive planning (lifespan tracking, cost estimates, rebate matching).

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Equipment list (all items)
- Individual equipment record (name, type, brand, model, year, efficiency)
- Equipment status (good / aging / replace soon)
- Lifespan progress (% of expected life used)
- Replacement cost estimate (low–high range)
- Available rebates for aging equipment
- Equipment aging notifications
- Lifecycle insights on dashboard
- Premium/free tier distinction

**Grouped structure:**

### Equipment Inventory (Primary)
- Equipment list on My Home screen: **Primary** — always visible, the entry point
- Add equipment button: **Primary** — visible in equipment section
- Individual equipment name/type/brand: **Primary** — basic info, always free
- Rationale: Core inventory is the foundation; users must see and manage their equipment freely

### Equipment Health (Secondary → Primary for paid)
- Equipment status badge (good/aging/replaceSoon): **Primary** — visible in list and detail
- Lifespan progress bar: **Secondary** — detail screen only, paid-tier
- Replacement cost estimate card: **Secondary** — detail screen only, paid-tier, only for aging/replaceSoon
- Rationale: Status badge is always visible as a quick signal; detailed health info is the paid upgrade value

### Proactive Alerts (Hidden → surfaces via notifications)
- Equipment aging notifications: **Hidden** — push notifications, background trigger
- Lifecycle insights on dashboard: **Secondary** — appears in insight feed when relevant
- Rationale: These are passive features that surface when equipment reaches thresholds

### Actions (Secondary)
- Edit equipment: **Secondary** — accessible from detail screen
- Delete equipment: **Secondary** — accessible from detail screen with confirmation
- Check rebates: **Secondary** — suggested action in insights and detail screen
- Find Pearl Pro: **Secondary** — suggested action alongside rebates
- Rationale: Actions are responses to information, not primary navigation targets

### Premium Gate (Contextual)
- "Upgrade for lifecycle tracking" banner: **Contextual** — only appears when non-premium user views detail screen
- Rationale: Gate is shown in-context where the locked features would appear, not as a separate screen

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| View equipment list | Equipment section on My Home with item rows, each row tappable with chevron |
| Add new equipment | "+" button or "Add Equipment" CTA in equipment section |
| View equipment detail | Tap equipment row → navigates to detail screen |
| Edit equipment | "Edit" button in detail screen header |
| Delete equipment | "Delete" button at bottom of detail screen (destructive, red text) |
| See equipment status | Color-coded status badge on list items and detail hero |
| See lifespan progress | Horizontal progress bar with percentage label (paid-tier) |
| See replacement cost | Card with dollar range, only visible for aging/replaceSoon (paid-tier) |
| Check rebates | Tappable rebate cards in detail screen |
| Upgrade to premium | Banner with "Upgrade" button replaces locked content |
| Navigate back | Back arrow in detail/entry screen headers |
| Save equipment entry | "Save" button at bottom of entry form |

**Affordance rules:**
- If user sees a chevron (>) on a row, they should assume it's tappable and navigates to detail
- If user sees a color badge (green/yellow/red), they should assume it indicates equipment health
- If user sees a progress bar, they should assume it shows how much lifespan is used
- If user sees a dollar range card, they should assume it's an estimate, not a quote
- If user sees a blurred/locked area with "Upgrade" text, they should assume it's a paid feature

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Adding equipment: choosing type | Choice | 8 types with icons and labels; group common types first (HVAC, water heater) |
| Adding equipment: filling all fields | Choice | Only name required; brand/model/year/efficiency all optional with "I don't know" |
| Understanding equipment status | Uncertainty | Use plain language: "Good condition", "Getting older", "Plan replacement" — not just color |
| Interpreting cost range | Uncertainty | Show as "$8,000 – $15,000 typical range" with equipment type label |
| Deciding whether to upgrade (premium gate) | Choice | Show what's locked (lifespan bar, costs, rebates) as a preview list, not just generic "premium features" |
| Deleting equipment | Choice | Confirmation dialog with equipment name to prevent accidental deletion |

**Defaults introduced:**
- Estimated lifespan auto-filled from equipment type (getTypicalLifespan) — user doesn't need to know
- Equipment status auto-calculated from year installed + lifespan — no manual status selection
- New equipment ID auto-generated (equip_{timestamp}) — no user-facing ID entry
- Equipment type label auto-derived from type selection — user picks "HVAC", sees "Heating & Cooling"

---

## Pass 5: State Design

### My Home Screen – Equipment Section

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | "No equipment added yet" message with add button | They need to add equipment to use this feature | Tap "Add Equipment" |
| Loading | Skeleton placeholder rows | Data is loading | Wait |
| Success (has items) | List of equipment with status badges and count | Their saved equipment with health status at a glance | Tap any item for detail, tap add for new |
| Error | Error state with retry | Something went wrong loading equipment | Tap retry |

### Equipment Entry Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| New entry | Empty form with type selector and required name field | They're adding new equipment | Fill fields, save |
| Edit mode | Pre-filled form with existing data | They're editing existing equipment | Modify fields, save |
| Saving | Button shows saving indicator | Entry is being saved | Wait |
| Validation error | Red text under name field | Name is required | Enter name, re-save |

### Equipment Detail Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Loading | Skeleton layout | Detail is loading | Wait |
| Success (free tier) | Basic info + "Upgrade" banner where lifespan/cost/rebates would be | They can see basics but lifecycle features are premium | Read info, tap upgrade, edit, delete |
| Success (paid, good status) | Full detail with green status, lifespan bar, no cost card | Equipment is healthy | Read info, edit, delete |
| Success (paid, aging) | Full detail with yellow status, lifespan bar, cost estimate card | Equipment is aging, budget planning info available | Check rebates, find pro, edit |
| Success (paid, replaceSoon) | Full detail with red status, lifespan bar, cost estimate card, rebate cards | Equipment needs replacement soon, action needed | Check rebates, find pro, edit |
| Not found | "Equipment not found" message with back button | The equipment was deleted or ID is invalid | Go back |

### Equipment Aging Notifications

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Aging notification | "Your {name} is {age} years old. Typical lifespan is {lifespan} years." | Equipment is getting older | Tap to view detail |
| ReplaceSoon notification | "Your {name} may need replacement soon. Check available rebates." | Action needed | Tap to view detail/rebates |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User adds equipment but doesn't see it on My Home | After save on EquipmentEntryScreen | Context updates immediately; My Home reads from context, not stale props |
| User deletes equipment but it still appears in list | After delete on EquipmentDetailScreen | Navigate back after delete; list reads from context |
| User edits equipment but changes don't appear | After edit save | Context updates; detail screen reads latest from context |
| Equipment not found after deep-link from notification | EquipmentDetailScreen with stale ID | Show "Equipment not found" error state with back button |
| Free user confused about what's locked | EquipmentDetailScreen premium gate | Banner lists specific locked features (lifespan tracking, cost estimates, rebate matching) |
| Notification arrives for already-deleted equipment | Background notification service | Check equipment still exists before generating notification |
| User sees "aging" but doesn't understand urgency | Equipment status badge | Use plain language labels alongside color: "Getting older" not just "Aging" |

**Visibility decisions:**
- Must be visible: Equipment status badge on list items, equipment count on My Home, back button on all sub-screens, save/cancel on entry, delete confirmation dialog
- Can be implied: Lifespan calculation logic, status threshold percentages, notification dedup logic, cost estimate data source

**UX constraints:**
- Equipment list and basic info (name, type, brand) must always be free — never gate the inventory itself
- Premium gate replaces locked content in-place — no separate paywall screen interrupting navigation
- Delete always requires confirmation with equipment name displayed
- Entry screen navigates back on successful save — no confirmation screen
- Notifications respect 30-day dedup — users should never feel spammed
- Cost estimates are always shown as ranges with "typical" qualifier — never as exact amounts
