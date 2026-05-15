import { create } from 'zustand';

interface GameState {
  timeOfDay: 'day' | 'night';
  forecast: number[];
  isHubOpen: boolean;
  setTimeOfDay: (time: 'day' | 'night') => void;
  setForecast: (forecast: number[]) => void;
  setHubOpen: (open: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  timeOfDay: 'day',
  forecast: [10, 20, 30],
  isHubOpen: false,
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setForecast: (forecast) => set({ forecast }),
  setHubOpen: (open) => set({ isHubOpen: open }),
}));
