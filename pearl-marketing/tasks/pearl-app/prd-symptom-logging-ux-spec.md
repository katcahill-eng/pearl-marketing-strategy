# UX Specification: Symptom Logging & Persistence

## Pass 1: Mental Model

**Primary user intent:** "I want to tell Pearl what's bothering me about my home and have it remember, so I get relevant help over time."

**Likely misconceptions:**
- Users may think logging a symptom immediately fixes something or triggers a service call
- Users may expect Pearl to "diagnose" the problem on the spot like a doctor, rather than tracking patterns
- Users may not realize follow-up notifications will come 30 days later and may be surprised by them

**UX principle to reinforce/correct:** Symptom logging is a journal, not a diagnostic tool. Pearl remembers what you tell it, watches for patterns, and checks back in. The value compounds over time — the more you log, the better Pearl understands your home.

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Symptom categories (Comfort, Health, Efficiency, Equipment)
- Individual symptoms (17 specific issues)
- Logged symptom entries (user's history)
- Symptom notes (optional user context)
- Affected pillars (which SCORE areas are impacted)
- Follow-up prompts ("Did this improve?")
- Symptom insights (what might cause this)
- Premium gate (30-day vs full history)

**Grouped structure:**

### Logging Flow
- Category selection: Primary (first step, always visible)
- Symptom selection: Primary (second step, filtered by category)
- Notes input: Secondary (optional, shown after symptom selected)
- Affected pillars: Hidden (shown only on insights screen)

### Dashboard Display
- Recent symptoms list: Primary (visible on Home tab)
- Symptom count badge: Primary (visible in section header)
- "Log a Symptom" quick action: Primary (always visible)
- FAB button: Primary (always visible, bottom-right)
- Older symptoms (premium): Hidden (behind upgrade prompt)

### Follow-up
- Follow-up notification: Primary (push notification after 30 days)
- "Did it improve?" prompt: Primary (in notification body)
- Resolve/dismiss actions: Secondary (available on symptom card)

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|--------------------------|
| Log new symptom | FAB button (accent color, + icon) and "Log a Symptom" card |
| Select category | Category cards with chevron-forward arrows |
| Select symptom | SymptomCard with pill-shaped tappable area |
| Add notes | TextInput with placeholder text suggesting what to write |
| Save symptom | "Save & View Insights" primary button at bottom |
| Dismiss symptom from dashboard | Close-circle-outline icon on symptom card |
| View symptom insights | Tap on symptom card in dashboard |
| Go back in modal | Arrow-back icon in header |
| Close modal without saving | Close (X) icon in header right |
| Resolve follow-up | Tap on follow-up notification → opens symptom insights |
| Upgrade for full history | Tappable upgrade banner below visible symptoms |

**Affordance rules:**
- If user sees a card with chevron-forward, they should assume it navigates deeper
- If user sees accent-colored FAB, they should assume it's the primary action
- If user sees close-circle icon, they should assume it dismisses/removes that item

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Choosing a category (4 options) | Choice | Keep to 4 categories with clear icons and descriptions |
| Choosing a symptom (4-5 per category) | Choice | Filter by selected category, show only relevant symptoms |
| Writing notes | Uncertainty | Make optional with helpful placeholder text |
| Understanding what logging does | Uncertainty | Info box: "After saving, we'll show you insights about what might be causing this" |
| Follow-up notification after 30 days | Uncertainty | Clear notification copy: "You logged X 30 days ago. Has it improved?" |
| Premium gate on history | Choice | Show count of hidden items and single upgrade CTA |

**Defaults introduced:**
- Notes default to empty (optional) — reduces friction
- Follow-up scheduled automatically at 30 days — no user decision needed
- `resolved` defaults to false — user only acts if symptom improves
- Free tier shows 30 days — enough to see recent activity without feeling locked out

---

## Pass 5: State Design

### HomeScreen Symptoms Section

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (no symptoms) | Empty state card with "Log Your First Symptom" CTA | No symptoms logged yet | Tap CTA or FAB to log first symptom |
| Loading | Skeleton cards | Data is loading | Wait |
| Has symptoms | List of symptom cards with dates and pillars | These are my logged issues | Tap to view insights, dismiss, or log more |
| Has hidden premium symptoms | Symptom list + "X older symptoms" upgrade banner | Some history is behind paywall | Upgrade or view recent symptoms |
| Error | Error state with retry | Something went wrong | Tap retry |

### SymptomLogModal

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Category step | 4 category cards | Pick what area is bothering you | Tap a category |
| Symptom step | Filtered symptom list | Pick the specific issue | Tap a symptom, or go back |
| Notes step | Summary + text input + info box | Add context if you want | Type notes or skip, then save |
| Saving | Button disabled momentarily | Saving in progress | Wait |

### Follow-up Notification

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Notification received | Push: "How's your [symptom]?" | Pearl is checking in after 30 days | Tap to open app |
| In-app from notification | Symptom insights screen for that symptom | Pearl wants to know if it improved | Mark resolved or dismiss follow-up |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User logs symptom but data lost | SymptomLogModal → HomeScreen | Save to context BEFORE navigating to insights |
| User confused by 30-day notification | Push notification | Clear copy: "You logged X 30 days ago" with symptom name |
| User closes modal mid-flow | Any step in SymptomLogModal | No data saved until explicit "Save" tap — no partial saves |
| GuidedQuestions answers not saved | Onboarding flow | Call setAnswers() before navigating to CoachSummary |
| Free user sees empty symptoms but has older data | HomeScreen | Show count of hidden items so they know data exists |

**Visibility decisions:**
- Must be visible: FAB button, symptom count in header, relative date on each card, affected pillar name
- Can be implied: Follow-up scheduling (automatic, no UI needed), premium status check (happens on load)

**UX constraints:**
- Symptom cards must show relative dates ("2 days ago"), not absolute dates
- Category icons must match between SymptomLogModal and HomeScreen symptom cards
- Follow-up notification must include symptom name — not generic text
- Premium upgrade banner must show count of hidden symptoms — not just "upgrade"
- Modal back button must always return to previous step, never close modal

---

## Visual Specifications

### HomeScreen Symptom Cards
- Follow existing Card component pattern
- Icon: 44x44 circle with accent+15% background
- Symptom name: body fontSize, medium weight
- Meta text: caption fontSize, "Logged [relative date] • Related to [pillar]"
- Dismiss: close-circle-outline icon, 20px, text.secondary color

### Premium Upgrade Banner (Symptom Section)
- Background: accent+10%
- Icon: lock-closed-outline
- Text: "[X] older symptoms" + "Upgrade for full history" link text
- No heavy border or aggressive styling — subtle prompt

### Follow-up Notification
- Category: symptom_followup
- Title: "How's your [symptomLabel]?"
- Body: "You logged '[symptomLabel]' 30 days ago. Has it improved?"
- Deep link data: { screen: 'SymptomInsights', symptomId: id }
