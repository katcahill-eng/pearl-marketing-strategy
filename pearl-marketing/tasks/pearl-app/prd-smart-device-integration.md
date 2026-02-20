# PRD: Smart Device Integration & Recommendation Engine

## Introduction

The Pearl Homeowner App currently relies on manually entered equipment data and estimated performance scores from public records. This feature transforms Pearl into a **living home performance dashboard** by connecting smart devices and monitoring tools, mapping their real-time data to Pearl's five SCORE pillars (Safety, Comfort, Operations, Resilience, Energy), and generating actionable recommendations grounded in the SCORE methodology.

Smart device integration is the key to daily app engagement. When Pearl can tell a homeowner "Your radon spiked overnight — open windows and check your mitigation system" or "Shift your EV charging to 1-3pm to use your solar production," the app becomes indispensable rather than a one-time setup.

This aligns directly with Pearl's stated methodology: Pearl "generates scientific knowledge through the analysis of data from bills, monitors, sensors, and other real-time measurement devices to generate high-resolution insights into what drives excellent home performance."

### Foundation: Pearl SCORE Methodology

Per the Pearl SCORE Methodology White Paper (V251106.02):

- Pearl SCORE evaluates over 150 high-performance features across 5 pillars
- Each pillar can score up to 300 points (50 base + 250 feature points)
- Points are assigned for: Threshold Eligibility, Feature Characteristics, and Installation Quality
- The SCORE is constructed around specific **problems** (Safety, Comfort, Operations, Resilience) and **opportunities** (Energy)
- Standards referenced include EPA Indoor Air Plus, ASHRAE 62.2-2022, ASHRAE 55, WELL Building Standard, IECC, ENERGY STAR, WaterSense, IBHS, FEMA, and DOE Solar Integration

Smart devices provide the **real-time measurement layer** that makes these pillar assessments dynamic rather than static estimates.

---

## Goals

- Connect smart home devices to the Pearl app with minimal user friction (one-tap where possible)
- Map device telemetry to specific SCORE pillar problems/opportunities as defined in the white paper
- Generate rule-based recommendations grounded in building science standards (EPA, ASHRAE, etc.)
- Surface actionable device adjustments that improve the homeowner's lived experience
- Increase daily app engagement by providing fresh, relevant insights from real device data
- Improve SCORE accuracy by replacing estimates with verified, real-time measurements
- Support a phased rollout: connect → insights → device control recommendations

---

## Phased Implementation

### Phase 1: Device Connection & Data Display
Connect to priority devices, ingest data, display readings mapped to SCORE pillars.

### Phase 2: Insight & Recommendation Engine
Analyze device data against SCORE methodology thresholds and generate actionable recommendations.

### Phase 3: Device Control Recommendations
Recommend specific device setting adjustments and (where APIs allow) enable one-tap actions from within Pearl.

---

## Priority Device Categories

### Tier 1 (Phase 1 launch)
| Category | Devices | Primary Pillar | Problems/Opportunities Addressed |
|----------|---------|---------------|----------------------------------|
| **Air Quality Monitors** | AirThings Wave Plus, AirThings View Plus, Awair Element, Awair Omni | Safety | PM2.5, CO2, radon, VOCs, humidity (mold risk) |
| **Smart Thermostats** | Google Nest, Ecobee, Honeywell Home | Comfort, Operations | Thermal comfort, HVAC runtime, energy efficiency, humidity |

### Tier 2 (Phase 2+)
| Category | Devices | Primary Pillar | Problems/Opportunities Addressed |
|----------|---------|---------------|----------------------------------|
| **Smart Smoke/CO Detectors** | Nest Protect, First Alert Onelink | Safety | CO exposure, combustion byproducts, fire safety |
| **Water Leak Sensors** | Flo by Moen, Phyn, Moen Smart Water Monitor | Safety, Resilience | Unsafe water, flood prevention, moisture/mold |
| **Whole-Home Energy Monitors** | Sense, Emporia Vue, Span Panel | Operations, Energy | Energy efficiency, consumption patterns, load management |

