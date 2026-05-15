# GardenCastle Phase 4: Evolution Trees & Career Research Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a persistent career progression system with RP generation and linear evolution trees.

**Architecture:** Use Zustand for persistent career state, a dedicated `ResearchManager` for RP calculations, and React for the Evolution Hub UI.

**Tech Stack:** React, TypeScript, Zustand, Phaser 3.

---

### Task 1: Career Store & Persistence

**Files:**
- Create: `src/store/useCareerStore.ts`

- [ ] **Step 1: Define the Career State and Persistence**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CareerStats {
  pestsPopped: number;
  plantsHarvested: number;
  highestDifficultyCleared: number;
}

interface CareerState {
  totalRP: number;
  unlockedNodes: string[];
  stats: CareerStats;
  addRP: (amount: number) => void;
  unlockNode: (nodeId: string, cost: number) => void;
  updateStats: (newStats: Partial<CareerStats>) => void;
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set) => ({
      totalRP: 0,
      unlockedNodes: [],
      stats: {
        pestsPopped: 0,
        plantsHarvested: 0,
        highestDifficultyCleared: 0,
      },
      addRP: (amount) => set((state) => ({ totalRP: state.totalRP + amount })),
      unlockNode: (nodeId, cost) =>
        set((state) => ({
          totalRP: state.totalRP - cost,
          unlockedNodes: [...state.unlockedNodes, nodeId],
        })),
      updateStats: (newStats) =>
        set((state) => ({ stats: { ...state.stats, ...newStats } })),
    }),
    {
      name: 'garden-castle-career',
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add src/store/useCareerStore.ts
git commit -m "feat: add persistent career store"
```

---

### Task 2: Research Tree Data & Types

**Files:**
- Create: `src/game/config/researchTrees.ts`

- [ ] **Step 1: Define Research Tree Data Structure**

```typescript
export interface ResearchNode {
  id: string;
  title: string;
  description: string;
  cost: number;
  tree: 'water' | 'tool' | 'biology';
  effect: any;
}

export const RESEARCH_TREES: Record<string, ResearchNode[]> = {
  water: [
    { id: 'water_01', title: 'Manual Sprayer', description: 'Improved manual watering.', cost: 100, tree: 'water', effect: {} },
    { id: 'water_02', title: 'Garden Hose', description: 'Faster watering reach.', cost: 250, tree: 'water', effect: {} },
  ],
  tool: [
    { id: 'tool_01', title: 'Heavy Shovel', description: 'Adds knockback to manual squish.', cost: 150, tree: 'tool', effect: {} },
  ],
  biology: [
    { id: 'bio_01', title: 'Sunflower', description: 'Unlocks Sunflowers.', cost: 50, tree: 'biology', effect: { unlock_plant: 'sunflower' } },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/game/config/researchTrees.ts
git commit -m "feat: define linear research tree data"
```

---

### Task 3: ResearchManager & RP Calculation

**Files:**
- Create: `src/game/managers/ResearchManager.ts`
- Create: `src/game/managers/__tests__/ResearchManager.test.ts`

- [ ] **Step 1: Write RP Calculation Test**

```typescript
// Test the density and health formula
// Symbiotic: 1.0 + (Count * 0.1)
// Competitive: 1.0 / (Count * 0.5)
```

- [ ] **Step 2: Implement ResearchManager**

```typescript
import { Plant } from '../entities/Plant';

export class ResearchManager {
  static calculateRP(plants: Plant[], difficulty: number): number {
    let totalRP = 0;
    const speciesCounts: Record<string, number> = {};
    
    // Tally species
    plants.forEach(p => {
        const type = p.texture.key;
        speciesCounts[type] = (speciesCounts[type] || 0) + 1;
    });

    plants.forEach(p => {
        const base = p.plantType === 'objective' ? 50 : (p.plantType === 'defensive' ? 20 : 10);
        const healthBonus = (p.health / 100) * 10;
        
        // Density logic (placeholder for actual species-specific config)
        let densityMult = 1.0;
        if (p.texture.key === 'sunflower') densityMult = 1.0 + (speciesCounts['sunflower'] * 0.1);
        
        totalRP += (base + healthBonus) * difficulty * densityMult;
    });

    return Math.floor(totalRP);
  }
}
```

- [ ] **Step 3: Run Tests & Commit**

---

### Task 4: Evolution Hub UI (React)

**Files:**
- Create: `src/components/EvolutionHub.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create the Hub UI with Tree Navigation**
- [ ] **Step 2: Implement Linear Purchase Logic**
- [ ] **Step 3: Add Stats Dashboard**

---

### Task 5: Integration with MainScene Harvest

**Files:**
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Trigger Harvest on Wave Complete**
- [ ] **Step 2: Show Harvest Summary Popup**
- [ ] **Step 3: Update Career Stats**

---

### Task 6: Final Verification

- [ ] **Step 1: Play through a wave**
- [ ] **Step 2: Verify RP is awarded correctly**
- [ ] **Step 3: Purchase an upgrade and verify persistence**
