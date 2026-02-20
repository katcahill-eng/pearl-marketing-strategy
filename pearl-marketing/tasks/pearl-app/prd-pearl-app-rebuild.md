# PRD: Pearl App Rebuild
## Performance on Rails

**Version:** 2.0
**Date:** January 20, 2026
**Status:** Draft
**Foundation:** Pearl App Value Proposition (MKT-000066)

---

## The Core Problem

Residential real estate transactions require non-experts to make high-stakes decisions about complex home performance topics without:
- A shared framework
- Clear priorities
- A structured way to manage uncertainty early in the process

**The result:**
- Important information surfaces late (after offers, when stakes are highest)
- Questions are poorly formed or poorly answered
- Conversations become adversarial or confusing
- Confidence is built reactively instead of proactively

**The core need is not more data. The core need is a structured way to understand, prioritize, and navigate uncertainty before commitment and pressure peak.**

---

## Pearl's Core Insight

> When two non-experts are forced to debate expert subjects, the conversation itself becomes the risk.

Pearl exists to remove that risk by acting as a neutral, structured intermediary—translating complex home performance information into a shared, credible, and guided framework.

**Pearl does not ask buyers and sellers to become experts. Pearl puts the conversation on rails.**

---

## What "On Rails" Means

Pearl structures how home performance is surfaced, discussed, verified, and trusted—so critical information moves through the transaction smoothly, predictably, and early.

### Three Defining Characteristics:

1. **Structured Discovery (Not Ad Hoc Debate)**
   - Standardized performance framework
   - Clearly defined categories (Safety, Comfort, Operations, Resilience, Energy)
   - Common vocabulary both parties can rely on

2. **Early Visibility (Not End-Stage Surprise)**
   - Performance attributes visible before stakes are highest
   - Priorities and uncertainties acknowledged upfront
   - Shifts dynamic from "What might be wrong?" to "Here's what we know"

3. **Neutral Mediation (Not Buyer vs. Seller)**
   - Independent third-party reference point
   - Focused on objective performance, not negotiation leverage
   - Guardrails that keep discussions factual and proportional

---

## The Correct Sequence (This IS the Rails)

The app must guide users through this progression:

### 1. Orientation
**Introduce the Categories of Performance**

Pearl's first value is conceptual. Users immediately understand:
- Home performance exists as a structured idea
- It spans five distinct categories (SCORE)
- These categories matter to lived experience, cost, and risk

*This alone is valuable. It gives people language they did not previously have.*

### 2. Education
**Reveal the Components Within Each Category**

Pearl shows:
- What actually makes up Safety, Comfort, Operations, Resilience, and Energy
- That each category consists of tangible systems, features, and conditions

*This reframes the home from "a black box with a price tag" to "a system with understandable parts."*

### 3. Personal Relevance
**Help Users Prioritize What Matters to Them**

This is the critical hook. Pearl allows users to:
- Flag which categories matter most to them
- Recognize tradeoffs
- See that not every home must be "perfect"—just aligned with their priorities

*This converts abstract categories into personal stakes.*

### 4. Transparency
**Show What Is Known—and Where Verification Adds Value**

Only now does Pearl introduce data depth:
- Here's what can be reasonably inferred today
- Here's where information is stronger
- Here's where clarity would increase confidence
- Here's how that clarity is achieved (verification, owner input, documentation)

**Framed as opportunity, not deficiency:** "There is more to learn" rather than "this data is missing."

---

## Critical Design Principle

### Value Before Verification

Pearl must create real, immediate value for buyers **before** owner engagement—or the entire system stalls.

**Wrong approach:** "Come back later—trust us, it will be worth it."

**Right approach:** "Here is value right now—and here is a clear path to more."

For the typical consumer:
- They do not have a mental model of "home performance"
- They do not know how it relates to what matters to them
- They do not know what questions to ask
- They do not know what information even exists

**Pearl's first job is not accuracy or verification. It is orientation.**

