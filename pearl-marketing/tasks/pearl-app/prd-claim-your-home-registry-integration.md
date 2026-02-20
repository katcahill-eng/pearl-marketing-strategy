# PRD: Claim Your Home — Pearl Registry Integration

## Introduction

When a homeowner searches for their address in the Pearl app, they should be able to **claim ownership** of that home — linking their app account to the home's record in the Pearl Home Performance Registry (registry.pearlscore.com). Today, the registry and app are completely disconnected: claiming in one has no effect on the other, data doesn't sync, and the registry's claim UX uses score-focused messaging that doesn't align with the app's value proposition ("understand your home, improve your life in it").

This PRD scopes the **app-side claim flow** with a mock registry API. It defines the full API contract so the registry team can implement their side in parallel, but the app will ship with mock responses until the real integration is ready.

## Goals

- Let users claim home ownership directly from the Pearl app (AddressEntryScreen or MyHomeScreen)
- Define a clean API contract between app and registry backend for future real integration
- Support document-based ownership verification (utility bill, closing docs, tax record)
- Handle ownership transfer when a home is already claimed by a previous owner
- Pre-fill app data from registry when a registry user downloads the app (score, features, equipment, climate risk — everything available)
- Use the new value prop messaging throughout ("understand your home") — not score-improvement messaging
- Show consistent "Claimed" status in the app, ready for registry parity later

## User Stories

### US-001: Define Registry API contract and mock service
**Description:** As a developer, I need a typed API contract and mock service so the app can be built against registry endpoints before the real backend exists.

**Acceptance Criteria:**
- [ ] Create `src/services/RegistryApiService.ts` with typed interfaces for all endpoints
- [ ] Endpoints: `lookupHome(address)`, `claimHome(homeId, userId, verificationDoc)`, `getClaimStatus(homeId)`, `getHomeData(homeId)`, `transferOwnership(homeId, newUserId, verificationDoc)`, `syncAppData(homeId, appData)`
- [ ] Create `src/services/MockRegistryService.ts` implementing all endpoints with realistic mock data
- [ ] Response types include: `RegistryHome`, `ClaimStatus`, `RegistryHomeData` (score, pillars, features, equipment, climate risk, energy projections, neighborhood comparisons)
- [ ] Mock latency of 300-800ms to simulate real API
- [ ] Export from `src/services/index.ts`
- [ ] Typecheck passes

### US-002: Registry home lookup on address selection
**Description:** As a homeowner, when I select my address in AddressEntryScreen, I want to see whether this home exists in the Pearl Registry and its current claim status, so I know what to expect.

**Acceptance Criteria:**
- [ ] After address selection (globe zoom completes), call `lookupHome(address)`
- [ ] Show registry status card below selected address: "Found in Pearl Registry" with Pearl SCORE badge, or "Not yet in registry" if not found
- [ ] If home is unclaimed: show "Claim This Home" CTA button (teal, prominent)
- [ ] If home is claimed by current user: show "Claimed" badge with checkmark
- [ ] If home is claimed by someone else: show "This home has been claimed" with "Are you the new owner?" link
- [ ] Loading state while registry lookup is in progress
- [ ] Graceful fallback if registry API is unavailable (proceed without claim, show retry later)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Document upload for ownership verification
**Description:** As a homeowner claiming my home, I need to upload a document proving I own it (utility bill, closing docs, or tax record) so Pearl can verify my ownership.

**Acceptance Criteria:**
- [ ] Create `src/screens/OwnershipVerificationScreen.tsx`
- [ ] Screen shows 3 document type options: "Utility Bill", "Closing Documents", "Property Tax Record"
- [ ] Each option launches `expo-image-picker` (camera or photo library) — reuse pattern from BillCaptureScreen
- [ ] Show photo preview after capture with "Retake" and "Submit" buttons
- [ ] Guidance text: "Upload a clear photo of one of the following documents showing your name and this address"
- [ ] On submit: call `claimHome(homeId, userId, verificationDoc)` with document URI and type
- [ ] Show loading state during submission ("Verifying ownership...")
- [ ] On success: navigate to claim confirmation screen
- [ ] On failure: show error with retry option
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Claim confirmation and data import
**Description:** As a homeowner who just claimed my home, I want to see what Pearl already knows about it and have that data pre-fill my app profile, so I don't have to re-enter everything.

