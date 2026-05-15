# GardenCastle Phase 3 Spec: Environmental Simulation

**Objective:** Implement the core environmental factors (Soil, Water, Light) that drive plant growth and tactical decision-making.

## 1. The Soil System
- **Global Soil Choice:** Dirt (Standard), Sand (Drainage/Cactus), Rocks (Defense/Hardy), Ash (Nutrients/Rare).
- **Mechanics:**
  - **Stat Multipliers:** e.g., Rose grows 50% slower in Sand.
  - **Resource Affinity:** e.g., Water drains 2x faster in Sand; Ash generates Sun 2x faster.
  - **Slot Locking:** Some high-tier plants (e.g., Phoenix Lily) can only be placed on their matching soil type.

## 2. Hydration & Light Mechanics
- **Hydration (0-100%):**
  - **Depletion:** Plants lose moisture over time based on Soil and Light.
  - **Sources:** Manual Watering (Hose), Automated Irrigation, Rain.
- **Light Level (0-100%):**
  - **Sources:** Global Sun (Day), UV Lamps (Night/Shade).
  - **Requirement:** Each plant has a "Preferred Light" range.
- **Visual Feedback (The "Wilt" Factor):**
  - **Vibrant/Glowing:** 80-100% needs met (Growth +50%).
  - **Normal:** 30-79% needs met (Base growth).
  - **Wilting/Brown:** <30% needs met (Growth stopped, taking damage).

## 3. The Weather Forecast
- **Mechanism:** A UI element showing a 3-day forecast.
- **Probability:** Starts at 10% and increases by 15-20% each day it doesn't rain.
- **The Rain Event:** A global moisture recharge that resets the "No-Rain" counter.

## 4. Light Cycle (Full Tactical Shift)
- **Day Phase:** High visibility, free Sun resource, aerial pests (Birds).
- **Night Phase:** Low visibility, slow growth (unless UV lit), subterranean pests (Moles, Groundhogs).

## 5. Technical Changes
- **Plant.ts Update:** Add `hydration`, `lightLevel`, and `visualState` properties.
- **MainScene Update:** Implement the `EnvironmentManager` class to handle global cycles and forecast logic.
- **UI System:** Add a Hover Overlay for detailed plant stats and a Forecast HUD element.

---
*Status: Approved and ready for implementation.*
