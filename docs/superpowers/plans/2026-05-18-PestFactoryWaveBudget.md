# Pest Factory & Wave Budgeting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize pest creation and implement a point-based wave budget system.

**Architecture:** Use a static `PestFactory` for pest instantiation and a budget-based queue system in `MainScene` to manage wave progression.

**Tech Stack:** TypeScript, Phaser 3

---

### Task 1: Update Constants

**Files:**
- Modify: `src/game/constants.ts`

- [ ] **Step 1: Add Locust stats and ensure budgets are defined**

```typescript
export const PEST_CONSTANTS = {
  // ... existing types
  BUDGETS: {
    aphid: 1,
    slug: 3,
    beetle: 5,
    locust: 8
  },
  BEETLE: {
    DR: 0.1,
    HEALTH: 50,
    SPEED: 30
  },
  SLUG: {
    REGEN_DELAY: 2000,
    REGEN_RATE: 1,
    LIFE_STEAL_MULT: 2.0,
    HEALTH: 30,
    SPEED: 40
  },
  LOCUST: {
    HEALTH: 5,
    SPEED: 80
  },
  // ...
};
```

- [ ] **Step 2: Update CamoLocust to use constants**
- Modify: `src/game/entities/CamoLocust.ts`

```typescript
import { PEST_CONSTANTS } from '../constants';
// ...
    this.health = PEST_CONSTANTS.LOCUST.HEALTH;
    this.maxHealth = PEST_CONSTANTS.LOCUST.HEALTH;
    this.speed = PEST_CONSTANTS.LOCUST.SPEED;
// ...
```

### Task 2: Create Pest Factory

**Files:**
- Create: `src/game/managers/PestFactory.ts`

- [ ] **Step 1: Implement PestFactory**

```typescript
import Phaser from 'phaser';
import { PEST_CONSTANTS } from '../constants';
import { Pest } from '../entities/Pest';
import { Aphid } from '../entities/Aphid';
import { IronCladBeetle } from '../entities/IronCladBeetle';
import { RegenSlug } from '../entities/RegenSlug';
import { CamoLocust } from '../entities/CamoLocust';

export class PestFactory {
  public static createPest(type: string, scene: Phaser.Scene, x: number, y: number): Pest {
    switch (type) {
      case PEST_CONSTANTS.TYPES.BEETLE:
        return new IronCladBeetle(scene, x, y);
      case PEST_CONSTANTS.TYPES.SLUG:
        return new RegenSlug(scene, x, y);
      case PEST_CONSTANTS.TYPES.LOCUST:
        return new CamoLocust(scene, x, y);
      case PEST_CONSTANTS.TYPES.APHID:
      default:
        return new Aphid(scene, x, y);
    }
  }
}
```

### Task 3: Update MainScene Preload

**Files:**
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Add texture placeholders for new pests**

```typescript
    // Beetle placeholder (Square)
    graphics.fillStyle(0x888888, 1);
    graphics.fillRect(0, 0, 24, 24);
    graphics.generateTexture('beetle-placeholder', 24, 24);
    graphics.clear();

    // Slug placeholder (Rectangle)
    graphics.fillStyle(0x9933ff, 1);
    graphics.fillRect(0, 0, 30, 15);
    graphics.generateTexture('slug-placeholder', 30, 15);
    graphics.clear();

    // Locust placeholder (Triangle)
    graphics.fillStyle(0x55ff55, 1);
    graphics.fillTriangle(10, 0, 0, 20, 20, 20);
    graphics.generateTexture('locust-placeholder', 20, 20);
    graphics.clear();
```

- [ ] **Step 2: Update pest entities to use these textures (if they don't already)**
- `Aphid.ts` already uses `aphid-placeholder`.
- `IronCladBeetle.ts` should use `beetle-placeholder`.
- `RegenSlug.ts` should use `slug-placeholder`.
- `CamoLocust.ts` should use `locust-placeholder`.

### Task 4: Implement Wave Budgeting in MainScene

**Files:**
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Add wave state variables**

```typescript
  private waveNumber: number = 1;
  private spawnQueue: string[] = [];
  // pestsToSpawn will now be derived from spawnQueue.length
```

- [ ] **Step 2: Refactor `spawnPest`**

```typescript
  spawnPest() {
    if (this.spawnQueue.length === 0) return;

    const type = this.spawnQueue.shift()!;
    let x, y;
    const side = Phaser.Math.Between(0, 3);
    // ... position logic ...
    
    const pest = PestFactory.createPest(type, this, x, y);
    this.pestsGroup.add(pest);
    this.pestsSpawned++;
  }
```

- [ ] **Step 3: Implement `startNewWave`**

```typescript
  startNewWave() {
    this.pestsSpawned = 0;
    this.pestsDestroyed = 0;
    this.isWaveActive = true;
    
    const budget = 10 + (this.waveNumber * 10);
    let currentSpent = 0;
    this.spawnQueue = [];

    const availablePests = [PEST_CONSTANTS.TYPES.APHID];
    if (this.waveNumber >= 3) availablePests.push(PEST_CONSTANTS.TYPES.SLUG);
    if (this.waveNumber >= 6) {
      availablePests.push(PEST_CONSTANTS.TYPES.BEETLE);
      availablePests.push(PEST_CONSTANTS.TYPES.LOCUST);
    }

    while (currentSpent < budget) {
      const type = Phaser.Utils.Array.GetRandom(availablePests);
      const cost = PEST_CONSTANTS.BUDGETS[type as keyof typeof PEST_CONSTANTS.BUDGETS];
      
      if (currentSpent + cost <= budget) {
        this.spawnQueue.push(type);
        currentSpent += cost;
      } else {
        // Fill remaining with aphids if possible
        if (currentSpent + 1 <= budget) {
          this.spawnQueue.push(PEST_CONSTANTS.TYPES.APHID);
          currentSpent += 1;
        } else {
          break;
        }
      }
    }
    
    this.pestsToSpawn = this.spawnQueue.length;
    this.waveNumber++;
  }
```

- [ ] **Step 4: Update `create()` and `resetWave()` to use `startNewWave()`**

### Task 5: Verification

- [ ] **Step 1: Run tests**
- `npm test`

- [ ] **Step 2: Verify build**
- `npm run build`

- [ ] **Step 3: Commit changes**
