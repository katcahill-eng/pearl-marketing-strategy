# PRD: Utility Bill Photo Analysis & Tracking

## Introduction

Add utility bill photo capture and analysis to the Pearl app so homeowners can track their energy usage over time, identify anomalies, and receive actionable insights. Users photograph their utility bill, Pearl extracts usage data via a mock OCR service (v1), and the app provides month-over-month and year-over-year comparisons with anomaly detection. This is a paid-tier feature that directly addresses the #1 homeowner question: "Why is my energy bill so high?"

## Goals

- Allow users to photograph utility bills and extract usage data (mock OCR for v1)
- Track energy usage month-over-month and year-over-year
- Detect usage anomalies (spikes >20% compared to same month prior year or prior month)
- Generate Energy pillar insights from utility bill data via the existing InsightEngine
- Provide clear visualizations of usage trends and cost history
- Gate feature behind paid tier with appropriate upgrade prompts for free users

## User Stories

### US-077: Utility bill data model and context
**Description:** As a developer, I need data types and a context provider for utility bill records so the app can store and manage bill history.

**Acceptance Criteria:**
- [ ] Create `UtilityBill` interface with fields: id, provider, billingPeriodStart, billingPeriodEnd, usageKwh, costCents, photoUri, extractedAt, createdAt
- [ ] Create `UtilityBillContextValue` with bills array, addBill, updateBill, deleteBill, getBillsByYear
- [ ] Create UtilityBillContext with provider, useUtilityBills hook, AsyncStorage persistence (@pearl_utility_bills)
- [ ] Add to context barrel exports
- [ ] Typecheck passes

### US-078: Mock OCR extraction service
**Description:** As a developer, I need a mock OCR service that simulates extracting usage data from a bill photo so the feature works without a real backend.

**Acceptance Criteria:**
- [ ] Create `MockOcrService.ts` in src/services/
- [ ] `extractBillData(photoUri: string)` returns a Promise resolving after 1.5s delay with mock extracted data
- [ ] Mock data includes: provider name, billing period dates, usage in kWh, cost in cents
- [ ] Generates realistic seasonal variation (higher in summer/winter, lower in spring/fall)
- [ ] Add to services barrel exports
- [ ] Typecheck passes

### US-079: Bill capture screen with photo picker
**Description:** As a user, I want to photograph my utility bill so Pearl can extract my usage data.

**Acceptance Criteria:**
- [ ] Install expo-image-picker
- [ ] Create `BillCaptureScreen` with camera and gallery options
- [ ] Show photo preview after capture with "Extract Data" button
- [ ] Call MockOcrService on submit, show loading state during extraction
- [ ] Display extracted data (provider, period, usage, cost) for user confirmation
- [ ] "Confirm & Save" saves to UtilityBillContext and navigates to BillDetail
- [ ] "Retake" returns to capture state
- [ ] Back button in header returns to previous screen
- [ ] Typecheck passes

### US-080: Bill detail screen
**Description:** As a user, I want to see the details of a single utility bill including the extracted data and how it compares to previous periods.

**Acceptance Criteria:**
- [ ] Create `BillDetailScreen` with route param `billId`
- [ ] Display bill photo thumbnail, provider, billing period, usage (kWh), cost ($)
- [ ] Show comparison cards: vs. prior month (% change) and vs. same month last year (% change)
- [ ] Color-code comparisons: green for decrease, red for increase, gray for no data
- [ ] Show "No comparison available" when insufficient history
- [ ] Back button in header
- [ ] Delete bill option with confirmation dialog
- [ ] Typecheck passes

### US-081: Bill history screen with usage chart
**Description:** As a user, I want to see my utility bill history with a visual chart so I can spot trends over time.

**Acceptance Criteria:**
- [ ] Create `BillHistoryScreen` showing all bills grouped by year
- [ ] Display a simple bar chart of monthly usage (kWh) using View-based bars (no chart library)
- [ ] Each bar is proportional to max usage in the displayed year, colored by status (green/yellow/red based on anomaly)
- [ ] Below chart, list bills as tappable rows showing month, usage, cost, and % change vs prior month
- [ ] Empty state when no bills exist with prompt to add first bill
- [ ] FAB or header button to add new bill (navigates to BillCapture)
- [ ] Tap row navigates to BillDetail
- [ ] Year picker to switch between years
- [ ] Typecheck passes

### US-082: Utility bill anomaly detection
**Description:** As a developer, I need an anomaly detection service that evaluates utility bill data and generates insights for unusual usage patterns.

