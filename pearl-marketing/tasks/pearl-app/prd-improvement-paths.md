# PRD: Improvement Paths & Rebate Persistence

## Introduction

Wire the Improve tab to use real data instead of mock constants. The ImprovementPath component already exists (full timeline UI with phases, steps, rebate/pro links) but ImproveScreen uses simple Card stubs with MOCK_IMPROVEMENT_PATHS instead. RebateDetailScreen also uses hardcoded REBATE_DATA. This feature creates data models and contexts for both improvement paths and rebates, adds a service that generates personalized improvement paths from logged symptoms, replaces all mock data in ImproveScreen and RebateDetailScreen, and wires the full ImprovementPath timeline component into the Improve tab.

## Goals

- Create Rebate and ImprovementPath data models with AsyncStorage persistence
- Generate personalized improvement paths from logged symptoms (symptom → contextual path)
- Replace MOCK_IMPROVEMENT_PATHS in ImproveScreen with real ImprovementPath timeline component
- Replace MOCK_REBATES in ImproveScreen with context-driven rebate data
- Replace hardcoded REBATE_DATA in RebateDetailScreen with context data
- Wire improvement path press → navigation to detail view
- Seed default rebates so the Improve tab is useful immediately

## User Stories

### US-102: Create Rebate and ImprovementPath models
**Description:** As a developer, I need data models for rebates and improvement paths so data has a consistent shape across the app.

**Acceptance Criteria:**
- [ ] Create `src/models/Rebate.ts` with `Rebate` interface: `id`, `equipmentType` (RebateEquipmentType), `savingsAmount` (number), `programName` (string), `programDescription` (string), `eligibility` (EligibilityStatus), `eligibilityRequirements` (string[]), `howToClaim` (ClaimStep[]), `expirationDate` (string | null), `additionalInfo` (string | null)
- [ ] Create `ClaimStep` interface in same file: `step` (number), `title` (string), `description` (string), `requiresProfessional` (boolean)
- [ ] Create `src/models/ImprovementPathData.ts` with `ImprovementPathData` interface: `id`, `title` (string), `description` (string), `sourceSymptomIds` (string[]) — which symptoms generated this path, `steps` (ImprovementStep[]) — uses existing ImprovementStep type from components, `createdAt` (ISO string)
- [ ] Export all types from `src/models/index.ts`
- [ ] Typecheck passes

### US-103: Create RebateContext with AsyncStorage persistence and seed data
**Description:** As a developer, I need a RebateContext to persist rebates and provide them across the app.

**Acceptance Criteria:**
- [ ] Create `src/context/RebateContext.tsx` following EquipmentContext pattern
- [ ] AsyncStorage key: `@pearl_rebates`
- [ ] State: `rebates: Rebate[]`, `isLoaded: boolean`
- [ ] Methods: `getRebateById(id)` returns single rebate, `addRebate(rebate)`, `updateRebate(id, updates)`
- [ ] On first load (empty storage), seed with DEFAULT_REBATES — 5 rebates matching existing MOCK_REBATES data from ImproveScreen (Federal Heat Pump Tax Credit $2000, Home Energy Rebate $1600, Heat Pump Water Heater $1750, Windows Credit $600, Solar Credit $7500) with full `programDescription`, `eligibilityRequirements`, and `howToClaim` data from RebateDetailScreen's REBATE_DATA
- [ ] Provider gates on `isLoaded`
- [ ] Export `RebateProvider` and `useRebates` hook from `src/context/index.ts`
- [ ] Add `RebateProvider` to App.tsx provider chain
- [ ] Typecheck passes

### US-104: Create ImprovementPathContext with AsyncStorage persistence
**Description:** As a developer, I need an ImprovementPathContext to persist generated improvement paths.

**Acceptance Criteria:**
- [ ] Create `src/context/ImprovementPathContext.tsx` following EquipmentContext pattern
- [ ] AsyncStorage key: `@pearl_improvement_paths`
- [ ] State: `paths: ImprovementPathData[]`, `isLoaded: boolean`
- [ ] Methods: `addPath(path)`, `deletePath(id)`, `getPathById(id)`, `getPathsForSymptom(symptomId)` returns paths where sourceSymptomIds includes symptomId
- [ ] Provider gates on `isLoaded`
- [ ] Export `ImprovementPathProvider` and `useImprovementPaths` hook from `src/context/index.ts`
- [ ] Add `ImprovementPathProvider` to App.tsx provider chain
- [ ] Typecheck passes

### US-105: Create ImprovementPathService to generate paths from symptoms
**Description:** As a user, I want Pearl to generate personalized improvement paths based on my logged symptoms.

**Acceptance Criteria:**
- [ ] Create `src/services/ImprovementPathService.ts`
- [ ] Export `generatePathForSymptom(symptomId: string, symptomLabel: string, categoryId: string): ImprovementPathData` function
- [ ] Maps each of the 17 symptom IDs to a contextual improvement path with 3-5 steps across phases (now/soon/later/major)
- [ ] Steps include realistic `estimatedCost` strings (e.g., "$0", "$0–30", "~$150", "$500–2,000", "$8,000–15,000")
- [ ] Steps include appropriate `impact` levels (low/medium/high)
- [ ] Steps include `hasRebate: true` where relevant (e.g., HVAC upgrade, insulation, heat pump steps)
- [ ] Steps include `hasPearlPro: true` where professional help applies (e.g., inspections, installations)
- [ ] Path title follows format: "Your [Symptom Label] Plan" (e.g., "Your Hot Rooms Plan")
- [ ] Path description provides brief context (e.g., "Steps to address hot rooms, from quick checks to long-term fixes")
- [ ] Export from `src/services/index.ts`
- [ ] Typecheck passes

