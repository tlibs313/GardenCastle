import Phaser from 'phaser';
import { useGameStore } from '../../store/useGameStore';

export type SoilType = 'dirt' | 'sand' | 'rocks' | 'ash';

export interface SoilProperties {
  growthMultiplier: { [key: string]: number };
  waterDrainMultiplier: number;
  sunGenerationMultiplier: number;
}

export const SOIL_CONFIG: Record<SoilType, SoilProperties> = {
  dirt: {
    growthMultiplier: { objective: 1.0, offensive: 1.0, defensive: 1.0 },
    waterDrainMultiplier: 1.0,
    sunGenerationMultiplier: 1.0
  },
  sand: {
    growthMultiplier: { objective: 0.5, offensive: 1.5, defensive: 1.0 },
    waterDrainMultiplier: 2.0,
    sunGenerationMultiplier: 1.0
  },
  rocks: {
    growthMultiplier: { objective: 0.8, offensive: 0.8, defensive: 1.2 },
    waterDrainMultiplier: 0.5,
    sunGenerationMultiplier: 1.0
  },
  ash: {
    growthMultiplier: { objective: 1.2, offensive: 1.2, defensive: 1.2 },
    waterDrainMultiplier: 1.0,
    sunGenerationMultiplier: 2.0
  }
};

export class EnvironmentManager {
  public timeOfDay: 'day' | 'night' = 'day';
  public moistureProbability: number = 0.1;
  public soilType: SoilType = 'dirt';
  public forecast: number[] = [10, 20, 30]; // 3-day forecast
  private scene: Phaser.Scene;
  private cycleTimer: number = 0;
  private readonly DAY_DURATION = 30000; // 30 seconds for testing
  private readonly NIGHT_DURATION = 30000;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // Sync initial state
    useGameStore.getState().setTimeOfDay(this.timeOfDay);
    useGameStore.getState().setForecast(this.forecast);
  }

  public getSoilProperties(): SoilProperties {
    return SOIL_CONFIG[this.soilType];
  }

  update(delta: number) {
    this.cycleTimer += delta;

    if (this.timeOfDay === 'day' && this.cycleTimer >= this.DAY_DURATION) {
      this.transitionToNight();
    } else if (this.timeOfDay === 'night' && this.cycleTimer >= this.NIGHT_DURATION) {
      this.transitionToDay();
    }
  }

  private transitionToNight() {
    this.timeOfDay = 'night';
    this.cycleTimer = 0;
    this.scene.events.emit('cycle-changed', 'night');
    useGameStore.getState().setTimeOfDay('night');
  }

  private transitionToDay() {
    this.timeOfDay = 'day';
    this.cycleTimer = 0;
    
    // Check for rain
    if (Math.random() < this.moistureProbability) {
      this.triggerRain();
    } else {
      this.moistureProbability = Math.min(this.moistureProbability + 0.15, 0.9);
    }

    // Update forecast
    this.updateForecast();
    
    this.scene.events.emit('cycle-changed', 'day');
    useGameStore.getState().setTimeOfDay('day');
    useGameStore.getState().setForecast(this.forecast);
  }

  private triggerRain() {
    console.log("It's raining!");
    this.moistureProbability = 0.1; // Reset probability
    this.scene.events.emit('weather-changed', 'rain');
  }

  private updateForecast() {
    // Simple logic: next days are current probability + increments
    this.forecast = [
      Math.floor(this.moistureProbability * 100),
      Math.floor(Math.min(this.moistureProbability + 0.15, 0.9) * 100),
      Math.floor(Math.min(this.moistureProbability + 0.30, 0.9) * 100)
    ];
  }
}
