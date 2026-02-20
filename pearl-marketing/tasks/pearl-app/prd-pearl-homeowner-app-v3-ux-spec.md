# UX Specification: Pearl Homeowner App
## "Understand Your Home. Improve Your Life In It."

**Source PRD:** prd-pearl-homeowner-app-v3.md (v3.2)
**Date:** January 20, 2026

---

## Pass 1: Mental Model

**Primary user intent:** "I want to understand why my home feels the way it does and know what I can do about it."

**Likely misconceptions:**

1. **"This is a home inspection app"** - Users may expect Pearl to identify defects or safety hazards. Pearl organizes information and uncertainty, not diagnose problems.

2. **"I need to enter all my data before I get value"** - Users may think the app requires comprehensive data entry upfront. Value should be delivered before data is requested.

3. **"The score tells me if my home is good or bad"** - Users may interpret the Pearl Score as a pass/fail judgment. The score is about alignment with priorities, not absolute quality.

4. **"This is for selling my house"** - Users may think Pearl is only valuable when preparing to sell. The app is for improving lived experience now.

5. **"Higher score = better home"** - Users may chase points without understanding what they measure. The score reflects home performance across specific pillars, not overall desirability.

6. **"I need to be an expert to understand this"** - Users may feel intimidated by home performance terminology. Pearl translates complexity; no expertise required.

**UX principle to reinforce/correct:**

**Value before data, understanding before action.** Pearl must deliver immediate insight from symptoms and estimated data before asking users to verify or add information. The app is a translator and guide, not a data collection tool or inspection service.

---

## Pass 2: Information Architecture

**All user-visible concepts:**

- Symptoms (user-reported home issues)
- Pearl Score (numeric 0-1000)
- Score Levels (Compromised → Outstanding)
- Five SCORE Pillars (Safety, Comfort, Operations, Resilience, Energy)
- Helping factors (positive contributors)
- Hurting factors (negative contributors)
- Equipment/features (HVAC, windows, appliances, etc.)
- Maintenance reminders
- Equipment age/lifecycle status
- Rebates/incentives
- Improvement paths (recommended actions)
- Pearl Professionals (contractors)
- Connected devices
- Utility bill data
- Symptom history/logs
- Badges (achievements)
- Certification tiers (Silver/Gold/Platinum/Platinum Plus)
- Documents (certification, uploads, tax)
- Subscription tier (Free/Paid)

**Grouped structure:**

### My Home's Health (Primary)
- **Symptoms logged**: Primary - entry point, immediate relevance
- **Helping factors**: Primary - positive reinforcement, shows value
- **Hurting factors**: Primary - actionable problems
- **Five SCORE Pillars**: Primary - organizing framework for understanding

*Rationale: These are the daily-use concepts that help homeowners understand their lived experience.*

### My Home's Profile (Secondary)
- **Equipment/features**: Secondary - data that powers insights
- **Equipment age/lifecycle**: Secondary - shown contextually with alerts
- **Pearl Score**: Secondary - summary metric, not primary focus
- **Score Levels**: Secondary - context for score meaning
- **Badges**: Secondary - achievements earned, not chased
- **Certification tiers**: Secondary - pathway for sellers, not primary users

*Rationale: Profile data supports insights but isn't the main engagement driver. Users add data to get better insights, not to fill out a profile.*

### Take Action (Secondary)
- **Improvement paths**: Secondary - surfaced when relevant to symptoms
- **Rebates/incentives**: Secondary - connected to hurting factors
- **Pearl Professionals**: Secondary - resource for getting help
- **Maintenance reminders**: Secondary - periodic engagement driver

*Rationale: Actions are valuable but only after understanding is established. Surface contextually, not as primary navigation.*

### Data Sources (Hidden/Progressive)
- **Connected devices**: Hidden until user upgrades or explores
- **Utility bill data**: Hidden until user subscribes
- **Symptom history**: Hidden until user has logged multiple symptoms

*Rationale: Advanced data sources are paid features and shouldn't clutter the free experience.*

### Account & Documents (Hidden/Progressive)
- **Documents**: Hidden in Account tab - only relevant for certified users or sellers
- **Subscription tier**: Hidden - shown contextually when features require upgrade
- **Settings**: Hidden - standard account functions

