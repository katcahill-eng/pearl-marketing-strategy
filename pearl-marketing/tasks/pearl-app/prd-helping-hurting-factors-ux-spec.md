# UX Specification: Helping/Hurting Factor Engine & Dynamic Pillar Statuses

## Pass 1: Mental Model

**Primary user intent:** "I want to understand why each area of my home scores the way it does, and what I can do to make it better."

**Likely misconceptions:**
- Users may think factors are Pearl's opinion rather than based on their actual data (readings, equipment, symptoms)
- Users may expect pillar statuses to change in real-time as they watch (they change when source data changes)
- Users may think "Good" status means nothing to improve (there can still be helping factors that maintain the good status)
- Users may not realize that logging a symptom or adding equipment will change their pillar statuses

**UX principle to reinforce/correct:** Factors are evidence-based observations from YOUR data — devices, equipment, symptoms you logged, and answers you gave during setup. The pillar status reflects the balance of helping vs hurting factors. More data = more accurate factors.

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Pillar status (good/typical/needsWork) on cards
- Pillar name and icon
- Pillar explanation text
- Helping factors (green, positive things about your home)
- Hurting factors (red, things that need attention)
- Factor name and explanation
- Factor expanded content (more detail)
- Factor action button (what you can do about it)
- Related equipment list
- Connected devices and readings
- Measured vs Estimated badges

**Grouped structure:**

### My Home Tab - Pillar Row
- Pillar cards with dynamic statuses: Primary (always visible)
- Score display: Primary (always visible)
- Equipment list: Primary (always visible)

### Home Tab - Pillar Summary
- Pillar cards in Your Pearl Score section: Primary (always visible)
- Daily Summary Card with pillar statuses: Primary (when devices connected)

### Pillar Detail Screen
- Pillar header with name, icon, status: Primary (always visible)
- Pillar explanation: Primary (always visible)
- What's Helping section with FactorCards: Primary (visible when helping factors exist)
- What's Hurting section with FactorCards: Primary (visible when hurting factors exist)
- Empty state when no factors: Secondary (visible when no data available)
- Connected devices: Secondary (visible when devices mapped to this pillar)
- Related equipment: Secondary (visible when equipment mapped to this pillar)

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|--------------------------|
| See pillar status at a glance | Colored status dot (green=good, yellow=typical, red=needsWork) on PillarCard |
| Tap pillar to see detail | PillarCard is tappable with press feedback |
| See what's helping | Green checkmark icon + "What's Helping" section header + green left border on FactorCards |
| See what's hurting | Red alert icon + "What's Hurting" section header + red left border on FactorCards |
| Expand a factor for more info | Chevron down icon on FactorCard, expands on tap |
| Take action on hurting factor | Accent-colored action button with label (e.g., "Find a Pro", "View Rebates") |
| Navigate back from detail | Arrow-back icon in header |

**Affordance rules:**
- If user sees a green left border, they should understand this is a positive factor
- If user sees a red left border, they should understand this needs attention
- If user sees an action button on a factor, they should expect it navigates to a relevant resource
- If user sees colored status dots on pillar cards, they should understand the relative health of each area

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Understanding why a pillar has its status | Uncertainty | Pillar explanation text + factors show evidence |
| Too many factors per pillar | Choice | Show all factors but grouped by helping/hurting with clear headers |
| What to do about hurting factors | Uncertainty | Action button on each hurting factor with specific label |
| Empty pillar with no factors | Uncertainty | Clear empty state: "No specific factors identified yet" with "Add equipment to get personalized insights" |
| Status dot colors | Uncertainty | Consistent color system across all pillar cards |

**Defaults introduced:**
- Pillar statuses auto-derived from factors — no user decision needed
- Factors auto-generated from context data — no user input needed
- Default status is 'good' when no data available — optimistic default
- Action labels pre-assigned per factor type — user doesn't choose what action to take

---

## Pass 5: State Design

### PillarDetailScreen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Has helping and hurting factors | Both sections with FactorCards | These are the things affecting this pillar | Expand factors, take action on hurting |
| Only helping factors | "What's Helping" section only | This pillar is doing well | Expand factors to learn more |
| Only hurting factors | "What's Hurting" section only | This pillar needs attention | Take action on hurting factors |
| No factors (no data) | Empty state: "No specific factors identified yet" | Need more data to evaluate this pillar | Add equipment or log symptoms |
| Has related equipment | Equipment list with status dots | These systems affect this pillar | Tap equipment for detail |
| Has connected devices | Device cards with readings | Live data feeding into this pillar | View device detail |

### MyHomeScreen - Pillar Row

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| All pillars good | All green dots | Home is performing well | Tap any pillar for detail |
| Mixed statuses | Mix of green/yellow/red dots | Some areas need attention | Tap yellow/red pillars to see what's wrong |
| No data (all default to good) | All green dots | Pearl hasn't found any issues yet | Add equipment, log symptoms, connect devices |

### HomeScreen - Pillar Summary

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Pillars with derived statuses | Colored status dots | How each area of my home is doing | Tap any pillar for detail |
| Daily summary with pillar statuses | Summary card with pillar indicators | Overall home health at a glance | Expand for more detail |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User adds equipment but pillar status doesn't change | MyHomeScreen | Factors re-derived on every render from latest context data (no stale cache) |
| User logs symptom but pillar doesn't reflect it | HomeScreen | Symptoms create hurting factors for affected pillars, status updates immediately |
| User taps "Find a Pro" on factor but PearlPros screen has no context | PillarDetail → PearlPros | PearlPros screen shows general pro directory (contextual filtering is future) |
| User taps "View Rebates" on factor but no specific rebate linked | PillarDetail → RebateDetail | Navigate to first available rebate; rebates are seeded with 5 defaults |
| Pillar status stuck on default (good) because no data sources | MyHomeScreen / HomeScreen | Good is the optimistic default; coach prompts encourage data collection |
| PillarDetailScreen accessed with non-canonical pillar ID | Navigation | PILLAR_INFO map includes all 5 canonical IDs; fallback to 'safety' if unknown ID |

**Visibility decisions:**
- Must be visible: Pillar status dots on all pillar cards, factor type (helping/hurting) via color coding, action buttons on hurting factors
- Can be implied: Factor generation (automatic from data sources), status derivation (automatic from factors), data source attribution (user doesn't need to know which source generated which factor)

**UX constraints:**
- Pillar statuses must use same 3-color system everywhere (good=green, typical=yellow, needsWork=red)
- FactorCards must show green left border for helping, red for hurting
- Hurting factors must have action buttons; helping factors should not
- Empty state must mention how to get factors (add equipment, log symptoms)
- Back button must always be functional on PillarDetailScreen

---

## Visual Specifications

### PillarDetailScreen Factor Sections
- Uses existing FactorCard component (no new design needed)
- Section headers: "What's Helping" with green checkmark, "What's Hurting" with red alert circle
- Gap between factor cards: spacing.sm
- Gap between sections: spacing.lg

### Dynamic Pillar Status Dots
- Uses existing PillarCard component status dots
- Colors from theme: colors.status.good (green), colors.status.typical (yellow), colors.status.needsWork (red)

### Empty State (No Factors)
- Uses existing empty state design in PillarDetailScreen
- Icon: information-circle-outline, 32px, text.disabled color
- Title: "No specific factors identified yet"
- Description: "Add equipment to get personalized insights"
