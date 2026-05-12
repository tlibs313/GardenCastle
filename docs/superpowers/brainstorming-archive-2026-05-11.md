# GardenCastle Brainstorming Archive (2026-05-11)

## Session Summary
This document captures the evolution of the **GardenCastle** project from initial concept to a detailed design specification.

---

## 1. Initial Concept
- **Goal:** Create a game called "GardenCastle".
- **Genre:** Tower Defense / Game.
- **Core Premise:** A "Gardener" defending a garden from pests.

## 2. Aesthetic Direction: "Whimsical Splatter"
- **Requirement:** A balance between "Whimsically Cute" and "Graphic Gore".
- **Visual Style:** Cute, wide-eyed pests (ants, beetles, squirrels) meeting violent, over-the-top ends (explosions of neon green goo, sparkly glitter-blood).
- **Inspiration:** *Happy Tree Friends*, *Plants vs. Zombies* (but with more carnage).

## 3. Core Mechanics: The Hybrid Action-TD
- **Player Role:** "The Static Gardener" (controlled via Mouse).
- **Inspiration:** *Mech Assemble* (Modular roguelike upgrades mid-wave).
- **Winning Condition:** Growing specific "Objective Plants" to a target level, rather than just surviving.
- **The "Three Pillars" of Planting:**
    1. **Objective Plants:** Must be protected; non-offensive; provide powerful boosts or harvest rewards.
    2. **Defensive/Complimentary Plants:** Shield objectives, slow pests, or provide synergy buffs (e.g., Sunflower, Wall-Nut).
    3. **Offensive Plants:** Automated pest-killers (e.g., Pea-Shooter, Venus Chainsaw).

## 4. Environmental Depth
- **Soil Selection:** Permanent starting choice (Dirt, Sand, Rocks, Ash) affecting growth multipliers.
- **Growth Factors:** Time, manual feeding (Water/Sun), soil quality, additives (Bone Meal/Nitrogen), and environmental light (Sun vs. Shade).
- **Spatial Strategy:** Choosing the shape (Corner, Island, Strip) and placement of the garden in the yard.

## 5. The Evolution Trees (Research)
Linear progression for all major systems:
- **Water Tree:** Rain Catchment -> Hose -> Sprayer -> Irrigation -> Condensator.
- **Soil Tree:** Compost -> Nitrogen -> Bone Meal -> Super-Fertilizer -> Nano-Nutrients.
- **Tool Trees:** Shovel/Sprayer upgrades.
- **Mutation Trees:** Transforming plants into specialized forms.

## 6. The Threat Roster (Pests & Disasters)
- **Bloons-Inspired Properties:** Armored (Iron-Clad Beetle), Stealth (Camo-Locust), Regen (Regen-Slug), Cluster (Splitting Ants).
- **Yard Marauders:** Squirrels (jumpers), Rabbits (speed), Crows (thieves), Moles (tunnelers), Groundhogs (tunnels), Raccoons (saboteurs).
- **Environmental Disasters:** Flash Floods, Hail Storms, Acid Rain, The Frost.
- **Bosses:** Mutant Squirrel, Goliath Worm, Swarm Queen.

## 7. Persistence & Quality
- **Career System:** User accounts for long-term progress, research, and stats.
- **Animation:** Fully animated 60fps experience (using Phaser 3/PixiJS) with high-detail particle effects for every "Pop."

---

## Final Design Specification
The formal design document is located at: `docs/superpowers/specs/2026-05-11-GardenCastle-design.md`