### Tier 3 (Phase 3+)
| Category | Devices | Primary Pillar | Problems/Opportunities Addressed |
|----------|---------|---------------|----------------------------------|
| **Solar Inverters** | Enphase, SolarEdge, Tesla | Energy | Generation capacity, grid interaction |
| **Battery Storage** | Tesla Powerwall, Enphase IQ | Energy, Resilience | Storage capacity, backup readiness, peak shaving |
| **EV Chargers** | ChargePoint, Wallbox, Tesla Wall Connector | Energy | EV charging capacity, smart scheduling |
| **Weather Stations** | Ambient Weather, WeatherFlow Tempest | Resilience | Extreme temperature monitoring, storm preparedness |

---

## Integration Architecture

**Hybrid approach** — optimized for user ease and data depth:

1. **Native API integrations** for Tier 1 devices (AirThings Cloud API, Ecobee API, Google Device Access API, Honeywell Home API) — these provide the most granular data for Safety and Comfort pillars
2. **Hub-based discovery** via SmartThings API and Apple HomeKit (where available) for Tier 2-3 devices — one connection covers many devices
3. **Device abstraction layer** — normalized data model so the app works identically regardless of whether data comes from native API or hub

### Connection Flow
```
User taps "Connect Devices" in Settings
    ↓
Pearl shows discovered device categories
    ↓
User selects device brand/hub
    ↓
OAuth flow → authorize Pearl to read device data
    ↓
Pearl confirms connection, shows which pillars benefit
    ↓
Data begins flowing to dashboard within 30 seconds
```

---

## User Stories

### Phase 1: Device Connection & Data Display

#### US-042: Create Device Connection hub screen
**Description:** As a homeowner, I want a central place to see all my connected devices and add new ones so I can manage my smart home connections in Pearl.

**Acceptance Criteria:**
- [ ] Create DeviceHubScreen in src/screens/
- [ ] Show list of connected devices grouped by pillar they impact
- [ ] Each device shows: name, type, connection status (connected/disconnected/syncing), last data received timestamp
- [ ] "Add Device" FAB or button at top
- [ ] Empty state with coach message: "Connect your smart devices and I'll show you what's really happening in your home."
- [ ] Accessible from Account tab under "Connected Devices"
- [ ] Add to navigation in AccountStack
- [ ] Typecheck passes

#### US-043: Create device connection flow for AirThings
**Description:** As a homeowner with an AirThings air quality monitor, I want to connect it to Pearl so Pearl can track my indoor air quality.

**Acceptance Criteria:**
- [ ] Create AirThingsConnectScreen in src/screens/devices/
- [ ] Show AirThings logo, brief description of what data Pearl will receive
- [ ] Display which pillars benefit: Safety (radon, PM2.5, CO2, VOCs), Comfort (humidity, temperature)
- [ ] "Connect AirThings" button launches OAuth2 flow via AirThings Cloud API
- [ ] Handle OAuth callback, store refresh token securely
- [ ] On success: show confirmation with device name and room assignment
- [ ] On failure: show error with retry option
- [ ] Create src/services/devices/airthings.ts service module
- [ ] Typecheck passes

#### US-044: Create device connection flow for smart thermostats
**Description:** As a homeowner with a smart thermostat, I want to connect it to Pearl so Pearl can understand my home's thermal comfort and HVAC efficiency.

**Acceptance Criteria:**
- [ ] Create ThermostatConnectScreen in src/screens/devices/
- [ ] Support three brands: Google Nest (Device Access API), Ecobee (API), Honeywell Home (API)
- [ ] Brand selector showing logos for each supported thermostat
- [ ] Display which pillars benefit: Comfort (temperature, humidity), Operations (HVAC runtime, efficiency)
- [ ] OAuth2 flow per selected brand
- [ ] Store refresh token securely per brand
- [ ] On success: show thermostat name, current temp reading, and connected status
- [ ] Create src/services/devices/thermostat.ts service module with brand adapters
- [ ] Typecheck passes

#### US-045: Create normalized device data model and storage
**Description:** As a developer, I need a unified data model that normalizes readings from different device brands so the app can process data consistently regardless of source.

**Acceptance Criteria:**
- [ ] Create src/models/DeviceData.ts with types:
  - `DeviceConnection`: id, type, brand, pillarMappings, status, lastSync
  - `DeviceReading`: deviceId, metric, value, unit, timestamp, pillar, problem
  - `MetricType` enum: 'radon' | 'pm25' | 'co2' | 'voc' | 'temperature' | 'humidity' | 'hvac_runtime' | 'energy_consumption' (extensible)