---

## User Personas (Reframed)

### Primary: The Buyer (and Buyer's Agent)

**Core Need:** Understand what matters about a home—and what matters most to them—before they are asked to commit emotionally or financially.

Specifically:
- A clear mental model of home performance (not just aesthetics)
- Help identifying which aspects of performance are personally important
- A way to distinguish "unknown" from "risky"
- A structured path to gain confidence without becoming an expert

**Without this:**
- Buyers fixate on surface signals
- Important considerations appear late and feel threatening
- Anxiety increases as commitment increases

### Secondary: The Seller (and Listing Agent)

**Core Need:** Present their home transparently and confidently without being penalized for uncertainty or forced into speculative claims.

Specifically:
- A structured way to acknowledge what is known and unknown
- Protection from misstatements and over-explanation
- A process that surfaces important topics early, when they can be managed
- Fewer surprises when stakes are highest

**Without this:**
- Sellers feel ambushed late
- Trust erodes
- Negotiations become defensive

---

## Requirements

### 1. Onboarding: Orientation First

#### 1.1 The Five Categories Introduction
- First screen after signup introduces the SCORE framework
- Visual representation of Safety, Comfort, Operations, Resilience, Energy
- Plain-language explanation of why each matters
- No score yet—just the framework

#### 1.2 What Matters to You?
- Interactive prioritization exercise
- User selects which 2-3 categories matter most to them
- Explains tradeoffs ("Some homes excel at energy but sacrifice comfort")
- Saves priorities to personalize the entire experience

#### 1.3 Defer Data Collection
- Do not ask for home address until after orientation
- Do not show a score until user understands what it measures
- Signup: Single screen, social auth, no password confirm

### 2. Home Profile: Education Phase

#### 2.1 Component Breakdown
- For each SCORE category, show the actual components:
  - **Safety:** Smoke detectors, CO detectors, electrical panel age, etc.
  - **Comfort:** HVAC type, insulation, window quality, etc.
  - **Operations:** Appliance age, maintenance records, smart home features
  - **Resilience:** Roof age, foundation, storm readiness, backup power
  - **Energy:** Solar, efficiency ratings, utility costs

#### 2.2 Visual System Map
- Show the home as an interconnected system
- Highlight relationships (e.g., insulation affects both Comfort and Energy)
- Make complexity understandable, not overwhelming

#### 2.3 No Jargon
| Current Term | New Term |
|--------------|----------|
| Baseload | Energy & Appliances |
| Performance Pillars | The Five Categories |
| Performance Value™ | Home Performance Profile |
| RESO Greenfields | Home Data Report |

### 3. Personal Relevance: Prioritization

#### 3.1 Priority-First Dashboard
- Dashboard organized by user's stated priorities
- Top priority category shown first and largest
- Categories they care less about collapsed/secondary

#### 3.2 Alignment Indicator
- Instead of a single score, show alignment with priorities
- "This home is strong in the areas you care about most"
- Or: "This home has room for improvement in Comfort, which you prioritized"

#### 3.3 Tradeoff Visualization
- Show where the home excels vs. where it needs work
- Help users see the full picture without judgment
- "Here's what this home offers. Here's what matters to you."

### 4. Transparency: What We Know vs. What We Can Learn

#### 4.1 Confidence Levels
For each component, show:
- **Verified:** Owner-confirmed or professionally documented
- **Inferred:** Based on home age, location, public records
- **Unknown:** No data yet—here's how to find out

#### 4.2 "Learn More" Pathways
- For each unknown, offer a clear path to clarity:
  - "Ask the seller"
  - "Request documentation"
  - "Include in inspection"
  - "Verify with utility"

#### 4.3 No Penalty for Unknowns
- Unknowns do not hurt a "score"
- Frame as: "Opportunity to learn more" not "Missing data"
- Progress toward verification is tracked but not gamified

### 5. Transaction Facilitation

