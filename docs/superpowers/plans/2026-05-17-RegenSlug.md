# Regen-Slug Implementation & Life Steal Refactor Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor pest damage logic to be handled by pests instead of plants, and implement the Regen-Slug with recovery and life-steal abilities.

**Architecture:** 
1. Move damage dealing from `ObjectivePlant` to the `Pest` base class. 
2. Introduce `damageRate` in `Pest`.
3. Create `RegenSlug` which overrides `update` to implement health recovery and life-steal (healing based on damage dealt).

**Tech Stack:** TypeScript, Phaser 3, Jest (Testing)

---

### Task 1: Refactor Damage Logic (Pest & Plant)

**Files:**
- Modify: `src/game/entities/Pest.ts`
- Modify: `src/game/entities/Plant.ts`
- Modify: `src/game/entities/ObjectivePlant.ts`

- [ ] **Step 1: Add damageRate to Pest and update its logic**
  Update `src/game/entities/Pest.ts` to include `damageRate` and deal damage to `targetPlant` in `update`.
  
  ```typescript
  // src/game/entities/Pest.ts
  export abstract class Pest ... {
    public damageRate: number = 0.01;
    // ...
    update(time: number, delta: number) {
      if (this.isAttached) {
        if (this.targetPlant) {
          this.targetPlant.takeDamage(this.damageRate * delta);
        }
        return;
      }
      // ... movement logic
    }
  }
  ```

- [ ] **Step 2: Update Plant to set targetPlant on Pest**
  Update `src/game/entities/Plant.ts` to set `pest.targetPlant` when attaching.

  ```typescript
  // src/game/entities/Plant.ts
  public attachPest(pest: Pest) {
    if (!this.attachedPests.includes(pest)) {
      this.attachedPests.push(pest);
      pest.isAttached = true;
      pest.targetPlant = this; // <--- Add this
      // ... rest
    }
  }
  ```

- [ ] **Step 3: Remove damage logic from ObjectivePlant**
  Update `src/game/entities/ObjectivePlant.ts` to stop dealing damage to itself.

- [ ] **Step 4: Verify with existing tests**
  Run: `npm test src/game/entities/__tests__/PestBase.test.ts`
  Expected: PASS

### Task 2: Implement RegenSlug (TDD)

**Files:**
- Create: `src/game/entities/RegenSlug.ts`
- Create: `src/game/entities/__tests__/RegenSlug.test.ts`

- [ ] **Step 1: Write failing tests for RegenSlug**
  Test recovery after delay and life steal when attached.

- [ ] **Step 2: Run tests to verify they fail**
  Run: `npm test src/game/entities/__tests__/RegenSlug.test.ts`
  Expected: FAIL (missing class)

- [ ] **Step 3: Implement RegenSlug**
  Inherit from `Pest`, implement `update` with recovery and life-steal logic.

- [ ] **Step 4: Run tests to verify they pass**
  Run: `npm test src/game/entities/__tests__/RegenSlug.test.ts`
  Expected: PASS

- [ ] **Step 5: Final Verification**
  Run: `npm test`
  Expected: PASS (0 failures)
