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
  addRP: (amount: number) => void;
  unlockNode: (nodeId: string, cost: number) => void;
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
        set((state) => ({
          totalRP: state.totalRP - cost,
          unlockedNodes: [...state.unlockedNodes, nodeId],
        })),
      updateStats: (newStats) =>
        set((state) => ({ stats: { ...state.stats, ...newStats } })),
    }),
    {
      name: 'garden-castle-career',
    }
  )
);
