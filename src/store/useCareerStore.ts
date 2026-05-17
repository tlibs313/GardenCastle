import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RESEARCH_TREES } from '../game/config/researchTrees';

interface CareerStats {
  pestsPopped: number;
  plantsHarvested: number;
  highestDifficultyCleared: number;
}

interface CareerState {
  totalRP: number;
  unlockedNodes: string[];
  stats: CareerStats;
  /**
   * Adds Research Points to the total career pool.
   * Only positive amounts are added.
   * @param amount The amount of RP to add.
   */
  addRP: (amount: number) => void;
  /**
   * Unlocks a research node if requirements are met.
   * Checks for sufficient RP and prevents duplicate unlocks.
   * @param nodeId The unique identifier of the node.
   * @param cost The RP cost to unlock.
   */
  unlockNode: (nodeId: string, cost: number) => void;
  /**
   * Checks if a specific plant or structure is unlocked by searching
   * through all unlocked nodes for a matching effect.
   * @param type The type of entity to check.
   * @param id The ID of the plant or structure.
   */
  isEntityUnlocked: (type: 'plant' | 'structure', id: string) => boolean;
  /**
   * Updates career statistics with the provided partial stats.
   * highestDifficultyCleared can only be increased.
   * @param newStats Partial career stats to merge into the current stats.
   */
  updateStats: (newStats: Partial<CareerStats>) => void;
  /**
   * Resets the career store to its initial state and clears persistent storage.
   */
  resetCareer: () => void;
}

const initialStats: CareerStats = {
  pestsPopped: 0,
  plantsHarvested: 0,
  highestDifficultyCleared: 0,
};

const initialState = {
  totalRP: 0,
  unlockedNodes: [],
  stats: initialStats,
};

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addRP: (amount) => {
        if (amount <= 0) return;
        set((state) => ({ totalRP: state.totalRP + amount }));
      },
      unlockNode: (nodeId, cost) =>
        set((state) => {
          // Defensive checks: ensure sufficient RP and no duplicate unlocks
          if (state.totalRP < cost || state.unlockedNodes.includes(nodeId)) {
            return state;
          }
          return {
            totalRP: state.totalRP - cost,
            unlockedNodes: [...state.unlockedNodes, nodeId],
          };
        }),
      isEntityUnlocked: (type, id) => {
        const { unlockedNodes } = get();
        // Flatten all research nodes to search their effects
        const allNodes = Object.values(RESEARCH_TREES).flat();
        
        return unlockedNodes.some(unlockedId => {
          const node = allNodes.find(n => n.id === unlockedId);
          if (!node) return false;
          
          if (type === 'plant' && node.effect.type === 'unlock_plant') {
            return node.effect.plantId === id;
          }
          if (type === 'structure' && node.effect.type === 'unlock_structure') {
            return node.effect.structureId === id;
          }
          return false;
        });
      },
      updateStats: (newStats) =>
        set((state) => {
          const updatedStats = { ...state.stats, ...newStats };
          
          // Ensure highestDifficultyCleared can only be increased
          if (newStats.highestDifficultyCleared !== undefined) {
            updatedStats.highestDifficultyCleared = Math.max(
              state.stats.highestDifficultyCleared,
              newStats.highestDifficultyCleared
            );
          }
          
          return { stats: updatedStats };
        }),
      resetCareer: () => {
        set(initialState);
        useCareerStore.persist?.clearStorage();
      },
    }),
    {
      name: 'garden-castle-career',
    }
  )
);

