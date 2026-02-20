# PRD: Pearl Homeowner App
## Understand Your Home. Improve Your Life In It.

**Version:** 3.2
**Date:** January 20, 2026
**Status:** Draft
**Foundation:** Pearl App Value Proposition - "Performance on Rails"

---

## Executive Summary

The Pearl Homeowner App helps people who already own and live in their homes understand their home's performance and know where to invest to improve their lived experience. It is NOT for home buyers (who use the free Pearl Registry) or real estate professionals (who use the Pearl Pro App).

The app serves as a **translator** - putting home performance conversations "on rails" so non-experts can make informed decisions about their home without becoming experts themselves.

---

## The Problem

Homeowners live with their home's performance issues daily but don't understand them:
- "Why is my upstairs always hot?"
- "Why are my allergies worse at home?"
- "Why is my energy bill so high?"
- "What should I fix first?"
- "Where should I put my money?"

They don't have a framework for understanding home performance, and they don't know what questions to ask. When they do make improvements, they often invest in the wrong things.

**Current app problem:** The existing Pearl app leads with an abstract score (351) that means nothing to homeowners. The valuable insights are buried. There's no reason to return after initial setup, leading to app deletion.

---

## The Solution

Pearl becomes a **home health dashboard** that:
1. Helps homeowners understand WHY their home feels the way it does
2. Tells them what they can DO about it
3. Keeps them engaged through relevant, timely notifications
4. Gets better over time as they add data or connect devices

**Core positioning:** Pearl translates complex home performance into actionable understanding - no expertise required.

---

## Target User

**Primary:** Homeowners who:
- Already own and live in their home
- Are NOT actively selling (may be years away)
- Experience their home daily - the quirks, discomfort, high bills
- Want to improve their lived experience
- Could make improvements if they knew what to prioritize

**Not for:**
- Home buyers researching properties (use Registry)
- Real estate agents documenting listings (use Pro App)
- People focused solely on resale value

---

## Pearl Ecosystem Context

| Product | Audience | Purpose |
|---------|----------|---------|
| **Registry (web)** | Buyers | Research homes, see estimated scores - free |
| **Pro App** | Agents/Contractors | Document homes for listings/certifications |
| **Homeowner App** | People living in their home | Understand & improve lived experience |

The Homeowner App feeds data back into the Registry, improving Pearl's accuracy at the micro level.

---

## Core Value Proposition

### For Homeowners:
"Understand your home. Improve your life in it."

- Know why your home feels the way it does
- Know where to invest your money for maximum impact
- Know what rebates you're missing
- Know when maintenance is due
- Connect with professionals who can help

### For Pearl:
- Accurate, verified data at the individual home level
- Engaged user base (not one-time data dumps)
- Subscription revenue
- Affiliate revenue from device recommendations
- Pipeline to certification when users eventually sell

---

## The Five SCORE Pillars

The app organizes home performance around five pillars:

| Pillar | What It Means | Homeowner Translation |
|--------|---------------|----------------------|
| **Safety** | Protection from health hazards | "Is my home making me sick?" |
| **Comfort** | Temperature, humidity, air quality | "Why is my house uncomfortable?" |
| **Operations** | Equipment efficiency and function | "Why does stuff keep breaking?" |
| **Resilience** | Weather and disruption readiness | "Will my home protect me?" |
| **Energy** | Energy consumption and costs | "Why is my bill so high?" |

---

## Key Features

### 1. Symptom-Based Entry Point

**Replace score-first with symptom-first.**

On first use (and as a persistent feature), ask:

"What's bothering you about your home?"
- [ ] Some rooms are too hot or cold
- [ ] My allergies are worse at home
- [ ] My energy bills feel too high
- [ ] I hear drafts or feel air leaks
- [ ] My HVAC runs constantly
- [ ] Humidity issues (too dry/too humid)
- [ ] Musty smells
- [ ] Equipment keeps breaking
- [ ] I'm not sure - help me explore

Pearl then connects symptoms to pillars and shows relevant Helping/Hurting insights.

**Example flow:**
1. User selects "Some rooms are too hot or cold"
2. Pearl shows: "Temperature inconsistencies often relate to Comfort. Based on your home profile, here's what might be causing this..."
3. Shows relevant factors: ducts in unconditioned space, older windows, insulation gaps
4. Offers actions: "Here's what you can do about it"

