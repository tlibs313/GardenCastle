# GardenCastle Implementation Plan - Phase 1: Core Engine & Gardening

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional "Garden Defense" prototype with a central castle, a planting grid, and a basic "Grow & Defend" loop.

**Architecture:** A React wrapper for the UI (Career, Pre-game) and a Phaser 3 instance for the real-time garden gameplay. State management via a custom Store (Zustand or similar) to bridge React and Phaser.

**Tech Stack:** React, TypeScript, Phaser 3, Vite.

---

### Task 1: Project Scaffold & Environment

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Initialize package.json**
```json
{
  "name": "gardencastle",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "phaser": "^3.60.0",
    "zustand": "^4.3.8"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

- [ ] **Step 2: Create Vite Config**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 3: Create Entry Points**
(Write basic index.html and main.tsx to boot React)

- [ ] **Step 4: Install Dependencies**
Run: `npm install`

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: initial project scaffold"
```

---

### Task 2: Phaser Integration & Basic Scene

**Files:**
- Create: `src/game/config.ts`
- Create: `src/game/scenes/MainScene.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Define Phaser Config**
```typescript
import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#4caf50',
  scene: [MainScene]
};
```

- [ ] **Step 2: Create MainScene with Grid**
```typescript
import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    // Draw 10x10 garden grid
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x2e7d32, 0.5);
    for (let i = 0; i <= 10; i++) {
      graphics.moveTo(i * 40 + 200, 100);
      graphics.lineTo(i * 40 + 200, 500);
      graphics.moveTo(200, i * 40 + 100);
      graphics.lineTo(600, i * 40 + 100);
    }
    graphics.strokePath();

    // Central Castle Placeholder
    this.add.text(400, 300, '🏰', { fontSize: '48px' }).setOrigin(0.5);
  }
}
```

- [ ] **Step 3: Mount Phaser in React**
(Update App.tsx to include a <div id="game-container" /> and init the game in useEffect)

- [ ] **Step 4: Verify Scene Loads**
Run: `npm run dev`
Expected: Green background with a 10x10 grid and a castle emoji in the center.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "feat: basic phaser scene with garden grid"
```

---

### Task 3: The "Three Pillars" Plant System

**Files:**
- Create: `src/game/entities/Plant.ts`
- Create: `src/game/entities/ObjectivePlant.ts`
- Create: `src/game/entities/OffensivePlant.ts`
- Create: `src/game/entities/DefensivePlant.ts`

- [ ] **Step 1: Define Base Plant Class**
```typescript
export abstract class Plant extends Phaser.GameObjects.Sprite {
  public health: number;
  public level: number = 1;
  public type: 'objective' | 'defensive' | 'offensive';

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.health = 100;
  }
}
```

- [ ] **Step 2: Implement Objective Plant (Growth Logic)**
```typescript
export class ObjectivePlant extends Plant {
  public growthProgress: number = 0;
  public targetLevel: number = 5;

  update(delta: number) {
    // Basic Time-based growth
    this.growthProgress += delta * 0.01;
    if (this.growthProgress >= 100 && this.level < this.targetLevel) {
      this.level++;
      this.growthProgress = 0;
      console.log(`${this.texture.key} leveled up to ${this.level}`);
    }
  }
}
```

- [ ] **Step 3: Implement Offensive Plant (Auto-Aim)**
(Basic structure for Pea-Shooter scanning for targets in range)

- [ ] **Step 4: Test Planting via Click**
(Add click listener to MainScene to spawn a plant on the grid)

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "feat: core plant entity system"
```

---

*(More tasks to follow for Pests, Research, and Career in Phase 2)*
