# UX Specification: Utility Bill Photo Analysis & Tracking

## Pass 1: Mental Model

**Primary user intent:** "I want to understand why my energy bill is high and see if it's getting better or worse."

**Likely misconceptions:**
- Users may think Pearl connects to their utility account automatically (it doesn't — photo-based)
- Users may expect real-time usage monitoring (it's monthly snapshots from bills)
- Users may think photographing the bill is optional and they can type values instead (not in v1)
- Users may expect Pearl to negotiate rates or switch providers (out of scope)
- Users may confuse device energy readings (real-time kWh/day from smart devices) with utility bill data (monthly aggregate)

**UX principle to reinforce/correct:** Pearl reads your bill photo to track your energy use over time — like a fitness tracker for your home's energy. Each bill you add makes the picture clearer. The more bills you add, the better Pearl can spot unusual patterns.

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Utility bill (individual record)
- Bill photo (captured image)
- Extraction status (processing/complete)
- Provider name
- Billing period (date range)
- Energy usage (kWh)
- Cost ($)
- Month-over-month comparison
- Year-over-year comparison
- Usage trend (chart)
- Anomaly alert
- Bill history (all bills)
- Year grouping
- Energy pillar score contribution
- Paid tier gate
- Upgrade prompt

**Grouped structure:**

### Bill Capture Flow
- Photo capture: **Primary** (the core action)
- Extraction status: **Primary** (user must wait and understand)
- Extracted data preview: **Primary** (user confirms accuracy)
- Rationale: Capture is the entry point — must be frictionless and clear

### Bill Details
- Provider, period, usage, cost: **Primary** (core data points)
- Bill photo thumbnail: **Secondary** (reference, not focal)
- MoM comparison: **Primary** (immediate context)
- YoY comparison: **Primary** (seasonal context)
- Delete action: **Hidden** (destructive, rare)
- Rationale: Details screen is where users get the "so what" — comparisons are the value

### Bill History & Trends
- Bar chart: **Primary** (visual trend at a glance)
- Bill list: **Primary** (drill-down access)
- Year picker: **Secondary** (most users care about current year)
- Add bill FAB: **Primary** (ongoing action)
- Empty state: **Primary** (first-time guidance)
- Rationale: History is the "big picture" view — chart draws the eye, list provides detail

### Anomaly & Insights
- Anomaly insight cards: **Primary** (on dashboard, high value)
- Energy pillar status: **Secondary** (updates silently)
- Suggested actions: **Primary** (what to do about it)
- Rationale: Anomalies are the feature's payoff — they must surface prominently

### Access & Gating
- Paid tier gate: **Primary** when triggered (blocks access clearly)
- Upgrade benefits: **Primary** within gate (sells the value)
- Feature entry points: **Secondary** (natural touchpoints, not pushy)
- Rationale: Gate must explain value without frustrating — show what they're missing

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| Take photo of bill | Large camera icon button with "Take Photo" label, centered on screen |
| Choose from gallery | Secondary text button "Choose from Library" below camera button |
| Confirm extracted data | Teal "Confirm & Save" button at bottom of extraction results |
| Retake photo | Outline "Retake" button next to confirm |
| View bill detail | Tappable row in history list with chevron |
| Switch year in history | Segmented control or left/right arrows with year label |
| Add new bill | Floating action button (+ icon) or header "Add" button |
| Delete bill | Red text button at bottom of detail screen, behind confirmation dialog |
| Navigate back | Back arrow in header (consistent with all Pearl screens) |
| Upgrade to premium | Teal filled button with "Upgrade" label in gate overlay |

**Affordance rules:**
- If user sees a camera icon with label, they should assume tapping opens the camera
- If user sees colored comparison cards (green/red), they should understand direction without reading numbers
- If user sees bar chart bars, they should understand relative usage without exact labels
- If user sees a lock icon or overlay, they should understand the feature requires upgrade

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Choosing camera vs gallery | Choice | Default to camera (primary), gallery as secondary text link |
| Waiting for OCR extraction | Waiting | Show animated progress with "Reading your bill..." message and estimated time |
| Reviewing extracted data | Uncertainty | Pre-fill all fields, highlight the key numbers (usage, cost) with large font |
| Understanding comparisons | Uncertainty | Use arrows (up/down) with color and plain language ("12% more than last month") |
| First bill with no comparisons | Uncertainty | Show "Add more bills to see trends" placeholder instead of empty comparison cards |
| Deciding to delete a bill | Choice | Require confirmation dialog with clear warning |
| Understanding anomaly severity | Uncertainty | Use existing Pearl color system (red=action, yellow=attention, green=good) |

**Defaults introduced:**
- Camera mode default: Camera (not gallery) — most users will photograph a physical bill
- Photo confirmation: Auto-proceed to extraction after photo capture (no extra "use this photo?" step)
- Year picker: Defaults to current year
- Premium flag: Default to true for demo (users see full feature)

---

## Pass 5: State Design

### Bill Capture Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (no photo) | Camera button + gallery option | "I need to photograph my bill" | Take photo or choose from gallery |
| Photo captured | Photo preview + Extract button | "Pearl has my bill, ready to read it" | Tap Extract or Retake |
| Extracting | Spinner + "Reading your bill..." | "Pearl is processing my bill" | Wait (button disabled) |
| Extraction complete | Data card with usage/cost/period | "Here's what Pearl found" | Confirm & Save or Retake |
| Error | Error message + Retry button | "Something went wrong reading the bill" | Retry or go back |

### Bill Detail Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Loading | Skeleton cards | "Loading bill details" | Wait |
| Success (with history) | Data + comparison cards | "Here's my bill and how it compares" | Review, delete, go back |
| Success (first bill) | Data + "Add more bills" placeholders | "I need more bills for comparisons" | Go back, add more bills |
| Error (bill not found) | Error state with back button | "This bill doesn't exist anymore" | Go back |

### Bill History Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | Illustration + "Add your first bill" message | "I haven't added any bills yet" | Tap to add first bill |
| Loading | Skeleton chart + skeleton rows | "Loading my bill history" | Wait |
| Success | Bar chart + bill list | "Here's my usage over time" | Tap bill, switch year, add new |
| Single bill | Chart with one bar + list with one row | "I only have one bill so far" | Add more or view detail |

### Paid Tier Gate

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Not premium | Overlay with feature benefits + Upgrade button | "This is a premium feature" | Tap Upgrade or go back |
| Premium | Normal feature access | N/A (no gate visible) | Use feature normally |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User photographs wrong part of bill | Bill capture | Show brief instruction text: "Photograph the section showing your total usage and charges" |
| OCR returns wrong data | Extraction preview | Let user see all extracted fields before confirming — can retake if wrong |
| User doesn't understand kWh | Everywhere | Show cost ($) alongside kWh — dollars are universally understood |
| First-time user has no comparison data | Bill detail | Show encouraging placeholder: "Add last month's bill to start tracking trends" |
| User confused about where to find feature | Navigation | Entry from HomeScreen energy coach prompt + MyHome/Account menu row |
| Free user hits gate after expecting feature | Capture screen | Gate shows immediately before camera opens — don't waste time then block |
| User accidentally deletes bill | Bill detail | Confirmation dialog: "Delete this bill? This can't be undone." |
| User on old year with no data | History year picker | Disable years with no bills, or show "No bills for [year]" |

**Visibility decisions:**
- Must be visible: Usage (kWh), cost ($), comparison arrows with % and color, add bill button, back navigation on every screen
- Can be implied: Provider name (shown but not emphasized), exact billing dates (secondary text), photo thumbnail (reference only)

**UX constraints:**
- Every screen must have a back button in the header
- Comparison colors must match Pearl system: green = helping/decrease, red = hurting/increase, gray = no data
- Bar chart bars must have a minimum visible height even for low usage months (so they're tappable)
- Gate overlay must appear BEFORE camera opens (don't prompt for camera permission then block)
- Extraction preview must show all data fields — no hidden data that silently saves

---

## Visual Specifications

### Bill Capture Screen
- **Header**: Back arrow + "Add Utility Bill" title (consistent with EquipmentEntry pattern)
- **Camera area**: Large centered camera icon (64px) in a dashed border container (200px tall), teal accent color
- **Gallery option**: Text button below: "Or choose from photo library" in secondary text color
- **Instruction text**: Small caption above camera area: "Photograph the section showing your total usage and charges"
- **Photo preview**: Full-width image with rounded corners (12px), overlay with "Retake" (outline) and "Extract Data" (filled teal) buttons
- **Extraction loading**: Replace photo area with centered spinner + "Reading your bill..." text
- **Extraction result**: Card with provider, period, usage (large bold), cost (large bold), with Confirm/Retake buttons at bottom

### Bill Detail Screen
- **Header**: Back arrow + "Bill Details" title
- **Hero card**: Provider icon placeholder + provider name + billing period in secondary text
- **Data row**: Two large stat boxes side-by-side — Usage (kWh, large bold) and Cost ($, large bold)
- **Comparison cards**: Two cards below — "vs Last Month" and "vs Last Year" — each with arrow icon (up red / down green), percentage, and plain text description
- **Photo thumbnail**: Small rounded image (80px) at bottom of hero card
- **Delete**: Red text button at very bottom with spacing from content

### Bill History Screen
- **Header**: Back arrow + "Utility Bills" title + "Add" button (or FAB)
- **Year picker**: Centered row with left/right chevrons + year text
- **Bar chart**: Full-width container, 12 bars (one per month), proportional height, month labels below, colored by status
- **Bill list**: Below chart, rows with: month name, usage (kWh), cost ($), change indicator (colored arrow + %)
- **Empty state**: Centered illustration (flash icon), "Track Your Energy Usage" heading, "Add your first utility bill to start seeing trends" body, teal "Add Bill" button

### Gate Overlay
- **Background**: Semi-transparent dark overlay over the screen content
- **Card**: Centered white card with: flash icon, "Unlock Energy Tracking" heading, 3 benefit bullets (track usage, spot anomalies, save money), teal "Upgrade to Premium" button, "Maybe Later" text button
