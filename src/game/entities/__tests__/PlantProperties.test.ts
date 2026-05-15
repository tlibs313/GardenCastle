import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Plant } from '../Plant';
import { PLANT_CONSTANTS } from '../../constants';

// We need a concrete class to test the abstract Plant
class TestPlant extends Plant {
  constructor(scene: any, x: number, y: number) {
    super(scene, x, y, 'test-texture', 'objective');
  }

  getSpeciesId() { return 'test-species'; }
  getBaseRP() { return 0; }
  getDensityMultiplier(count: number) { return 1.0; }
}

vi.mock('phaser', () => {
  class MockSprite {
    scene: any;
    x: number;
    y: number;
    texture: string;
    health: number = 100;
    tint: number = 0;

    constructor(scene: any, x: number, y: number, texture: string) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.texture = texture;
    }
    setTint(color: number) { 
      this.tint = color; 
      return this; 
    }
    clearTint() { 
      this.tint = 0; 
      return this; 
    }
    setOrigin() { return this; }
    getBounds() { return { x: this.x, y: this.y, width: 32, height: 32 }; }
  }

  return {
    default: {
      Physics: {
        Arcade: {
          Sprite: MockSprite
        }
      },
      Math: {
        Between: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
      }
    },
    Physics: {
      Arcade: {
        Sprite: MockSprite
      }
    },
    Math: {
      Between: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
    }
  };
});

describe('Plant Properties', () => {
  let mockScene: any;
  let plant: any; // Using any to avoid type errors before properties exist

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      environmentManager: { timeOfDay: 'day' }
    };
    plant = new TestPlant(mockScene, 100, 100);
  });

  it('should have initial hydration and light level', () => {
    expect(plant.hydration).toBe(PLANT_CONSTANTS.INITIAL_HYDRATION);
    expect(plant.lightLevel).toBe(PLANT_CONSTANTS.INITIAL_LIGHT_LEVEL);
  });

  it('should decrease hydration over time', () => {
    const initialHydration = plant.hydration;
    plant.update(1000); // 1 second
    expect(plant.hydration).toBe(initialHydration - PLANT_CONSTANTS.HYDRATION_DECREASE_RATE * 1000);
  });

  it('should update lightLevel based on environmentManager timeOfDay', () => {
    mockScene.environmentManager.timeOfDay = 'night';
    plant.update(1000);
    expect(plant.lightLevel).toBe(PLANT_CONSTANTS.LIGHT_LEVELS.NIGHT);

    mockScene.environmentManager.timeOfDay = 'day';
    plant.update(1000);
    expect(plant.lightLevel).toBe(PLANT_CONSTANTS.LIGHT_LEVELS.DAY);
  });

  it('should wilt when hydration is low', () => {
    plant.hydration = PLANT_CONSTANTS.THRESHOLDS.WILTING - 10;
    plant.update(0);
    expect(plant.isWilting).toBe(true);
    expect(plant.tint).toBe(PLANT_CONSTANTS.TINTS.WILTING);
  });

  it('should glow when hydration and light are high', () => {
    plant.hydration = PLANT_CONSTANTS.THRESHOLDS.GLOWING + 10;
    plant.lightLevel = PLANT_CONSTANTS.THRESHOLDS.GLOWING + 10;
    plant.update(0);
    expect(plant.isGlowing).toBe(true);
    expect(plant.tint).toBe(PLANT_CONSTANTS.TINTS.GLOWING);
  });

  it('should clear tint when stats are normal', () => {
    plant.hydration = 50;
    plant.lightLevel = 50;
    plant.update(0);
    expect(plant.isWilting).toBe(false);
    expect(plant.isGlowing).toBe(false);
    expect(plant.tint).toBe(0);
  });
});
