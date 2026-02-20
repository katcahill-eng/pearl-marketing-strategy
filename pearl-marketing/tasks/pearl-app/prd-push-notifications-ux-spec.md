# UX Specification: Push Notifications & Background Device Sync

## Pass 1: Mental Model

**Primary user intent:** "I want my home to tell me when something needs attention — without me having to check."

**Likely misconceptions:**
- "Notifications means spam" — Users may associate push notifications with marketing spam. Pearl notifications must feel like a trusted advisor, not a marketer.
- "I need to keep the app open for it to work" — Users may not understand background sync. They need to trust that Pearl is watching their home even when they're not in the app.
- "All notifications are the same importance" — Users may not distinguish between an urgent radon alert and a seasonal tip. The system must visually and tonally differentiate urgency levels.
- "Turning off one category turns off everything" — Users need to see that controls are granular, not all-or-nothing.
- "The app is spying on me" — Background data collection can feel invasive. Framing must emphasize "your devices, your data, on your phone."

**UX principle to reinforce/correct:** Pearl notifications are a **personal home health advisor** — they only speak up when they have something useful to say. The mental model is a knowledgeable friend who checks on your house, not an app that buzzes for engagement metrics. Reinforce this by making every notification actionable and by giving users full control over what they hear and when.

---

## Pass 2: Information Architecture

