# GardenCastle Phase 5 Design: Advanced Pests & Bosses

**Date:** 2026-05-16
**Status:** Pending Review

## 1. Overview
Phase 5 introduces enemy variety and meta-progression in difficulty. We move away from simple Aphid swarms toward specialist units that counter specific garden setups, culminating in a recurring Boss fight.

## 2. New Pest Entities
We utilize the **Specialist Class Approach** (Option 1) for modularity and clean AI logic.

### A. Iron-Clad Beetle (The Tank)
- **Mechanic:** High Damage Reduction (DR). Takes only 10% damage from basic seeds.
- **Behavior:** Slow movement, ignores knockback (if implemented later).
- **Goal:** Forces the player to have high-level offensive plants or focus-fire.

### B. Camo-Locust (The Stealth)
- **Mechanic:** `isTargetable = false`. 
- **Behavior:** Invisible to automated plants. They will fly past defenses directly to the objective.
- **Goal:** Forces manual player intervention (Clicking/Squishing).

### C. Regen-Slug (The Sustainer)
- **Mechanic:** Recovery + Life Steal.
- **Recovery:** Heals 1 HP/sec if not damaged for 2 seconds.
- **Life Steal:** When attached to a plant, heals 2 HP for every 1 damage dealt to the plant.
- **Goal:** Prevents "chip damage" from being effective; needs burst damage.

## 3. Wave Composition System
Replacing the fixed "+5 Aphids" with a dynamic **Wave Budget**.

### Budgeting
- **Aphid:** 1 pt
- **Slug:** 3 pts
- **Beetle:** 5 pts
- **Locust:** 8 pts

### Unlock Schedule
- **Wave 1-2:** 10-20 pts (Aphids only).
- **Wave 3-4:** 30-40 pts (Introduce Slugs).
- **Wave 5:** **BOSS WAVE** (Special).
- **Wave 6:** 60 pts (Introduce Beetles).
- **Wave 7-8:** 70-80 pts (Introduce Locusts).

## 4. Boss: Mutant Squirrel
Spawns at the end of every 5th wave once the budget is clear.

- **Stats:** 500 HP, high speed.
- **Defeat Mechanic (Option A: Stun & Chip):**
  - **Plant DPS:** Automated plants provide constant damage.
  - **Manual Stuns:** Clicking the Squirrel deals 10 damage and **stuns** it for 500ms.
  - **The Final Pop:** At 0 HP, it enters a "Dizzy" state. One final click is required to defeat it and spawn the loot.
- **Loot:** "Golden Seed" granting +50 RP instantly.

## 5. Technical Changes
- **`PestFactory.ts`:** New static class to handle instantiation of specific pest types based on string IDs.
- **`Pest.ts`:** Add `isTargetable`, `lastHitTime`, and `takeDamage(amount)` method.
- **`OffensivePlant.ts`:** Update targeting logic to filter for `p.isTargetable`.
- **`MainScene.ts`:** Implement wave budget logic and Boss spawn trigger.

## 6. Success Criteria
- [ ] Wave 3 successfully spawns a mix of Aphids and Slugs.
- [ ] Offensive plants ignore Camo-Locusts.
- [ ] Iron-Clad Beetles take significantly longer to kill than Aphids.
- [ ] Mutant Squirrel health bar is visible and manual stuns work.
