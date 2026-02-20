# UX Specification: Pearl Score Calculation Engine

## Pass 1: Mental Model

**Primary user intent:** "I want to know how my home is performing and see it improve as I take action."

**Likely misconceptions:**
- Score is arbitrary/random — users may not understand what drives it
- Score is fixed — users may not realize it updates when they add equipment or log symptoms
- Higher = better but don't know how to improve — need actionable link between score and factors

**UX principle to reinforce:** The score is a **living metric** that reflects real data. Every action the user takes (adding equipment, connecting devices, addressing symptoms) visibly moves the needle. The animation from previous→current score reinforces causality.

## Pass 2: Information Architecture

**All user-visible concepts:**
- Total Pearl Score (0-1000)
- Score level label (Compromised → Outstanding)
- Per-pillar sub-score (0-200 each)
- Score change animation (points earned)
- Previous score (for comparison)

**Grouped structure:**

### Score Summary (My Home Tab)
- Total Score: Primary
- Level Label: Primary
- Visual Scale: Primary
- Points Earned Badge: Primary (when score changes)
- Rationale: The score is the hero element of the My Home tab — always visible and prominent

### Pillar Sub-Scores (Pillar Detail Screen)
- Per-pillar score (X/200): Secondary
- Rationale: Sub-scores add context to each pillar without cluttering the main score display

### Score History (Not in this feature)
- Previous score: Hidden (only surfaced through animation)
- Rationale: Users see the delta through animation, not through explicit history UI

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| View overall score | Large number with color-coded level label in My Home tab |
| Understand score level | Level label text (e.g., "Excellent") + color coding |
| See score improvement | Animated count-up from previous score + "+X points earned" badge |
| View pillar sub-score | "X / 200" text next to pillar status dot in PillarDetailScreen header |
| Understand what drives score | Helping/hurting factors on PillarDetailScreen (already built) |

**Affordance rules:**
- If user sees score change animation, they understand their action improved the score
- If user sees a pillar sub-score, they understand that pillar's contribution to the total
- Score color always matches the level label color

## Pass 4: Cognitive Load

**Friction points:**
| Moment | Type | Simplification |
|--------|------|----------------|
| First time seeing score | Uncertainty — "What does 625 mean?" | Explanation tooltip (already built) |
| Score doesn't change | Uncertainty — "Is it working?" | Score recalculates on data change; animation makes it obvious |
| Per-pillar score meaning | Choice — "Which pillar to improve?" | Lowest sub-score is the highest-leverage area |

**Defaults introduced:**
- Base score of 125 per pillar (625 total): Provides a reasonable starting point that matches "Excellent" level so users feel positive about their home
- No animation on first load: Previous score is null, avoiding confusing animation from 0

## Pass 5: State Design

### Score Display (My Home Tab)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Loading | Skeleton placeholder | Data is loading | Wait |
| First Load | Score number, no animation | This is their home's score | Tap for tooltip |
| Score Changed | Animated count-up + points badge | Their action improved the score | Continue improving |
| No Data | Score of 625 (baseline) | Default starting point | Add equipment/data to personalize |

### Per-Pillar Sub-Score (Pillar Detail)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Normal | "X / 200" next to status | This pillar's contribution | Address hurting factors |
| Low Score | Low number in red/orange | This pillar needs attention | Take action on hurting factors |
| High Score | High number in green | This pillar is performing well | Maintain current state |

## Pass 6: Flow Integrity

**Flow risks:**
| Risk | Where | Mitigation |
|------|-------|------------|
| Score feels meaningless | My Home tab | Level labels + tooltip explanation (already built) |
| Score doesn't update after action | MyHomeScreen | useMemo recalculation + ScoreContext persistence |
| Animation confusing on first load | MyHomeScreen | previousScore is null on first load — no animation |
| Sub-score clutters header | PillarDetailScreen | Small text, secondary placement next to status |

**Visibility decisions:**
- Must be visible: Total score, level label, scale bar, points earned animation
- Can be implied: Per-pillar sub-scores (shown on drill-down only), score history

**UX constraints:**
- Score animation only triggers when previousScore differs from current score
- Per-pillar sub-score display must not compete with the pillar status badge
- Score baseline (625) should feel like a reasonable starting point, not penalizing

---

## Visual Specifications

### My Home Tab — Score Display
- No visual changes needed — ScoreDisplay component already handles all states
- Just wire real data instead of hardcoded 625
- Animation infrastructure is ready (previousScore prop triggers count-up)

### Pillar Detail Screen — Sub-Score
- Location: Header area, right-aligned next to status badge
- Format: "X / 200" in caption-size font
- Color: Uses pillar status color (good=green, typical=yellow, needsWork=red)
- Weight: Regular (not bold) — secondary information
