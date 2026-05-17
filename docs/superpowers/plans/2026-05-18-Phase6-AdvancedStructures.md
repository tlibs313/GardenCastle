# Phase 6: Advanced Structures & Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a polymorphic Structure system with durability, soil-anchoring, and a set of initial tools (Stone Wall, Auto-Sprinkler, Copper Zapper).

**Architecture:**
- Create an abstract `Structure` base class extending `Phaser.Physics.Arcade.Sprite`.
- Implement `StructureFactory` for instantiation.
- Update `MainScene` to handle "Build Mode" toggling (Key 'B') and anchor-soil validation.
- Integrate structures into the Evolution Hub research tree.

**Tech Stack:** TypeScript, Phaser 3, Zustand, Vitest.

---

### Task 1: Constants & Base Structure Class

**Files:**
- Modify: `src/game/constants.ts`
- Create: `src/game/entities/Structure.ts`
- Test: `src/game/entities/__tests__/Structure.test.ts`

- [ ] **Step 1: Update Constants**
Add structure types, anchor requirements, and base stats.

```typescript
// src/game/constants.ts
export const STRUCTURE_CONSTANTS = {
  TYPES: {
    WALL: 'stone_wall',
    SPRINKLER: 'auto_sprinkler',
    ZAPPER: 'copper_zapper'
  },
  ANCHORS: {
    stone_wall: ['rocks'],
    auto_sprinkler: ['dirt', 'sand'],
    copper_zapper: ['ash']
  },
  STATS: {
    stone_wall: { durability: 200, cost: 100 },
    auto_sprinkler: { durability: 50, cost: 250, interval: 10000 },
    copper_zapper: { durability: 100, cost: 500, range: 80 }
  }
};
```

- [ ] **Step 2: Create Abstract Structure Class**
Implement the base logic for durability and soil anchoring.

```typescript
// src/game/entities/Structure.ts
import Phaser from 'phaser';

export abstract class Structure extends Phaser.Physics.Arcade.Sprite {
  public durability: number;
  public maxDurability: number;
  public anchorSoil: string[];
  public isBroken: boolean = false;
  public structureType: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: string, durability: number, anchorSoil: string[]) {
    super(scene, x, y, texture);
    this.structureType = type;
    this.durability = durability;
    this.maxDurability = durability;
    this.anchorSoil = anchorSoil;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static by default
  }

  public takeDamage(amount: number) {
    this.durability -= amount;
    if (this.durability <= 0) {
      this.durability = 0;
      this.onBreak();
    }
  }

  protected onBreak() {
    this.isBroken = true;
    this.scene.events.emit('structure-broken', this);
    this.destroy();
  }

  public getDisplayName(): string {
    return this.structureType.replace('_', ' ').toUpperCase();
  }
}
```

- [ ] **Step 3: Write tests for Base Structure**
- [ ] **Step 4: Verify tests and commit**
`git add src/game/constants.ts src/game/entities/Structure.ts && git commit -m "feat: add base Structure class and constants"`

---

### Task 2: Build Mode & Store Integration

**Files:**
- Modify: `src/store/useGameStore.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Add Build Mode to Store**
Track whether the player is in "Planting" or "Building" mode.

```typescript
// src/store/useGameStore.ts (Inside the state definition)
isBuildMode: boolean;
setBuildMode: (active: boolean) => void;

// Implementation
isBuildMode: false,
setBuildMode: (active) => set({ isBuildMode: active }),
```

- [ ] **Step 2: Implement 'B' Key Toggle in MainScene**
Add a keyboard listener to toggle build mode and show a UI indicator.

```typescript
// src/game/scenes/MainScene.ts
private buildModeIndicator!: Phaser.GameObjects.Text;

// In create():
this.buildModeIndicator = this.add.text(400, 20, 'BUILD MODE', { fontSize: '20px', color: '#fbbf24' }).setOrigin(0.5).setVisible(false);