#### 5.1 Question Templates
- Pre-written, structured questions for each category
- Buyer can send to seller/agent through app
- Questions are factual, bounded, non-adversarial

#### 5.2 Mediated Exchange
- Seller receives structured questions, not open-ended demands
- Answers are captured in the home's profile
- Both parties work from the same document

#### 5.3 Conversation History
- All exchanges logged
- Reduces "he said / she said"
- Creates documentation trail

### 6. Navigation Redesign

#### 6.1 Three Primary Modes

| Mode | Purpose | User Intent |
|------|---------|-------------|
| **Explore** | Understand the home's performance | "What does this home offer?" |
| **Prioritize** | Define what matters to you | "What do I care about most?" |
| **Clarify** | Get answers, verify, document | "How do I learn more?" |

#### 6.2 Remove
- Gamified scores and badges
- Rebate-first framing (move to contextual suggestions)
- Toolkit upsell as primary navigation
- "Features" as a data entry chore

### 7. Seller Mode

#### 7.1 Prepare Your Home's Story
- Guided process to document known features
- Acknowledge unknowns gracefully
- Generate shareable profile

#### 7.2 Anticipate Questions
- Show what buyers typically ask about
- Prompt seller to gather documentation proactively
- "Buyers often ask about HVAC age. Do you have records?"

#### 7.3 Transaction Ready Documents
- Certification materials
- Performance summary
- Appraisal-ready documentation

---

## What This App Does NOT Do

### Not a Score Optimizer
- The goal is not to "improve your score"
- The goal is alignment between home and buyer priorities

### Not a Fault Finder
- Pearl does not identify defects
- Pearl organizes uncertainty so it can be resolved early

### Not an Inspection Replacement
- Pearl operates upstream of inspection
- Reduces friction when inspection findings arrive

### Not a Data Collection Chore
- Photos optional, not required
- "I don't know" is always valid
- Value delivered before data requested

---

## Success Metrics

| Metric | What It Measures |
|--------|------------------|
| Orientation completion | Do users understand the framework? |
| Priority completion | Do users engage with personalization? |
| Question sends | Are users using Pearl to facilitate conversation? |
| Seller response rate | Is the mediated exchange working? |
| Time to first clarification | How fast do users move to deeper engagement? |
| Return visits | Is Pearl part of the transaction process? |

**Not measuring:**
- Score improvement (gamification metric)
- Features added (data collection metric)
- Rebates viewed (upsell metric)

---

## Technical Requirements

### Platform
- React Native for iOS and Android
- Minimum iOS 14, Android 10

### Performance
- App load < 2 seconds
- Smooth transitions throughout orientation flow
- Offline support for viewing home profile

### Accessibility
- WCAG 2.1 AA compliance
- VoiceOver/TalkBack support
- High contrast mode
- Minimum 44x44pt touch targets

---

## Out of Scope (v1)

- Contractor marketplace
- Real-time utility integration
- Home maintenance reminders
- Community/social features
- AR equipment scanning
- Multi-home comparison

---

## The One-Sentence Test

If we can't say this clearly, the app isn't right:

> **Pearl helps buyers and sellers get on the same page, prioritize what's most important, and achieve clarity on a home's performance—before commitment and pressure peak.**

---

## Appendix: Current App vs. Proposed App

| Current App | Proposed App |
|-------------|--------------|
| Score-first | Orientation-first |
| Data collection focused | Understanding focused |
| Gamified progression | Natural conversation flow |
| Features → Score → Certification | Orient → Prioritize → Clarify → Align |
| Rebates as primary value | Transaction facilitation as primary value |
| Homeowner-centric | Buyer AND seller utility |
| "Add your heat pump" | "What matters to you about comfort?" |
| 351 / 1000 | "Strong alignment with your priorities" |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 20, 2026 | Initial draft (UX fixes focus) |
| 2.0 | Jan 20, 2026 | Complete rewrite aligned with Value Proposition |
