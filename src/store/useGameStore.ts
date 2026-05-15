import { create } from 'zustand';

interface GameState {
  timeOfDay: 'day' | 'night';
  forecast: number[];
  setTimeOfDay: (time: 'day' | 'night') => void;
  setForecast: (forecast: number[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  timeOfDay: 'day',
  forecast: [10, 20, 30],
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setForecast: (forecast) => set({ forecast }),
}));
