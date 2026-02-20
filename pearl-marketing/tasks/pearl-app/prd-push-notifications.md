# PRD: Push Notifications & Background Device Sync

## Introduction

The Pearl Homeowner App currently requires users to open the app to see device insights and home performance updates. This feature adds **local push notifications** triggered by device threshold breaches, maintenance reminders, seasonal tips, symptom follow-ups, new rebates, equipment aging alerts, and weather events. It also adds **background device sync** so device readings are refreshed periodically without the user opening the app.

Push notifications are Pearl's #1 retention driver. The v3 PRD sets a target of >60% notification opt-in and >40% 30-day retention. Without notifications, the app is a one-time setup tool that gets deleted. With them, Pearl becomes an always-on home health advisor that earns its place on the homeowner's phone.

This is a **local-first implementation** — all notification logic runs on-device using expo-notifications, expo-task-manager, and expo-background-fetch. No backend push service is required for v1. Remote push notifications can be layered on later when a backend exists.

---

## Goals

- Increase 30-day retention to >40% by giving users reasons to return
- Achieve >60% notification opt-in rate across all users
- Deliver timely, relevant notifications that homeowners find useful (not annoying)
- Refresh device readings in the background so insights are current when the user opens the app
- Support 7 notification trigger types from the v3 PRD
- Provide granular user controls: opt in/out by category, frequency preferences, quiet hours
- Gate device insight notifications to paid tier; maintenance and seasonal notifications available to all users
- Deep link notification taps to the relevant screen in the app

---

## User Stories

### US-001: Install and configure expo-notifications
**Description:** As a developer, I need the notification infrastructure installed and configured so other stories can schedule local notifications.

**Acceptance Criteria:**
- [ ] Install `expo-notifications` and `expo-device` packages
- [ ] Add notification permissions request on app launch (asks once, respects denial)
- [ ] Configure notification handler to show notifications when app is in foreground
- [ ] Configure notification categories with action buttons (dismiss, view)
- [ ] Add notification channel for Android (Pearl Insights channel)
- [ ] Create `src/services/NotificationService.ts` with functions: `requestPermissions()`, `scheduleLocalNotification(opts)`, `cancelNotification(id)`, `cancelAllNotifications()`, `getBadgeCount()`, `setBadgeCount(n)`
- [ ] Export from `src/services/index.ts` barrel
- [ ] Typecheck passes

### US-002: Install and configure background fetch
**Description:** As a developer, I need background task infrastructure so the app can sync device data when backgrounded.

**Acceptance Criteria:**
- [ ] Install `expo-task-manager` and `expo-background-fetch` packages
- [ ] Register a background fetch task named `PEARL_BACKGROUND_SYNC` in `src/services/BackgroundSyncService.ts`
- [ ] Task is registered at app startup (in App.tsx or root provider)
- [ ] Task configuration: minimum interval 15 minutes, `BackgroundFetch.BackgroundFetchResult` return values handled correctly
- [ ] Add `startBackgroundSync()` and `stopBackgroundSync()` exported functions
- [ ] Export from `src/services/index.ts` barrel
- [ ] Typecheck passes

### US-003: Create NotificationContext with preferences state
**Description:** As a developer, I need a React context to manage notification preferences, permission status, and pending notifications so all screens can access notification state.

**Acceptance Criteria:**
- [ ] Create `src/context/NotificationContext.tsx` with provider and `useNotifications()` hook
- [ ] State includes: `permissionGranted: boolean`, `preferences: NotificationPreferences`, `pendingCount: number`
- [ ] `NotificationPreferences` type has: `enabled: boolean`, category toggles (`deviceInsights`, `maintenanceDue`, `equipmentAging`, `newRebates`, `symptomFollowUp`, `seasonalTips`, `weatherEvents` — all boolean), `frequency: 'realtime' | 'daily_digest' | 'weekly_digest'`, `quietHoursEnabled: boolean`, `quietHoursStart: string` (HH:mm), `quietHoursEnd: string` (HH:mm)
- [ ] Default preferences: all categories enabled, frequency `realtime`, quiet hours disabled, start `22:00`, end `07:00`
- [ ] Persists to AsyncStorage with key `@pearl_notification_preferences`
- [ ] Loads preferences from AsyncStorage on mount
- [ ] Export from `src/context/index.ts` barrel
- [ ] Typecheck passes

### US-004: Create notification type definitions
**Description:** As a developer, I need TypeScript types for the 7 notification categories so the system is type-safe.

