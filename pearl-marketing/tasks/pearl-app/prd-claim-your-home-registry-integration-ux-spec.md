# UX Specification: Claim Your Home — Pearl Registry Integration

## Pass 1: Mental Model

**Primary user intent:** "I want to prove this is my home so Pearl gives me everything it knows about it."

**Likely misconceptions:**
- **"Claiming means I'm buying something"** — Users may think "claim" implies a purchase, subscription, or commitment. The word "claim" has insurance/legal connotations. Mitigation: pair "claim" with "verify ownership" language and show it's free.
- **"My home already has a score, so it's already claimed"** — Every US home has a Pearl SCORE from public data. Users will confuse "scored" with "claimed." Mitigation: explicitly distinguish "Pearl already scored your home from public records" vs. "Claim it to unlock verified data and take ownership."
- **"If I claim here, it only works in this app"** — Users won't expect app actions to affect an external registry. Mitigation: show "Connected to Pearl Registry" badge to reinforce the link.
- **"Uploading a document means someone will review it manually"** — Mock auto-approves, but users may expect a wait. Mitigation: set expectations with "Instant verification" for utility bills, "May take up to 24 hours" for other docs.
- **"The previous owner can still see my data"** — Transfer anxiety. Mitigation: explicit "Previous owner's personal data is removed" messaging during transfer.

**UX principle to reinforce:** Claiming is a *gift* — you're unlocking data Pearl already has about your home, not giving something up. Frame as "unlock" not "submit."

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Home address (from AddressEntryScreen)
- Pearl SCORE (0-1000, already exists for every home)
- Registry status (found/not found in registry)
- Claim status (unclaimed / claimed by me / claimed by someone else / transfer pending)
- Verification document (utility bill, closing docs, tax record)
- Document photo (camera capture or gallery selection)
- Imported registry data (score, pillars, features, equipment, climate risk, energy projections, neighborhood comparisons)
- "What Pearl already knows" (verified features from registry)
- "What you can add" (gaps the user can fill)
- Sync status (app ↔ registry connection health)
- Ownership transfer (for homes claimed by previous owner)

**Grouped structure:**

### Discovery Group
- Registry status: **Primary** — shown immediately after address selection
- Pearl SCORE badge: **Primary** — visual anchor showing the home exists in Pearl's system
- Claim CTA: **Primary** — the main action we want users to take
- Rationale: Users need to see registry status before they can decide to claim

### Verification Group
- Document type selection: **Primary** — 3 clear options (utility bill, closing docs, tax record)
- Document photo capture: **Primary** — the core verification action
- Photo preview: **Primary** — user must confirm before submitting
- Verification status/progress: **Primary** — feedback during and after submission
- Rationale: Verification is the gate to claiming; every element must be visible and clear

### Confirmation Group
- Claim success celebration: **Primary** — milestone moment, must feel rewarding
- Imported data summary: **Primary** — shows immediate value of claiming
- "What Pearl knows" list: **Secondary** — detail view, expandable
- "What you can add" list: **Secondary** — progressive disclosure, not overwhelming
- Rationale: Celebration first, details second. Don't bury the win in data.

### Ongoing Status Group
- Claim badge on MyHomeScreen: **Secondary** — subtle when claimed (mission accomplished), prominent when unclaimed (CTA)
- Registry sync indicator: **Hidden** — only visible if user taps claimed badge
- Transfer status: **Primary** (only when applicable) — amber badge visible on MyHomeScreen during pending transfer
- Rationale: Once claimed, status fades to background. Unclaimed status is a CTA.

### Transfer Group (conditional)
- "Already claimed" message: **Primary** — immediately visible when home is claimed by another
- "I'm the new owner" CTA: **Primary** — clear escape hatch
- Transfer pending status: **Primary** — visible on MyHomeScreen
- Transfer complete confirmation: **Primary** — same celebration as initial claim
- Rationale: Transfer is a blocker; must be surfaced clearly, not hidden.

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| Claim this home | Teal filled button, prominent placement below registry status card. Button text: "Claim This Home" |
| Select document type | 3 tappable cards with icons (receipt=utility bill, document=closing docs, building=tax record). Card highlights on selection. |
| Take photo of document | Large dashed-border camera target (reuse BillCaptureScreen pattern). Camera icon center. Text below: "Take a clear photo" |
| Choose from library | Text link below camera target: "Or choose from photo library" |
| Retake photo | Outline button alongside Submit button in preview state |
| Submit verification | Filled teal button: "Submit for Verification" |
| View imported data | Scrollable summary card; individual items are read-only text, not tappable |
| Continue to My Home | Filled teal button at bottom of confirmation screen |
| Start ownership transfer | Text link: "I'm the new owner" — not a button (lower commitment feel) |
| View registry sync details | Tap the claimed badge on MyHomeScreen → navigates to registry detail |
| Retry failed verification | "Try Again" button appears in error state |

