# GardenCastle Design Specification

**Date:** 2026-05-11
**Project:** GardenCastle
**Genre:** Roguelike Modular Tower Defense (Static Action-TD)
**Aesthetic:** Whimsical Splatter (Cute vs. Gory). High-fidelity animations with significant detail during pest destruction (e.g., custom "pop" animations for every pest type, neon green goo splatters, mechanical debris for armored units).

## 1. Core Vision
"The Gardener" must protect and grow a series of "Objective Plants" in a central garden while defending against swarms of cute but deadly pests. The game combines the modular upgrade system of *Mech Assemble* with traditional grid-based tower defense and a "harvest-based" victory condition.

## 2. Gameplay Loop
1. **Pre-Game Selection (Strategic Setup):**
   - **Soil Choice:** Select global Soil Type (Dirt, Sand, Rocks, Ash).
   - **Garden Layout:** Choose the shape and placement of the garden in the yard.
   - **Objective Selection:** Based on difficulty (1 for Easy, 5 for Insane), the player chooses specific **Objective Plants** to protect and grow. This defines the wave's requirements and potential rewards.
   - **Loadout Selection:** The player starts with **3 Tool Slots** and **3 Structure Slots** (expandable via Research). Choose which items to bring into the wave.
2. **The Wave (Tactical):** 
   - Pests enter from the edges, targeting "Objective Plants".
   - The player uses mouse-aimed tools and a mix of **Offensive** and **Defensive** plants to destroy pests.
   - Pests drop "Seeds" (XP/Currency). Mid-wave "Mutation Choices" allow for new plantings or upgrades.
3. **Research (Meta):**
   - Successfully harvested plants yield "Research Points".
   - Between waves, players spend Research Points to advance along **Evolution Trees**.
   - **Sample Evolution Trees:**
     - **Water Tree:** Rain Catchment (Passive Rain Bonus) -> Garden Hose (Manual Single) -> Manual Sprayer (Manual AOE) -> Automated Irrigation (Passive Grid) -> Atmospheric Condensator (High-tech, ignores heatwaves).
     - **Soil Tree:** Natural Compost (Basic Growth) -> Nitrogen Pellets (+Speed) -> Bone Meal (+Health) -> Super-Fertilizer (Massive Multiplier) -> Nano-Nutrients (Permanent Mutation).
     - **Tool Tree (The Shovel):** Shovel (Basic Knockback) -> Heavy Shovel (Stun) -> Steam Shovel (AOE Shockwave) -> Seismic Hammer (Screen-wide Knockback).
     - **Tool Tree (The Sprayer):** Hand Pump (Basic Poison) -> Compression Tank (Longer spray) -> Industrial Sprayer (Wide cone) -> Chemical Launcher (Lobbed clouds).
   - **Mutation Trees:** Offensive and Defensive plants can be "Mutated" into specialized versions (e.g., Pea-Shooter -> Gatling-Pea -> Acid-Pea).

## 3. The "Chaos" System
Every wave has a 30% chance of a "Climate Shift" or "Wildcard Event":
- **Shade:** -25% Growth speed (Time).
- **Humidity:** +100% Growth speed (Time).
- **Mutant Squirrel:** Boss pest with high HP and plant-destroying abilities.
- **The Static Gardener:** Use the Mouse to manage the modular Castle and operate **Manual Defenses**. While many "towers" are automated, key power-up tools and certain tactical defenses require manual aiming and clicking to be effective.

## 4. Master Inventory (The Three Pillars)

### A. Pillar 1: Objective Plants
*Non-offensive. Must be protected to win. Each provides a unique boost or harvest reward.*
- **Royal Rose:** Needs High Water. Harvest: High Research Points.
- **Iron Oak:** Needs Synergy. Harvest: Permanent Castle HP buff.
- **Lunar Glow-Shroom:** Needs Shade. Harvest: Unlocks Bioluminescent tool upgrades.
- **Phoenix Lily:** Needs Ash/Nitrogen. Boost: Adds fire damage to nearby offensive plants.
- **Crystal Cactus:** Needs Sand/Sun. Boost: Grants reflective armor to the garden.

### B. Pillar 2: Defensive & Complimentary Plants
*Focus on protection, utility, and enhancing other plants. May have limited offensive capability.*
- **Thorn-Vine:** Slows pests and deals minor bleed damage.
- **Sunflower:** Generates Sun Resources; boosts growth speed of adjacent Objective plants.
- **Wall-Nut Shell:** High HP blocker that diverts pest pathing.
- **Lavender Mist:** Calms pests, slowing their attack speed in a wide area.
- **Mycelium Network:** Transfers water/nutrients between connected plants, equalizing growth.

