# PRD: Pearl Coach Onboarding Flow

**Version:** 1.0
**Date:** January 21, 2026
**Status:** Ready for development

---

## Overview

Replace the current survey-style onboarding with a conversational "coach" experience. Pearl should feel like a knowledgeable neighbor guiding the user through understanding their home—not a form to fill out.

---

## Current Flow (Problem)

```
Sign Up → 3 passive slides → Address → Grid of 8 symptoms → Data dump → Dashboard
```

**Issues:**
- Passive reading → cold interrogation → overwhelming data
- No coach voice or personality
- Feels like a survey, not a conversation
- No immediate value or personalization

---

## New Coach Flow

```
Sign Up → Welcome → Address + Confirmation → Guided Questions (4 topics) → Coach Summary → Personalized Dashboard
```

---

## Screens

### 1. Welcome Screen (NEW)

**Purpose:** Introduce Pearl as a guide, set expectations

**Content:**
- Friendly greeting: "Hi, I'm Pearl"
- Value prop: "I help homeowners understand their homes—no expertise needed."
- Expectation setting: "Let's take a few minutes to learn about your place."
- Single CTA: "Let's go"

**Design:**
- Pearl teal background
- Centered content
- Warm, approachable tone

---

### 2. Address Entry (MODIFY)

**Purpose:** Get address with context

**Changes from current:**
- Add coach intro: "First, let's find your home."
- After entry, show loading state: "Got it! Let me pull up what I know about [address]..."

---

### 3. Home Confirmation Screen (NEW)

**Purpose:** Build trust by showing we have data, let user verify

**Content:**
- "Here's what I found:"
- Display: Address, Year built, Square footage (from Pearl data)
- "Does this look right?"
- Two options: "Yes, that's my home" / "Something's off"

**If "Something's off":**
- Allow manual correction or skip

---

### 4. Guided Questions (REPLACE symptom grid)

**Purpose:** Understand user's concerns conversationally, one topic at a time

**Structure:** 4 sequential screens, each focused on one area

#### 4a: Comfort
- "Let's talk about comfort. How does your home feel temperature-wise?"
- Options:
  - "Pretty comfortable"
  - "Some rooms are off"
  - "It's a real issue"

#### 4b: Energy/Bills
- "What about your energy bills?"
- Options:
  - "Seem reasonable"
  - "Higher than I'd like"
  - "Way too high"

#### 4c: Air Quality
- "How's the air inside?"
- Options:
  - "Fresh and clean"
  - "Sometimes stuffy or dusty"
  - "Allergies act up / odors"

#### 4d: Equipment
- "Any equipment concerns? (HVAC, water heater, appliances)"
- Options:
  - "Everything works fine"
  - "Some things need attention"
  - "Something's breaking down"

**Design:**
- One question per screen
- Large, tappable option buttons (not checkboxes)
- Progress indicator showing 1/4, 2/4, etc.
- Back button to revise previous answer

---

### 5. Coach Summary Screen (REPLACE insights screen)

**Purpose:** Reflect back what user said, validate, give hope

**Content:**
- "Thanks for sharing."
- "Here's what I'm hearing:" + bullet list of concerns they mentioned
- Hopeful message: "Good news: these are connected, and there are solutions."
- CTA: "Show me what you found"

**Logic:**
- Only show concerns they actually indicated (not "everything's fine" answers)
- If they said everything is fine: "Great! Your home sounds like it's in good shape. Let me show you how to keep it that way."

---

### 6. Dashboard First-Time Experience (MODIFY)

**Purpose:** Introduce dashboard with coach context

**Changes:**
- First-time overlay/card: "This is your home dashboard."
- "Based on what you told me, I've highlighted a few things to look at first."
- Highlight cards relevant to their answers (comfort, energy, etc.)
- Add coach prompts for adding more data (see below)

---

## Dashboard Coach Prompts

After onboarding, dashboard cards should invite deeper engagement with coach voice:

### Pattern: Insight → Invitation

**Example: Comfort card**
```
🌡️ Comfort: Some rooms uncomfortable

I'm estimating based on your home's age.
Tell me about your HVAC system and I can
be more specific about what's causing this.

[Tell me about your HVAC] (2 min)
```

**Example: Energy card**
```
💡 Energy: Estimated

Right now I'm guessing based on typical homes.
Share a utility bill and I'll show you exactly
where you stand.

[Add a utility bill]
```

---

## Data Tiers (Display Logic)

| Tier | Badge | Coach message |
|------|-------|---------------|
| Estimated | "Estimated" | "I'm estimating based on homes like yours" |
| Basic | "Based on your input" | "Based on what you've told me..." |
| Detailed | "Your equipment" | "With your specific setup..." |
| Connected | "Live data" | "Looking at your actual usage..." |

---

## Navigation Changes

**Remove:**
- OnboardingStoriesScreen (3 slides) - replaced by Welcome
- SymptomSelectionScreen (grid) - replaced by GuidedQuestionsScreen
- SymptomInsightsScreen (data dump) - replaced by CoachSummaryScreen

**Add:**
- WelcomeScreen
- HomeConfirmationScreen
- GuidedQuestionsScreen (handles all 4 questions)
- CoachSummaryScreen

**Modify:**
- AddressEntryScreen - add coach intro text
- HomeScreen (Dashboard) - add first-time experience, coach prompt cards

---

## Success Criteria

1. User feels guided, not interrogated
2. Onboarding takes ~2 minutes
3. Dashboard is personalized to their answers
4. Clear path to add more data with value explained
5. Coach voice consistent throughout

---

## Out of Scope (Phase 2)

- Detailed equipment entry flows (HVAC, water heater guided flows)
- Utility bill photo upload
- Device connections
- These will be built as separate coach-guided flows after Phase 1