**All user-visible concepts:**
- Notification permission request
- Individual notification (alert)
- Notification categories (7 types)
- Notification preferences (master toggle)
- Category toggles (on/off per type)
- Frequency setting (realtime / daily / weekly)
- Quiet hours (time range)
- Notification history (past alerts)
- Badge count (app icon)
- Deep link destination (where tapping goes)
- Premium/paid gating (locked categories)
- Background sync status (implicit — user shouldn't need to think about this)

**Grouped structure:**

### Notification Delivery (Hidden — runs automatically)
- Background sync: Hidden (user never sees this directly)
- Notification trigger evaluation: Hidden
- Badge count: Primary (visible on app icon at all times)
- Deep linking: Hidden (just works when tapped)

### Notification Content (Primary — the actual alerts)
- Device insight alerts: Primary — these are the core value
- Maintenance reminders: Primary — universal, high utility
- Seasonal tips: Secondary — nice-to-have, lower urgency
- Equipment aging alerts: Secondary — infrequent, paid only
- Symptom follow-ups: Secondary — placeholder for v1
- New rebate alerts: Secondary — placeholder for v1
- Weather event alerts: Secondary — placeholder for v1
- Rationale: Device insights and maintenance are the daily-use retention drivers. Others supplement.

### Notification Controls (Secondary — accessed from Account settings)
- Master toggle: Primary within this group — first thing users see
- Category toggles: Primary within this group — the main control surface
- Frequency picker: Secondary — most users will leave on realtime
- Quiet hours: Secondary — power-user feature, progressive disclosure
- Premium gating: Secondary — visible but not prominent
- Rationale: Controls are accessed infrequently after initial setup. Group behind Account > Notifications.

### Notification History (Secondary — accessed from Preferences screen)
- Past notifications list: Secondary — review/reference, not primary workflow
- Rationale: Most users act on notifications when they arrive. History is for the "what did I miss" use case.

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|--------------------------|
| Grant notification permission | System dialog (OS-native) — user recognizes this pattern |
| Tap notification to act on it | Standard OS notification tray — tapping opens app |
| Open notification preferences | MenuRow with chevron in Account screen (established pattern) |
| Toggle a category on/off | Switch component — universally understood toggle |
| Toggle master notifications on/off | Prominent switch at top of preferences, larger than category switches |
| Set frequency | Segmented control with 3 options — tap to select |
| Enable quiet hours | Switch toggle, reveals time pickers when on |
| Set quiet hours times | Time picker wheels — standard mobile pattern |
| View notification history | MenuRow "View History" with chevron — navigates to list |
| Tap history item | Full-width row — tapping navigates to relevant screen |
| Recognize paid-only category | Lock icon + "Premium" badge — dimmed/disabled switch |
| Dismiss notification | Standard OS swipe-to-dismiss in notification tray |

**Affordance rules:**
- If user sees a Switch, they should assume it toggles something on/off immediately (no save button)
- If user sees a chevron row, they should assume tapping navigates deeper
- If user sees a lock icon, they should assume the feature requires an upgrade
- If user sees a notification, they should assume tapping opens the relevant part of the app

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Permission request on first launch | Choice | Frame as benefit: "Get alerts when your home needs attention." One-time ask, never re-ask if denied. |
| 7 notification categories | Choice | All enabled by default. User only needs to opt OUT, not opt IN. Reduce decisions from 7 to 0 for most users. |
| Frequency selection | Choice | Default to "Real-time" which is what most users expect. Daily/weekly digest are for power users who discover them later. |
| Quiet hours setup | Choice | Disabled by default with sensible defaults (10pm-7am) pre-filled. User just flips one switch. |
| Paid-only categories | Uncertainty | Show them visibly but dimmed — don't hide. User understands what they'd get with Premium without confusion about missing features. |
| "Where do I find notification settings?" | Uncertainty | Place in Account screen (established settings location) with clear "Notifications" label and bell icon. |
| "What does this notification mean?" | Uncertainty | Every notification body includes: what happened + what to do next. Never just "Alert: radon high." |
| Background sync happening invisibly | Uncertainty | No UI needed. Trust is built by notifications arriving without the user opening the app first. |

**Defaults introduced:**
- All 7 categories enabled: Users get full value immediately; opt-out is easier than opt-in
- Frequency = realtime: Matches user expectation that alerts mean "tell me now"
- Quiet hours = disabled, preset to 22:00–07:00: When users discover this, one toggle activates sensible defaults
- Badge count resets on app open: Users don't need to manually clear — matches iOS/Android conventions

---

## Pass 5: State Design

### Notification Permission

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Not yet asked | Nothing (app hasn't prompted) | N/A | Opens app for first time |
| Permission dialog shown | OS native dialog with Pearl's explanation | App wants to send alerts about home | Grant or deny |
| Granted | Notifications menu shows "On" | Notifications are active | Configure preferences |
| Denied | Notifications menu shows "Off" | Notifications are blocked | Go to phone Settings to re-enable |

### Notification Preferences Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Loading | Brief spinner or skeleton | Preferences are loading | Wait (< 1 second) |
| Default (first visit) | All toggles on, realtime selected, quiet hours off | Everything is enabled by default | Customize as needed |
| Customized | Reflects saved preferences | Settings are remembered | Change any setting |
| Permission denied | Banner at top: "Notifications are turned off in your phone's settings" + deep link | OS-level block, not app-level | Tap to open phone Settings |
| Free user | 5 toggles active, 2 dimmed with lock | Some categories need Premium | Upgrade or skip |

### Notification Delivery

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| No devices connected | No device insight notifications (only maintenance/seasonal) | Connecting devices unlocks more alerts | Connect a device |
| Device connected, readings normal | No notifications (silence = good news) | Home is performing well | Nothing needed — peace of mind |
| Threshold breached | Push notification with title + body + action | Something needs attention | Tap to see details and act |
| Quiet hours active | No notification delivered; queued | N/A (user is sleeping) | Sees notification after quiet hours end |
| Duplicate suppressed | No notification (same alert <4 hours ago) | N/A (invisible to user) | N/A |

### Notification History Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty | "No notifications yet" + coach message explaining what to expect | App will notify them as things happen | Wait for first notification |
| Loading | Brief spinner | History is loading | Wait |
| Has history | Date-grouped list of past notifications | Can review missed alerts | Tap any to navigate to relevant screen |
| 90+ days old items | Items naturally pruned (user doesn't see removal) | Only recent history matters | N/A |

### Background Sync

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Running | Nothing (invisible) | N/A (shouldn't need to know) | N/A |
| Sync completes with new data | Notification appears (if threshold breached) | Home is being monitored | Act on notification |
| Sync completes, no new data | Nothing | Home is fine | N/A |
| Sync fails | Nothing (silent failure, retry next interval) | N/A | N/A |
| App returns to foreground | Updated readings on HomeScreen | Data is fresh | View latest readings |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User denies permission and can't find how to re-enable | Permission dialog | Show persistent banner on Notification Preferences screen with "Open Settings" deep link |
| User overwhelmed by 7 category toggles | Preferences screen | Group by section (Home Alerts, Reminders, Tips) instead of flat list; defaults are all-on so no immediate action needed |
| User doesn't know notifications exist | After onboarding | Permission prompt on first launch; "Notifications" menu row visible in Account; first notification proves the feature works |
| Notification tap goes nowhere (dead link) | Deep linking | Every notification category has a fallback to HomeScreen; never show a blank or error screen |
| User thinks background sync drains battery | General concern | No UI that draws attention to background activity; if asked, explain in Help section |
| Paid-only categories confuse free users | Preferences screen | Lock icon + "Premium" label is clear; do not hide categories entirely (that would be worse — user wouldn't know what they're missing) |
| User sets quiet hours but expects alerts during emergency | Quiet hours | Severity: `action` notifications (e.g., radon spike) should bypass quiet hours with a clear disclaimer in quiet hours UI: "Critical safety alerts will still come through" |
| Notification history is empty forever for users with no devices | History screen | Maintenance reminders and seasonal tips fire for ALL users, so history populates regardless of device status |
| Back navigation from Preferences or History | Screens | Both screens are pushed onto the navigation stack — hardware/gesture back returns to Account screen |

**Visibility decisions:**
- Must be visible: Master notification toggle, category toggles, quiet hours toggle, notification permission status, "Notifications" row in Account, badge count on app icon
- Can be implied: Background sync activity, deduplication logic, frequency batching mechanics, notification queuing during quiet hours

**UX constraints:**
- Every notification body must contain: what happened + what to do. Never raw data alone.
- Permission request must happen exactly once. If denied, never re-prompt (show settings deep link instead).
- Category toggles must save immediately — no "Save" button.
- Quiet hours UI must mention that critical safety alerts may bypass quiet hours.
- Notification Preferences screen must have a back button/gesture to return to Account.
- Notification History screen must have a back button/gesture to return to Preferences.
- Empty states must always have explanatory text, never just a blank screen.

---

## Visual Specifications

### Screen: Notification Preferences

**Layout (top to bottom):**
1. **Header:** "Notifications" title with back arrow
2. **Permission banner** (conditional): Shows only when OS permission denied. Yellow/warning background. "Notifications are turned off. Open Settings to enable." Tappable.
3. **Master toggle card:** Single Card containing one row: bell icon, "Enable Notifications" label, Switch. When off, all below sections are dimmed/disabled.
4. **Categories card:** Card with section header "Alert Types". 7 rows, each with: category icon (from NOTIFICATION_CATEGORY_CONFIG), label, description (smaller text below label), Switch. Paid-only rows show lock icon and "Premium" pill badge. Dividers between rows (matches AccountScreen pattern with marginLeft: 68).
5. **Frequency card:** Card with section header "Delivery". Segmented control with 3 options: "Real-time" | "Daily Digest" | "Weekly Digest".
6. **Quiet Hours card:** Card with "Quiet Hours" header. Toggle row: clock icon, "Quiet Hours", Switch. When enabled, reveals two time picker rows: "Start" (default 22:00) and "End" (default 07:00). Small text below: "Critical safety alerts may still come through."
7. **History row:** Card with single MenuRow: "View Notification History" with chevron.
8. **Bottom padding:** sufficient for tab bar.

**Styling:**
- Uses `useTheme()` for all colors, spacing, typography
- Cards use existing `Card` component
- Rows use pattern from `AccountScreen.MenuRow` (icon container, label, optional value, chevron/switch)
- Switches use React Native `Switch` with `trackColor` and `thumbColor` from theme
- Segmented control: custom component using `TouchableOpacity` with active/inactive states from theme
- Premium badge: small rounded pill, `colors.accent` background, white text, "Premium" label

### Screen: Notification History

**Layout:**
1. **Header:** "Notification History" title with back arrow
2. **List:** SectionList grouped by date (today, yesterday, then date strings)
3. **Row:** Category icon in colored circle (from NOTIFICATION_CATEGORY_CONFIG), title (1 line, bold), body (1 line, truncated, secondary color), relative time (right-aligned, caption size). Full row tappable.
4. **Empty state:** Centered vertically. Bell icon (large, muted), "No notifications yet" heading, "You'll see your notification history here once Pearl starts sending you alerts about your home." body text.

**Styling:**
- Section headers: date label, secondary text color, small font
- Rows: 72px min height, same icon container size as AccountScreen MenuRow (36x36)
- Uses existing `Card` wrapper for visual consistency
- Empty state follows existing app empty state patterns (centered icon + text)

### Notification Content (Push Notification Copy)

| Category | Title Pattern | Body Pattern |
|----------|--------------|-------------|
| Device Insight | "{Metric} Alert" | "{Insight title} — {first action from insight}" |
| Maintenance Due | "Maintenance Reminder" | "Time to {task} — it's been about {days} days" |
| Equipment Aging | "Equipment Check" | "Your {equipment} turns {age} this year — here's what to know" |
| New Rebate | "New Rebate Available" | "A ${amount} {type} rebate just launched in {state}" |
| Symptom Follow-up | "How's Your Home?" | "You logged '{symptom}' {days} days ago — did it improve?" |
| Seasonal Tip | "{Season} Home Tip" | "{Tip body}" |
| Weather Event | "Weather Alert" | "{Event} expected this week — here's how your home might handle it" |

### Navigation Integration

- `AccountScreen` → new "Notifications" MenuRow (between Connected Devices and Help)
- `AccountScreen` → tap → `NotificationPreferencesScreen` (pushed to stack)
- `NotificationPreferencesScreen` → "View History" → `NotificationHistoryScreen` (pushed to stack)
- `NotificationHistoryScreen` → tap row → deep link to relevant screen
- Back gesture/button always returns to previous screen in stack