- [ ] Create src/context/DeviceContext.tsx to manage connected devices and latest readings
- [ ] Persist device connections and recent readings to AsyncStorage
- [ ] Provide useDevices() hook exposing: devices, readings, addDevice, removeDevice, getReadingsForPillar
- [ ] Typecheck passes

#### US-046: Create pillar-mapped device data cards for dashboard
**Description:** As a homeowner, I want to see my device readings on my home dashboard, organized by which SCORE pillar they impact so I understand how my home is performing right now.

**Acceptance Criteria:**
- [ ] Create DeviceReadingCard component in src/components/
- [ ] Card shows: metric name, current value with unit, trend arrow (up/down/stable vs. last 24h), pillar badge (Safety/Comfort/Operations/Resilience/Energy)
- [ ] Color-code readings: green (good/within standard), yellow (attention), red (action needed)
- [ ] Thresholds based on SCORE methodology standards:
  - Radon: green <2.0 pCi/L, yellow 2.0-3.9, red >=4.0 (EPA action level)
  - PM2.5: green <12 μg/m³, yellow 12-35, red >35 (EPA Air Quality Index)
  - CO2: green <800 ppm, yellow 800-1000, red >1000 (ASHRAE 62.2-2022)
  - VOCs: green <250 ppb, yellow 250-500, red >500
  - Humidity: green 30-50%, yellow 25-30% or 50-60%, red <25% or >60% (mold risk per EPA Indoor Air Plus)
  - Temperature: green 64-75°F, yellow 60-64 or 75-80, red <60 or >80 (ASHRAE 55)
- [ ] Integrate cards into HomeScreen dashboard in a "Live Readings" section
- [ ] Show "Connect a device" prompt card if no devices connected
- [ ] Typecheck passes

#### US-047: Create device detail screen with historical data
**Description:** As a homeowner, I want to see detailed readings from a specific device over time so I can understand trends and patterns.

**Acceptance Criteria:**
- [ ] Create DeviceDetailScreen in src/screens/devices/
- [ ] Show device info: brand, model, room, connection status, pillars impacted
- [ ] Display current readings for all metrics the device provides
- [ ] Show 24-hour sparkline chart for each metric (simplified line chart, no external charting library required — can use react-native-svg paths)
- [ ] Show min/max/average for last 24 hours
- [ ] Highlight any readings that exceeded thresholds with timestamp
- [ ] "Disconnect Device" option with confirmation
- [ ] Navigate here from DeviceReadingCard tap or DeviceHubScreen device tap
- [ ] Typecheck passes

#### US-048: Background data sync service
**Description:** As a developer, I need a service that periodically fetches latest readings from connected device APIs so the dashboard stays current.

**Acceptance Criteria:**
- [ ] Create src/services/DeviceSyncService.ts
- [ ] Poll connected device APIs on configurable interval (default: every 15 minutes for air quality, every 5 minutes for thermostat)
- [ ] Normalize responses into DeviceReading format regardless of brand
- [ ] Update DeviceContext with new readings
- [ ] Store last 48 hours of readings in AsyncStorage for offline access and trend display
- [ ] Handle API rate limits gracefully (exponential backoff)
- [ ] Handle token refresh for OAuth connections
- [ ] Log sync errors without crashing the app
- [ ] Typecheck passes

---

### Phase 2: Insight & Recommendation Engine

#### US-049: Create SCORE threshold rules engine
**Description:** As a developer, I need a rules engine that evaluates device readings against SCORE methodology thresholds and generates typed insight objects.

