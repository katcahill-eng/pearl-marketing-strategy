# PRD: Equipment Lifecycle Tracking

## Introduction

Add a real data persistence layer for home equipment and build lifecycle tracking features. Currently the equipment screens (entry, detail, list) exist but display hardcoded mock data with no persistence. This feature adds an EquipmentContext with AsyncStorage, wires up the entry/detail screens to real data, adds replacement cost estimates, equipment aging notifications, and lifecycle insights in the Energy/Operations pillars. Equipment lifecycle tracking is a paid-tier feature.

## Goals

- Create EquipmentContext with AsyncStorage persistence so equipment data survives app restarts
- Wire existing EquipmentEntryScreen to save/update real equipment records
- Wire existing EquipmentDetailScreen and MyHomeScreen to read from context instead of mocks
- Add replacement cost estimates per equipment type
- Add equipment aging notifications via the existing push notification system
- Generate Operations/Energy pillar insights from equipment lifecycle data
- Gate lifecycle tracking features (aging alerts, cost estimates, rebate matching) behind paid tier

## User Stories

### US-086: Equipment context with AsyncStorage persistence
**Description:** As a developer, I need a context provider that stores equipment records so data persists across sessions.

**Acceptance Criteria:**
- [ ] Create EquipmentContext in src/context/EquipmentContext.tsx
- [ ] State includes: equipment array (EquipmentItem[]), isLoaded boolean
- [ ] Provides: addEquipment, updateEquipment, deleteEquipment, getEquipmentById functions
- [ ] Persist to AsyncStorage under @pearl_equipment with Date-safe serialization
- [ ] Export EquipmentProvider and useEquipment hook
- [ ] Add to src/context/index.ts barrel exports
- [ ] Add EquipmentProvider to App.tsx provider chain (before DeviceProvider)
- [ ] Typecheck passes

### US-087: Wire EquipmentEntryScreen to save real data
**Description:** As a user, I want my equipment entries to actually save so I can see them later.

**Acceptance Criteria:**
- [ ] EquipmentEntryScreen calls useEquipment().addEquipment on save (new) or updateEquipment (edit)
- [ ] Generates a unique ID for new equipment (equip_{timestamp})
- [ ] Calculates status using existing calculateEquipmentStatus function from components
- [ ] Sets estimatedLifespan from getTypicalLifespan if user doesn't specify
- [ ] After save, navigates back (onSave callback)
- [ ] When equipmentId prop is provided, loads existing equipment from context for editing
- [ ] Typecheck passes

### US-088: Wire MyHomeScreen to display real equipment from context
**Description:** As a user, I want to see my actual saved equipment on the My Home screen instead of mock data.

**Acceptance Criteria:**
- [ ] MyHomeScreen reads equipment from useEquipment() instead of MOCK_EQUIPMENT constant
- [ ] Remove MOCK_EQUIPMENT hardcoded array
- [ ] Empty state shown when no equipment added (using existing EquipmentList empty state)
- [ ] Equipment count badge updates dynamically
- [ ] Typecheck passes

### US-089: Wire EquipmentDetailScreen to read from context
**Description:** As a user, I want to see real data on the equipment detail screen with working edit and delete.

**Acceptance Criteria:**
- [ ] EquipmentDetailScreen reads equipment from useEquipment().getEquipmentById instead of mock lookup
- [ ] Remove MOCK_EQUIPMENT_DATA hardcoded object
- [ ] Delete button calls useEquipment().deleteEquipment and navigates back
- [ ] Edit button navigates to EquipmentEntry with equipmentId param
- [ ] Shows "Equipment not found" error state if ID doesn't match any record
- [ ] Typecheck passes

### US-090: Replacement cost estimates
**Description:** As a user, I want to see estimated replacement costs for my aging equipment so I can budget ahead.

**Acceptance Criteria:**
- [ ] Add REPLACEMENT_COST_ESTIMATES constant: Record<EquipmentType, { low: number; high: number; label: string }>
- [ ] Values: hvac $8000-15000, waterHeater $1200-3000, insulation $1500-5000, windows $5000-15000, solar $15000-30000, appliance $500-3000, lighting $200-1000, other $500-5000
- [ ] Add cost estimate card to EquipmentDetailScreen when status is 'aging' or 'replaceSoon'
- [ ] Card shows range (e.g. "$8,000 – $15,000") with equipment type label
- [ ] Export REPLACEMENT_COST_ESTIMATES from components barrel
- [ ] Typecheck passes

