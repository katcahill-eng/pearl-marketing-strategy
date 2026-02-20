# UX Specification: Smart Device Integration & Recommendation Engine

## Pass 1: Mental Model

**Primary user intent:** "I want Pearl to use my smart devices to tell me what's going on in my home and what I should do about it."

**Secondary intent:** "I want to see my SCORE improve based on real data, not estimates."

**Likely misconceptions:**

- **"Connecting a device will improve my SCORE"** — Users may expect that the act of connecting automatically earns points. Reality: connecting provides data; the data informs insights; acting on insights leads to improvements that raise the SCORE.
- **"Pearl replaces my device's app"** — Users may expect full device control (set thermostat schedule, configure AirThings alerts). Pearl reads data and recommends; it doesn't replace manufacturer apps.
- **"Readings update in real-time like my thermostat display"** — Pearl polls at intervals (5-15 min), not live streaming. Users accustomed to their Nest app showing instant updates may perceive Pearl as laggy.
- **"Red means danger/emergency"** — Red readings mean "above the standard threshold, action recommended." Not all red readings are emergencies (e.g., CO2 at 1100 ppm is above ASHRAE standard but not immediately hazardous).
- **"Pearl controls my devices"** — Phase 3 adds one-tap actions for some devices, but many recommendations are manual actions ("replace your filter," "open windows"). Pearl is a coach, not an automation system.
- **"All my smart devices will work"** — Only Tier 1 devices (AirThings, Nest, Ecobee, Honeywell) are supported at launch. Users with Ring, Arlo, or other devices may be disappointed.

**UX principles to reinforce:**

1. **Pearl is your home performance coach, not a device controller.** The coach metaphor established in onboarding extends here: Pearl interprets data and guides action.
2. **Readings are mapped to SCORE pillars, not to devices.** Users should think "my Safety pillar has a radon concern" not "my AirThings says 3.2." The pillar framework is the organizing principle.
3. **Green/yellow/red always means the same thing across the app.** Consistent color language: green = within building science standards, yellow = approaching threshold, red = exceeds threshold and action recommended.

---

## Pass 2: Information Architecture

**All user-visible concepts:**

