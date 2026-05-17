# Phase 5: Advanced Pests & Bosses Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement specialist pests (Beetle, Locust, Slug), a dynamic wave budget system, and the first boss (Mutant Squirrel).

**Architecture:** Use the Specialist Class Approach for enemies. Extend the `Pest` base class with hook methods for damage reduction, stealth, and regeneration. Implement a `PestFactory` for decoupled spawning and a budget-based wave manager in `MainScene`.

**Tech Stack:** TypeScript, Phaser 3, Vitest, Zustand.

---

### Task 1: Constants & Base Pest Enhancements

**Files:**
- Modify: `src/game/constants.ts`
- Modify: `src/game/entities/Pest.ts`
- Test: `src/game/entities/__tests__/PestBase.test.ts`

- [ ] **Step 1: Update Constants**
Add PEST_TYPES, budgets, and specific stats for new enemies.

```typescript
export const PEST_CONSTANTS = {
  // ... existing
  TYPES: {
    APHID: 'aphid',
    BEETLE: 'beetle',
    SLUG: 'slug',
    LOCUST: 'locust',
    BOSS_SQUIRREL: 'boss_squirrel'
  },
  BUDGETS: {
    aphid: 1,
    slug: 3,
    beetle: 5,
    locust: 8
  },
  BEETLE: {
    DR: 0.1, // 10% damage taken
    HEALTH: 50,
    SPEED: 30
  },
  SLUG: {
    REGEN_DELAY: 2000,
    REGEN_RATE: 1, // HP per second
    LIFE_STEAL_MULT: 2.0,
    HEALTH: 30,
    SPEED: 40
  },
  BOSS: {
    HEALTH: 500,
    STUN_DURATION: 500,
    CLICK_DAMAGE: 10,
    LOOT_RP: 50
  }
};
```

- [ ] **Step 2: Enhance Pest Base Class**
Add `isTargetable`, `lastHitTime`, and `takeDamage` hook.

```typescript
export abstract class Pest extends Phaser.Physics.Arcade.Sprite {
  public health: number = 10;
  public maxHealth: number = 10;
  public speed: number = 50;
  public isAttached: boolean = false;
  public isTargetable: boolean = true;
  protected lastHitTime: number = 0;
  // ...
  public takeDamage(amount: number) {
    this.health -= amount;
    this.lastHitTime = this.scene.time.now;
    if (this.health <= 0) this.die();
  }
  protected die() {
    this.scene.events.emit('pest-squished', this.x, this.y);
    this.destroy();
  }
}
```

- [ ] **Step 3: Commit**
`git commit -m "feat: enhance Pest base class and constants"`

---

### Task 2: Iron-Clad Beetle Implementation (TDD)

**Files:**
- Create: `src/game/entities/IronCladBeetle.ts`
- Test: `src/game/entities/__tests__/IronCladBeetle.test.ts`

- [ ] **Step 1: Write failing test for Damage Reduction**
```typescript
it('should reduce incoming damage by 90%', () => {
  const beetle = new IronCladBeetle(mockScene, 0, 0);
  beetle.takeDamage(10);
  expect(beetle.health).toBe(beetle.maxHealth - 1);
});
```
- [ ] **Step 2: Implement IronCladBeetle**
- [ ] **Step 3: Verify tests and commit**
`git commit -m "feat: add IronCladBeetle with damage reduction"`

---

### Task 3: Regen-Slug Implementation (TDD)

**Files:**
- Create: `src/game/entities/RegenSlug.ts`
- Test: `src/game/entities/__tests__/RegenSlug.test.ts`

- [ ] **Step 1: Write failing test for Regeneration**
Verify health increases after 2 seconds of no damage.
- [ ] **Step 2: Write failing test for Life Steal**
Verify slug heals when dealing damage to a plant.
- [ ] **Step 3: Implement RegenSlug**
- [ ] **Step 4: Verify tests and commit**
`git commit -m "feat: add RegenSlug with recovery and life steal"`

---

### Task 4: Camo-Locust & Targeting Fix

**Files:**
- Create: `src/game/entities/CamoLocust.ts`
- Modify: `src/game/entities/OffensivePlant.ts`
- Test: `src/game/entities/__tests__/OffensivePlantTargeting.test.ts`

- [ ] **Step 1: Implement CamoLocust with `isTargetable = false`**
- [ ] **Step 2: Update OffensivePlant targeting**
```typescript
const targetablePests = pests.filter(p => p.isTargetable);
// ... find nearest in targetablePests
```
- [ ] **Step 3: Verify that plants ignore locusts and commit**
`git commit -m "feat: add CamoLocust and update plant targeting"`

---

### Task 5: Pest Factory & Wave Budgeting

**Files:**
- Create: `src/game/managers/PestFactory.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Create PestFactory**
Static method `createPest(type, scene, x, y)` returning the correct instance.
- [ ] **Step 2: Implement Budget logic in MainScene**
Replace `pestsToSpawn` count with `waveBudget`.
```typescript
private generateWave() {
  let currentBudget = this.calculateBudgetForWave(this.waveNumber);
  const allowedTypes = this.getAvailablePests(this.waveNumber);
  while (currentBudget > 0) {
    const type = Phaser.Utils.Array.GetRandom(allowedTypes);
    this.spawnQueue.push(type);
    currentBudget -= PEST_CONSTANTS.BUDGETS[type];
  }
}
```
- [ ] **Step 3: Commit**
`git commit -m "feat: implement dynamic wave budget and pest factory"`

---

### Task 6: Mutant Squirrel Boss

**Files:**
- Create: `src/game/entities/BossSquirrel.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Create BossSquirrel entity**
Implement `onPointerDown` for manual stuns and damage. Add a simple health bar using Graphics.
- [ ] **Step 2: Trigger Boss at Wave 5**
- [ ] **Step 3: Implement Boss Loot (Golden Seed)**
- [ ] **Step 4: Final verification and commit**
`git commit -m "feat: add Mutant Squirrel boss and victory loot"`
