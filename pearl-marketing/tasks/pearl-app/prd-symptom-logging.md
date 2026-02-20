# PRD: Symptom Logging & Persistence

## Introduction

Add persistent symptom logging to the Pearl Homeowner App so symptoms logged by users survive app restarts, drive personalized insights, and trigger 30-day follow-up notifications. Currently, symptom data lives in local React state and is lost when the app closes. This feature creates a SymptomContext with AsyncStorage persistence, wires all existing symptom screens to real data, connects GuidedQuestions answers to OnboardingContext, and adds a symptom follow-up notification service.

## Goals

- Persist all logged symptoms to AsyncStorage so data survives app restarts
- Wire existing SymptomLogModal, HomeScreen, and SymptomInsightsScreen to use SymptomContext instead of mock/local data
- Connect GuidedQuestionsScreen to properly save answers to OnboardingContext
- Add 30-day symptom follow-up notifications ("Did this improve?")
- Gate full symptom history behind premium (free: last 30 days)
- Remove all mock symptom data from HomeScreen

## User Stories

### US-094: Create Symptom model and types
**Description:** As a developer, I need a Symptom data model so logged symptoms have a consistent shape across the app.

**Acceptance Criteria:**
- [ ] Create `src/models/Symptom.ts` with `LoggedSymptom` interface: `id`, `symptomId`, `symptomLabel`, `categoryId`, `categoryLabel`, `affectedPillars` (Pillar[]), `notes`, `loggedAt` (ISO string), `followUpScheduledAt` (ISO string | null), `followUpDismissed` (boolean), `resolved` (boolean)
- [ ] Export all types from `src/models/index.ts`
- [ ] Typecheck passes

### US-095: Create SymptomContext with AsyncStorage persistence
**Description:** As a developer, I need a SymptomContext to persist logged symptoms across app restarts.

**Acceptance Criteria:**
- [ ] Create `src/context/SymptomContext.tsx` following EquipmentContext pattern
- [ ] AsyncStorage key: `@pearl_symptoms`
- [ ] State: `symptoms: LoggedSymptom[]`, `isLoaded: boolean`
- [ ] Methods: `addSymptom(symptom)`, `resolveSymptom(id)`, `dismissFollowUp(id)`, `deleteSymptom(id)`, `getRecentSymptoms(days: number)` returns symptoms within N days
- [ ] Provider gates on `isLoaded` (returns null until loaded)
- [ ] Export `SymptomProvider` and `useSymptoms` hook from `src/context/index.ts`
- [ ] Add `SymptomProvider` to App.tsx provider chain
- [ ] Typecheck passes

### US-096: Wire SymptomLogModal to save through SymptomContext
**Description:** As a user, I want my logged symptoms to persist so I can see them when I reopen the app.

**Acceptance Criteria:**
- [ ] HomeScreen imports `useSymptoms` from context
- [ ] `handleSymptomLogSave` creates a `LoggedSymptom` and calls `addSymptom()`
- [ ] `followUpScheduledAt` set to 30 days from now (ISO string)
- [ ] Remove `MOCK_LOGGED_SYMPTOMS` constant
- [ ] Remove local `loggedSymptoms` useState — read from `useSymptoms().symptoms` instead
- [ ] `handleDismissSymptom` calls `deleteSymptom(id)` on context
- [ ] Symptom cards show real `loggedAt` dates formatted as relative time ("Just now", "2 days ago", "3 weeks ago")
- [ ] Typecheck passes

### US-097: Wire GuidedQuestionsScreen to save answers to OnboardingContext
**Description:** As a user, I want my onboarding answers to persist so the dashboard can show personalized content.

**Acceptance Criteria:**
- [ ] GuidedQuestionsScreen (or its wrapper in RootNavigator) calls `setAnswers()` from `useOnboarding()` when questions are completed
- [ ] Answers are saved before navigating to CoachSummary
- [ ] On app restart, `useOnboarding().answers` returns the previously saved answers
- [ ] HomeScreen coach prompts render based on persisted answers
- [ ] Typecheck passes

### US-098: Wire SymptomInsightsScreen to read from context
**Description:** As a user, after logging a symptom I want to see insights based on my logged data.

