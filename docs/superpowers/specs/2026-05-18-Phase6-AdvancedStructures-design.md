# Phase 6: Advanced Structures & Tools Design Specification

**Date:** 2026-05-18  
**Status:** Draft  
**Topic:** Hardware expansion, Durability, and Soil Anchoring.

## 1. Overview
Phase 6 introduces "Hardware" structures to GardenCastle. These are non-biological entities that provide defense, automation, and offense. Unlike plants, they do not count towards the 12-plant garden limit but are governed by cost and strict soil anchoring requirements.

## 2. Core Mechanics

### 2.1 The Structure Base Class
A new `Structure` class (extending `Phaser.Physics.Arcade.Sprite`) will be introduced.
- **Properties:**
  - `durability: number`: Total health/uses before destruction.
  - `maxDurability: number`: The starting value.
  - `anchorSoil: string`: The required soil type (e.g., 'rocks', 'ash').
  - `isBroken: boolean`: True if durability reaches 0.
- **Methods:**
  - `takeDamage(amount: number)`: Reduces durability.
  - `onBreak()`: Handles removal and visual feedback (cracking/sparks).

### 2.2 Durability & Maintenance
Structures are designed to wear out rather than grow.
- **Friction-Based Wear:** Utility structures (Sprinkler/Zapper) lose a set amount of durability per "activation".
- **Pest Wear:** Any physical contact from a pest (overlapping the structure's hit-box) reduces durability over time.
- **Pathfinding:** Pests will treat "Blocking" structures (Walls) as targets if they cannot path around them to a plant.

### 2.3 The Anchor System
Placement is restricted by soil type. The `MainScene.handlePlanting` logic must be updated to:
1. Detect if a structure is being placed.
2. Check the `EnvironmentManager.soilType` at the target grid square.
3. Reject placement if the soil doesn't match the structure's `anchorSoil`.

## 3. The Initial Toolset

### 3.1 Stone Wall
- **Type:** Defensive (Barrier)
- **Anchor:** 'rocks'
- **Durability:** 200 (High)
- **Effect:** Solid physics body that blocks pest movement.
- **Visuals:** Grey stone block. Develops cracks at 66% and 33% durability.

### 3.2 Auto-Sprinkler
- **Type:** Utility (Hydration)
- **Anchor:** 'dirt' or 'sand'
- **Durability:** 50 uses.
- **Effect:** Fires once every 10 seconds. Restores 20% hydration to all plants in a 3x3 grid around it.
- **Visuals:** Rotating nozzle. Blue water particle ring when firing.

### 3.3 Copper Zapper
- **Type:** Offensive (Kill-zone)
- **Anchor:** 'ash'
- **Durability:** 100 hits.
- **Effect:** Automatically zaps the nearest pest within a 2-grid range (80px). High damage, but loses 1 durability per shot.
- **Visuals:** Metallic pole with a glass orb. Blue electrical arc to target.

## 4. UI & Controls
- **Toggle Mode:** Use the 'B' key (Build) to toggle between Planting Mode and Building Mode. A UI text indicator should appear (e.g., "BUILD MODE") when active.
- **Hover Stats:** Showing the Durability bar instead of HP/Water/Light stats when hovering over a structure.
- **Cost Display:** Structures will be added to the `researchTrees.ts` under a new 'Hardware' branch. 
  - *Stone Wall:* 100 RP
  - *Auto-Sprinkler:* 250 RP
  - *Copper Zapper:* 500 RP

## 5. Technical Considerations
- **Layering:** Structures should render behind plants (or at the same depth) but must not overlap plants on the same grid square.
- **Persistence:** Structure state (durability) should be saved if the game supports mid-run saves in the future.
- **Audio:** Unique SFX for "Thud" (Wall), "Whir" (Sprinkler), and "Zap" (Zapper).

## 6. Testing Strategy
- **Unit Tests:**
  - Verify placement rejection on wrong soil.
  - Verify durability depletion on activation/contact.
  - Verify destruction logic.
- **Integration Tests:**
  - Ensure walls successfully block pest physics.
  - Ensure sprinklers correctly target adjacent plant entities.
