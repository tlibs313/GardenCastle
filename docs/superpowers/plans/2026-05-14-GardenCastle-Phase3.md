# Phase 3: Environmental Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Soil system, Hydration/Light mechanics, Weather Forecast, and the Day/Night cycle.

**Architecture:** 
- `EnvironmentManager` class in `MainScene` to handle global timers and weather.
- Extended `Plant` properties for environmental needs.
- Shader-based or tint-based visual feedback for plant states (Wilt/Glow).
- React-based HUD for the Forecast.

**Tech Stack:** Phaser 3, React (HUD), TypeScript.

---

### Task 1: Environment Manager & Day/Night Cycle

**Files:**
- Create: `src/game/managers/EnvironmentManager.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Create EnvironmentManager**
```typescript
export class EnvironmentManager {
  public timeOfDay: 'day' | 'night' = 'day';
  public moistureProbability: number = 0.1;
  // ... (Handle cycle timers)
}
```

- [ ] **Step 2: Integrate into MainScene**
(Link the manager to the scene's update loop; add visual dimming for Night)

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: environment manager and tactical day/night cycle"
```

---

### Task 2: Soil Mechanics & Stat Multipliers

**Files:**
- Modify: `src/game/entities/Plant.ts`
- Modify: `src/game/entities/ObjectivePlant.ts`

- [ ] **Step 1: Define Soil Types and Multipliers**
(Add `soilType` to global state; implement growth modifiers based on the selected soil)

- [ ] **Step 2: Implement Slot Locking**
(Add check during planting to ensure high-tier plants match the soil)

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: soil-based multipliers and affinity mechanics"
```

---

### Task 3: Hydration, Light, and Visual Wilting

**Files:**
- Modify: `src/game/entities/Plant.ts`
- Modify: `src/game/scenes/MainScene.ts`

- [ ] **Step 1: Add Needs to Plants**
(Implement `hydration` and `lightLevel` depletion in `Plant.update()`)

- [ ] **Step 2: Implement Visual Feedback**
(Apply sprite tinting: brown/gray for Wilting, vibrant/yellow for Glowing)

- [ ] **Step 3: Add Hover Stats UI**
(Create a Phaser text overlay that appears when the pointer is over a plant)

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: plant hydration/light needs and visual feedback"
```

---

### Task 4: The Weather Forecast System

**Files:**
- Create: `src/components/WeatherHUD.tsx`
- Modify: `src/game/managers/EnvironmentManager.ts`

- [ ] **Step 1: Implement Forecast Logic**
(Increase rain probability daily; trigger "Rain" event that fills hydration for all plants)

- [ ] **Step 2: Build HUD Component**
(React component displaying the next 3 days of forecast)

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: rain probability and forecast system"
```