*Rationale: Administrative functions should not compete with primary value.*

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| Log a symptom | Prominent floating action button (FAB) or card with "What's bothering you?" prompt |
| Select a symptom category | Tappable cards with icons representing each symptom type |
| View pillar details | Tappable pillar cards that expand or navigate to detail |
| See helping/hurting factors | Collapsible sections with green (helping) and red (hurting) indicators |
| Take action on hurting factor | Inline CTA button within hurting factor card |
| View a rebate | Tappable card that navigates to rebate detail |
| Mark maintenance complete | Checkbox or "Done" button on reminder card |
| Add equipment | Plus icon or "Add" button on equipment list |
| Connect a device | "Connect" button in device section (paid badge if free user) |
| Upload utility bill | Camera icon with "Scan bill" label |
| View score breakdown | Tappable score display that expands to show pillars |
| Navigate between tabs | Bottom navigation bar with 4 icons + labels |
| Upgrade to paid | Contextual prompt with "Upgrade" button when hitting feature limit |
| View documents | List items with document icon and download/preview action |
| Contact Pearl Pro | "Contact" or "Request Quote" button on contractor card |

**Affordance rules:**

- If user sees a symptom card, they should assume tapping it will show related insights
- If user sees green/red color coding, they should assume green = helping, red = hurting
- If user sees a score with a scale, they should assume tapping shows breakdown
- If user sees a "lock" icon or "Upgrade" badge, they should assume the feature requires subscription
- If user sees a contractor card, they should assume they can contact that contractor
- If user sees an alert badge (red dot), they should assume something needs attention
- If user sees a chevron (>), they should assume tapping navigates to detail view
- If user sees a checkbox, they should assume they can mark something complete

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| First open - "What do I do?" | Uncertainty | Symptom selector as first screen after signup; clear primary action |
| Symptom selection - "Which one?" | Choice | Limit to 8-10 common symptoms; allow multi-select; provide "Not sure" option |
| Adding equipment - "What details do I need?" | Uncertainty | Smart defaults from public records; "I don't know" always available |
| Viewing pillars - "What does this mean?" | Uncertainty | Plain-language labels; one-tap explanations; relate to user's symptoms |
| Understanding score - "Is 351 good?" | Uncertainty | Always show level label (e.g., "Typical"); show range context; color coding |
| Choosing rebate - "Which one applies?" | Choice | Pre-filter to user's situation; show "Recommended for you" first |
| Deciding to upgrade - "Is it worth it?" | Choice | Show specific locked features contextually, not generic upsell |
| Maintenance reminders - "What's urgent?" | Choice | Sort by urgency/due date; highlight overdue items |
| Improvement paths - "Where do I start?" | Choice | Sequence actions (Now/Soon/Later); show estimated cost/impact |

**Defaults introduced:**

- **Equipment defaults from public records**: Don't make users enter home age, sq footage, or basic systems if we can estimate. Let them correct if wrong.
- **Symptom-first flow**: Default to "What's bothering you?" rather than score or profile completion.
- **Pre-filtered rebates**: Default to showing rebates relevant to user's location and known equipment, not all rebates.
- **Standard maintenance schedule**: Pre-populate common maintenance items with industry-standard intervals.
- **Score visible but not hero**: Default dashboard shows symptoms/insights first, score accessible but secondary.

---

## Pass 5: State Design

### Symptom Selection Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | Symptom cards with icons, prompt "What's bothering you about your home?" | They should select what's bothering them | Tap one or more symptom cards; tap "Just exploring" to skip |
| Selected | Highlighted symptom card(s) with checkmarks | Their selection is registered | Continue to see insights; deselect; add more |
| Loading | Brief spinner after selection | Pearl is finding relevant insights | Wait (< 2 sec) |
| Success | Insights screen showing related helping/hurting factors | Pearl found relevant information | View factors; take action; log another symptom |
| Error | "Couldn't load insights" with retry button | Something went wrong | Retry; continue browsing app |

### Dashboard (Home Tab)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (no symptoms) | Welcome message, prominent symptom prompt, basic pillar overview | They haven't engaged yet; app wants to help | Log a symptom; explore pillars |
| Loading | Skeleton cards where content will appear | Data is loading | Wait (< 2 sec) |
| Success | Active symptom card, alerts, pillar summary, quick actions | App has relevant information for them | View details; log new symptom; check maintenance |
| Partial (limited data) | Insights with "Estimated" badges; prompt to improve accuracy | Data is estimated, could be better | Add equipment; verify details; continue with estimates |
| Error | "Couldn't load your home data" with retry | Connection issue | Retry; view cached data if available |