**Acceptance Criteria:**
- [ ] Create types in `src/models/Notification.ts`
- [ ] `NotificationCategory` union type: `'device_insight' | 'maintenance_due' | 'equipment_aging' | 'new_rebate' | 'symptom_followup' | 'seasonal_tip' | 'weather_event'`
- [ ] `PearlNotification` interface with: `id: string`, `category: NotificationCategory`, `title: string`, `body: string`, `data: Record<string, string>` (for deep link params), `scheduledAt: Date`, `delivered: boolean`, `tappedAt: Date | null`
- [ ] `NotificationPreferences` interface (as described in US-003)
- [ ] `NOTIFICATION_CATEGORY_CONFIG` constant mapping each category to: `label: string`, `description: string`, `icon: string` (Ionicons name), `defaultEnabled: boolean`, `paidOnly: boolean`
- [ ] Device insight and equipment aging are `paidOnly: true`; all others `paidOnly: false`
- [ ] Export from `src/models/index.ts` barrel
- [ ] Typecheck passes

### US-005: Build notification trigger engine
**Description:** As a developer, I need a service that evaluates conditions and decides which notifications to fire, respecting user preferences and quiet hours.

**Acceptance Criteria:**
- [ ] Create `src/services/NotificationTriggerEngine.ts`
- [ ] Function `evaluateAndNotify(readings: DeviceReading[], insights: Insight[], preferences: NotificationPreferences): PearlNotification[]`
- [ ] For `device_insight` triggers: check if any new insight from InsightEngine has severity `action` or `attention`, generate notification with insight title/body
- [ ] Deduplication: do not fire notification if same metric+severity was notified within the last 4 hours (tracked via AsyncStorage key `@pearl_notification_history`)
- [ ] Respect quiet hours: if current time is within quiet hours window, queue notification for quiet hours end
- [ ] Respect category toggles: skip disabled categories
- [ ] Respect frequency: if `daily_digest`, batch notifications and schedule one summary at 9am; if `weekly_digest`, batch and schedule for Monday 9am; if `realtime`, fire immediately
- [ ] Return array of notifications that were scheduled
- [ ] Typecheck passes

### US-006: Implement background sync task logic
**Description:** As a developer, I need the background task to actually sync device data and trigger notification evaluation when the app is backgrounded.

**Acceptance Criteria:**
- [ ] Background task in `BackgroundSyncService.ts` reads devices from AsyncStorage (same key as DeviceContext: `@pearl_devices`)
- [ ] Calls `simulateSync(devices)` from MockDeviceSyncService to generate new readings
- [ ] Appends new readings to AsyncStorage (same key as DeviceContext: `@pearl_readings`) with 48h pruning
- [ ] Runs `evaluateReadings(readings)` from InsightEngine on the updated readings
- [ ] Passes results to `evaluateAndNotify()` from NotificationTriggerEngine
- [ ] Schedules any resulting notifications via NotificationService
- [ ] Updates `@pearl_last_sync_time` in AsyncStorage
- [ ] Returns `BackgroundFetch.BackgroundFetchResult.NewData` if new readings generated, `.NoData` otherwise
- [ ] Typecheck passes

### US-007: Add notification tap deep linking
**Description:** As a user, I want to tap a notification and be taken to the relevant screen so I can act on the alert immediately.

**Acceptance Criteria:**
- [ ] Add notification response listener in NotificationContext that fires on notification tap
- [ ] `device_insight` notifications deep link to InsightHistoryScreen (or PillarDetailScreen for the relevant pillar)
- [ ] `maintenance_due` notifications deep link to the Improve tab
- [ ] `seasonal_tip` notifications deep link to HomeScreen
- [ ] All other categories deep link to HomeScreen as fallback
- [ ] Deep link data stored in notification `data` field: `{ screen: string, params: string }` (JSON-encoded params)
- [ ] Navigation performed via `navigationRef` from RootNavigator
- [ ] Typecheck passes

### US-008: Build Notification Preferences screen
**Description:** As a user, I want to control which notification types I receive, how often, and set quiet hours so I'm not bothered at inconvenient times.