### US-091: Equipment aging notification trigger
**Description:** As a user, I want to receive push notifications when my equipment is approaching end-of-life.

**Acceptance Criteria:**
- [ ] Create checkEquipmentAging function in src/services/EquipmentAgingService.ts
- [ ] Reads equipment from AsyncStorage @pearl_equipment (runs in background sync context)
- [ ] For equipment with status 'aging': generate notification "Your {name} is {age} years old. Typical lifespan is {lifespan} years."
- [ ] For equipment with status 'replaceSoon': generate notification "Your {name} may need replacement soon. Check available rebates."
- [ ] Dedup: one notification per equipment per 30 days via @pearl_equipment_aging_notified
- [ ] Respect notification preferences (equipment_aging category maps to existing categories)
- [ ] Add to services barrel exports
- [ ] Call from BackgroundSyncService task alongside maintenance/seasonal checks
- [ ] Typecheck passes

### US-092: Equipment lifecycle insights in InsightEngine
**Description:** As a user, I want my equipment status to generate insights on the dashboard.

**Acceptance Criteria:**
- [ ] Add generateEquipmentInsights(equipment: EquipmentItem[]) function to InsightEngine
- [ ] 'replaceSoon' equipment → 'action' severity insight with title like "Time to plan a {type} replacement"
- [ ] 'aging' equipment → 'attention' severity insight with title like "Your {name} is getting older"
- [ ] Each insight includes suggested actions: check rebates (type: 'rebate'), find Pearl Pro (type: 'pearl_pro')
- [ ] Insights map to 'operations' pillar for HVAC/waterHeater, 'energy' for solar/lighting
- [ ] Export from services barrel
- [ ] Typecheck passes

### US-093: Premium gate for lifecycle features
**Description:** As a free-tier user, I want to see basic equipment info but lifecycle tracking details are gated.

**Acceptance Criteria:**
- [ ] EquipmentDetailScreen checks @pearl_is_premium flag
- [ ] When not premium: hide lifespan progress bar, replacement cost card, and rebate cards
- [ ] Show a small "Upgrade for lifecycle tracking" banner in their place with tap to show PremiumGate overlay
- [ ] Equipment list and basic info (name, type, brand) always visible on free tier
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Persist equipment array to AsyncStorage under @pearl_equipment
- FR-2: EquipmentEntryScreen saves new records and updates existing ones in context
- FR-3: MyHomeScreen displays real equipment from context, not mock data
- FR-4: EquipmentDetailScreen reads from context with working edit/delete
- FR-5: Replacement cost estimates displayed for aging/replaceSoon equipment
- FR-6: Equipment aging notifications trigger via background sync (30-day dedup)
- FR-7: Equipment status generates Operations/Energy pillar insights
- FR-8: Lifecycle features (lifespan bar, costs, rebates) gated behind paid tier

## Non-Goals

- No real rebate API integration (continue using mock rebate data)
- No equipment photo storage (placeholder remains)
- No equipment sharing or export
- No automatic equipment detection from smart devices
- No warranty tracking (deferred to Documents feature)

## Technical Considerations

- EquipmentContext follows existing context pattern (createContext, Provider, useHook, AsyncStorage, isLoaded gate)
- Equipment aging service runs alongside MaintenanceScheduler and SeasonalTipService in BackgroundSyncService
- Premium gate reuses existing PremiumGate component and @pearl_is_premium flag
- Must remove mock data from MyHomeScreen and EquipmentDetailScreen without breaking existing navigation flow
- calculateEquipmentStatus and getTypicalLifespan already exist in EquipmentList component — reuse them

## Success Metrics

- Equipment persists across app restarts
- Users can add, edit, and delete equipment
- Aging notifications arrive for equipment past 60% lifespan
- Equipment insights appear on dashboard for aging/replaceSoon items

## Open Questions

- Should we seed demo equipment for new users to demonstrate the feature?
- Should equipment data export to the Documents feature when it's built?