**Acceptance Criteria:**
- [ ] Create src/services/InsightEngine.ts
- [ ] Define rule interface: `{ metric: MetricType, pillar: Pillar, problem: string, thresholds: { green, yellow, red }, insightTemplates: { attention, action, resolved } }`
- [ ] Implement rules for all Tier 1 metrics mapped to SCORE methodology:
  - **Safety pillar rules:**
    - Radon ≥4.0 pCi/L → "Your radon level is above the EPA action level. Consider professional radon mitigation — this is the #1 cause of lung cancer among non-smokers."
    - PM2.5 >35 μg/m³ → "Particulate matter is high. Run your air purifier, check HVAC filter (MERV 13+ recommended per EPA Indoor Air Plus), and avoid activities that generate particles."
    - CO2 >1000 ppm → "CO2 is elevated, indicating poor ventilation. Open windows or check your mechanical ventilation system per ASHRAE 62.2-2022."
    - VOCs >500 ppb → "Volatile organic compounds are high. Increase ventilation and identify potential sources (new furniture, cleaning products, paint)."
    - Humidity >60% → "Humidity is in the mold risk zone. Run a dehumidifier to get below 50% per EPA Indoor Air Plus guidelines."
  - **Comfort pillar rules:**
    - Temperature outside 64-75°F → "Your home is outside the ASHRAE 55 thermal comfort range. [Specific adjustment based on thermostat data]."
    - Humidity <30% → "Low humidity can cause respiratory irritation and static. Consider a whole-house humidifier."
    - Zone temperature differential >5°F → "Your upstairs is significantly warmer than downstairs. This often indicates duct issues or insufficient insulation."
  - **Operations pillar rules:**
    - HVAC runtime >18 hours/day → "Your HVAC ran [X] hours yesterday — significantly above normal. Check filter, thermostat settings, and consider a professional inspection."
    - HVAC short cycling (>6 cycles/hour) → "Your system is short cycling, which wastes energy and reduces equipment life. This may indicate an oversized unit or airflow problem."
- [ ] Each generated insight includes: id, pillar, problem, severity (info/attention/action), title, body, recommended actions (array), relatedMetric, timestamp
- [ ] Typecheck passes

#### US-050: Create insight cards for dashboard
**Description:** As a homeowner, I want to see Pearl's recommendations based on my device data so I know what to do to improve my home's performance.

**Acceptance Criteria:**
- [ ] Create InsightCard component in src/components/
- [ ] Card shows: pillar badge, severity icon (info=blue, attention=yellow, action=red), title, body text (coach voice), list of recommended actions
- [ ] Each action is tappable with icon: "Adjust thermostat" / "Replace filter" / "Open windows" / "Call a Pearl Pro"
- [ ] Actions that map to device controls show device icon; actions that map to Pearl Pro show pro icon; actions that map to rebates show dollar icon
- [ ] Dismissable with "Got it" or "Remind me later" (snooze 24h)
- [ ] Add "Pearl Says" section to HomeScreen dashboard between Live Readings and Pillar Overview
- [ ] Show max 3 insight cards at a time, prioritized by severity (action > attention > info)
- [ ] If no active insights: "Everything looks good! I'll let you know if anything needs attention."
- [ ] Typecheck passes

#### US-051: Create pillar impact view showing device contribution
**Description:** As a homeowner, I want to understand how my connected devices are contributing to each SCORE pillar so I see the connection between my devices and my home's performance.

**Acceptance Criteria:**
- [ ] Update PillarDetailScreen to include a "Connected Devices" section when devices are linked to that pillar
- [ ] For each connected device, show: device name, what it's measuring, current reading with status color, how it maps to this pillar's problems
- [ ] Show which problems within the pillar have device coverage vs. which are still estimated
- [ ] Example for Safety pillar: "Air Quality (AirThings): Radon 1.8 pCi/L ✓ | PM2.5 8 μg/m³ ✓ | CO2 650 ppm ✓" + "Water Safety: No device connected — estimated from public records"
- [ ] "Add a device" prompt for pillar problems without device coverage
- [ ] Typecheck passes

#### US-052: Insight history and patterns
**Description:** As a homeowner, I want to see past insights and whether my actions resolved the issues so I can track my home's improvement over time.

**Acceptance Criteria:**
- [ ] Create InsightHistoryScreen in src/screens/
- [ ] List past insights grouped by: Active, Resolved (last 30 days), All History
- [ ] Each entry shows: date, pillar, severity at time, title, current status (active/resolved/dismissed)
- [ ] Resolved insights show what changed: "Resolved: Humidity dropped to 45% after you ran the dehumidifier"
- [ ] Accessible from "Pearl Says" section header on dashboard ("View All")
- [ ] Persist insight history in AsyncStorage (last 90 days for free tier, unlimited for paid)
- [ ] Typecheck passes

#### US-053: Time-based and pattern-based insight triggers
**Description:** As a developer, I need the insight engine to detect patterns over time, not just instantaneous threshold breaches, so recommendations are meaningful rather than noisy.