**Acceptance Criteria:**
- [ ] Create `src/screens/NotificationPreferencesScreen.tsx`
- [ ] Master toggle at top: "Enable Notifications" — disables all when off
- [ ] Category section: 7 toggles, one per notification category, with icon, label, and description from `NOTIFICATION_CATEGORY_CONFIG`
- [ ] Paid-only categories show lock icon and "Premium" badge for free users (toggles disabled)
- [ ] Frequency picker: Real-time / Daily Digest / Weekly Digest (segmented control or radio)
- [ ] Quiet Hours section: toggle to enable, time pickers for start/end
- [ ] All changes persist immediately to NotificationContext (which saves to AsyncStorage)
- [ ] Uses `useTheme()` for all styling, matches existing Card/MenuRow patterns from AccountScreen
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Add Notifications menu row to AccountScreen
**Description:** As a user, I want to access notification preferences from the Account/Settings screen.

**Acceptance Criteria:**
- [ ] Add "Notifications" MenuRow to AccountScreen settings card, between "Connected Devices" and "Help / Contact"
- [ ] Icon: `notifications-outline`
- [ ] Value shows current state: "On" or "Off" based on master toggle
- [ ] Pressing navigates to NotificationPreferencesScreen
- [ ] Add `onNotificationsPress` prop to AccountScreen
- [ ] Wire navigation in BottomTabNavigator's AccountScreenWrapper
- [ ] Add NotificationPreferences to RootNavigator stack
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Implement maintenance reminder notifications
**Description:** As a user (free or paid), I want to receive reminders when home maintenance tasks are due so I don't forget them.

**Acceptance Criteria:**
- [ ] Create `src/services/MaintenanceScheduler.ts`
- [ ] Define maintenance schedule: HVAC filter (90 days), gutter cleaning (180 days), smoke detector battery (365 days), water heater flush (365 days), dryer vent cleaning (365 days)
- [ ] On app launch and background sync, check if any maintenance is due within 7 days
- [ ] Schedule local notification with title "Maintenance Reminder" and descriptive body (e.g., "Time to change your HVAC filter — it's been about 90 days")
- [ ] Track last-completed dates in AsyncStorage key `@pearl_maintenance_dates`
- [ ] Do not re-notify for same task within 7 days
- [ ] Available to all users (free + paid)
- [ ] Typecheck passes

### US-011: Implement seasonal tip notifications
**Description:** As a user (free or paid), I want to receive seasonal home tips so I can prepare my home for changing weather.

**Acceptance Criteria:**
- [ ] Create `src/services/SeasonalTipService.ts`
- [ ] Define tips array with season associations: `{ id: string, season: 'spring' | 'summer' | 'fall' | 'winter', title: string, body: string }`
- [ ] At least 3 tips per season (12 total minimum)
- [ ] On app launch, determine current season from date, check if a tip has been shown this month (tracked in `@pearl_seasonal_tips_shown`)
- [ ] Schedule one tip per month during that season
- [ ] Available to all users (free + paid)
- [ ] Typecheck passes

### US-012: Implement notification badge count
**Description:** As a user, I want to see a badge on the app icon showing unread notifications so I know there are new insights to check.

**Acceptance Criteria:**
- [ ] After scheduling any notification, increment badge count via `Notifications.setBadgeCountAsync()`
- [ ] When user opens app, reset badge count to 0
- [ ] When user taps a notification, decrement badge count by 1
- [ ] Badge count tracked in NotificationContext `pendingCount` state
- [ ] Typecheck passes

### US-013: Wire background sync into app lifecycle
**Description:** As a developer, I need background sync to start when the app is backgrounded and the DeviceContext to pick up background-synced readings when foregrounded.

**Acceptance Criteria:**
- [ ] Register background task at app startup (top-level, outside React tree, as required by expo-task-manager)
- [ ] Start background fetch after notification permissions are granted and at least one device is connected
- [ ] When app returns to foreground (AppState listener), DeviceContext reloads readings from AsyncStorage to pick up any background-synced data
- [ ] InsightContext also reloads to pick up any new insights generated in background
- [ ] Add `AppState` listener in a `useAppState` hook or within providers
- [ ] Typecheck passes

### US-014: Create notification history log
**Description:** As a user, I want to see a history of past notifications so I can review alerts I may have missed.

**Acceptance Criteria:**
- [ ] Add `notificationHistory: PearlNotification[]` to NotificationContext state
- [ ] Persist to AsyncStorage key `@pearl_notification_log` (retain last 90 days)
- [ ] Each delivered notification appended to history
- [ ] Create `src/screens/NotificationHistoryScreen.tsx` — flat list of past notifications grouped by date
- [ ] Each row shows: category icon, title, body preview (1 line), relative time
- [ ] Tapping a row deep links same as original notification tap
- [ ] Empty state: "No notifications yet" with descriptive text
- [ ] Add navigation route and access from NotificationPreferencesScreen ("View History" row)
- [ ] Uses `useTheme()`, Card, existing patterns
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

