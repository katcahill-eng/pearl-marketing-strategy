# UX Specification: Pearl Coach Onboarding Flow

---

## Pass 1: Mental Model

**Primary user intent:** "I want to understand what's going on with my home and what I can do about it."

**Likely misconceptions:**

1. **"This is another home inspection app"** — Users may expect Pearl to physically inspect or require professional assessment. Reality: Pearl uses existing data + user input.

2. **"I need to know technical details about my home"** — Users may worry they don't know enough (SEER ratings, R-values). Reality: Pearl translates; no expertise needed.

3. **"This will try to sell me something"** — Users are skeptical of "free" apps with home improvement angles. Reality: Pearl is a guide first, recommendations second.

4. **"I have to finish everything now"** — Users may feel trapped in a long onboarding. Reality: They can exit and return; data is saved.

5. **"The app found these problems"** — Users may think Pearl diagnosed issues. Reality: Pearl reflects back what THEY said and provides context.

**UX principles to reinforce:**

- **Pearl is a translator, not an inspector** — Language should be "based on what you told me" not "we detected"
- **No expertise required** — Never show technical jargon without plain-English explanation
- **Conversation, not interrogation** — One question at a time, acknowledgment before next question
- **User is in control** — Can go back, skip, exit anytime

---

## Pass 2: Information Architecture

**All user-visible concepts:**

- Pearl (the guide/coach persona)
- Home address
- Home details (year built, square footage)
- Comfort concerns
- Energy/bill concerns
- Air quality concerns
- Equipment concerns
- Coach summary/reflection
- Dashboard
- Data tiers (Estimated, Basic, Detailed, Connected)
- Coach prompts for more data

**Grouped structure:**

### Onboarding Flow (Sequential)
- Welcome message: **Primary** — First impression, sets tone
- Address entry: **Primary** — Required to proceed
- Home confirmation: **Primary** — Builds trust, shows Pearl has data
- Guided questions (4): **Primary** — Core discovery
- Coach summary: **Primary** — Validation, transition to dashboard

### Guided Question Topics
- Comfort: **Primary** — Most tangible, relatable concern
- Energy/Bills: **Primary** — Universal concern (money)
- Air quality: **Primary** — Health-related, less obvious
- Equipment: **Primary** — Practical, maintenance-focused

*Rationale: All 4 are primary because each represents a distinct SCORE pillar area. Order goes from most relatable (temperature) to more specific (equipment).*

### Dashboard Elements (Post-Onboarding)
- First-time coach intro: **Primary** — One-time orientation
- Personalized highlight cards: **Primary** — Based on their answers
- Coach prompts for more data: **Secondary** — Available but not blocking
- Data tier indicators: **Hidden** — Shown contextually when relevant

### Data Tiers
- Estimated: **Hidden** — Default state, shown as badge only
- Basic: **Hidden** — After onboarding answers
- Detailed: **Hidden** — After equipment entry
- Connected: **Hidden** — After utility/device connection

*Rationale: Tiers are system concepts. Users see results, not the tier system itself.*

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| Proceed to next step | Large, full-width primary button at bottom ("Let's go", "Continue") |
| Go back to previous question | Back arrow in header, always visible |
| Select an answer option | Large tappable cards with radio-style selection (one choice) |
| Confirm home details | Two distinct buttons: "Yes, that's my home" (primary) / "Something's off" (secondary/text) |
| Skip/exit onboarding | "Skip" text link in header (subtle but present) |
| View more about a topic | Cards with chevron → or "Learn more" link |
| Add more data (dashboard) | Coach prompt cards with clear CTA button |
| Dismiss first-time overlay | Tap anywhere or explicit "Got it" button |

**Affordance rules:**

