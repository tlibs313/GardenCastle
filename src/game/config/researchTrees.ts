/**
 * Valid research tree categories.
 */
export type ResearchTreeType = 'water' | 'tool' | 'biology' | 'hardware';

/**
 * Defines the possible effects a research node can have on the game.
 * Using a union type for stronger type safety.
 */
export type ResearchEffect =
  | { type: 'unlock_plant'; plantId: string }
  | { type: 'unlock_structure'; structureId: string }
  | { type: 'modifier'; stat: string; value: number }
  | { type: 'custom'; payload: Record<string, any> };

/**
 * A single node in a research tree.
 */
export interface ResearchNode {
  /** Unique identifier for the research. */
  id: string;
  /** Display name of the research. */
  name: string;
  /** Detailed description of what the research does. */
  description: string;
  /** Cost in Research Points (RP) to unlock. */
  cost: number;
  /** The tree this node belongs to. */
  tree: ResearchTreeType;
  /** The effect applied upon unlocking. */
  effect: ResearchEffect;
  /** Optional ID of the node that must be unlocked before this one. */
  prerequisiteId?: string;
}

/**
 * Global configuration for all research trees.
 * Evolution Trees are strictly linear: Tier N+1 requires Tier N.
 */
export const RESEARCH_TREES: Record<ResearchTreeType, ResearchNode[]> = {
  water: [
    {
      id: 'water_01',
      name: 'Manual Sprayer',
      description: 'Improved manual watering speed.',
      cost: 100,
      tree: 'water',
      effect: { type: 'modifier', stat: 'watering_speed', value: 1.2 }
    },
    {
      id: 'water_02',
      name: 'Garden Hose',
      description: 'Significantly faster watering reach.',
      cost: 250,
      tree: 'water',
      effect: { type: 'modifier', stat: 'watering_range', value: 2.0 },
      prerequisiteId: 'water_01'
    },
  ],
  tool: [
    {
      id: 'tool_01',
      name: 'Heavy Shovel',
      description: 'Adds knockback to manual squish.',
      cost: 150,
      tree: 'tool',
      effect: { type: 'modifier', stat: 'squish_knockback', value: 50 }
    },
  ],
  biology: [
    {
      id: 'bio_01',
      name: 'Sunflower',
      description: 'Unlocks Sunflowers for planting.',
      cost: 50,
      tree: 'biology',
      effect: { type: 'unlock_plant', plantId: 'sunflower' }
    },
  ],
  hardware: [
    {
      id: 'hw_01',
      name: 'Basic Fortifications',
      description: 'Unlocks Stone Walls for defense.',
      cost: 100,
      tree: 'hardware',
      effect: { type: 'unlock_structure', structureId: 'stone_wall' }
    },
    {
      id: 'hw_02',
      name: 'Irrigation Systems',
      description: 'Unlocks Auto-Sprinklers.',
      cost: 250,
      tree: 'hardware',
      effect: { type: 'unlock_structure', structureId: 'auto_sprinkler' },
      prerequisiteId: 'hw_01'
    },
    {
      id: 'hw_03',
      name: 'Electrical Defense',
      description: 'Unlocks Copper Zappers.',
      cost: 500,
      tree: 'hardware',
      effect: { type: 'unlock_structure', structureId: 'copper_zapper' },
      prerequisiteId: 'hw_02'
    },
  ],
};