**Acceptance Criteria:**
- [ ] Add pattern detection to InsightEngine:
  - **Sustained breach**: Only trigger attention/action if a threshold is breached for >30 minutes (prevents transient spikes from generating noise)
  - **Recurring pattern**: "Your CO2 spikes every night between 11pm-6am" — detect repeated time-of-day patterns across 3+ days
  - **Trend detection**: "Your energy consumption has increased 20% week-over-week" — compare rolling 7-day averages
  - **Correlation**: "Your humidity rises when outdoor temp drops below 40°F" — cross-reference thermostat temp with humidity readings
- [ ] Pattern insights use different templates than threshold breaches (more analytical tone)
- [ ] Pattern detection runs on sync (every 15 minutes) against rolling 7-day data window
- [ ] Typecheck passes

---

### Phase 3: Device Control Recommendations

#### US-054: Create actionable thermostat recommendations
**Description:** As a homeowner, I want Pearl to recommend specific thermostat adjustments based on my comfort and efficiency data so I can improve my SCORE without guessing.

**Acceptance Criteria:**
- [ ] Create src/services/recommendations/ThermostatRecommendations.ts
- [ ] Generate recommendations based on thermostat + air quality data:
  - **Schedule optimization**: "Your HVAC runs heavily 6-8am but you leave at 7. Adjusting your schedule could save ~15% runtime."
  - **Temperature setback**: "Lowering your nighttime temp by 2°F could reduce HVAC runtime by ~10% with minimal comfort impact (still within ASHRAE 55 range)."
  - **Humidity coordination**: "Your humidity is 62%. Setting your thermostat to 'auto' mode with dehumidify could bring this into the safe range."
  - **Seasonal prep**: "Heating season is approaching. Your system ran X hours last winter — here's how to prepare."
- [ ] Each recommendation shows: estimated SCORE impact ("Could improve Operations by ~X points"), estimated cost savings (when calculable), effort level (easy/moderate/professional)
- [ ] Typecheck passes

#### US-055: Create actionable air quality recommendations
**Description:** As a homeowner, I want Pearl to recommend specific actions based on my air quality readings so I can improve my Safety pillar score and my family's health.

**Acceptance Criteria:**
- [ ] Create src/services/recommendations/AirQualityRecommendations.ts
- [ ] Generate recommendations mapped to Safety pillar problems:
  - **Ventilation**: "Your CO2 averages 1,100 ppm. Running your ERV for 2 hours/day could bring this below 800 ppm (ASHRAE 62.2-2022 compliant)."
  - **Filtration**: "PM2.5 is consistently above 15 μg/m³. Upgrading to MERV 13+ filters could earn points toward your Safety pillar (EPA Indoor Air Plus standard)."
  - **Radon mitigation**: "Your radon averages 3.5 pCi/L. While below the EPA action level (4.0), the WHO recommends below 2.7. A mitigation system could add Safety points."
  - **Moisture control**: "Humidity peaked at 68% three times this week. A dehumidifier in [room] would reduce mold risk and improve your Safety score."
  - **Source control**: "VOCs spike between 6-8pm (cooking hours). Running your range hood during cooking would reduce VOC exposure."
- [ ] Link recommendations to relevant rebates when available (e.g., "ERV installation — $500 rebate available in your area")
- [ ] Link recommendations to Pearl Pros when professional installation needed
- [ ] Typecheck passes

#### US-056: Create one-tap device adjustment actions
**Description:** As a homeowner, I want to act on Pearl's recommendations with a single tap when possible, rather than switching to another app to adjust my device.

**Acceptance Criteria:**
- [ ] Create src/services/DeviceControlService.ts
- [ ] For thermostats with write API access (Ecobee, Nest with Device Access):
  - "Set temperature to X°F" → one-tap executes API call
  - "Switch to Away mode" → one-tap
  - "Enable auto/dehumidify mode" → one-tap
- [ ] For devices without write access or where control is not possible:
  - Show step-by-step instructions with screenshots/illustrations for adjusting in the device's own app
  - Deep link to manufacturer's app when possible
- [ ] Each action shows confirmation: "Temperature set to 72°F ✓" or "Open the Ecobee app and navigate to..."
- [ ] Log all actions taken for insight resolution tracking (US-052)
- [ ] Handle API errors gracefully: "Couldn't reach your thermostat. Check your Wi-Fi connection."
- [ ] Typecheck passes

#### US-057: Create SCORE impact simulator
**Description:** As a homeowner, I want to see how a recommended action would impact my SCORE before I take it, so I'm motivated to make improvements.