- If user sees a **full-width button at bottom** → they should tap to proceed
- If user sees **large option cards** → they should tap one to select (only one)
- If user sees **back arrow** → they can revise previous answer
- If user sees **"Skip"** → they can exit without completing
- If user sees a **coach prompt card** → it's an invitation, not a requirement
- If user sees **"Estimated" badge** → Pearl is guessing; they can improve accuracy

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Welcome screen | Uncertainty | Single CTA only; no choices to make |
| Address entry | Choice | Autocomplete; don't require full manual entry |
| Home confirmation | Choice | Binary choice (Yes/No); "No" allows correction, not restart |
| Each guided question | Choice | Limit to 3 options per question; no "other" or text entry |
| Selecting answer | Uncertainty | Visual confirmation (checkmark, highlight) on selection |
| After guided questions | Uncertainty | Coach summary reflects back answers before dashboard |
| First dashboard view | Overwhelm | One-time overlay explains what they're seeing |
| Coach prompts | Choice | Each prompt has single, clear CTA; "Later" option implicit (just don't tap) |

**Defaults introduced:**

- **Progress is auto-saved** — If user exits mid-onboarding, they resume where they left off
- **"Estimated" is the default tier** — No action needed to see initial recommendations
- **First highlighted card = their top concern** — Based on strongest response in guided questions
- **Skip = go to dashboard with Estimated data** — Not a dead end

---

## Pass 5: State Design

### Welcome Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Default | Pearl greeting, value prop, "Let's go" button | Pearl is friendly, this will be quick | Tap to start |
| N/A | (No loading, error, or empty states) | | |

### Address Entry Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | Input field with placeholder, coach intro text | Need to enter address | Type or use autocomplete |
| Typing | Autocomplete suggestions appearing | Pearl is helping find address | Tap suggestion or keep typing |
| Loading | "Got it! Let me pull up what I know..." | Pearl is fetching home data | Wait (brief) |
| Success | Transition to Home Confirmation | Address accepted | Proceed |
| Error | "I couldn't find that address. Try again?" | Address not recognized | Re-enter or enter manually |

### Home Confirmation Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Success | Address + year + sqft, "Does this look right?" | Pearl has data about their home | Confirm or correct |
| Partial | Address only, "I don't have details yet" | Pearl has limited data | Confirm and proceed (can add later) |
| Error | "Something's off" flow → manual entry | They need to correct info | Enter year/sqft manually |

### Guided Questions Screen (each question)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Unanswered | Question + 3 options, none selected | Need to pick one | Tap an option |
| Answered | Selected option highlighted with checkmark | Choice recorded | Tap Continue or change selection |
| Transitioning | Brief fade/slide to next question | Moving forward | Wait (instant) |

### Coach Summary Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Has concerns | "Here's what I'm hearing:" + bullet list | Pearl listened, these are their concerns | Tap to go to dashboard |
| No concerns | "Your home sounds like it's in good shape" | Everything is fine | Tap to go to dashboard |

### Dashboard (First-Time)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| First visit | Overlay: "This is your home dashboard" + highlighted cards | Orientation to main screen | Dismiss overlay, explore |
| Returning | No overlay, personalized cards | Their home hub | Explore, log symptoms, view maintenance |

### Coach Prompt Cards

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Available | Card with insight + "Tell me about..." CTA | Can improve accuracy by adding data | Tap to start guided data entry, or ignore |
| Completed | Card shows "Based on your [equipment]" | Pearl has their data now | View details |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User exits mid-onboarding | Any screen | Auto-save progress; resume on return |
| User doesn't know address details | Home Confirmation | "Partial" state allows proceeding without year/sqft |
| User selects wrong answer | Guided questions | Back button always visible; can revise |
| User feels interrogated | Guided questions | Limit to 4 questions; one at a time; coach tone |
| User overwhelmed at dashboard | First dashboard view | One-time overlay explains what they're seeing |
| User doesn't understand "Estimated" | Dashboard cards | Badge + coach text explains: "I'm estimating..." |
| User thinks they're done forever | Dashboard | Coach prompts invite deeper engagement with clear value |
| User wants to restart | Any point | Settings option to "Redo onboarding" (hidden, available) |

**Visibility decisions:**

**Must be visible:**
- Back button (header, all onboarding screens)
- Progress indicator (guided questions: 1/4, 2/4, etc.)
- Skip option (subtle but present)
- Selected answer confirmation (checkmark/highlight)
- Coach summary before dashboard (no skipping this)
- First-time dashboard overlay

**Can be implied:**
- Data tier (shown contextually, not as a system concept)
- "You can add more data later" (implied by coach prompts, not stated explicitly)
- Exit/save (auto-saves, no explicit "save" button needed)

**UX constraints for visual phase:**

1. **One question per screen** — No scrolling multi-question forms
2. **Maximum 3 options per question** — No overwhelm, no "Other" text entry
3. **Coach voice in every screen** — Intro text should feel like a person speaking
4. **No jargon without translation** — If a term appears (SEER, R-value), plain English follows immediately
5. **Primary CTA always visible** — No scrolling to find the button
6. **Progress must be linear with back option** — No branching, no skipping ahead
7. **Summary before dashboard** — User must see reflection before data is shown
8. **First-time dashboard overlay required** — Cannot skip orientation

---

## Visual Specifications

### Screen Flow

```
┌──────────────────┐
│  Welcome Screen  │
│  "Hi, I'm Pearl" │
│  [Let's go]      │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Address Entry   │
│  "First, let's   │
│   find your home"│
│  [input field]   │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Home Confirmation│
│  "Here's what I  │
│   found..."      │
│  [Yes] [No]      │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Guided Questions │
│  (4 screens)     │
│  [Option cards]  │
│  Progress: 1/4   │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Coach Summary   │
│  "Here's what    │
│   I'm hearing:"  │
│  [Show me...]    │
└────────┬─────────┘
         ▼
┌──────────────────┐
│    Dashboard     │
│  (First-time     │
│   overlay)       │
└──────────────────┘
```

### Component Specifications

**Option Card (Guided Questions)**
- Full-width, tappable
- Height: ~80px
- Border: 1px subtle gray (unselected), 2px teal (selected)
- Background: white (unselected), light teal (selected)
- Checkmark icon appears on right when selected
- Text: 16-18px, left-aligned

**Progress Indicator**
- Horizontal dots or segments: ○ ○ ● ○ for "2 of 4"
- Position: top of screen, below header
- Subtle, not distracting

**Coach Text**
- Larger than body text (18-20px)
- Conversational line length (~50 chars)
- Centered or left-aligned depending on content

**Primary CTA Button**
- Full-width (with padding)
- Height: 56px
- Background: Pearl teal
- Text: white, 16-18px, bold
- Position: bottom of screen (safe area aware)

**Back Button**
- Left arrow icon in header
- Tappable area: 44x44px minimum
- Always visible during onboarding (except Welcome)

**Skip Link**
- Text link: "Skip"
- Position: header right side
- Subtle gray, not primary color
- Visible but not prominent

### Dashboard Coach Prompt Card

**Structure:**
```
┌─────────────────────────────────┐
│ 🌡️ Comfort              [Badge]│
│                                 │
│ Some rooms uncomfortable        │
│                                 │
│ I'm estimating based on your    │
│ home's age. Tell me about your  │
│ HVAC and I can be more specific.│
│                                 │
│ [Tell me about your HVAC] (2min)│
└─────────────────────────────────┘
```

- Icon + label at top
- Badge: "Estimated" (gray) or "Your equipment" (teal)
- Insight text: coach voice
- CTA button: secondary style (outline or lighter)
- Time estimate in parentheses (optional)

### First-Time Dashboard Overlay

- Semi-transparent backdrop
- Centered card with coach text
- Points/arrows to highlighted areas
- Single dismiss action: "Got it" button
- Cannot be skipped on first visit