**Acceptance Criteria:**
- [ ] SymptomInsightsScreen reads symptoms from `useSymptoms()` context
- [ ] Shows affected pillars based on the symptom's `affectedPillars` field
- [ ] If navigated to without specific symptom data, shows summary of all recent symptoms
- [ ] Back button returns to previous screen
- [ ] Typecheck passes

### US-099: Create SymptomFollowUpService for 30-day notifications
**Description:** As a user, I want Pearl to check in 30 days after I log a symptom to ask if it improved.

**Acceptance Criteria:**
- [ ] Create `src/services/SymptomFollowUpService.ts`
- [ ] `checkSymptomFollowUps(preferences: NotificationPreferences)` reads symptoms from `@pearl_symptoms`
- [ ] For each symptom where `followUpScheduledAt` is in the past AND `followUpDismissed` is false AND `resolved` is false, generate a notification
- [ ] Notification title: "How's your [symptomLabel]?"
- [ ] Notification body: "You logged '[symptomLabel]' 30 days ago. Has it improved?"
- [ ] Notification data: `{ screen: 'SymptomInsights', symptomId: symptom.id }`
- [ ] Respects `preferences.symptomFollowUp` toggle
- [ ] Respects master `preferences.enabled` toggle
- [ ] Export from `src/services/index.ts`
- [ ] Typecheck passes

### US-100: Integrate SymptomFollowUpService into BackgroundSyncService
**Description:** As a developer, I need the background sync to check for symptom follow-ups.

**Acceptance Criteria:**
- [ ] Import `checkSymptomFollowUps` in BackgroundSyncService
- [ ] Add step after equipment aging check that calls `checkSymptomFollowUps(preferences)`
- [ ] Schedule returned notifications via `scheduleLocalNotification`
- [ ] Include follow-up notification count in totalNotifs logging
- [ ] Typecheck passes

### US-101: Premium gate for symptom history
**Description:** As a free user, I can see symptoms from the last 30 days. Paid users see full history.

**Acceptance Criteria:**
- [ ] HomeScreen checks `@pearl_is_premium` from AsyncStorage
- [ ] Free users: symptom list filtered to last 30 days via `getRecentSymptoms(30)`
- [ ] Paid users: show all symptoms
- [ ] When free user has older symptoms that are hidden, show count: "X older symptoms — Upgrade to see full history"
- [ ] Upgrade banner links to Account screen
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Add `LoggedSymptom` interface to models with id, symptomId, symptomLabel, categoryId, categoryLabel, affectedPillars, notes, loggedAt, followUpScheduledAt, followUpDismissed, resolved fields
- FR-2: Create SymptomContext with AsyncStorage persistence under key `@pearl_symptoms`
- FR-3: SymptomLogModal saves through SymptomContext, not local state
- FR-4: HomeScreen reads symptoms from SymptomContext, not from mock data
- FR-5: GuidedQuestionsScreen saves answers to OnboardingContext before navigating
- FR-6: SymptomFollowUpService generates notifications 30 days after symptom logging
- FR-7: BackgroundSyncService calls SymptomFollowUpService during periodic sync
- FR-8: Free tier shows last 30 days of symptoms; paid tier shows full history

## Non-Goals

- No symptom trend analysis or pattern detection (future feature)
- No symptom-to-insight correlation engine (future: Improvement Paths)
- No custom symptom categories (use existing 4 categories + 17 symptoms)
- No symptom editing after save (user can delete and re-log)

## Technical Considerations

- Follow existing EquipmentContext pattern for AsyncStorage persistence
- Dates stored as ISO strings in AsyncStorage (no Date objects in JSON)
- Symptom categories and symptom definitions remain in SymptomLogModal (not duplicated into model)
- `affectedPillars` uses existing `Pillar` type from DeviceData model
- Relative date formatting uses simple math (no external date library)

## Success Metrics

- Logged symptoms persist across app restarts
- 30-day follow-up notifications fire for unresolved symptoms
- Zero mock data remaining in symptom flow
- GuidedQuestions answers persist and drive coach prompts on restart