### 2. Symptom Logging (Ongoing Engagement)

Users can log symptoms anytime:
- "Log an issue" → Select category → Add notes → Save
- Pearl tracks patterns over time
- Enables follow-up: "You logged 'high energy bill' 30 days ago - has it improved?"

**Free tier:** Last 30 days of logs
**Paid tier:** Full history + trend analysis

### 3. Helping/Hurting Insights (Keep & Elevate)

The existing Helping/Hurting insights are valuable - elevate them from buried accordions to primary content.

For each pillar, show:
- What's **helping** your home perform well
- What's **hurting** your home's performance
- **What you can do** about each item

Connect hurting factors to:
- DIY fixes
- Professional services (Pearl Pros)
- Rebates/incentives
- Device recommendations

### 4. Smart Device Integration (Paid Tier)

For users with smart home devices, Pearl becomes the interpretation layer:

**Supported integrations:**
- Smart thermostats (Nest, Ecobee, Honeywell)
- Air quality monitors (Awair, Purple Air, AirThings)
- Smart plugs with energy monitoring
- Future: Solar inverters, EV chargers, battery systems

**What Pearl provides:**
- Unified dashboard across devices
- Interpretation: "Your second floor is consistently 5° warmer - this often indicates duct issues"
- Anomaly detection: "Your HVAC ran 40% more than usual yesterday"
- Correlation: "Your air quality drops when humidity rises - consider a dehumidifier"

**For users WITHOUT devices:**
- Pearl recommends relevant devices based on their symptoms
- Affiliate revenue opportunity
- "Want better insight into your comfort issues? An air quality monitor could help identify the cause."

### 5. Utility Bill Analysis (Paid Tier)

**Photo-based, not account connection** (less invasive):
- User photographs utility bill
- Pearl extracts usage data via OCR
- Tracks month-over-month, year-over-year
- Benchmarks against similar homes
- Identifies anomalies: "Your January usage was 30% higher than last year"

### 6. Maintenance Reminders

Track equipment and prompt maintenance:

| Item | Reminder |
|------|----------|
| HVAC filter | Every 90 days (customizable) |
| HVAC service | Annual |
| Water heater flush | Annual |
| Smoke detector batteries | Every 6 months |
| Dryer vent cleaning | Annual |
| Gutter cleaning | Seasonal |

Users can:
- Mark tasks complete
- Snooze reminders
- Add custom maintenance items
- Log maintenance history

**Paid tier:** Full maintenance calendar + history
**Free tier:** Basic reminders for top 3 items

### 7. Equipment Lifecycle Tracking

For each major system/appliance:
- Current age
- Typical lifespan range
- Status indicator (Good / Aging / Replace Soon)
- Replacement cost estimate
- Available rebates for upgrade

Push notification: "Your water heater turns 10 this year. Average lifespan is 10-12 years. Here's what to know about replacement options and current rebates."

### 8. Rebate Calculator (Keep)

Maintain existing rebate functionality with improvements:
- Personalized to user's actual equipment and location
- Tied to Hurting factors: "Your gas furnace is hurting your Energy score. Heat pump rebates available: $3,500"
- Show total potential savings
- Guide on how to claim
- Filter by: category, amount, deadline

### 9. Improvement Paths (Evolved from Home Improvement Plans)

Instead of standalone plans, generate contextual improvement paths based on logged symptoms:

"You've logged 'upstairs too hot' twice this month. Here's a path forward:"

| Timeframe | Action | Cost | Impact |
|-----------|--------|------|--------|
| **Now** | Check if vents open, change filter | $0-30 | Quick check |
| **Soon** | Get duct inspection from [Pearl Pro] | ~$150 | Diagnose root cause |
| **Later** | Seal duct leaks or add attic insulation | $500-2,000 | Long-term fix |
| **Major** | HVAC upgrade with rebate | $8,000-15,000 | $3,500 rebate available |

Plans feel relevant because they're solving a problem the user already identified.

### 10. Pearl Recognized Professionals (Keep)

