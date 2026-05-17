# GardenCastle Project Instructions

## Overview
GardenCastle is a "Whimsical Splatter" Tower Defense game built with React, TypeScript, and Phaser 3.

## Technical Stack
- **Frontend:** React (UI), Phaser 3 (Game Engine)
- **Language:** TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand
- **Backend:** Node.js/Express (Planned)

## Core Design Pillars
1. **The Three Pillars of Planting:**
   - **Objective:** Protect and grow to win.
   - **Defensive:** Shield and support.
   - **Offensive:** Kill pests.
2. **Environmental Simulation:** Soil types (Dirt, Sand, Rocks, Ash), hydration, and light requirements.
3. **Evolution Trees:** Linear research paths for technology and biology.
4. **Whimsical Splatter:** Cute aesthetic contrasted with high-fidelity, gory destruction animations.

## Development Status
- **Phase 1 (Complete):** Project scaffolded, Phaser integrated, grid system and plant entities implemented.
- **Phase 2 (Complete):** Pests (Aphids) implemented with chaotic movement, manual squish interaction, and seed spray offensive mechanics.
- **Phase 3 (Complete):** Environmental simulation implemented: Soil types, Day/Night cycles, Hydration/Light needs, and Weather Forecast HUD.
- **Phase 4 (Complete):** Evolution Trees implemented with linear research paths, RP calculations, and a career progression hub.
- **Phase 5 (Complete):** Advanced Pests (Beetle, Slug, Locust) and Boss Squirrel implemented with a dynamic wave budgeting system and real-time dashboard.
- **Next Phase:** Phase 6: Advanced Structures & Tools.

## Conventions
- Follow TDD (Test Driven Development).
- Use subagent-driven development for implementation tasks.
- Keep components small and focused.
- Log major design decisions in `docs/conversations/`.