### C. Pillar 3: Offensive Plants
*Primary damage dealers. Target and destroy pests automatically.*
- **Pea-Shooter:** Basic projectile unit. Single target, high frequency.
- **Venus Chainsaw:** Melee shredder. Massive damage to anything in reach.
- **Acid-Berry:** Armor-stripping projectiles. Essential for tanky beetles.
- **Snap-Dragon (Turret):** Short-range fire breather. Area of effect damage.
- **Spore-Bomber:** High-damage lobbed attacks that explode into sticky goo.

### D. Tools & Manual Defenses (Gardener Equipment)
*Active interaction. 3 slots available at start.*
- **Pesticide Sprayer:** Basic (Poison), Industrial (Wide), Acidic (Armor-strip).
- **The Heavy Shovel:** Basic (Knockback), Steam (AOE shockwave), Golden (Loot bonus).
- **Watering Can:** Manual (Single), Auto-Refill (Infinite), Vitamin Solution (Heals plants).
- **The Trowel:** Precision Tool. Moves a plant to a different slot mid-wave.
- **Pruning Shears:** Sacrifice 10% of an Objective Plant's growth for a massive temporary Offensive buff.
- **Fertilizer Spreader:** High-speed application of additives (Bone Meal/Nitrogen).

### E. Structures (Static Utility)
*Non-plant objects. 3 slots available at start.*
- **Fencing:** Wood (Cheap), Iron (Sturdy), Electric (Zaps pests).
- **Irrigation:** Sprinkler (3x3 water), Drip-Line (High efficiency for 1 row).
- **UV Lamp Post:** Artificial Sunlight for shade-dwellers or night waves.
- **Compost Bin:** Converts pest remains (goo) into extra Seeds or Nutrients.
- **Bee Hive:** Boosts growth speed and synergy bonuses for all adjacent plants.
- **Scarecrow:** Deters flying Locusts, forcing them to land or move away.
- **Sensor Array:** A tech totem that increases the Critical Hit chance of nearby Offensive plants.

### F. Pests (Enemies)
- **Aphid Swarm:** Small, fast, easy to pop. (The Red Bloon equivalent).
- **Iron-Clad Beetle:** Armored. Immune to basic seeds. Needs Acid-Berry or Heavy Shovel. (The Lead Bloon).
- **Camo-Locust:** Stealth. Invisible to towers without a Sensor Array or UV Lamp. (The Camo Bloon).
- **Regen-Slug:** Regenerative. Heals HP over time. Needs high DPS. (The Regen Bloon).
- **Splitting Ants:** Cluster. Releases 3 Aphids when popped. (The Black/White Bloon).
- **Acrobatic Squirrel:** Jumps over fences; runs along irrigation lines. Targets Seeds.
- **Speedster Rabbit:** Extreme speed bursts in zig-zags.
- **Thieving Crow:** Aerial. Snatches Seeds or Objective Plants. Deterred by Scarecrows.
- **Tunneling Mole:** Damaging roots from below; vulnerable to Shovel shockwaves.
- **Groundhog (Heavy Tunneler):** High HP. Creates permanent tunnels that other ground pests can use to bypass defenses.
- **Raccoon (Saboteur):** High HP. Can disable structures (Fences/Sprinklers) and steals uncollected Seeds/Research Points.

### G. Global Boosters (Mid-Wave & Research)
*Boosters can enhance any game parameter and are earned through side-goals or research.*
- **Growth Stimulant:** Temporarily +200% growth speed for all objective plants.
- **Pesticide Potency:** Increases Tool damage and area of effect.
- **Soil Enlarger:** Expands the "Rich Soil" zone around the Castle.
- **Hydration Shield:** Prevents water evaporation during Heat Waves.
- **Thorn Hardener:** Adds armor-piercing to all vine-based defenses.
- **Synergy Amp:** Double the growth bonus from complimentary plant placement.

### H. Booster Goals (Side-Objectives)
- **Flawless Bloom:** Grow a plant without it taking any damage. Reward: *Growth Stimulant*.
- **Pest Purge:** Kill 20 pests within 10 seconds. Reward: *Pesticide Potency*.
- **Eco-Balance:** Have 4 different plant species active. Reward: *Synergy Amp*.
- **Soil Preservation:** Prevent any "Snail Slime" from touching rich soil. Reward: *Soil Enlarger*.


## 5. Technical Approach & Persistence
- **Platform:** Web-based (React + TypeScript). 
- **Game Engine:** Phaser 3 or PixiJS (for high-performance 2D animations and particle effects).
- **Career System:** 
  - **User Profiles:** Players log in to save their "Career" progress.
  - **Persistent Progress:** Research Tree unlocks, highest difficulty cleared, and global currency (Research Points) persist across sessions.
  - **Career Stats:** Tracks "Pests Popped," "Gallons Watered," "Rare Plants Harvested," and "Disasters Survived."
- **Backend:** Node.js (Express) with a database (e.g., MongoDB or Firebase) to store user account and career data.
- **Input:** Mouse-centric (Aiming, Clicking to Feed/Plant).

---
*This document is a living specification. Additions to the Master Inventory are encouraged as development proceeds.*