Display Pearl Pros connected to the home:
- Contractor who performed certified work
- Contact information
- Work history on this home
- "Request service" action

Also show:
- Find Pearl Pros in your area
- Filter by specialty (HVAC, insulation, solar, etc.)
- Request quotes for improvement path items

### 11. Documents (Keep, Simplify)

For homeowners who achieve certification or want documentation:

**Rename for clarity:**
- "Your Certification" (was Pearl Docs)
- "Your Uploads" (was My Docs)
- "Tax Documents" (seasonal visibility only)

**Improvements:**
- In-app preview (no forced download)
- Plain-English descriptions
- "Use this when..." guidance
- Easy sharing

---

## Push Notification Strategy

Notifications that earn their place - relevant, timely, not annoying:

| Trigger | Example | Frequency |
|---------|---------|-----------|
| **Seasonal** | "Heating season starts soon - 3 things to check on your furnace" | 4x/year |
| **Equipment age** | "Your water heater turns 10 this year" | As needed |
| **New rebate** | "A $2,000 heat pump rebate just launched in MD" | As available |
| **Symptom follow-up** | "You logged 'high energy bill' 30 days ago - did it improve?" | After 30 days |
| **Maintenance due** | "Time to change your HVAC filter" | Per schedule |
| **Weather event** | "Extreme heat coming this week - here's how your home might handle it" | As needed |
| **Device insight** | "Your HVAC ran 40% more than usual yesterday" | When anomaly detected |

**User controls:**
- Opt in/out by category
- Frequency preferences
- Quiet hours

---

## Monetization

### Free Tier
- Home profile with estimated data
- Basic Helping/Hurting insights (top 3 per pillar)
- Symptom logging (last 30 days)
- Browse rebates
- Equipment overview (no lifecycle tracking)
- Basic maintenance reminders (top 3 items)
- Pearl Pro directory

### Paid Subscription ($X/month or $Y/year)
- Full Helping/Hurting insights
- Unlimited symptom history + trend analysis
- Device integrations
- Utility bill photo analysis + tracking
- Full maintenance calendar + history
- Equipment lifecycle tracking + alerts
- Personalized improvement paths
- Detailed shareable reports
- Priority Pearl Pro connection

### Additional Revenue
- **Affiliate:** Device recommendations (smart thermostats, air quality monitors, etc.)
- **Lead gen:** Pearl Pro referrals
- **Certification:** When homeowners decide to sell, pathway to paid certification

---

## Navigation Structure

### Bottom Navigation (4 tabs)

| Tab | Purpose |
|-----|---------|
| **Home** | Dashboard: symptoms, key insights, alerts |
| **My Home** | Home profile: equipment, features, pillars |
| **Improve** | Rebates, improvement paths, Pearl Pros |
| **Account** | Settings, subscription, documents |

### Dashboard (Home Tab)

1. **Active symptom or insight** (if any logged)
2. **Quick actions:** Log symptom, Check maintenance
3. **Alerts:** Maintenance due, equipment aging, new rebates
4. **Connected devices summary** (if any)
5. **Your home at a glance:** 5 pillars with status

**NOT on dashboard:**
- Giant score number
- Tax documents banner
- Locked achievement badges
- Toolkit upsell

---

## User Flows

### Flow 1: New User Onboarding

```
Download App
    ↓
Splash Screen (2 sec)
    ↓
Sign Up (single screen, social auth)
    ↓
Enter/Confirm Address
    ↓
"What's bothering you about your home?"
  - Select symptoms (or "Just exploring")
    ↓
Show relevant insights based on symptoms
  - "Based on your home, here's what might be causing that..."
    ↓
Dashboard with personalized content
    ↓
Prompt: "Want better insights? Tell us about your equipment"
  - Optional, not required
```

### Flow 2: Symptom Logging

```
Tap "Log an issue"
    ↓
Select category (Comfort, Energy, Safety, etc.)
    ↓
Select specific symptom
    ↓
Add notes (optional)
    ↓
Save
    ↓
Pearl shows related insights
  - "This might be related to..."
  - "Here's what you can do..."
    ↓
30 days later: Follow-up notification
  - "Did this improve?"
```

### Flow 3: Device Connection (Paid)

