# GardenCastle Phase 4 Design Specification: Evolution Trees & Career Research

**Date:** 2026-05-15
**Project:** GardenCastle
**Topic:** Phase 4 - Progression & Meta-Systems

## 1. Overview
Phase 4 introduces the "Career" layer to GardenCastle. Players earn Research Points (RP) during waves based on their gardening efficiency and plant management. These points are spent between waves in the Evolution Hub to unlock new plants, upgrade tools, and improve global stats through strictly linear research trees.

## 2. Research Points (RP) & Harvest Mechanics

### 2.1 The Harvest Formula
At the end of each wave, every surviving plant is "harvested" to generate RP. The yield is calculated using the following multi-factor formula:

`Total RP = Σ ([Base RP] + [Health Bonus]) * [Difficulty Multiplier] * [Density Multiplier]`

- **Base RP:**
  - Objective: 50 RP
  - Defensive: 20 RP
  - Offensive: 10 RP
- **Health Bonus:** `(Current Health / Max Health) * 10`. Reward players for keeping plants pristine.
- **Difficulty Multiplier:** 1.0 (Easy) to 5.0 (Insane).
- **Density Multiplier ("Whimsical Density"):**
  - **Symbiotic (e.g., Sunflower):** `1.0 + (Count * 0.1)` (Bonuses for grouping).
  - **Competitive (e.g., Venus Chainsaw):** `1.0 / (Count * 0.5)` (Penalties for overcrowding).
  - **Soloists:** `1.0` (Fixed).

### 2.2 Harvest Flow
1. **Wave Clear:** The `MainScene` triggers the `ResearchManager`.
2. **Calculation:** The manager iterates through all surviving `Plant` entities.
3. **Summary UI:** A breakdown of RP earned per species, highlighting density bonuses/penalties.
4. **Storage:** RP is added to the persistent `CareerStore`.

## 3. Evolution Trees (Meta-Progression)

### 3.1 Structure
Evolution Trees are **strictly linear**. Tier N+1 cannot be purchased until Tier N is unlocked.

### 3.2 Core Trees
- **Water Tree:** Manual Sprayer -> Garden Hose -> Automated Irrigation.
- **Tool Tree:** Shovel (Basic) -> Heavy Shovel (Stun) -> Steam Shovel (AOE).
- **Biology Tree:** Unlocks new Offensive/Defensive plant species for mid-wave purchase.

### 3.3 "Unlock then Buy"
Researching a plant node does not grant it for free. It adds the plant to the player's **Available Loadout**, allowing it to be purchased with "Seeds" (in-game currency) during the Tactical Wave.

## 4. Career Persistence

### 4.1 Data Model (`CareerState`)
- `totalRP`: Lifetime RP balance.
- `unlockedNodes`: List of IDs representing purchased research.
- `stats`:
  - `pestsPopped`: Total count.
  - `plantsHarvested`: Total count.
  - `highestDifficultyCleared`: Difficulty level.

### 4.2 Storage
The state is managed via Zustand and persisted to `localStorage`.

## 5. UI Components

### 5.1 Evolution Hub
A dedicated React screen/overlay between waves:
- **Tree View:** Visual representation of the linear paths.
- **Purchase Logic:** Handles RP deduction and state updates.
- **Stats Dashboard:** Displays the player's lifetime achievements.

### 5.2 Harvest Summary
A post-wave tactical report showing the RP breakdown.

## 6. Testing Strategy
- **Unit Tests:** Verify the RP calculation formula with various plant counts, health levels, and difficulty settings.
- **Store Tests:** Ensure `localStorage` persistence and linear unlock logic.
- **Integration Tests:** Confirm `MainScene` correctly filters available plants based on career unlocks.