**Acceptance Criteria:**
- [ ] Create `src/screens/ClaimConfirmationScreen.tsx`
- [ ] Celebration moment: "Your home is now claimed!" with teal checkmark animation
- [ ] Show summary card of imported data: Pearl SCORE, pillar breakdown, known equipment, home features
- [ ] Display "What Pearl already knows" section listing verified features (HVAC type, insulation, solar, year built, etc.)
- [ ] "What you can add" section showing what's missing (equipment photos, device connections, assessments)
- [ ] "Continue to My Home" button that navigates to MyHomeScreen
- [ ] On navigation: registry data is merged into local app state (equipment, score, pillar data)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Ownership transfer flow
**Description:** As a new homeowner, when I try to claim a home that's already claimed by the previous owner, I want to transfer ownership to myself so I can manage my home in Pearl.

**Acceptance Criteria:**
- [ ] When `lookupHome` returns `claimedByOther` status, show "This home was claimed by a previous owner" message
- [ ] "I'm the new owner" button opens OwnershipVerificationScreen (same doc upload flow)
- [ ] Transfer request calls `transferOwnership(homeId, newUserId, verificationDoc)`
- [ ] Mock service simulates: immediate transfer for utility bill, 24h pending for other docs
- [ ] Pending state: "Ownership transfer in progress" badge on MyHomeScreen
- [ ] On transfer complete: previous owner's claim is removed, new owner gets full access
- [ ] Previous owner's personal data (symptoms, notes) is NOT transferred — only home feature data
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Claim status on MyHomeScreen
**Description:** As a homeowner, I want to see my home's claim status on MyHomeScreen so I know whether my home is connected to the Pearl Registry.

**Acceptance Criteria:**
- [ ] Add claim status badge below ScoreDisplay on MyHomeScreen
- [ ] Unclaimed: "Claim on Pearl Registry" teal link/CTA that navigates to claim flow
- [ ] Claimed: "Pearl Registry" badge with house icon and checkmark (subtle, not dominant)
- [ ] Pending transfer: "Transfer pending" amber badge
- [ ] Tapping claimed badge navigates to a registry detail view showing sync status
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Registry data model and local storage
**Description:** As a developer, I need a data model for registry home data and a way to persist it locally so claimed home data survives app restarts.

**Acceptance Criteria:**
- [ ] Create `src/models/RegistryHome.ts` with types: `RegistryHome`, `ClaimStatus` ('unclaimed' | 'claimed' | 'claimed_by_other' | 'transfer_pending'), `RegistryHomeData`, `VerificationDocument`
- [ ] `RegistryHomeData` includes: score, pillarScores, verifiedFeatures, knownEquipment, climateRisk, energyProjections, neighborhoodComparisons
- [ ] Create `src/context/RegistryContext.tsx` with provider and hook `useRegistry()`
- [ ] State persisted in AsyncStorage under `@pearl_registry_home`
- [ ] Provides: `claimStatus`, `registryData`, `claimHome()`, `transferOwnership()`, `syncData()`
- [ ] Export from `src/context/index.ts` and `src/models/index.ts`
- [ ] Typecheck passes

### US-008: App → Registry data sync (outbound)
**Description:** As a homeowner, when I add equipment, complete assessments, or connect devices in the app, I want that data to sync back to the registry so my registry profile stays current.

**Acceptance Criteria:**
- [ ] After claiming, equipment additions trigger `syncAppData(homeId, { equipment })` call
- [ ] Assessment completions trigger `syncAppData(homeId, { completedAssessments })` call
- [ ] Device connection events trigger `syncAppData(homeId, { connectedDevices })` call
- [ ] Sync is fire-and-forget (non-blocking) — failures logged but don't disrupt app UX
- [ ] Sync debounced (batch changes, sync at most every 30 seconds)
- [ ] Mock service logs sync calls for development visibility
- [ ] Typecheck passes

### US-009: Navigation wiring
**Description:** As a developer, I need all new screens wired into the navigation stack so users can reach them.

**Acceptance Criteria:**
- [ ] Add to RootStackParamList: `OwnershipVerification`, `ClaimConfirmation`, `RegistryDetail`
- [ ] Wire OwnershipVerificationScreen in RootNavigator
- [ ] Wire ClaimConfirmationScreen in RootNavigator
- [ ] AddressEntryScreen "Claim This Home" button navigates to OwnershipVerification
- [ ] MyHomeScreen claim badge navigates appropriately based on status
- [ ] Back navigation works correctly from all new screens
- [ ] Typecheck passes

## Functional Requirements