```
Go to Settings → Connected Devices
    ↓
Select device type (Thermostat, Air Quality, etc.)
    ↓
Authenticate with device account
    ↓
Pearl imports data
    ↓
Dashboard now shows device insights
    ↓
Ongoing: Pearl interprets data and alerts on anomalies
```

### Flow 4: Maintenance Reminder

```
Notification: "Time to change your HVAC filter"
    ↓
Tap to open app
    ↓
See maintenance item with guidance
    ↓
Options:
  - Mark complete
  - Snooze 1 week
  - Find filter (affiliate link)
  - Find Pearl Pro to help
```

---

## Gamification Layer (Keep, De-emphasize)

Gamification remains in the app but as a **secondary engagement mechanism**, not the primary value proposition.

### Pearl Score

- **Location:** Lives in "My Home" tab, not dashboard hero
- **Display:** Show score (e.g., 351) with 1-1000 scale and level label
- **Context:** Always show "What this means" and "How to improve"
- **Updates:** When user adds/updates equipment, show score change: "You added your heat pump → +45 points"

#### Score Levels

| Score Range | Level | Meaning |
|-------------|-------|---------|
| 0-124 | Compromised | Significant performance issues |
| 125-249 | Needs Improvement | Below typical for area |
| 250-374 | Typical | Average performance |
| 375-499 | Good | Above average performance |
| 500-624 | Very Good | Strong performance |
| 625-749 | Excellent | Outstanding performance |
| 750-874 | Exceptional | Top-tier performance |
| 875+ | Outstanding | Best-in-class performance |

### Badges

Badges are achievements the HOME earns, not arbitrary rewards.

#### Currently Available Badges

| Badge | Criteria | Meaning |
|-------|----------|---------|
| **Electrified Home** | 100% electric heating, cooling, water heating | Fully electrified home |

#### Planned Badges (2026)

| Badge | Criteria | Meaning |
|-------|----------|---------|
| **Solar Powered** | Has solar PV system | Generating renewable energy |
| **Smart Home** | Connected devices integrated | Data-driven insights enabled |
| **Air Quality Champion** | High-rated air filtration + ventilation | Healthy indoor air |
| **Resilient** | Battery backup, storm-ready features | Prepared for disruptions |

**Display approach:**
- Show EARNED badges prominently (celebration)
- Show UNEARNED badges as "paths" user can work toward
- Don't show locked/grayed badges (discouraging)

### Points

- Points are awarded for adding verified equipment/features
- Points contribute to Pearl Score
- Points unlock certification tiers
- Show points earned in context: "Heat pump verified → +45 points"

### Certification Tiers

| Tier | Score Threshold | Benefits |
|------|-----------------|----------|
| **Silver** | 500+ (Very Good) | Basic certification documents |
| **Gold** | 625+ (Excellent) | Full certification package |
| **Platinum** | 750+ (Exceptional) | Premium certification + marketing materials |
| **Platinum Plus** | 875+ (Outstanding) | Elite certification + enhanced marketing |

Certification remains available for users who want it (especially when selling), but is NOT pushed as the primary value proposition.

### Two User Paths, One App

| "Fix my problems" user | "Improve my score" user |
|------------------------|-------------------------|
| Enters via symptoms | Enters via score/badges |
| Gets insights on issues | Sees what to do to level up |
| Makes improvements | Tracks progress |
| Happens to earn points | Earns points intentionally |
| May eventually certify | Actively pursuing certification |

Both paths lead to the same actions. The difference is motivation.

---

## Entry Points & Acquisition

Users arrive at the app through two main paths:

### Path 1: App Store Discovery

User searches for home-related apps or sees an ad.

**App Store listing must communicate:**
- "Understand your home. Improve your life in it."
- NOT "Improve your Pearl Score"
- Lead with symptoms/problems: "Why is my house uncomfortable? Why are my bills high?"
- Show value: insights, maintenance reminders, rebate discovery

**Screenshots should show:**
- Symptom selection screen
- Helping/Hurting insights
- Maintenance reminders
- Device dashboard (aspirational)

### Path 2: Registry → "Claim My Home"

User visits registry.pearlscore.com, views their Home Performance Snapshot, clicks "Claim My Home."

