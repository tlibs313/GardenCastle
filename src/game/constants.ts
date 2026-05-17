/**
 * Game constants for GardenCastle.
 */

export const RESEARCH_CONSTANTS = {
  HEALTH_BONUS_SCALE: 10,
  BASE_RP: {
    OBJECTIVE: 50,
    OFFENSIVE: 10,
    DEFENSIVE: 20
  },
  DENSITY_FACTORS: {
    SYMBIOTIC: 0.1,
    COMPETITIVE: 0.5
  }
};

export const PLANT_CONSTANTS = {
  MAX_HEALTH: 100,
  BASE_LEVEL: 1,
  BASE_GROWTH_RATE: 0.01,
  INITIAL_HYDRATION: 80,
  INITIAL_LIGHT_LEVEL: 50,
  HYDRATION_DECREASE_RATE: 0.001,
  LIGHT_LEVELS: {
    DAY: 100,
    NIGHT: 20
  },
  THRESHOLDS: {
    WILTING: 30,
    GLOWING: 80
  },
  TINTS: {
    WILTING: 0x884400,
    GLOWING: 0xffff00
  },
  PEST_OFFSET_RANGE: 10,
  GROWTH_TARGET: 100,
  OBJECTIVE_TARGET_LEVEL: 5,
  OBJECTIVE_DAMAGE_RATE: 0.01,
  OFFENSIVE_FIRE_RATE: 2000,
  OFFENSIVE_RANGE: 200,
  OFFENSIVE_NUM_SEEDS: { MIN: 3, MAX: 5 },
  OFFENSIVE_SPREAD: 0.2,
  OFFENSIVE_SEED_SPEED: 200
};

export const PEST_CONSTANTS = {
  TYPES: {
    APHID: 'aphid',
    BEETLE: 'beetle',
    SLUG: 'slug',
    LOCUST: 'locust',
    BOSS_SQUIRREL: 'boss_squirrel'
  },
  BUDGETS: {
    aphid: 1,
    slug: 3,
    beetle: 5,
    locust: 8
  },
  BEETLE: {
    DR: 0.1, // 10% damage taken
    HEALTH: 50,
    SPEED: 30
  },
  SLUG: {
    REGEN_DELAY: 2000,
    REGEN_RATE: 1, // HP per second
    LIFE_STEAL_MULT: 2.0,
    HEALTH: 30,
    SPEED: 40
  },
  LOCUST: {
    HEALTH: 5,
    SPEED: 80
  },
  BOSS: {
    HEALTH: 500,
    STUN_DURATION: 500,
    CLICK_DAMAGE: 10,
    LOOT_RP: 50
  }
};

export const STRUCTURE_CONSTANTS = {
  TYPES: {
    WALL: 'stone_wall',
    SPRINKLER: 'auto_sprinkler',
    ZAPPER: 'copper_zapper'
  },
  ANCHORS: {
    stone_wall: ['rocks'],
    auto_sprinkler: ['dirt', 'sand'],
    copper_zapper: ['ash']
  },
  STATS: {
    stone_wall: { durability: 200, cost: 100 },
    auto_sprinkler: { durability: 50, cost: 250, interval: 10000 },
    copper_zapper: { durability: 100, cost: 500, range: 80 }
  }
};
