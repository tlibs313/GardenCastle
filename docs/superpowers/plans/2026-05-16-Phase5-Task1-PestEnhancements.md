# Pest Enhancements Implementation Plan (Phase 5 Task 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the base Pest class and update constants to support specialist pests.

**Architecture:** Update the `Pest` abstract class with health management and targetability features. Define a central `PEST_CONSTANTS` object for configuration.

**Tech Stack:** TypeScript, Phaser 3, Vitest

---

### Task 1: Update Constants

**Files:**
- Modify: `src/game/constants.ts`

- [ ] **Step 1: Add PEST_CONSTANTS to `src/game/constants.ts`**

Add the following object to the file:

```typescript
export const PEST_CONSTANTS = {
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

### Task 2: Create Pest Base Tests (RED)

**Files:**
- Create: `src/game/entities/__tests__/PestBase.test.ts`

- [ ] **Step 1: Write failing tests for `Pest` base functionality**

Since `Pest` is abstract, we'll create a concrete subclass in the test for verification.

```typescript
import { describe, it, expect, vi } from 'vitest';
import { Pest } from '../Pest';

// Mock Phaser
vi.mock('phaser', () => {
  class MockSprite {
    scene: any;
    x: number;
    y: number;
    texture: string;
    constructor(scene: any, x: number, y: number, texture: string) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.texture = texture;
    }
    destroy = vi.fn();
  }

  return {
    default: {
      Physics: { Arcade: { Sprite: MockSprite } }
    },
    Physics: { Arcade: { Sprite: MockSprite } }
  };
});

class TestPest extends Pest {
  constructor(scene: any, x: number, y: number) {
    super(scene, x, y, 'test-texture');
  }
}

describe('Pest Base Class', () => {
  it('should initialize with new properties', () => {
    const mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      time: { now: 1000 }
    } as any;
    
    const pest = new TestPest(mockScene, 100, 100);
    expect(pest.maxHealth).toBe(10);
    expect(pest.isTargetable).toBe(true);
  });

  it('should take damage and update lastHitTime', () => {
    const mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      time: { now: 1000 },
      events: { emit: vi.fn() }
    } as any;
    
    const pest = new TestPest(mockScene, 100, 100);
    pest.takeDamage(3);
    expect(pest.health).toBe(7);
    // lastHitTime is protected, we'll check it via side effect or making it public if needed
    // for now we'll check health and death
  });

  it('should die when health reaches 0', () => {
    const mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      time: { now: 1000 },
      events: { emit: vi.fn() }
    } as any;
    
    const pest = new TestPest(mockScene, 100, 100);
    const destroySpy = vi.spyOn(pest, 'destroy');
    pest.takeDamage(10);
    expect(mockScene.events.emit).toHaveBeenCalledWith('pest-squished', 100, 100);
    expect(destroySpy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test src/game/entities/__tests__/PestBase.test.ts`
Expected: FAIL (missing properties and methods)

### Task 3: Implement Pest Base Enhancements (GREEN)

**Files:**
- Modify: `src/game/entities/Pest.ts`

- [ ] **Step 1: Update `Pest` class with new properties and methods**

```typescript
import Phaser from 'phaser';

export abstract class Pest extends Phaser.Physics.Arcade.Sprite {
  public health: number = 10;
  public maxHealth: number = 10;
  public speed: number = 50;
  public isAttached: boolean = false;
  public isTargetable: boolean = true;
  protected lastHitTime: number = 0;
  protected targetPlant: any = null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

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

- [ ] **Step 2: Run tests to verify they pass**

Run: `npm test src/game/entities/__tests__/PestBase.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/game/constants.ts src/game/entities/Pest.ts src/game/entities/__tests__/PestBase.test.ts
git commit -m "feat: enhance Pest base class and constants"
```
