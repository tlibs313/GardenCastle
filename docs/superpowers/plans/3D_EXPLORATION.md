# 3D Perspective Exploration

## Overview
The user requested a move from 2D grids to a 3D garden that can be spun to change perspective.

## Options Analyzed

### 1. True 3D (Three.js / React Three Fiber)
- **Concept:** Replace Phaser with a 3D engine.
- **Pros:** Best visuals, dynamic lighting, smooth orbital rotation.
- **Cons:** High refactor effort; requires replacing Phaser's physics and scene management.

### 2. Hybrid (Phaser 3 + Three.js)
- **Concept:** Layer a 3D container inside the existing Phaser scene.
- **Pros:** Keeps existing wave/logic code; adds 3D visuals.
- **Cons:** Coordination between 2D UI/Logic and 3D rendering can be tricky.

### 3. Retro/Isometric (Fake 3D)
- **Concept:** Use isometric grid math within Phaser.
- **Pros:** High performance, lower work effort.
- **Cons:** Rotation is usually limited to 90-degree snaps; not "true" diorama spinning.

## Technical Requirements for Refactor
1. **Renderer:** `@react-three/fiber` + `@react-three/drei`.
2. **Physics:** Rapier or Cannon.js (or keep logic-only for performance).
3. **Assets:** Migrate from 2D sprites to 3D primitives (Cubes/Spheres/Cylinders).
4. **Camera:** Implement `OrbitControls` for user interaction.