**Acceptance Criteria:**
- [ ] Create ScoreImpactSimulator component in src/components/
- [ ] Shows current pillar score → projected pillar score after action
- [ ] Visual: animated score bar with delta highlight (e.g., "Safety: 45 → 62 (+17)")
- [ ] Calculations based on SCORE methodology:
  - Connecting an air quality monitor and achieving good readings → reflects in Safety pillar feature points
  - Maintaining HVAC efficiency metrics → reflects in Operations pillar
  - Adding battery backup → reflects in both Energy and Resilience pillars
- [ ] Show on recommendation cards when SCORE impact is calculable
- [ ] Include note: "Estimated impact based on Pearl SCORE methodology. Actual points may vary."
- [ ] Typecheck passes

#### US-058: Create daily home performance summary
**Description:** As a homeowner, I want a daily summary of my home's performance across all pillars so I have a reason to check Pearl every day.

**Acceptance Criteria:**
- [ ] Create DailySummaryCard component in src/components/
- [ ] Shows at top of HomeScreen dashboard each morning (refreshes at 6am local time)
- [ ] Content includes:
  - Overall status: "Your home performed well yesterday" / "A few things need attention"
  - Per-pillar mini status: 5 colored dots (green/yellow/red) for S-C-O-R-E
  - Top insight of the day (highest severity unresolved insight)
  - Key stat: "Your HVAC ran X hours" or "Air quality averaged Y PM2.5"
- [ ] Tappable to expand into full daily report with all metrics
- [ ] Coach voice: "Good morning! Here's how your home did overnight."
- [ ] Typecheck passes

---

## Functional Requirements

- FR-1: Support OAuth2 device connections for AirThings, Google Nest, Ecobee, and Honeywell Home APIs
- FR-2: Normalize all device readings into a unified DeviceReading data model regardless of brand or source
- FR-3: Map every device metric to its corresponding SCORE pillar and specific problem/opportunity
- FR-4: Color-code all readings against thresholds derived from building science standards (EPA, ASHRAE, WELL)
- FR-5: Store device connections and 48 hours of readings locally for offline access
- FR-6: Sync device data at configurable intervals (5-15 minutes depending on device type)
- FR-7: Generate rule-based insights when readings breach SCORE methodology thresholds
- FR-8: Suppress transient threshold breaches (<30 minutes) to reduce notification noise
- FR-9: Detect recurring patterns across 3+ days and generate pattern-based insights
- FR-10: Display max 3 active insights on dashboard, prioritized by severity
- FR-11: Allow insight dismissal with "Got it" or snooze (24h)
- FR-12: Track insight history with resolution status for 90 days
- FR-13: Generate thermostat-specific adjustment recommendations with estimated SCORE impact
- FR-14: Generate air quality-specific action recommendations linked to rebates and Pearl Pros
- FR-15: Support one-tap device control for APIs with write access (Ecobee, Nest)
- FR-16: Fall back to step-by-step instructions and deep links for read-only device APIs
- FR-17: Show projected SCORE impact before and after recommended actions
- FR-18: Generate daily performance summary refreshed each morning

---

## Non-Goals (Out of Scope)

- **Custom device integrations** — No support for Z-Wave/Zigbee direct device pairing; only cloud API and hub-based connections
- **Real-time streaming** — Polling-based sync only; no WebSocket or MQTT real-time feeds in v1
- **Device purchase/installation** — Pearl does not sell or install devices; recommendations link to affiliate partners and Pearl Pros
- **Automated device control** — No autonomous actions without user confirmation; Pearl recommends, the user decides
- **Multi-home support** — Single home per account in this version
- **Historical data import** — Only data from point of connection forward; no backfilling from device manufacturer's historical data
- **Modification of SCORE algorithm** — This feature surfaces insights from the existing methodology; it does not change how SCORE points are calculated
- **Push notifications** — Notification delivery is a separate feature; this PRD covers in-app insights only

---

## Design Considerations

### Coach Voice
All insights and recommendations use Pearl's coach voice established in the onboarding flow:
- Warm, knowledgeable, not alarmist
- "I noticed..." not "WARNING:"
- Always pairs a problem with an action: "Here's what's happening → Here's what you can do"
- Connects to the SCORE framework: "This affects your Safety pillar because..."