### My Home Tab (Profile/Score)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | Basic home info from address; placeholder score; "Add details" prompts | Pearl has limited data about their home | Add equipment; verify details |
| Loading | Skeleton for score and pillars | Calculating/loading | Wait |
| Success | Score with level, 5 pillars with status, equipment list, badges earned | Full picture of home performance | View pillar details; add equipment; see badges |
| Partial | Score marked "Estimated"; some pillars marked "Limited data" | Some areas need more information | Add data to those areas; view what's available |
| Error | "Couldn't load home profile" with retry | Connection issue | Retry |

### Equipment Entry

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | Equipment type selector with common categories | They're starting to add equipment | Select category |
| Pre-filled | Form with estimated values from public records | Pearl guessed based on home data | Confirm; edit fields; mark "I don't know" |
| Editing | Form fields with current values | They're updating information | Change values; add photo (optional); save |
| Saving | Save button disabled; spinner | Data is being saved | Wait |
| Success | Confirmation with score impact shown | Equipment saved; score updated | Return to list; add another |
| Error | Inline error messages on problematic fields | Something needs correction | Fix errors; retry save |

### Rebates/Savings

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | "No rebates found" with suggestion to check back | No current rebates match their situation | Browse other categories; check eligibility |
| Loading | Skeleton cards | Loading rebates | Wait |
| Success | Rebate cards sorted by relevance; total savings shown | These rebates apply to them | View details; save/pin; share |
| Partial | Rebates with "Check eligibility" badges | Some rebates may or may not apply | View details to check eligibility |
| Error | "Couldn't load rebates" with retry | Connection issue | Retry |

### Maintenance Reminders

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | "No maintenance items yet" with option to add | They haven't set up maintenance tracking | Add items; use suggested schedule |
| Loading | Skeleton list | Loading | Wait |
| Success | List sorted by urgency: overdue (red), due soon (yellow), upcoming (gray) | What needs attention and when | Mark complete; snooze; view details |
| Partial | Some items with estimated dates, others exact | Mix of data quality | Confirm/edit dates; add missing items |
| Error | "Couldn't load maintenance" with retry | Connection issue | Retry |

### Upgrade Prompt (Paywall)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Initial | Contextual message about locked feature; "Upgrade" button | This feature requires subscription | Upgrade; dismiss; continue with free |
| Loading | Processing payment | Payment processing | Wait |
| Success | Welcome message; feature now accessible | They upgraded successfully | Use the feature |
| Error | Payment failed message | Payment didn't work | Try again; use different payment; contact support |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User skips symptom selection and doesn't understand value | Onboarding | Make symptom selection feel optional but valuable; show preview of insights they'll get |
| User adds equipment but doesn't see impact | Equipment entry | Always show score change after adding; connect to pillars |
| User doesn't know what symptoms to pick | Symptom selection | Include "I'm not sure - help me explore" option that shows all pillars |
| User gets discouraged by low score | Score display | Frame as "here's what you have" not "here's what's wrong"; show improvement paths |
| User doesn't understand Free vs Paid distinction | Throughout | Show locked features in context with clear value; don't hide features, badge them |
| User abandons equipment entry mid-flow | Equipment forms | Auto-save progress; allow "I don't know" for any field; make photos optional |
| User doesn't return after initial use | Retention | Push notifications for maintenance, rebates, weather; symptom follow-ups |
| User expects app to diagnose problems | Symptom flow | Clear language: "might be related to" not "this is causing"; suggest professional help |
| User thinks certification is required | Gamification | Never block features behind certification; position as optional pathway |
| Registry user has different expectations | Entry from Registry | Consistent "What's bothering you?" flow regardless of entry point |

**Visibility decisions:**

**Must be visible:**
- Symptom logging action (FAB or prominent card) - always accessible
- Current symptoms/issues being tracked - on dashboard
- Top helping/hurting factors - on dashboard
- Maintenance alerts (when due) - on dashboard
- Score with level label - in My Home tab
- Free vs Paid feature distinction - contextual badges
- Navigation between 4 main tabs - bottom bar

**Can be implied:**
- Detailed score breakdown - tap score to expand
- Full equipment list - in My Home tab, scrollable
- All rebates - in Improve tab
- Badge criteria - tap badge to see requirements
- Document details - in Account tab
- Subscription management - in Account tab

