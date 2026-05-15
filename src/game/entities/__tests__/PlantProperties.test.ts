import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Plant } from '../Plant';

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
      timeOfDay: 0.5 // Default mid-day
    };
    plant = new TestPlant(mockScene, 100, 100);
  });

  it('should have initial hydration and light level', () => {
    expect(plant.hydration).toBe(80);
    expect(plant.lightLevel).toBe(50);
  });

  it('should decrease hydration over time', () => {
    const initialHydration = plant.hydration;
    plant.update(1000); // 1 second
    expect(plant.hydration).toBeLessThan(initialHydration);
  });

  it('should update lightLevel based on scene timeOfDay', () => {
    mockScene.timeOfDay = 0; // Midnight
    plant.update(1000);
    expect(plant.lightLevel).toBeLessThan(50);

    mockScene.timeOfDay = 0.5; // Noon
    plant.update(1000);
    expect(plant.lightLevel).toBeGreaterThan(0);
  });

  it('should wilt when hydration is low', () => {
    plant.hydration = 20;
    plant.update(0);
    expect(plant.isWilting).toBe(true);
    expect(plant.tint).toBe(0x884400);
  });

  it('should glow when hydration and light are high', () => {
    plant.hydration = 90;
    plant.lightLevel = 90;
    plant.update(0);
    expect(plant.isGlowing).toBe(true);
    expect(plant.tint).toBe(0xffff00);
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