### Existing Components to Reuse
- `Card.tsx` — base card wrapper
- `PillarCard.tsx` — pillar status display
- `CoachPromptCard.tsx` — invitation-style cards for device connection
- `AlertCard.tsx` — severity-based alert display
- `FactorCard.tsx` — helping/hurting factor display
- `EquipmentList.tsx` — device list patterns
- `useTheme()` — consistent styling

### Color System for Device Readings
| Status | Color | Meaning |
|--------|-------|---------|
| Green | #34C759 | Within standard — no action needed |
| Yellow | #FF9500 | Attention — approaching threshold |
| Red | #FF3B30 | Action needed — exceeds standard |
| Gray | #8E8E93 | No data / device offline |

---

## Technical Considerations

### API Dependencies
| Device | API | Auth | Rate Limits | Data Available |
|--------|-----|------|-------------|----------------|
| AirThings | AirThings Cloud API v1 | OAuth2 | 120 req/hour | Radon, CO2, VOCs, PM2.5, humidity, temp, pressure |
| Google Nest | Device Access API (SDM) | OAuth2 + $5 dev fee | 10 req/min | Temp, humidity, HVAC status, mode, fan |
| Ecobee | Ecobee API v1 | OAuth2 (PIN-based) | 3 req/min per thermostat | Temp, humidity, HVAC runtime, occupancy, remote sensors |
| Honeywell Home | Honeywell Home API | OAuth2 | Varies | Temp, humidity, setpoint, mode, fan |
| SmartThings | SmartThings API | OAuth2 | 250 req/day | Varies by connected device |

### Key Dependencies
- `@react-native-async-storage/async-storage` — MUST be added to package.json (currently missing)
- `expo-auth-session` — for OAuth2 flows
- `expo-secure-store` — for storing OAuth refresh tokens
- `react-native-svg` — already installed, needed for sparkline charts
- `expo-linking` — for deep links to manufacturer apps

### Data Storage Strategy
- **Device connections**: AsyncStorage (encrypted tokens in SecureStore)
- **Recent readings** (48h): AsyncStorage with rolling window cleanup
- **Insight history** (90 days): AsyncStorage with date-based pruning
- **Future**: Sync to Pearl backend API when available (not in scope for this PRD)

### Performance
- Device sync runs in background at intervals (not continuous)
- Insight engine evaluates on each sync cycle — lightweight rule evaluation, not ML inference
- Dashboard renders max 3 insight cards + 5 device reading cards to avoid scroll fatigue
- AsyncStorage reads are cached in DeviceContext to avoid repeated disk access

---

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Device connection rate | >30% of active users connect 1+ device within 30 days | Core engagement driver |
| Daily active users (DAU) | 2x increase vs. pre-device baseline | Daily insights create daily reasons to open |
| Insight engagement rate | >50% of insights tapped/expanded | Insights must be relevant and actionable |
| Action completion rate | >25% of recommended actions marked complete | Recommendations must be practical |
| Device retention (30-day) | >80% of connected devices remain connected | Connection must be stable and valuable |
| SCORE accuracy improvement | Pillar scores for connected users are 15%+ more precise than estimate-only users | Real data replaces estimates |
| Recommendations per user per week | 3-5 insights generated | Enough to engage without overwhelming |

---

## Open Questions

1. **API costs**: Google Device Access API requires a $5 one-time developer fee and has strict rate limits. Does Pearl have or need a Google Cloud project with Device Access?
2. **Ecobee PIN-based auth**: Ecobee uses a PIN-based OAuth flow (not redirect-based). How does this work in a mobile app context?
3. **Backend sync**: When the Pearl backend API is available, should device data sync to the server for cross-device access and more sophisticated analysis?
4. **Paid tier gating**: Should device connections be free or paid-tier only? The v3 PRD lists it as paid, but connection count could be gated (e.g., 1 device free, unlimited paid).
5. **SCORE recalculation**: When device data contradicts public record estimates (e.g., actual HVAC efficiency measured vs. estimated), should the displayed SCORE update in real-time or only on official recalculation?
6. **Data privacy**: What data sharing consent is needed? Device data stays on-device in v1, but future backend sync needs clear privacy policy language.
7. **SmartThings vs. HomeKit**: For hub-based integration, which platform has better API access for residential IoT? SmartThings has a public API; HomeKit requires Apple developer program integration.