**UX constraints:**

1. **No score on dashboard hero** - Score lives in My Home tab; dashboard leads with symptoms and insights
2. **No locked/grayed badges** - Show earned badges prominently; show unearned as "paths" with progress
3. **No required photos** - Photos always optional; offer "verified" badge incentive
4. **No jargon without explanation** - Every technical term has inline explanation on first appearance
5. **"I don't know" always valid** - Every form field must accept uncertainty without penalty
6. **Value before data** - Show estimated insights before asking for data entry
7. **Action tied to problem** - Every improvement path starts from a user-identified symptom or hurting factor
8. **Contextual upgrade prompts** - Only show upgrade when user hits a paid feature, not proactively

---

## Visual Specifications

### Design Principles

1. **Diagnostic, not gamified** - Clinical clarity over achievement excitement
2. **Calming, not alarming** - Issues are improvement opportunities, not failures
3. **Helpful, not judgmental** - Guidance without condescension
4. **Simple, not sparse** - Information-rich but well-organized

### Navigation Structure

**Bottom Navigation (4 tabs):**

| Tab | Icon | Label | Purpose |
|-----|------|-------|---------|
| 1 | Grid/Dashboard | Home | Dashboard: symptoms, insights, alerts |
| 2 | House | My Home | Profile: score, pillars, equipment, badges |
| 3 | Lightbulb/Wrench | Improve | Rebates, improvement paths, Pearl Pros |
| 4 | Person/Gear | Account | Settings, subscription, documents |

### Screen Inventory

#### Onboarding Flow (3-4 screens)

1. **Splash** - Logo, brief (< 2 sec)
2. **Sign Up** - Single screen: social auth prominent, email option, no confirm password
3. **Address Entry** - Search field, "We found your home" confirmation
4. **Symptom Selection** - "What's bothering you?" with symptom cards

#### Main App Screens

5. **Dashboard (Home Tab)**
   - Active symptom card (if any)
   - Quick actions: Log symptom, Check maintenance
   - Alerts section (maintenance due, equipment aging, new rebates)
   - Pillar summary (5 icons with status indicators)
   - Connected devices summary (paid users)

6. **Symptom Insights** - Triggered after symptom selection
   - Relevant pillar highlighted
   - Helping factors (green)
   - Hurting factors (red) with action CTAs
   - "What you can do" section

7. **My Home (Profile Tab)**
   - Score display with level label and scale
   - 5 Pillar cards (tappable to expand)
   - Equipment list with lifecycle indicators
   - Badges earned section

8. **Pillar Detail** - One per pillar
   - Pillar explanation (plain language)
   - Helping factors for this pillar
   - Hurting factors for this pillar
   - Equipment contributing to this pillar

9. **Equipment Entry** - Single screen per equipment type
   - Smart defaults pre-filled
   - "I don't know" option for each field
   - Optional photo upload
   - Score impact preview

10. **Improve Tab**
    - "Recommended for you" rebates section
    - Total potential savings
    - Improvement paths (if active symptoms)
    - Pearl Pros directory link

11. **Rebate Detail**
    - Amount, program, eligibility
    - How to claim steps
    - Save/share actions

12. **Maintenance List**
    - Sorted by urgency
    - Mark complete / Snooze actions
    - Add custom item

13. **Account Tab**
    - Profile settings
    - Subscription status
    - Documents (3 categories)
    - Connected devices
    - Help / Contact

### Component Specifications

#### Symptom Card
- **Dimensions:** Full-width minus margins, ~80px height
- **Content:** Icon (left, 40x40), Label (center-left), Checkbox (right, on selection)
- **States:** Default, Hover/Press, Selected
- **Color:** Neutral background; selected = brand accent border

#### Pillar Card
- **Dimensions:** ~equal width cards in row of 5, or 2-column grid
- **Content:** Icon, Pillar name, Status indicator (color dot or label)
- **States:** Default, Tapped (navigates to detail)
- **Color:** Status colors: Good (green), Typical (yellow), Needs Work (red)