## Functional Requirements

- FR-1: The app must request notification permissions on first launch and respect the user's choice
- FR-2: The app must support 7 notification categories: device insights, maintenance due, equipment aging, new rebates, symptom follow-ups, seasonal tips, weather events
- FR-3: Device insight and equipment aging notifications must be gated to paid tier users
- FR-4: Maintenance reminders and seasonal tips must be available to all users (free + paid)
- FR-5: Users must be able to opt in/out of each notification category independently
- FR-6: Users must be able to set notification frequency: real-time, daily digest, or weekly digest
- FR-7: Users must be able to set quiet hours during which no notifications are delivered
- FR-8: Background device sync must run approximately every 15 minutes when the app is backgrounded
- FR-9: Background sync must generate new device readings, evaluate them against InsightEngine thresholds, and fire local notifications for new insights
- FR-10: Tapping a notification must deep link to the relevant screen in the app
- FR-11: The app icon must display a badge count for undelivered/unread notifications
- FR-12: Notification history must be persisted for 90 days and viewable in-app
- FR-13: Duplicate notifications for the same metric+severity must be suppressed for 4 hours
- FR-14: All notification preferences must persist across app restarts via AsyncStorage

---

## Non-Goals (Out of Scope)

- No remote/server-side push notifications (v1 is local-only)
- No backend API for notification management
- No email or SMS notifications
- No notification preferences sync across devices
- No A/B testing of notification copy
- No weather API integration (weather event notifications are placeholder/manual for v1)
- No rebate API integration (new rebate notifications are placeholder for v1)
- No equipment aging calculations (equipment aging notifications are placeholder for v1)
- No symptom follow-up tracking (placeholder for v1 — requires symptom logging feature)
- No rich media in notifications (images, action buttons beyond dismiss/view)

---

## Design Considerations

- **Notification Preferences screen** follows the existing Account > Settings pattern with Card containers and MenuRow-style toggles
- **Quiet hours** uses simple time pickers, not complex scheduling UI
- **Category toggles** use Switch components matching iOS/Android native feel
- **Paid-only gating** shows a subtle lock icon + "Premium" label — does not block the entire preferences screen, just disables paid-only toggles
- **Notification copy** uses Pearl's coach voice: warm, direct, actionable (e.g., "Your radon levels spiked overnight — open some windows and check your mitigation system")
- Reuse existing `Card`, `CoachPromptCard` components where applicable

---

## Technical Considerations

- **expo-notifications** handles all local notification scheduling and permissions
- **expo-task-manager** + **expo-background-fetch** handle background sync; task must be registered at the top level (outside React component tree) per Expo docs
- Background fetch interval is a minimum hint — iOS may throttle based on usage patterns
- **AsyncStorage** keys follow existing `@pearl_` prefix convention
- All new contexts follow the existing pattern: `createContext` → Provider with `isLoaded` gate → named hook with error boundary
- Notification deduplication uses a lightweight history in AsyncStorage (metric+severity → last notified timestamp)
- Deep linking uses React Navigation's `navigationRef` for programmatic navigation from outside the component tree
- Date serialization follows existing pattern: custom JSON replacer/reviver for ISO strings
- New packages needed: `expo-notifications`, `expo-device`, `expo-task-manager`, `expo-background-fetch`

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| Notification opt-in rate | >60% | % users who grant permission and keep ≥1 category enabled |
| 30-day retention | >40% | % users who open app at least once in 30 days after install |
| Notification tap-through rate | >15% | % delivered notifications that are tapped |
| Background sync success rate | >80% | % background fetch executions that return NewData |
| Maintenance reminder completion | >50% | % maintenance notifications where user marks task complete |
| Daily active users (DAU) increase | >25% | DAU growth after notification feature ships |

---

## Open Questions

1. Should daily/weekly digest notifications combine all categories into one notification, or send one per category?
2. What is the exact copy for each seasonal tip? (Placeholder tips included for v1, can be refined by content team)
3. Should we track notification analytics locally for later sync to a backend?
4. When remote push is added in v2, should local notifications be replaced or run alongside?
5. For weather events — should we integrate a weather API in a future version, or rely on manual/content-driven tips?
