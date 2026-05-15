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
   * Adds Research Points to the total.
   * @param amount The number of RP to add.
   */
  addRP: (amount: number) => void;
  /**
   * Unlocks a node if the player has enough RP and it's not already unlocked.
   * @param nodeId Unique identifier for the node to unlock.
   * @param cost The cost in RP to unlock the node.
   */
  unlockNode: (nodeId: string, cost: number) => void;
  /**
   * Updates career statistics with partial data.
   * @param newStats Object containing stats to update.
   */
  updateStats: (newStats: Partial<CareerStats>) => void;
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set) => ({
      totalRP: 0,
      unlockedNodes: [],
      stats: {
        pestsPopped: 0,
        plantsHarvested: 0,
        highestDifficultyCleared: 0,
      },
      addRP: (amount) => set((state) => ({ totalRP: state.totalRP + amount })),
      unlockNode: (nodeId, cost) =>
        set((state) => {
          // Check if already unlocked or insufficient RP
          if (state.unlockedNodes.includes(nodeId) || state.totalRP < cost) {
            return state;
          }
          return {
            totalRP: state.totalRP - cost,
            unlockedNodes: [...state.unlockedNodes, nodeId],
          };
        }),
      updateStats: (newStats) =>
        set((state) => ({ stats: { ...state.stats, ...newStats } })),
    }),
    {
      name: 'garden-castle-career',
    }
  )
);