#### Helping/Hurting Factor Card
- **Dimensions:** Full-width, variable height based on content
- **Content:** Indicator bar (green/red left edge), Factor name, Brief explanation, Action CTA (on hurting cards)
- **States:** Collapsed, Expanded
- **Color:** Green (#10B981) for helping, Red (#EF4444) for hurting

#### Score Display
- **Dimensions:** Centered, prominent in My Home tab
- **Content:** Large number, Level label below, Visual scale
- **States:** Default, Tapped (expands to pillar breakdown)
- **Color:** Score number in brand blue; scale shows range from red to green

#### Rebate Card
- **Dimensions:** Full-width, ~120px height
- **Content:** Equipment icon (not stock photo), Savings amount (large), Program name, Eligibility indicator
- **States:** Default, Saved/Pinned
- **Color:** Savings amount in green

#### Maintenance Reminder Card
- **Dimensions:** Full-width, ~70px height
- **Content:** Item name, Due date, Status badge, Mark complete button
- **States:** Overdue (red), Due Soon (yellow), Upcoming (gray), Completed
- **Color:** Status-based left border

#### Badge
- **Dimensions:** ~60x60px
- **Content:** Badge icon, Name below
- **States:** Earned (full color), In Progress (outline with progress)
- **Color:** Full color when earned; muted/outline when in progress

### Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Primary | #0B3D5C (dark navy) | Headers, primary buttons, brand elements |
| Accent | #14B8A6 (teal) | CTAs, interactive elements, links |
| Helping | #10B981 (green) | Positive indicators, helping factors |
| Hurting | #EF4444 (red) | Negative indicators, hurting factors, overdue |
| Warning | #F59E0B (amber) | Due soon, caution states |
| Background | #F8FAFC (light gray) | App background |
| Card | #FFFFFF | Card backgrounds |
| Text Primary | #1E293B | Headings, important text |
| Text Secondary | #64748B | Body text, descriptions |
| Disabled | #CBD5E1 | Inactive elements |

### Typography

| Role | Style |
|------|-------|
| H1 (Screen titles) | 24px, Bold, Primary text |
| H2 (Section headers) | 18px, Semibold, Primary text |
| H3 (Card titles) | 16px, Semibold, Primary text |
| Body | 14px, Regular, Secondary text |
| Caption | 12px, Regular, Secondary text |
| Score number | 48px, Bold, Accent |
| Button | 14px, Semibold |

### Spacing System

- **Base unit:** 4px
- **Small:** 8px (within components)
- **Medium:** 16px (between components)
- **Large:** 24px (between sections)
- **XL:** 32px (screen padding top/bottom)

### Touch Targets

- **Minimum:** 44x44px for all interactive elements
- **Recommended:** 48x48px for primary actions
- **FAB:** 56x56px

### Responsive Considerations

- **Primary design:** Mobile-first (375px width)
- **Large phones:** Scale up to 428px width
- **Tablets:** Optional - maintain mobile layout or 2-column where appropriate

### Animations & Transitions

- **Screen transitions:** 300ms ease-in-out
- **Card expand/collapse:** 200ms ease
- **Score change:** Animated count-up (500ms)
- **Success states:** Brief celebratory animation (confetti optional)
- **Loading:** Skeleton screens, not spinners (except brief operations)

---

## Appendix: Screen Flow Diagrams

### New User Onboarding
```
Splash → Sign Up → Address Entry → "We found your home" → Symptom Selection → Insights → Dashboard
```

### Symptom Logging (Returning User)
```
Dashboard → Tap "Log symptom" → Select symptom(s) → View insights → (Optional) Take action
```

### Equipment Entry
```
My Home → Equipment list → "Add" → Select type → Fill form (defaults shown) → Save → See score impact
```

### Rebate Discovery
```
Dashboard alert "Eligible for $X" → Improve tab → Rebate card → Detail → How to claim
```

### Maintenance Flow
```
Push notification → Open app → Maintenance card → Mark complete / Snooze / Find help
```

### Upgrade Flow
```
Tap paid feature → Contextual upgrade prompt → Upgrade → Payment → Success → Feature unlocked
```

---

## Appendix: Screenshot Reference

Current app screenshots available in `pearl-app-screenshots 2/` folder for reference during visual design phase. Key screens to study for patterns to keep or avoid:

**Keep patterns from:**
- Helping/Hurting insights (elevate from buried accordions)
- Energy Insight cards (contextual education)
- Rebate data structure

**Avoid patterns from:**
- 5-slide onboarding carousel (too long)
- Score as dashboard hero (de-emphasize)
- Locked achievement badges (discouraging)
- Endless dashboard scroll (too many sections)
- Tax docs banner everywhere (contextual only)

---

*End of UX Specification*
