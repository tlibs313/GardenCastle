# Conversation Log: GardenCastle Initial Brainstorming
**Date:** 2026-05-11
**Participants:** User & Gemini CLI

## Overview
This session focused on the initial discovery, brainstorming, and design of "GardenCastle," a browser-based, high-fidelity tower defense game with roguelike elements.

## Key Discussion Points

### 1. Genre & Core Loop
- **Decision:** A "Static Action-TD" where the player (The Gardener) uses a mouse to aim tools and manage a central castle.
- **Victory Condition:** Growing specific "Objective Plants" to target levels while defending against pests.
- **Inspiration:** *Mech Assemble* (modular upgrades) and *Bloons TD* (varied enemy properties).

### 2. The "Three Pillars" Plant System
- **Objective Plants:** Non-offensive, provide boosts/harvest rewards.
- **Defensive/Complimentary:** Provide utility, shields, and growth synergy.
- **Offensive:** Primary pest-killers.

### 3. Environmental & Soil Mechanics
- **Soil Selection:** Player chooses a permanent starting soil (Dirt, Sand, Rocks, Ash) which sets the baseline growth difficulty.
- **Spatial Strategy:** Garden shape and placement in the yard affect pathing and synergy.
- **Growth Factors:** Time, manual feeding, synergy, and soil additives (Bone Meal, Nitrogen).

### 4. Progression & Research
- **Evolution Trees:** Linear research paths for Water, Soil, Tools, and Mutations.
- **Career System:** Persistent user profiles for tracking research and long-term stats.

### 5. Threats & Aesthetic
- **Pest Roster:** Insects (Armored, Camo, Regen, Cluster) and Yard Marauders (Squirrels, Rabbits, Crows, Moles, Groundhogs, Raccoons).
- **Chaos System:** Random weather events and wildcard boss pests.
- **Aesthetic:** "Whimsical Splatter"—cute characters meeting high-detail, gory ends.

## Technical Decisions
- **Stack:** React + TypeScript + Phaser 3.
- **Persistence:** Node.js/Express backend with a database for Career progress.
- **Visuals:** 60fps animations with rich particle effects for pest destruction.

## Artifacts Created
- Design Specification: `docs/superpowers/specs/2026-05-11-GardenCastle-design.md`
- Implementation Plan (Phase 1): `docs/superpowers/plans/2026-05-11-GardenCastle-Phase1.md`
- Brainstorming Archive: `docs/superpowers/brainstorming-archive-2026-05-11.md`

---
*End of Log*