- Connected devices (list, status, brand)
- Device readings (current values, units, trends)
- Reading thresholds (green/yellow/red zones)
- SCORE pillar mappings (which device feeds which pillar)
- Insights/recommendations (Pearl's analysis of readings)
- Insight severity (info, attention, action)
- Recommended actions (what to do)
- Action types (one-tap device control, manual steps, call Pearl Pro, claim rebate)
- SCORE impact projections (estimated point change)
- Device connection flow (OAuth, brand selection)
- Sync status (when data was last updated)
- Reading history (24h sparklines, min/max/avg)
- Insight history (past recommendations, resolved vs. active)
- Daily summary (morning performance digest)
- Device coverage gaps (pillar problems without device data)

**Grouped structure:**

### Dashboard Integration (Home Tab — Primary)
- **Daily Summary Card**: Primary — first thing user sees each morning
- **Live Readings section**: Primary — current device values mapped to pillars, color-coded
- **"Pearl Says" Insights section**: Primary — top 3 active recommendations
- **Pillar Overview (existing)**: Primary — now enhanced with real data indicators
- **Coach Prompt Cards (existing)**: Secondary — "Connect a device" prompts for users without devices
- Rationale: Dashboard is the daily-use surface. Device data lives here, not in a separate "Devices" tab.

### Device Management (Account Tab — Secondary)
- **Device Hub screen**: Secondary — manage connections, see all devices
- **Device Connection flows**: Hidden (progressive) — only shown when user initiates "Add Device"
- **Device Detail screen**: Secondary — accessed by tapping a device reading or from hub
- Rationale: Device management is setup/maintenance, not daily use. Keep it out of the main dashboard flow.

### Pillar Integration (My Home Tab — Secondary)
- **Device Coverage section in PillarDetail**: Secondary — shows which problems have device data vs. estimates
- **"Add a device" prompts per pillar**: Hidden (progressive) — shown only for uncovered problems
- Rationale: Deepens the pillar experience without cluttering it.

### Insight System (spans Dashboard + dedicated History screen)
- **InsightCard on dashboard**: Primary — the 3 most important active insights
- **Insight History screen**: Secondary — accessed via "View All" from dashboard
- **SCORE Impact Simulator**: Hidden (progressive) — shown inline on recommendations that have calculable impact
- Rationale: Insights are the core value prop. They must be prominent on the dashboard but not overwhelming.

### Action System (within Insight Cards)
- **One-tap device actions**: Primary within insight card — "Set to 72°F" button
- **Manual step instructions**: Secondary within insight card — expandable "How to do this"
- **Pearl Pro link**: Secondary — "Find a pro for this"
- **Rebate link**: Secondary — "Rebate available"
- Rationale: Actions are embedded in context (the insight that triggers them), not in a separate actions list.

---

## Pass 3: Affordances

| Action | Visual/Interaction Signal |
|--------|---------------------------|
| Connect a new device | "+" button on Device Hub; CoachPromptCard on dashboard with "Connect" CTA; teal accent color |
| View device detail | DeviceReadingCard is tappable (chevron indicator, active opacity on press) |
| Understand reading status | Color dot (green/yellow/red) next to every reading value — same colors used across entire app |
| See which pillar a reading affects | Pillar badge icon on every DeviceReadingCard (shield for Safety, thermometer for Comfort, etc.) |
| Understand trend direction | Arrow icon: ↑ (worsening), ↓ (improving), → (stable) next to value. Arrow color matches status. |
| Read an insight | InsightCard has distinct background tint per severity: blue border (info), yellow border (attention), red border (action) |
| Take action on an insight | Tappable action buttons inside InsightCard with distinct icons per type: wrench (device), person (Pearl Pro), dollar (rebate) |
| Dismiss an insight | "Got it" text button at card bottom (secondary styling, not primary) |
| Snooze an insight | "Remind me later" text link next to "Got it" |
| See SCORE impact of an action | Animated score bar appears below recommendation: "Safety: 45 → 62 (+17)" with delta highlighted in green |
| Disconnect a device | Red "Disconnect" button at bottom of DeviceDetailScreen, requires confirmation dialog |
| Navigate back from any detail screen | Back arrow in header (consistent with existing app pattern) |
| See sync status | Small text below reading: "Updated 5 min ago" — grays out if >30 min stale |
| Expand daily summary | Chevron or "See full report" link on DailySummaryCard |
| Start OAuth flow | Brand logo + "Connect [Brand]" primary button — familiar OAuth pattern |

**Affordance rules:**
- If user sees a colored dot next to a number, they should assume it indicates status (good/attention/action)
- If user sees a pillar icon, they should assume tapping it goes to that pillar's detail
- If user sees a card with a border color, they should assume it's an insight with that severity
- If user sees a button with an icon inside an insight card, they should assume it's an action they can take
- If user sees "Updated X min ago" text, they should assume this data refreshes automatically
- If user sees "Estimated" badge, they should assume this data could be more accurate with a device

---

## Pass 4: Cognitive Load

**Friction points:**

| Moment | Type | Simplification |
|--------|------|----------------|
| Choosing which device to connect first | Choice | Show "Recommended" badge on devices that address the user's onboarding concerns (from GuidedQuestionsScreen answers). If user said comfort is "a real issue," recommend thermostat first. |
| OAuth authorization screen (unfamiliar, different per brand) | Uncertainty | Pre-explain: "You'll be taken to [Brand]'s website to authorize Pearl. This is standard and secure." Post-explain: "Connected! Pearl can now read your [data types]." |
| Understanding threshold values (pCi/L, μg/m³, ppm) | Uncertainty | Never show raw units alone. Always pair with plain-English: "Radon: 1.8 pCi/L — Good (below EPA threshold)". The color and label are primary; the number is secondary. |
| Too many readings on dashboard | Choice | Cap at 5 reading cards on dashboard. Show highest-severity first. "See all readings" link for rest. |
| Multiple insights competing for attention | Choice | Max 3 insight cards. Severity-sorted. "Pearl Says" section header shows count: "Pearl Says (3 insights)" |
| Deciding whether to act on a recommendation | Uncertainty | Show effort level (Easy / Moderate / Professional) and estimated SCORE impact on every actionable recommendation. |
| Understanding what "estimated" vs "measured" means | Uncertainty | Use consistent badge: gray "Estimated" tag on data from public records, teal "Measured" tag on device data. One-line explanation on first encounter: "Estimated data is based on homes like yours. Connect a device for exact readings." |
| Waiting for first data after connecting | Waiting | Show immediate confirmation: "Connected! First readings arriving in ~30 seconds..." with progress indicator. If delayed: "Still waiting for data from your [device]. This usually takes under a minute." |
| Device disconnects unexpectedly | Uncertainty | Show clear status on reading card: gray dot + "Offline" label + "Last reading: 2 hours ago". Device Hub shows reconnect button. Don't remove the last known reading — show it grayed with staleness indicator. |

**Defaults introduced:**
- **Sort order for dashboard readings**: By severity (red first, then yellow, then green) — user sees most important first
- **Default insight snooze**: 24 hours — enough to take action without forgetting
- **Sync intervals**: 15 min for air quality, 5 min for thermostats — balanced between freshness and API rate limits. User does NOT configure this.
- **Threshold values**: Pre-set from SCORE methodology standards (EPA, ASHRAE). User does NOT customize thresholds. Pearl is the expert.
- **Device recommendation on hub screen**: Pre-sorted by pillar relevance to user's onboarding answers
- **Reading card display**: Show plain-English status label ("Good", "Needs Attention", "Action Needed") as primary. Show numeric value + unit as secondary detail.

---

## Pass 5: State Design

### Dashboard — Live Readings Section

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (no devices) | CoachPromptCard: "Connect your smart devices and I'll show you what's really happening in your home." with "Connect a Device" button | They need to connect a device to see live readings | Tap "Connect a Device" → DeviceHubScreen |
| Loading (first sync in progress) | Skeleton cards with pulse animation + "Connecting to your devices..." text | Data is being fetched from their device | Wait ~30 seconds |
| Success (devices connected, data fresh) | 1-5 DeviceReadingCards with color-coded values, trend arrows, pillar badges, "Updated X min ago" | Their home is being monitored; green = good, yellow = watch, red = act | Tap card → DeviceDetailScreen; scroll to insights |
| Partial (some devices connected, some offline) | Mix of active reading cards + grayed "Offline" cards with last known value | Some devices are working, some lost connection | Tap offline card → DeviceDetailScreen with reconnect option |
| Error (sync failed for all devices) | Last known readings grayed + banner: "Couldn't refresh data. Will retry shortly." with "Retry Now" link | Temporary connectivity issue, data is stale but still visible | Tap "Retry Now" or wait for auto-retry |
| Stale (data >30 min old) | Reading cards with dimmed colors + "Updated 45 min ago" in orange text | Data isn't current but is still the most recent available | Pull to refresh to force sync |

### Dashboard — "Pearl Says" Insights Section

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (no active insights) | Subtle card: "Everything looks good! I'll let you know if anything needs attention." with green checkmark | Their home is performing well right now | Nothing needed — reassurance |
| Loading (insights being generated) | Not shown — insight generation is instant (rule evaluation, not API call) | N/A | N/A |
| Success (1-3 active insights) | InsightCards sorted by severity with pillar badge, title, body, action buttons | Pearl has found things that need attention and is telling them what to do | Tap action buttons; dismiss with "Got it"; snooze with "Remind me later" |
| Overflow (>3 insights) | 3 InsightCards + "View All (X more)" link at bottom | There are more recommendations available | Tap "View All" → InsightHistoryScreen |

### Device Hub Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Empty (no devices) | Illustration of home with device icons + "No devices connected yet" + list of supported device categories with "Connect" buttons | They can add supported devices | Tap a device category → connection flow |
| Success (devices connected) | Device list grouped by pillar, each showing name, brand, status dot, last sync time | They have active device connections | Tap device → detail; tap "+" → add another |
| Partial (mix of connected/disconnected) | Connected devices with green dots; disconnected with red dots + "Reconnect" button | Some devices need attention | Tap "Reconnect" on disconnected devices |
| Error (can't load device list) | "Couldn't load your devices" + retry button | Temporary issue | Tap retry |

### Device Connection Flow (OAuth)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Brand Selection | Brand logos with names; "Recommended for you" badge on relevant brands | They need to pick their device brand | Tap brand → next step |
| Pre-auth Explanation | Brand logo + "Pearl will read: [data list]" + "Pillars improved: [badges]" + "Connect [Brand]" button | What data Pearl will access and why it matters | Tap "Connect" → OAuth screen |
| OAuth In Progress | System browser/webview with manufacturer's auth page | They're authorizing on the device manufacturer's side (standard, secure) | Enter credentials, approve access |
| Success | Checkmark animation + "Connected!" + device name + first reading preview | Device is connected and data is flowing | Tap "Done" → back to Device Hub or Dashboard |
| Failure | Error icon + "Connection failed" + specific message (wrong credentials, timeout, etc.) + "Try Again" button | Something went wrong but they can retry | Tap "Try Again" or "Cancel" to go back |
| Already Connected | "This device is already connected" + link to device detail | They don't need to connect again | Tap to view device or go back |

### Device Detail Screen

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Connected (fresh data) | Device info + all current readings with sparkline charts + min/max/avg stats + threshold highlights | Device is working and they can see trends | Scroll through readings; tap reading for detail |
| Connected (stale data) | Same as above but with orange "Last updated X min ago" warning | Device data isn't fresh | Pull to refresh; check device connectivity |
| Disconnected | Device info grayed + "Device Offline" banner + last known readings grayed + "Reconnect" button | Device lost connection; last known data shown | Tap "Reconnect" → re-auth flow |
| Loading (refreshing) | Spinner overlay on readings section | Data is being refreshed | Wait |

### Insight Card (individual)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| New (unread) | Bold title + severity border + "NEW" badge | Pearl found something new that needs attention | Read it, act on it, dismiss it, snooze it |
| Read (no action taken) | Normal title (no bold) + severity border | They've seen this but haven't acted | Act on it, dismiss it, snooze it |
| Action in progress | Action button changes to "In Progress..." + spinner | Their one-tap action is executing | Wait for confirmation |
| Action succeeded | Green checkmark + "Done! [confirmation message]" | The action was taken successfully | Dismiss insight or wait for auto-resolve |
| Action failed | Red X + error message + "Try Again" button | The action didn't work | Retry or follow manual instructions |
| Snoozed | Card removed from dashboard; returns after 24h | They chose to deal with this later | It will come back tomorrow |
| Resolved | Card removed from dashboard; visible in history with green "Resolved" badge | The issue was fixed (reading returned to normal) | View in history |

### Daily Summary Card

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| All Good | "Good morning! Your home performed well yesterday." + 5 green dots for S-C-O-R-E | Everything is within standards | Feel good; tap to expand for details |
| Mixed | "Good morning! A few things need attention." + mix of green/yellow/red dots + top insight preview | Some pillars have issues | Tap to expand; tap insight to see details |
| No Devices | Not shown — DailySummaryCard only appears when 1+ device is connected | N/A | N/A |
| Stale/Offline | "I haven't heard from your devices in a while. Check your connections." | Devices need attention | Tap → Device Hub to troubleshoot |

### SCORE Impact Simulator

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| Calculable | Animated bar: "Safety: 45 → 62 (+17)" with green delta | This action could improve their score by this amount | Motivated to take the action |
| Not Calculable | Not shown — simulator only appears when impact can be estimated | N/A | N/A |
| After Action | Bar shows new score: "Safety: 62 ✓" if reading improved | The action worked and improved their score | Feel accomplished |

---

## Pass 6: Flow Integrity

**Flow risks:**

| Risk | Where | Mitigation |
|------|-------|------------|
| User stuck in OAuth flow (browser doesn't redirect back) | Device Connection OAuth step | Show "Having trouble? Tap here to cancel and try again" link after 30 seconds. OAuth callback handler must handle timeout gracefully. |
| User doesn't know which device to connect first | Device Hub empty state | Show "Recommended for you" based on onboarding answers. If user said "comfort is a real issue," highlight thermostats first. |
| User connects device but doesn't understand dashboard changes | First device connection return to dashboard | Show one-time overlay: "Your [Device] is now feeding data to Pearl. Look for the [pillar] badge on your dashboard readings." Dismiss with "Got it." |
| User sees red reading and panics | DeviceReadingCard shows red value | Always pair red with actionable text. Never just show a red number. InsightCard must appear simultaneously explaining what to do. Coach tone: "I noticed" not "DANGER." |
| User takes action but reading doesn't immediately change | After one-tap action (e.g., set thermostat) | Show "Done! It may take a few minutes for your home to respond. I'll check back." Set delayed re-evaluation at next sync cycle. |
| User dismisses insight but condition persists | "Got it" dismissal on active threshold breach | If reading is still in red/yellow at next sync, regenerate the insight after 24 hours. Dismissal is a snooze, not a permanent silencer for active breaches. |
| User has device in another app but not discoverable via Pearl's OAuth | Device Hub brand selection | Clear "Supported Devices" list. For unsupported brands: "Don't see your device? We're adding more soon. [Request a device]" |
| User doesn't understand "Estimated" vs "Measured" | PillarDetailScreen showing mix of device data and estimates | First time user sees both: tooltip explaining the difference. "Estimated" badge is consistently gray; "Measured" badge is consistently teal throughout app. |
| User's device firmware updates break API connection | Background sync returns auth error | Auto-attempt token refresh. If refresh fails, show "Reconnect needed" on device card and in Device Hub. Don't delete device or historical data. |
| User navigates deep (Dashboard → Reading → Device Detail → Disconnect) and gets lost | Deep navigation stack | Every screen has back arrow. Device Hub is always accessible from Account tab. Dashboard is always one tab tap away. |
| User has multiple devices feeding same metric (e.g., 2 AirThings in different rooms) | DeviceReadingCard shows conflicting values | Show readings per room: "Living Room: 1.8 pCi/L" / "Bedroom: 2.1 pCi/L". Pillar score uses worst reading (conservative). Insight references the specific room. |
| Daily summary appears but user hasn't opened app in days | DailySummaryCard on return after long absence | Show summary for yesterday only. Don't backlog summaries. If devices were offline during absence: "Welcome back! Your devices have been offline. Let me catch up..." then sync. |

**Visibility decisions:**

**Must be visible:**
- Current reading values with color status (always on dashboard when devices connected)
- Pillar badge on every reading card (users must connect readings to SCORE framework)
- Sync timestamp on every reading ("Updated X min ago")
- Insight severity (color border is not enough; include icon + label)
- Action buttons on insight cards (must not require scrolling within card)
- Back button on every detail/sub screen
- "Estimated" vs "Measured" badges in Pillar Detail
- Device connection status (green/red dot) in Device Hub

**Can be implied:**
- Specific building science standard citations (show in expanded detail, not on cards)
- Trend calculation methodology (sparkline is enough; don't explain the math)
- API rate limit handling (invisible to user; sync just happens)
- Insight suppression logic (30-min sustained breach rule is invisible; user just sees relevant insights)
- Token refresh mechanics (invisible; connection just works or shows "Reconnect needed")
- Historical data storage limits (invisible unless they hit the limit)

**UX constraints (non-negotiable):**

1. **Every red reading must have a corresponding insight.** Never show a red number without explaining what it means and what to do. If the insight engine hasn't generated one yet, show "Analyzing..." rather than a naked red number.
2. **Coach voice on all insight text.** No "WARNING:" or "ALERT:" language. Always "I noticed..." or "Your home..." tone.
3. **Max 3 insights on dashboard.** More than 3 creates overwhelm and decision paralysis. Use "View All" for overflow.
4. **Max 5 reading cards on dashboard.** Same reasoning. Highest severity first.
5. **Never remove last known reading when device goes offline.** Show it grayed with staleness indicator. Removing data is worse than stale data.
6. **Threshold values are not user-configurable.** Pearl is the expert. Thresholds come from building science standards. No settings screen for "customize my thresholds."
7. **One-tap actions always show confirmation.** Never silently change a device setting. User must see that something happened.
8. **"Estimated" and "Measured" badges must use the same styling everywhere.** Gray for estimated, teal for measured. No exceptions.
9. **OAuth pre-explanation screen is mandatory.** Never dump the user into a third-party login without explaining what's about to happen and why.
10. **Device disconnection requires confirmation dialog.** "Disconnect [Device]? You'll stop receiving readings and insights for [metrics]." with Cancel/Disconnect buttons.

---

## Visual Specifications

### New Screens Required

1. **DeviceHubScreen** — Account tab → "Connected Devices"
   - Header: "Connected Devices" with "+" add button
   - Device list grouped by pillar section headers
   - Empty state with illustration and supported device list
   - Each device row: brand icon, name, room, status dot, last sync, chevron

2. **AirThingsConnectScreen** — Device Hub → Add → AirThings
   - Brand logo centered
   - "What Pearl will read" list with metric icons
   - "Pillars improved" row with pillar badges
   - "Connect AirThings" primary CTA
   - Pre-auth explanation text
   - Back button in header

3. **ThermostatConnectScreen** — Device Hub → Add → Thermostat
   - Brand selector: 3 logo cards (Nest, Ecobee, Honeywell)
   - Selected state shows brand-specific data list
   - Same pillar/CTA pattern as AirThings screen
   - Back button in header

4. **DeviceDetailScreen** — Tapped from reading card or device hub
   - Header: device name + brand icon + status dot
   - Current readings section with large values + status colors
   - 24h sparkline chart per metric (SVG paths)
   - Min/Max/Avg stats row
   - Threshold breach highlights with timestamps
   - "Disconnect Device" button at bottom (red, with confirmation)
   - Back button in header

5. **InsightHistoryScreen** — Dashboard "Pearl Says" → "View All"
   - Segmented tabs: Active | Resolved | All
   - Insight list with: date, pillar badge, severity icon, title, status
   - Resolved items show resolution detail
   - Back button in header

### New Components Required

1. **DeviceReadingCard** — Dashboard reading display
   - Layout: [Status dot] [Metric label] [Value + unit] [Trend arrow] [Pillar badge]
   - Below: "Updated X min ago" small text
   - Tappable → DeviceDetailScreen
   - Variants: normal, offline (grayed), stale (dimmed)

2. **InsightCard** — Dashboard recommendation
   - Layout: [Severity icon + Pillar badge] [Title] [Body text] [Action buttons] [Dismiss/Snooze]
   - Border color by severity: blue (info), yellow (attention), red (action)
   - Action buttons: icon + label, horizontally scrollable if >2
   - Variants: new (bold), read, action-in-progress, succeeded, failed

3. **DailySummaryCard** — Dashboard morning digest
   - Layout: [Coach greeting] [5 pillar dots S-C-O-R-E] [Top insight preview] [Key stat]
   - Tappable to expand full report
   - Only shown when 1+ device connected

4. **ScoreImpactSimulator** — Inline in recommendation cards
   - Layout: [Pillar name] [Current score bar] → [Projected score bar] [(+delta)]
   - Animated transition when appearing
   - Green highlight on delta

5. **DeviceConnectionCard** — Device Hub empty state / Add Device list
   - Layout: [Brand icon] [Device name] [Supported metrics] ["Connect" button]
   - "Recommended" badge variant based on onboarding answers

### Existing Components to Modify

1. **HomeScreen** — Add three new sections:
   - DailySummaryCard (top, above existing content, only when devices connected)
   - "Live Readings" section with DeviceReadingCards (after symptoms, before pillar overview)
   - "Pearl Says" section with InsightCards (after Live Readings, before pillar overview)

2. **PillarDetailScreen** — Add "Connected Devices" section:
   - Device coverage list showing measured vs. estimated problems
   - "Add a device" prompt for uncovered problems

3. **AccountScreen** — Add "Connected Devices" menu row:
   - Icon: hardware-chip-outline
   - Shows count: "3 devices"
   - Navigates to DeviceHubScreen

### Color System (extends existing theme)

| Token | Value | Usage |
|-------|-------|-------|
| `colors.statusGood` | #34C759 | Reading within standard |
| `colors.statusAttention` | #FF9500 | Approaching threshold |
| `colors.statusAction` | #FF3B30 | Exceeds threshold |
| `colors.statusOffline` | #8E8E93 | No data / device offline |
| `colors.badgeMeasured` | colors.accent (teal) | "Measured" data badge |
| `colors.badgeEstimated` | #8E8E93 | "Estimated" data badge |
| `colors.insightInfo` | #007AFF | Info severity insight border |
| `colors.insightAttention` | #FF9500 | Attention severity insight border |
| `colors.insightAction` | #FF3B30 | Action severity insight border |

### Navigation Additions

```
Account Tab
  └─ DeviceHubScreen
       ├─ AirThingsConnectScreen
       ├─ ThermostatConnectScreen
       └─ DeviceDetailScreen

Home Tab (modal pushes)
  └─ InsightHistoryScreen
  └─ DeviceDetailScreen (from reading card tap)
```