**Affordance rules:**
- If user sees a **teal filled button**, they should assume it's the primary action on this screen
- If user sees a **dashed border area with camera icon**, they should assume they can tap to take a photo
- If user sees a **card with icon + label**, they should assume it's a selection option
- If user sees a **checkmark badge**, they should assume that item is complete/verified
- If user sees an **amber badge**, they should assume something is pending/in progress
- Read-only data is displayed in gray/muted text inside cards — never looks tappable

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| "Should I claim this home?" | Choice | Show value preview: "Unlock X verified features, climate risk data, and neighborhood comparisons" — make the benefit concrete before asking for action |
| "Which document should I upload?" | Choice | Default recommend utility bill (most common, fastest verification). Show "Recommended" badge on utility bill option. Other options available but secondary. |
| "Is this photo good enough?" | Uncertainty | Show guidance overlay: "Make sure your name and address are visible." Preview shows the photo large enough to assess quality. |
| "How long will verification take?" | Waiting | Set expectations upfront: utility bill = instant, closing docs = up to 24h, tax record = up to 24h. Show estimated time before submission. |
| "What happens to the previous owner?" | Uncertainty | Proactive disclosure during transfer: "The previous owner's personal notes and preferences will be removed. Only home feature data (equipment, verified features) transfers." |
| "Did it actually sync to the registry?" | Uncertainty | Show "Connected to Pearl Registry" badge with last-synced timestamp on detail view |

**Defaults introduced:**
- **Utility bill is pre-highlighted** as recommended document type — Rationale: fastest verification, most commonly available, reduces decision paralysis
- **Camera launches by default** (not gallery) — Rationale: matches BillCaptureScreen pattern, users expect to photograph a physical document
- **Auto-import all registry data on claim** — Rationale: no reason to make user choose what to import; everything is valuable. User can override later.
- **Sync is automatic and silent** — Rationale: fire-and-forget pattern; don't burden user with sync management

---

## Pass 5: State Design

### AddressEntryScreen — Registry Lookup

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Pre-search | Globe rotating, search input empty | "I need to type my address" | Type address, browse suggestions |
| Lookup loading | Skeleton card below selected address with shimmer animation | "Pearl is checking if my home is in the registry" | Wait (brief, 300-800ms) |
| Found + Unclaimed | Registry status card: "Found in Pearl Registry" with SCORE badge + "Claim This Home" teal button | "My home has a Pearl SCORE and I can claim it" | Tap "Claim This Home" to start verification |
| Found + Claimed by me | Registry status card: "Found in Pearl Registry" + "Claimed" badge with checkmark | "I already claimed this home" | Continue to My Home |
| Found + Claimed by other | Registry status card: "This home has been claimed" + "Are you the new owner?" link | "Someone else claimed this home but I can transfer" | Tap "I'm the new owner" to start transfer |
| Not found | Muted card: "Not yet in Pearl Registry" | "My home isn't tracked yet, but I can still use the app" | Continue without claiming (app works without claim) |
| API error | No registry card shown; app continues normally | Nothing — user doesn't know registry exists if it's down | Continue to My Home as if registry doesn't exist |

### OwnershipVerificationScreen — Document Upload

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Doc type selection | 3 document type cards (utility bill highlighted as recommended), guidance text | "I need to pick a document type and photograph it" | Select document type |
| Camera/idle | Dashed camera target, guidance text about clear photo with name + address visible | "I need to take a photo of my document" | Tap camera area or "choose from library" |
| Preview | Full photo preview with "Retake" and "Submit for Verification" buttons | "I can check if the photo is clear before submitting" | Retake or submit |
| Submitting | ActivityIndicator + "Verifying ownership..." text, buttons disabled | "Pearl is checking my document" | Wait |
| Success | Brief success flash → auto-navigate to ClaimConfirmationScreen | "Verification passed!" | (auto-navigates) |
| Error | Error message: "We couldn't verify this document" + "Try Again" button + "Try a different document" link | "Something went wrong but I can retry" | Retry same photo, retake, or pick different doc type |

