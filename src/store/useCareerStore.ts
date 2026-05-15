import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    (set) => ({
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