this.input.keyboard?.on('keydown-B', () => {
  const active = !useGameStore.getState().isBuildMode;
  useGameStore.getState().setBuildMode(active);
  this.buildModeIndicator.setVisible(active);
});
```

- [ ] **Step 3: Commit**
`git commit -m "feat: implement Build Mode toggle and store state"`

---

### Task 3: Stone Wall & Structure Factory

**Files:**
- Create: `src/game/entities/StoneWall.ts`
- Create: `src/game/managers/StructureFactory.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Implement StoneWall**
A high-HP static barrier.

```typescript
// src/game/entities/StoneWall.ts
import { Structure } from './Structure';
import { STRUCTURE_CONSTANTS } from '../constants';

export class StoneWall extends Structure {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'stone', STRUCTURE_CONSTANTS.TYPES.WALL, STRUCTURE_CONSTANTS.STATS.stone_wall.durability, STRUCTURE_CONSTANTS.ANCHORS.stone_wall);
  }
}
```

- [ ] **Step 2: Create StructureFactory**
```typescript
// src/game/managers/StructureFactory.ts
import { StoneWall } from '../entities/StoneWall';
import { STRUCTURE_CONSTANTS } from '../constants';

export class StructureFactory {
  static create(type: string, scene: Phaser.Scene, x: number, y: number) {
    switch(type) {
      case STRUCTURE_CONSTANTS.TYPES.WALL: return new StoneWall(scene, x, y);
      default: throw new Error(`Unknown structure type: ${type}`);
    }
  }
}
```

- [ ] **Step 3: Update handlePlanting for Anchoring**
Validate soil type before placing structures.

- [ ] **Step 4: Commit**
`git commit -m "feat: add StoneWall and structure placement logic"`

---

### Task 4: Auto-Sprinkler (Utility)

**Files:**
- Create: `src/game/entities/AutoSprinkler.ts`
- Modify: `src/game/managers/StructureFactory.ts`

- [ ] **Step 1: Implement AutoSprinkler**
Uses a timer to heal hydration in a 3x3 radius.

```typescript
// src/game/entities/AutoSprinkler.ts
import { Structure } from './Structure';
import { STRUCTURE_CONSTANTS } from '../constants';
import { Plant } from './Plant';

export class AutoSprinkler extends Structure {
  private timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'cactus', STRUCTURE_CONSTANTS.TYPES.SPRINKLER, STRUCTURE_CONSTANTS.STATS.auto_sprinkler.durability, STRUCTURE_CONSTANTS.ANCHORS.auto_sprinkler);
    
    this.timer = scene.time.addEvent({
      delay: STRUCTURE_CONSTANTS.STATS.auto_sprinkler.interval,
      callback: this.activate,
      callbackScope: this,
      loop: true
    });
  }

  private activate() {
    if (this.isBroken) return;
    
    const radius = 80; // 2 grids
    const plants = (this.scene as any).plantsGroup.getChildren() as Plant[];
    plants.forEach(p => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, p.x, p.y);
      if (dist < radius) {
        p.hydration = Math.min(100, p.hydration + 20);
      }
    });

    this.takeDamage(1); // Lose 1 durability per use
  }
}
```

- [ ] **Step 2: Commit**
`git commit -m "feat: add Auto-Sprinkler utility"`

---

### Task 5: Copper Zapper (Offensive)

**Files:**
- Create: `src/game/entities/CopperZapper.ts`
- Modify: `src/game/managers/StructureFactory.ts`

- [ ] **Step 1: Implement CopperZapper**
Zaps the nearest pest within range.

- [ ] **Step 2: Commit**
`git commit -m "feat: add Copper Zapper weaponry"`

---

### Task 6: Research Tree & Final Polish

**Files:**
- Modify: `src/game/config/researchTrees.ts`
- Modify: `src/components/Dashboard.tsx`

- [ ] **Step 1: Add Hardware Branch to Research**
- [ ] **Step 2: Update Dashboard to show Mode**
- [ ] **Step 3: Final Verification of Soil Anchors**
- [ ] **Step 4: Commit**
`git commit -m "feat: integrate structures into research and UI"`