### ClaimConfirmationScreen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Celebration | Teal checkmark animation, "Your home is now claimed!" header, confetti/glow moment | "I did it! My home is mine in Pearl" | Scroll to see details |
| Data summary | Summary card: Pearl SCORE, pillar breakdown, count of verified features and known equipment | "Pearl already knows a lot about my home" | Review data, scroll |
| What you can add | List of gaps: "Add equipment photos," "Connect smart devices," "Complete assessments" | "There's more I can do to improve my profile" | Continue to My Home |
| Continue | "Continue to My Home" button at bottom | "I'm done here, let me see my home" | Tap to navigate to MyHomeScreen |

### MyHomeScreen — Claim Badge

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Unclaimed | Teal "Claim on Pearl Registry" link/CTA below ScoreDisplay | "I haven't claimed my home yet — I should do this" | Tap to start claim flow |
| Claimed | Subtle "Pearl Registry" badge with house+checkmark icon | "My home is connected to the Pearl Registry" | Tap badge to see sync details |
| Transfer pending | Amber "Transfer pending" badge | "My ownership transfer is being processed" | Tap to see transfer status |
| No registry data | Nothing shown (no badge, no CTA) | (Unaware of registry — graceful absence) | Use app normally |

### Ownership Transfer (conditional flow)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Transfer prompt | "This home was claimed by a previous owner" message + "I'm the new owner" button | "The previous owner claimed this — I need to prove I'm the new owner" | Start transfer (same doc upload flow) |
| Transfer submitted | "Ownership transfer in progress" message with estimated time | "My transfer is being processed" | Wait, use app with limited registry features |
| Transfer pending (MyHomeScreen) | Amber "Transfer pending" badge | "Still waiting on transfer" | Tap to check status |
| Transfer complete | Celebration screen (same as initial claim confirmation) | "I'm now the verified owner" | Continue to My Home with full registry data |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User uploads blurry/wrong document | OwnershipVerificationScreen preview | Show guidance text BEFORE camera: "Make sure your name and this address are clearly visible." Preview at large size so blur is obvious. |
| User confused about which document to use | Doc type selection | Pre-highlight utility bill as "Recommended (fastest)." Brief helper text per option: "Most recent bill showing your name and address." |
| User abandons mid-verification | OwnershipVerificationScreen | No data lost — they haven't submitted yet. Back button returns to AddressEntryScreen. Claim CTA still visible when they return. |
| User's home isn't in registry | AddressEntryScreen lookup | Graceful "Not yet in Pearl Registry" message. App continues normally. User is NOT blocked from using the app. |
| Registry API is down | AddressEntryScreen lookup | No error shown. Registry card simply doesn't appear. App functions fully without registry. User can claim later. |
| User navigates away during verification submission | OwnershipVerificationScreen | Show "Verifying..." state. If they leave and come back, re-check claim status via `getClaimStatus()`. |
| User doesn't understand ownership transfer | Transfer prompt | Explicit: "The previous owner's personal notes will be removed. Only home data (equipment, features) carries over." FAQ link if available. |
| Previous owner tries to access after transfer | Outside app scope | Mock service handles this server-side. App only shows current owner's view. |
| Back button from ClaimConfirmation goes to verification | ClaimConfirmationScreen | Back button should go to AddressEntryScreen (skip verification). Or better: no back button — only "Continue to My Home" CTA. This is a terminal success screen. |
| User re-enters claim flow after already claiming | AddressEntryScreen | Lookup returns "claimed by me" → shows badge, not CTA. No way to accidentally re-claim. |

**Visibility decisions:**
- **Must be visible:** Registry status (after lookup), claim CTA (when unclaimed), document type options, photo preview, verification progress, claim badge on MyHomeScreen, transfer status
- **Can be implied:** Sync status (background, silent), registry data source attribution (data just appears in app), API connection health (graceful degradation)

**UX constraints:**
- ClaimConfirmationScreen has NO back button — it's a celebration endpoint. Only forward navigation ("Continue to My Home").
- OwnershipVerificationScreen back button returns to the screen that launched it (AddressEntryScreen or MyHomeScreen), never to a half-completed state.
- Registry API failures are NEVER shown as errors to the user. The claim feature simply doesn't appear. The app must work 100% without registry.
- All messaging uses "understand your home" framing, NOT "improve your score." Banned phrases: "boost your score," "increase your rating," "score improvement."
- Document upload reuses the BillCaptureScreen camera pattern exactly — same dashed border, same button layout, same preview flow. Users who've captured a bill will recognize the pattern.
- Utility bill is always the pre-selected/recommended document type.

