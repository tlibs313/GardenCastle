# GardenCastle Phase 2 Design: Pests & Tactical Defense

**Date:** 2026-05-14 (Retrospective)
**Status:** Completed

## 1. Overview
Phase 2 shifts the game from a peaceful gardening simulator to a tactical defense game. It introduces the first hostile threats (Pests), the "Corruption" mechanic that halts plant growth, and the dual-layered defense system: manual player interaction (Squishing) and automated plant defenses (Seed Spray).

## 2. The Threat: Aphid Swarms
The Aphid serves as the baseline enemy unit. It is small, fast, and physically weak but dangerous in groups.

### A. Chaotic Movement
- **Zig-Zag Logic:** Aphids do not move in straight lines. They calculate a vector toward the center of the garden and apply a sin-wave offset to their velocity, creating a jittery, unpredictable movement pattern.
- **Spawning:** Pests spawn from random locations outside the viewport and move toward the coordinate (400, 300).

### B. The Corruption Mechanic (Attachment)
- **Collision:** When a Pest overlaps with a Plant, it "attaches" itself.
- **Impact:** While a pest is attached, the plant is "corrupted." Its growth progress is halted entirely, and it takes minor damage over time (implemented as halting the growth timer in Phase 2).
- **Stacking:** Multiple pests can attach to a single plant, requiring the player to clear them all to resume growth.

## 3. Player Interaction: Manual Squish
To emphasize the "Action" in Action-TD, the player has a direct way to influence the board.
- **Mechanism:** Pests are interactive objects. Clicking on an Aphid triggers its `squish()` method.
- **Result:** The pest is immediately destroyed, removed from any attached plant's list, and triggers a visual "Splatter" effect.

## 4. Automated Defense: Seed Spray
The "Crystal Cactus" (Offensive Plant) provides the first automated defense.
- **Targeting:** Scans for the nearest pest within its range.
- **Fire Pattern:** Fires 3-5 "Seeds" in a high-velocity cone (spray) toward the target.
- **Projectile Physics:** Seeds are physics-enabled sprites that destroy pests on contact. This creates a "shotgun" effect that is highly effective against swarms but has a long cooldown.

## 5. Aesthetic: Whimsical Splatter
Phase 2 implements the first "Gory" element of the design.
- **Particle System:** A Phaser particle manager is initialized in the `MainScene`.
- **The Pop:** Upon death (via squish or seed), pests explode into a burst of neon-green particles.
- **Visual Feedback:** This provides high-impact satisfaction for successful defense actions, contrasting the cute "🏰" placeholder and plant sprites.

## 6. Technical Architecture
- **Pest Hierarchy:** Introduced an abstract `Pest` base class to handle shared properties (health, speed, attachment state).
- **Collision Layers:**
    - **Pests vs. Plants:** Overlap trigger for attachment.
    - **Seeds vs. Pests:** Overlap trigger for destruction.
- **Event System:** Uses Phaser's scene events (`pest-squished`) to decouple entity death from particle management.