- FR-1: The app must look up a home's registry status when the user selects an address
- FR-2: The app must allow users to claim an unclaimed home by uploading a verification document (utility bill, closing docs, or tax record)
- FR-3: The app must show a photo preview of the uploaded verification document before submission
- FR-4: On successful claim, the app must import all available registry data (score, pillars, features, equipment, climate risk, energy projections, neighborhood data) into local state
- FR-5: The app must handle the case where a home is already claimed by showing an ownership transfer flow
- FR-6: Ownership transfer must require the same document verification as initial claiming
- FR-7: The app must NOT transfer personal data (symptoms, logged notes) from previous owner — only home feature data
- FR-8: The app must display claim status on MyHomeScreen (unclaimed CTA, claimed badge, or pending transfer badge)
- FR-9: The app must sync equipment additions, assessment completions, and device connections back to the registry (non-blocking, debounced)
- FR-10: All registry API calls must gracefully handle failures without disrupting the core app experience
- FR-11: The app must use messaging aligned with "understand your home, improve your life" — not score-improvement framing
- FR-12: The mock registry service must simulate realistic latency (300-800ms) and return comprehensive test data

## Non-Goals

- Registry backend changes (this is app-side only; API contract is defined for the registry team to implement)
- Real ownership verification logic (mock service auto-approves; real verification is a registry backend concern)
- Real-time push sync from registry → app (app fetches on launch; no WebSocket)
- Multi-owner support (one owner per home in v1; co-owners are a future feature)
- Registry web UI changes (the registry team owns their UX separately)
- Automated ownership verification via Plaid or public records API (future enhancement)
- Displaying full registry data within the app (imported data populates existing app screens, not a separate registry view)

## Design Considerations

- **OwnershipVerificationScreen** should feel secure but not bureaucratic — use the same camera UI pattern as BillCaptureScreen
- **ClaimConfirmationScreen** should feel celebratory — this is a milestone moment. Use Pearl teal accent, checkmark animation, and positive messaging ("Welcome home!")
- **Claim status badge** on MyHomeScreen should be subtle when claimed (small house+checkmark icon) and prominent when unclaimed (teal CTA to drive conversion)
- **Messaging throughout:** "Claim your home to unlock everything Pearl knows about it" — NOT "Claim your home to improve your score"
- Reuse existing components: Button, Card, the expo-image-picker pattern from BillCaptureScreen

## Technical Considerations

- **API contract first:** `RegistryApiService.ts` defines the interface; `MockRegistryService.ts` implements it. When real API is ready, swap the implementation without changing any UI code.
- **AsyncStorage for persistence:** Registry claim state stored under `@pearl_registry_home` key. On app launch, hydrate from storage, then background-refresh from API.
- **Context pattern:** Follow existing patterns (useEquipment, useDevices, etc.) for the new `useRegistry()` hook.
- **Data merge strategy:** Registry data fills empty fields but does NOT overwrite user-entered data. User's manual entries are treated as higher-trust than registry synthetic data.
- **Privacy boundary:** App sends to registry: equipment specs, assessment IDs, device types. App does NOT send: symptoms, notes, personal preferences.
- **Image upload:** Verification documents stored locally (URI) in v1. Real implementation will need secure upload endpoint.
- **Deep linking (future):** The API contract should support a `claimToken` that the registry can embed in "Download the app" links, enabling automatic account linking. Not implemented in v1 but designed for.

## Success Metrics

- Users who search an address see registry status within 1 second
- 60%+ of users who see "Claim This Home" tap the button
- Claim flow completes in under 2 minutes (address → document → confirmation)
- 90%+ of imported registry data correctly pre-fills app screens
- Zero claim-related crashes or blocking errors (graceful degradation)

## Open Questions

1. What does the registry backend team need from us to start building their side of the API? Timeline?
2. What is the real ownership verification process? Does Pearl's legal team have requirements?
3. Should "Claim Your Home" be gated behind account creation, or can anonymous users start the flow?
4. How should the app handle homes that don't exist in the registry at all (new construction, missing from public records)?
5. What happens to the claim when a home is sold — does the real estate transaction data automatically trigger a transfer, or is it always manual?
6. Should the registry team update their "Claim My Home" web messaging to align with the app's value prop simultaneously?
7. What is the expected latency/availability SLA for the registry API?
8. **Postcard verification (v2?):** Should we add a Google Business-style flow where Pearl mails a postcard with a secret code to the home's address? Stronger verification than document upload, but adds 5-7 day latency and requires a mailing backend. Could be offered as an alternative when users don't have a utility bill handy. (Feedback from Kat C. — current registry claim only asks a few questions with no document proof, which isn't enough security.)
9. The current registry "Claim My Home" web flow has no document verification at all — just questions. The app now has stricter verification (document photo). Should the registry web flow adopt the same standard, or will the two platforms have different verification levels?
