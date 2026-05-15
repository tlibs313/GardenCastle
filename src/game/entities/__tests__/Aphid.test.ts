import { describe, it, expect, vi } from 'vitest';
import { Aphid } from '../Aphid';

// Mock Phaser
vi.mock('phaser', () => {
  class MockSprite {
    scene: any;
    x: number;
    y: number;
    texture: string;
    health: number = 10;
    speed: number = 50;
    isAttached: boolean = false;

    constructor(scene: any, x: number, y: number, texture: string) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.texture = texture;
    }
    setAcceleration() { return this; }
    setVelocity() { return this; }
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
        Angle: {
          Between: vi.fn().mockReturnValue(0)
        }
      }
    },
    Physics: {
      Arcade: {
        Sprite: MockSprite
      }
    },
    Math: {
      Angle: {
        Between: vi.fn().mockReturnValue(0)
      }
    }
  };
});

describe('Aphid', () => {
  it('should be initialized with default values', () => {
    const mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } }
    } as any;
    
    const aphid = new Aphid(mockScene, 100, 100);
    expect(aphid.health).toBe(10);
    expect(aphid.speed).toBe(50);
    expect(mockScene.add.existing).toHaveBeenCalledWith(aphid);
    expect(mockScene.physics.add.existing).toHaveBeenCalledWith(aphid);
  });
});