**Current problem:** If Registry messaging is "your score is low, download the app to improve it," users who don't care about scores won't convert.

**Needed alignment:** Registry messaging should lead with the same value prop:
- "Want to understand why your home feels the way it does?"
- "Get personalized insights and maintenance reminders"
- "Discover rebates you're missing"

**Note for UX phase:** Registry "Claim My Home" flow and messaging may need optimization to align with new app value proposition. This is a dependency.

### Onboarding Continuity

Regardless of entry point, the in-app experience should:
1. Confirm/verify address (may be pre-filled from Registry)
2. Ask "What's bothering you about your home?"
3. Deliver immediate value based on symptoms
4. Invite deeper engagement (equipment entry, devices, subscription)

---

## What We're NOT Building (v1)

- Real-time utility account connection (too invasive)
- AR equipment scanning
- Contractor marketplace/booking
- Community/social features
- Multi-home support
- Score as PRIMARY focus (it's secondary)

---

## Success Metrics

| Metric | What It Measures | Target |
|--------|------------------|--------|
| Symptom log rate | Are users engaging? | >1 log per user per month |
| 30-day retention | Do users come back? | >40% |
| Notification opt-in | Do users want to hear from us? | >60% |
| Device connection rate | Are paid users getting value? | >30% of paid |
| Maintenance completion | Are reminders useful? | >50% marked complete |
| Free → Paid conversion | Is paid tier compelling? | >5% |
| Equipment additions | Are users improving data? | >3 items per user |

**Secondary metrics (gamification):**
- Score improvement rate (for engaged users)
- Badge earn rate
- Certification conversion (when selling)

---

## Technical Requirements

### Platform
- React Native for iOS and Android
- iOS 14+, Android 10+

### Integrations
- Smart thermostat APIs (Nest, Ecobee, Honeywell)
- Air quality monitor APIs (Awair, AirThings)
- OCR for utility bill scanning
- Push notification service
- Pearl backend/API

### Performance
- App load < 2 seconds
- Background sync for device data
- Offline support for viewing home profile

### Accessibility
- WCAG 2.1 AA compliance
- VoiceOver/TalkBack support
- Minimum 44x44pt touch targets
- High contrast mode

---

## Migration from Current App

For existing users:
- Preserve all entered equipment/features
- Preserve documents
- Preserve Pearl Pro connections
- New onboarding flow shows "What's bothering you?" even for existing users
- Score visible but de-emphasized (in My Home tab, not dashboard hero)

---

## Open Questions

1. Subscription pricing - what's the right price point?
2. Which device integrations to prioritize for launch?
3. How to handle homes with no estimated data in Pearl's database?
4. Should maintenance reminders be customizable or standardized?
5. What's the minimum feature set for free tier to still be useful?
6. Does Registry "Claim My Home" messaging need to change to align with new value prop?

**Answered:**
- Certification thresholds: Silver 500+, Gold 625+, Platinum 750+, Platinum Plus 875+
- Currently available badge: Electrified Home Badge. Additional badges planned for 2026.

---

## Appendix: Current vs. New Comparison

| Aspect | Current App | New App |
|--------|-------------|---------|
| Entry point | Score (351) | Symptoms ("What's bothering you?") |
| Primary value | Points toward certification | Understand & improve lived experience |
| Engagement model | Add features → get points | Log symptoms → get insights |
| Return triggers | None (one-time use) | Notifications, maintenance, follow-ups |
| Monetization | Toolkit upsell ($99) | Subscription + affiliate |
| Tone | Gamified, score-focused | Helpful, diagnostic |
| Data collection | Manual photo uploads | Symptoms + optional devices |
| Rebates | Disconnected list | Tied to problems and Hurting factors |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 20, 2026 | Initial draft (UX fixes focus) |
| 2.0 | Jan 20, 2026 | Rewrite aligned with Value Proposition |
| 3.0 | Jan 20, 2026 | Complete reframe: symptom-based, subscription model, engagement focus |
| 3.1 | Jan 20, 2026 | Added gamification layer (score, badges, points), entry points & acquisition paths, Registry alignment note |
| 3.2 | Jan 20, 2026 | Updated with accurate score levels, certification thresholds, and badge info from Pearl Score Methodology whitepaper |
