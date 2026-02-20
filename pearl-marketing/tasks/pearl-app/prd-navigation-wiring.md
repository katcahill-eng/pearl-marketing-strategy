# PRD: Screen Navigation Wiring

## Introduction/Overview

Multiple screens have navigation handlers stubbed with console.log instead of actual navigation. This feature wires up all remaining navigation paths so users can flow between screens: MyHomeScreen pillar/score/badge taps, AccountScreen menu items, and PillarDetailScreen equipment taps.

## User Stories

### US-119: Wire MyHomeScreen navigation callbacks
Add onPillarPress and onScorePress props, wire in BottomTabNavigator.

### US-120: Wire AccountScreen navigation callbacks
Add onDocumentsPress, onLogout, onHelpPress props, wire in BottomTabNavigator.

### US-121: Wire PillarDetailScreen equipment taps
Navigate to EquipmentDetail when equipment is tapped in PillarDetailScreen.