**Acceptance Criteria:**
- [ ] Create `BillAnalysisService.ts` in src/services/
- [ ] `analyzeBills(bills: UtilityBill[])` returns anomaly insights
- [ ] Detect spike >20% vs same month prior year → 'action' severity insight
- [ ] Detect spike >15% vs prior month (seasonal-adjusted) → 'attention' severity insight
- [ ] Detect sustained decrease >10% over 3 months → 'info' (positive) insight
- [ ] Each insight includes title, body, and suggested actions (check equipment, schedule audit, etc.)
- [ ] Add to services barrel exports
- [ ] Typecheck passes

### US-083: Energy pillar integration
**Description:** As a user, I want my utility bill data to improve my Energy pillar score and generate insights on the dashboard.

**Acceptance Criteria:**
- [ ] Add `utility_usage` and `utility_cost` to MetricType union
- [ ] Add thresholds for utility_usage in METRIC_THRESHOLDS (green: 0-30 kWh/day, yellow: 30-50, red: 50+)
- [ ] Add InsightEngine rule for energy anomalies detected by BillAnalysisService
- [ ] Energy pillar status on HomeScreen reflects utility bill data when available
- [ ] Dashboard "Pearl Says" section shows utility bill anomaly insights
- [ ] Typecheck passes

### US-084: Navigation wiring and account integration
**Description:** As a user, I want to access utility bill features from the dashboard energy coach prompt and from the Account/My Home screens.

**Acceptance Criteria:**
- [ ] Add BillCapture, BillDetail, BillHistory routes to RootNavigator with param types
- [ ] Wire HomeScreen `onAddUtilityBill` callback to navigate to BillCapture
- [ ] Add "Utility Bills" row to MyHomeScreen or Account screen with bill count and navigation to BillHistory
- [ ] Wrap BillCaptureScreen, BillDetailScreen, BillHistoryScreen in navigator wrappers
- [ ] Wire UtilityBillProvider into App.tsx provider chain
- [ ] Typecheck passes

### US-085: Paid tier gate and upgrade prompt
**Description:** As a free-tier user, I want to see what utility bill analysis offers so I'm motivated to upgrade, but I can't access the full feature.

**Acceptance Criteria:**
- [ ] BillCapture and BillHistory screens check subscription status (mock: use AsyncStorage flag @pearl_is_premium, default true for demo)
- [ ] When not premium, show upgrade prompt overlay instead of bill capture UI
- [ ] Upgrade prompt shows feature benefits (track usage, detect anomalies, save money) and "Upgrade" button (logs to console for v1)
- [ ] HomeScreen energy coach prompt still visible to free users but tapping shows upgrade prompt
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Add `UtilityBill` type with id, provider, billingPeriodStart/End, usageKwh, costCents, photoUri, extractedAt, createdAt
- FR-2: Persist utility bills to AsyncStorage under `@pearl_utility_bills`
- FR-3: Mock OCR extracts provider, billing period, usage, and cost from bill photo with realistic seasonal variation
- FR-4: Bill capture uses expo-image-picker for camera and gallery access
- FR-5: Bill detail shows extracted data with month-over-month and year-over-year comparisons
- FR-6: Bill history displays simple bar chart (View-based) of monthly usage grouped by year
- FR-7: Anomaly detection flags >20% YoY spike as 'action' and >15% MoM spike as 'attention'
- FR-8: Utility bill insights appear in Energy pillar and dashboard "Pearl Says" section
- FR-9: Feature gated behind paid tier with upgrade prompt for free users
- FR-10: Navigation from HomeScreen energy coach prompt, and Account/MyHome screen to bill history

## Non-Goals

- No real OCR/ML integration (mock service for v1)
- No account-connected utility provider integration
- No gas/water bill support (electricity only for v1)
- No bill image text rendering or annotation
- No export or sharing of bill data
- No regional utility rate comparison
- No real payment/subscription integration (mock premium flag)

## Technical Considerations

- Use `expo-image-picker` for photo capture (camera + gallery)
- Mock OCR with 1.5s delay to simulate processing, returns randomized-but-realistic data
- View-based bar chart avoids adding a chart library dependency
- UtilityBillContext follows existing context pattern (AsyncStorage, load/save effects, barrel exports)
- Anomaly detection runs on bill add/update and on app foreground
- Premium gate uses AsyncStorage boolean flag (swappable for real subscription check later)

## Success Metrics

- Users can capture and save a utility bill in under 30 seconds
- Bill history chart clearly shows usage trends at a glance
- Anomaly insights trigger within 1 second of bill confirmation
- Energy pillar score updates to reflect utility bill data

## Open Questions

- Should we support manual bill entry (type in values) as fallback when photo doesn't work?
- Should anomaly notifications integrate with the push notification system built in US-062–076?
- What thresholds best represent "similar homes" for benchmarking (deferred to v2)?
