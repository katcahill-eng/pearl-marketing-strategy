# PRD: Helping/Hurting Factor Engine & Dynamic Pillar Statuses

## Introduction

Replace all mock data in PillarDetailScreen, MyHomeScreen, and HomeScreen with dynamically generated helping/hurting factors. PillarDetailScreen already has a production-ready UI (FactorCard components, section headers, equipment list) but uses hardcoded `PILLAR_DATA`. MyHomeScreen and HomeScreen both have hardcoded `PILLARS` arrays with static statuses. This feature creates a Factor data model, a FactorEngine service that generates factors from device readings, equipment status, logged symptoms, and onboarding answers, then wires all three screens to use real data.

## Goals

- Create a Factor data model for helping/hurting factors with pillar association
- Create a FactorEngine service that generates factors from 4 data sources: device readings, equipment, symptoms, onboarding answers
- Create a `derivePillarStatus` utility that computes pillar status (good/typical/needsWork) from factors
- Replace `PILLAR_DATA` mock in PillarDetailScreen with real factor data from FactorEngine
- Replace hardcoded `PILLARS` statuses in MyHomeScreen with dynamically derived statuses
- Replace hardcoded `PILLARS` statuses in HomeScreen with dynamically derived statuses
- Fix PillarDetailScreen to use canonical SCORE pillar IDs (safety/comfort/operations/resilience/energy) instead of non-canonical IDs (health/efficiency/sustainability)
- Connect hurting factor action buttons to navigation (Pearl Pros, rebates)

## User Stories

### US-109: Create Factor data model
**Description:** As a developer, I need a Factor interface so factors have a consistent shape across the app.

**Acceptance Criteria:**
- [ ] Create `src/models/Factor.ts` with `Factor` interface: `id` (string), `type` ('helping' | 'hurting'), `pillar` (Pillar), `name` (string), `explanation` (string), `expandedContent` (string | undefined), `actionLabel` (string | undefined), `actionType` ('pearl_pro' | 'rebate' | 'improvement' | 'manual' | undefined), `source` ('reading' | 'equipment' | 'symptom' | 'onboarding'), `severity` ('info' | 'attention' | 'action' — only for hurting factors, helps determine pillar status)
- [ ] Export `Factor` type from `src/models/index.ts`
- [ ] Typecheck passes

### US-110: Create FactorEngine service
**Description:** As a developer, I need a pure service that generates helping/hurting factors from multiple data sources so PillarDetailScreen can show real data.

**Acceptance Criteria:**
- [ ] Create `src/services/FactorEngine.ts`
- [ ] Export `generateFactorsFromReadings(readings: DeviceReading[]): Factor[]` — maps good readings to helping factors and bad readings to hurting factors using same SCORE thresholds from InsightEngine
- [ ] Export `generateFactorsFromEquipment(equipment: EquipmentItem[]): Factor[]` — good status = helping, aging = hurting (attention), replaceSoon = hurting (action). Maps equipment types to pillars using same mapping as InsightEngine (EQUIPMENT_PILLAR_MAP)
- [ ] Export `generateFactorsFromSymptoms(symptoms: LoggedSymptom[]): Factor[]` — each logged symptom creates a hurting factor for each of its affectedPillars. Uses symptomLabel as factor name, severity = 'attention'
- [ ] Export `generateFactorsFromOnboarding(answers: OnboardingAnswers): Factor[]` — 'good' answers create helping factors, 'bad' or 'some' answers create hurting factors for the relevant pillar
- [ ] Export `generateAllFactors(params: { readings, equipment, symptoms, onboardingAnswers }): Factor[]` — combines all 4 generators, returns sorted by pillar then type
- [ ] Export `derivePillarStatus(factors: Factor[], pillar: Pillar): PillarStatus` — if any hurting factor has severity 'action' → 'needsWork', if any hurting factor has severity 'attention' → 'typical', else 'good'
- [ ] Export `derivePillarStatuses(factors: Factor[]): Record<Pillar, PillarStatus>` — calls derivePillarStatus for each of the 5 SCORE pillars
- [ ] All functions are pure (no side effects, no async)
- [ ] Export from `src/services/index.ts`
- [ ] Typecheck passes

### US-111: Wire PillarDetailScreen to use FactorEngine with real data
**Description:** As a user, I want to see real helping/hurting factors on the pillar detail screen based on my actual home data.

**Acceptance Criteria:**
- [ ] PillarDetailScreen imports `useDevices`, `useEquipment`, `useSymptoms`, `useOnboarding` from context
- [ ] PillarDetailScreen imports `generateAllFactors`, `derivePillarStatus` from services
- [ ] Remove `PILLAR_DATA` mock constant and local `PillarInfo`, `FactorData`, `EquipmentData` interfaces
- [ ] Replace mock data with FactorEngine-generated factors: call `generateAllFactors()` with context data, filter by `pillarId`
- [ ] Pillar status derived dynamically via `derivePillarStatus(factors, pillarId)`
- [ ] Helping factors section renders from `factors.filter(f => f.type === 'helping' && f.pillar === pillarId)`
- [ ] Hurting factors section renders from `factors.filter(f => f.type === 'hurting' && f.pillar === pillarId)`
- [ ] Pillar name and icon use a static `PILLAR_INFO` map with the 5 canonical SCORE pillar IDs (safety/comfort/operations/resilience/energy) and their explanations
- [ ] Pillar explanation text for each of the 5 pillars preserved from original PILLAR_DATA
- [ ] Equipment section uses real equipment from EquipmentContext, filtered by equipment type → pillar mapping
- [ ] If no factors exist for a pillar, show existing empty state: "No specific factors identified yet"
- [ ] FactorCard `onAction` calls `onTakeAction` prop with factor ID
- [ ] Typecheck passes

