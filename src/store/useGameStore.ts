import { create } from 'zustand';

interface GameState {
  timeOfDay: 'day' | 'night';
  forecast: number[];
  isHubOpen: boolean;
  isBuildMode: boolean;
  selectedStructureType: string;
  
  // Dashboard Info
  waveNumber: number;
  pestsKilled: number;
  pestsToSpawn: number;
  incomingPests: Record<string, number>;
  plantCount: number;
  plantLimit: number;

  setTimeOfDay: (time: 'day' | 'night') => void;
  setForecast: (forecast: number[]) => void;
  setHubOpen: (open: boolean) => void;
  setBuildMode: (active: boolean) => void;
  setSelectedStructureType: (type: string) => void;
  
  // Dashboard Actions
  setWaveInfo: (wave: number, total: number, incoming: Record<string, number>) => void;
  incrementKills: () => void;
  updatePlantCount: (count: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  timeOfDay: 'day',
  forecast: [10, 20, 30],
  isHubOpen: false,
  isBuildMode: false,
  selectedStructureType: 'stone_wall',
  
  waveNumber: 1,
  pestsKilled: 0,
  pestsToSpawn: 0,
  incomingPests: {},
  plantCount: 0,
  plantLimit: 12, // Starting limit

  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setForecast: (forecast) => set({ forecast }),
  setHubOpen: (open) => set({ isHubOpen: open }),
  setBuildMode: (active) => set({ isBuildMode: active }),
  setSelectedStructureType: (type) => set({ selectedStructureType: type }),

  setWaveInfo: (wave, total, incoming) => set({ 
    waveNumber: wave, 
    pestsToSpawn: total, 
    incomingPests: incoming,
    pestsKilled: 0 
  }),
  incrementKills: () => set((state) => ({ pestsKilled: state.pestsKilled + 1 })),
  updatePlantCount: (count) => set({ plantCount: count }),
}));