### US-106: Wire ImproveScreen to use ImprovementPath component with context data
**Description:** As a user, I want to see personalized improvement paths on the Improve tab instead of placeholder cards.

**Acceptance Criteria:**
- [ ] ImproveScreen imports `useImprovementPaths` from context
- [ ] ImproveScreen imports `useSymptoms` from context
- [ ] ImproveScreen imports `useRebates` from context
- [ ] ImproveScreen imports `ImprovementPath` component (the real timeline component)
- [ ] Remove `MOCK_IMPROVEMENT_PATHS` constant and local `ImprovementPath` interface
- [ ] Replace mock rebates: `rebates` prop default changes from `MOCK_REBATES` to `useRebates().rebates` mapped to the existing Rebate shape
- [ ] Remove local `Rebate` interface — use imported type from models
- [ ] If user has logged symptoms but no paths generated yet, auto-generate paths for each unique symptom via ImprovementPathService and save to context
- [ ] Improvement Paths section renders the real `ImprovementPath` timeline component for each path (max 3 shown, most recent first)
- [ ] If no symptoms logged, show empty state: "Log a symptom to get a personalized improvement plan"
- [ ] If paths exist, show them with the full timeline UI (phases, steps, cost, impact, rebate/pro links)
- [ ] `onImprovementPathPress` passes path ID for future detail navigation
- [ ] Typecheck passes

### US-107: Wire RebateDetailScreen to read from RebateContext
**Description:** As a user, I want rebate detail to show real data from context instead of hardcoded mock data.

**Acceptance Criteria:**
- [ ] RebateDetailScreen imports `useRebates` from context
- [ ] `getRebateById(rebateId)` replaces hardcoded `REBATE_DATA[rebateId]` lookup
- [ ] Remove `REBATE_DATA` constant and local `RebateInfo` interface
- [ ] If rebate not found, show a fallback message instead of crashing
- [ ] All existing UI stays the same (hero, eligibility, requirements, how-to-claim, actions)
- [ ] Typecheck passes

### US-108: Wire ImproveScreen wrapper to pass navigation callbacks
**Description:** As a developer, I need ImproveScreen's improvement path and rebate actions to navigate correctly.

**Acceptance Criteria:**
- [ ] `ImproveScreenWrapper` in BottomTabNavigator passes `onImprovementPathPress` callback that logs the path ID (future: navigate to ImprovementPathDetail screen)
- [ ] Rebate card `onStepPress` in ImprovementPath triggers navigation to RebateDetail when `hasRebate` is true
- [ ] Pearl Pro link in ImprovementPath triggers navigation to PearlPros screen
- [ ] ImproveScreen passes `onRebatePress` from ImprovementPath's `onRebatePress` callback → navigates to RebateDetail
- [ ] ImproveScreen passes `onPearlProPress` from ImprovementPath's `onPearlProPress` callback → navigates to PearlPros
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Add `Rebate` and `ClaimStep` interfaces to models
- FR-2: Add `ImprovementPathData` interface to models
- FR-3: Create RebateContext with AsyncStorage persistence under key `@pearl_rebates`, seeded with 5 default rebates
- FR-4: Create ImprovementPathContext with AsyncStorage persistence under key `@pearl_improvement_paths`
- FR-5: ImprovementPathService generates contextual paths for all 17 symptom types
- FR-6: ImproveScreen uses real ImprovementPath timeline component with context data
- FR-7: ImproveScreen uses real rebate data from RebateContext
- FR-8: RebateDetailScreen reads from RebateContext instead of hardcoded data

## Non-Goals

- No improvement path editing (user can delete and regenerate)
- No improvement path detail screen (future feature — path detail navigation logs ID for now)
- No remote rebate data fetching (all data is local/seeded for v1)
- No saved rebates persistence (save toggle is local state for now)
- No Pearl Pros context (PearlProsScreen keeps its own mock data for now)

## Technical Considerations

- Follow existing EquipmentContext pattern for AsyncStorage persistence
- ImprovementPath component already exports ImprovementStep type — ImprovementPathData.steps uses this type
- RebateEquipmentType and EligibilityStatus types already exist in components/RebateCard
- Rebate model should be consistent with both ImproveScreen's grid display and RebateDetailScreen's full display
- Seed data for rebates combines the brief MOCK_REBATES (5 items) with the detailed REBATE_DATA (3 items with full claim steps) — fill in missing detail for rebates that only have brief data
- ImprovementPathService is a pure function (no async) — takes symptom info, returns path data

## Success Metrics

- Zero mock data remaining in ImproveScreen and RebateDetailScreen
- ImprovementPath timeline component renders on Improve tab with real step data
- Rebates persist across app restarts
- Generated improvement paths persist across app restarts
- Logging a symptom on HomeScreen → switching to Improve tab shows a new path