---

## Visual Specifications

### Screen: AddressEntryScreen — Registry Status Card (addition to existing screen)

**Placement:** Below the selected address confirmation card, above the Continue button.

**Registry Found + Unclaimed variant:**
- Card with 1px border (accent color), border-radius md, padding md
- Left: Pearl SCORE badge (small circular score display, accent color)
- Center: "Found in Pearl Registry" text (bodyMedium, primary color). Below: "Claim to unlock verified data about your home" (caption, secondary color)
- Below card: "Claim This Home" button (full-width, teal filled, same Button component)

**Registry Found + Claimed by me variant:**
- Same card layout
- Left: Teal checkmark circle (same as selected address checkmark pattern)
- Center: "Claimed on Pearl Registry" (bodyMedium, primary). Below: "Your home is connected" (caption, secondary)
- No CTA button

**Registry Found + Claimed by other variant:**
- Same card layout, amber border instead of teal
- Left: Amber warning icon
- Center: "This home has been claimed" (bodyMedium, primary). Below: "Are you the new owner?" (caption, accent color, tappable)

**Loading variant:**
- SkeletonCard (reuse existing Skeleton component) same dimensions as registry card

**Not found / API error:**
- Card not rendered. Continue button still visible. App flow unchanged.

### Screen: OwnershipVerificationScreen (new)

**Header:** Standard back-button header pattern (48px back button, centered title "Verify Ownership", 48px spacer)

**Document type section:**
- Title: "Choose a document" (h3, primary)
- Subtitle: "Upload a clear photo showing your name and this address" (body, secondary)
- 3 cards in vertical stack, each: icon (24px, left) + label (bodyMedium) + description (caption). Utility bill card has "Recommended" badge (small teal pill, top-right).
- Selected card: teal border + light teal background. Unselected: default border.

**Camera section (appears after doc type selected):**
- Reuse BillCaptureScreen camera pattern exactly:
  - Dashed border target area, camera icon center
  - "Or choose from photo library" text link below
  - Preview state: Image full-width 300px + Retake/Submit button row
  - Submitting state: ActivityIndicator + "Verifying ownership..." text

### Screen: ClaimConfirmationScreen (new)

**No header back button.** Only forward navigation.

**Celebration section (top):**
- Large teal checkmark icon (64px) with subtle scale-in animation
- "Your home is now claimed!" (h2, primary, center-aligned)
- "Welcome home!" (body, secondary, center-aligned)

**Data summary card:**
- Card component with sections:
  - Pearl SCORE (large, accent color) with pillar breakdown (5 small colored indicators)
  - "X verified features" count
  - "X known equipment items" count

**"What Pearl already knows" section:**
- Expandable/collapsible list (same chevron pattern as PillarAssessmentSection)
- Each item: checkmark icon + feature name (e.g., "Central AC — Verified", "Attic Insulation — R-30")

**"What you can add" section:**
- List of opportunities: each with plus-circle icon + description
- Examples: "Add equipment photos", "Connect smart devices", "Complete home assessments"

**CTA:** "Continue to My Home" (full-width teal button, bottom, with safe area padding)

### Screen: MyHomeScreen — Claim Badge (addition)

**Placement:** Below ScoreDisplay, above overall assessment progress.

**Unclaimed:** Teal text link with house-outline icon: "Claim on Pearl Registry →" (caption weight, teal color). Tappable — navigates to claim flow.

**Claimed:** Subtle inline badge: house icon + checkmark (16px, muted teal) + "Pearl Registry" text (caption, secondary color). Tappable — navigates to registry detail.

**Transfer pending:** Amber inline badge: time-outline icon (16px, amber) + "Transfer pending" text (caption, amber color). Tappable — shows transfer status.

### Component Reuse
- `Button` — all primary CTAs
- `Card` — registry status card, data summary card
- `Skeleton` / `SkeletonCard` — loading states
- `ErrorState` — API error fallback (if ever needed)
- BillCaptureScreen camera pattern — document photo capture
- PillarAssessmentSection chevron pattern — expandable "What Pearl knows" list
- Badge component pattern — claim status badges
