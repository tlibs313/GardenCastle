# Phase 2: Pests & Tactical Defense Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Aphid Swarms with chaotic movement, the "Manual Squish" mechanic, and the Pea-Shooter's "Seed Spray" ability.

**Architecture:** 
- New `Pest` base class and `Aphid` subclass.
- Collision system in `MainScene` using Phaser Arcade Physics.
- Particle system for the "Whimsical Splatter" effects.
- Event-based "Corruption" state linking Pests to Plants.

**Tech Stack:** Phaser 3 (Arcade Physics), TypeScript.

---

### Task 1: Pest Foundation & Aphid Entity

**Files:**
- Create: `src/game/entities/Pest.ts`
- Create: `src/game/entities/Aphid.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Create Base Pest Class**
```typescript
import Phaser from 'phaser';

export abstract class Pest extends Phaser.Physics.Arcade.Sprite {
  public health: number = 10;
  public speed: number = 50;
  public isAttached: boolean = false;
  protected targetPlant: any = null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
```

- [ ] **Step 2: Implement Aphid with Chaotic Movement**
(Implement update loop with zig-zag logic using sin/cos offsets toward target)

- [ ] **Step 3: Register Pests in MainScene**
(Add `pests` group and a basic spawn timer for testing)

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: initial pest system and aphid entity"
```

---

### Task 2: Interaction: Attachment & Manual Squish

**Files:**
- Modify: `src/game/entities/Plant.ts`
- Modify: `src/game/entities/Aphid.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Add Corruption Logic to Plants**
(Add `attachedPests` array; if length > 0, set `growthProgress` to 0 in update)

- [ ] **Step 2: Implement Attachment Collision**
(In MainScene, add collider between `pests` and `plants`. On overlap, trigger attachment)

- [ ] **Step 3: Implement Manual Squish**
(Add `pointerdown` listener to Aphid; on click, destroy entity and trigger splatter)

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: aphid attachment and manual squish mechanics"
```

---

### Task 3: Offensive: Pea-Shooter Seed Spray

**Files:**
- Create: `src/game/entities/Seed.ts`
- Modify: `src/game/entities/OffensivePlant.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Create Seed Projectile**
(Simple physics sprite that destroys itself on collision or edge of screen)

- [ ] **Step 2: Implement Seed Spray in OffensivePlant**
(Update shoot logic to fire 3-5 seeds in a random cone toward the nearest pest)

- [ ] **Step 3: Implement Seed-Pest Collision**
(In MainScene, add collider between `seeds` and `pests`)

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: pea-shooter seed spray offensive mechanic"
```

---

### Task 4: Visual Polish: The Splatter System

**Files:**
- Modify: `src/game/scenes/MainScene.ts`
- Modify: `src/game/entities/Aphid.ts`

- [ ] **Step 1: Initialize Particle Manager**
(Set up a neon-green particle emitter in MainScene)

- [ ] **Step 2: Trigger Splatter on Death**
(Call emitter.explode() at pest location when destroyed)

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: whimsical splatter particle effects"
```
