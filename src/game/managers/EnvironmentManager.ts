import Phaser from 'phaser';

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
  private scene: Phaser.Scene;
  private cycleTimer: number = 0;
  private readonly DAY_DURATION = 30000; // 30 seconds for testing
  private readonly NIGHT_DURATION = 30000;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
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
    // Visual feedback handled by scene listener
  }

  private transitionToDay() {
    this.timeOfDay = 'day';
    this.cycleTimer = 0;
    this.scene.events.emit('cycle-changed', 'day');
    this.moistureProbability += 0.1; // Increase rain chance every day
  }
}