### US-112: Wire MyHomeScreen to derive pillar statuses dynamically
**Description:** As a user, I want the My Home tab pillar cards to reflect my actual home performance, not static mock statuses.

**Acceptance Criteria:**
- [ ] MyHomeScreen imports `useDevices`, `useEquipment`, `useSymptoms`, `useOnboarding` from context
- [ ] MyHomeScreen imports `generateAllFactors`, `derivePillarStatuses` from services
- [ ] Remove hardcoded `status` from `PILLARS` array — statuses now derived dynamically
- [ ] Compute factors via `generateAllFactors()` and derive statuses via `derivePillarStatuses(factors)`
- [ ] Each PillarCard receives its dynamic status
- [ ] When no data sources available (no readings, no equipment, no symptoms, no onboarding), all pillars default to 'good'
- [ ] Typecheck passes

### US-113: Wire HomeScreen to derive pillar statuses dynamically
**Description:** As a user, I want the Home tab pillar summary to reflect my actual home performance.

**Acceptance Criteria:**
- [ ] HomeScreen imports `useEquipment`, `useSymptoms` (useDevices and useOnboarding already imported)
- [ ] HomeScreen imports `generateAllFactors`, `derivePillarStatuses` from services
- [ ] Remove hardcoded `status` from `PILLARS` array — statuses now derived dynamically
- [ ] Use Factor-based pillar statuses for the pillar cards section (map PillarStatus to the existing rendering)
- [ ] Existing `derivePillarStatuses()` function that uses device readings is replaced by the FactorEngine version
- [ ] DailySummaryCard still receives pillar statuses, now from FactorEngine (convert PillarStatus to ReadingStatus for backward compatibility: good→good, typical→attention, needsWork→action)
- [ ] Typecheck passes

### US-114: Connect hurting factor actions to navigation
**Description:** As a user, I want to tap action buttons on hurting factors and be taken to relevant screens (Pearl Pros, rebates).

**Acceptance Criteria:**
- [ ] PillarDetailScreen `onTakeAction` prop is wired in RootNavigator's `PillarDetailScreenWrapper`
- [ ] When `onTakeAction` is called, navigate based on factor's `actionType`: 'pearl_pro' → PearlPros, 'rebate' → RebateDetail (first available rebate), 'improvement' → Improve tab
- [ ] MyHomeScreen PillarCard `onPress` still navigates to PillarDetail (no change needed, already wired)
- [ ] HomeScreen PillarCard `onPress` still navigates to PillarDetail (no change needed, already wired)
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Add `Factor` interface to models
- FR-2: FactorEngine generates factors from device readings using SCORE thresholds
- FR-3: FactorEngine generates factors from equipment lifecycle status
- FR-4: FactorEngine generates factors from logged symptoms (each symptom → hurting factor per affected pillar)
- FR-5: FactorEngine generates factors from onboarding answers
- FR-6: FactorEngine derives PillarStatus (good/typical/needsWork) from factors
- FR-7: PillarDetailScreen shows real factors from FactorEngine
- FR-8: PillarDetailScreen uses canonical SCORE pillar IDs (safety/comfort/operations/resilience/energy)
- FR-9: MyHomeScreen pillar statuses derived from FactorEngine
- FR-10: HomeScreen pillar statuses derived from FactorEngine
- FR-11: Hurting factor action buttons navigate to relevant screens

## Non-Goals

- No factor persistence to AsyncStorage (factors are derived from persisted source data — readings, equipment, symptoms, onboarding)
- No factor editing or manual factor creation by users
- No score calculation from factors (score calculation is a separate future feature)
- No factor-based notifications (existing InsightEngine handles notifications)
- No factor history or trend tracking

## Technical Considerations

- FactorEngine is a set of pure functions (no async, no side effects) — takes data in, returns factors out
- FactorEngine reuses threshold constants from InsightEngine for reading evaluation
- Equipment-to-pillar mapping already exists in InsightEngine as `EQUIPMENT_PILLAR_MAP` — FactorEngine should use the same mapping
- PillarDetailScreen currently uses non-canonical pillar IDs in PILLAR_DATA (health, efficiency, sustainability) but PILLAR_PROBLEMS already uses canonical IDs (safety, comfort, operations, resilience, energy) — fix PILLAR_DATA to match canonical IDs
- `PillarStatus` type ('good' | 'typical' | 'needsWork') already exists in components
- `ReadingStatus` type ('good' | 'attention' | 'action') is different from PillarStatus — HomeScreen's DailySummaryCard expects ReadingStatus, so a mapping function is needed
- FactorCard component already supports all needed props: type, name, explanation, expandedContent, actionLabel, onAction

## Success Metrics

- Zero mock data remaining in PillarDetailScreen, MyHomeScreen pillars, and HomeScreen pillars
- Adding equipment or logging symptoms changes pillar statuses dynamically
- Pillar detail screen shows contextual factors from real data sources
- Hurting factor action buttons navigate to correct screens
