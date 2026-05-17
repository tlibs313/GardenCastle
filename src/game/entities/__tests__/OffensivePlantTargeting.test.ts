import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OffensivePlant } from '../OffensivePlant';
import { Aphid } from '../Aphid';
import { CamoLocust } from '../CamoLocust';

// Mock Phaser
vi.mock('phaser', () => {
  class MockSprite {
    scene: any;
    x: number;
    y: number;
    texture: string;
    constructor(scene: any, x: number, y: number, texture: string) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.texture = texture;
    }
    destroy = vi.fn();
    setInteractive = vi.fn().mockReturnThis();
    on = vi.fn().mockReturnThis();
    setVelocity = vi.fn().mockReturnThis();
    setTint = vi.fn().mockReturnThis();
    clearTint = vi.fn().mockReturnThis();
    setAlpha = vi.fn().mockReturnThis();
    setData = vi.fn().mockReturnThis();
    getData = vi.fn().mockReturnValue(0);
  }

  return {
    default: {
      Physics: { Arcade: { Sprite: MockSprite } },
      Math: {
        Angle: {
          Between: vi.fn().mockReturnValue(0)
        },
        Distance: {
          Between: (x1: number, y1: number, x2: number, y2: number) => {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          }
        },
        Between: vi.fn().mockReturnValue(5)
      },
      GameObjects: { Sprite: MockSprite }
    },
    Physics: { Arcade: { Sprite: MockSprite } },
    Math: {
      Angle: {
        Between: vi.fn().mockReturnValue(0)
      },
      Distance: {
        Between: (x1: number, y1: number, x2: number, y2: number) => {
          return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
      },
      Between: vi.fn().mockReturnValue(5)
    },
    GameObjects: { Sprite: MockSprite }
  };
});

// Mock Seed to avoid circular dependency issues
vi.mock('../Seed', () => {
  return {
    Seed: class {
      constructor() {}
      setVelocity() {}
    }
  };
});

describe('OffensivePlant Targeting', () => {
  let mockScene: any;
  let offensivePlant: OffensivePlant;

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      time: { now: 1000 },
      events: { emit: vi.fn() },
      pestsGroup: {
        getChildren: vi.fn()
      },
      seedsGroup: {
        add: vi.fn()
      }
    };
    offensivePlant = new OffensivePlant(mockScene, 100, 100);
  });

  it('should only target targetable pests', () => {
    const targetableAphid = new Aphid(mockScene, 150, 100); // 50 units away
    const untargetableLocust = new CamoLocust(mockScene, 120, 100); // 20 units away (closer)
    
    // Ensure CamoLocust is actually untargetable
    expect(untargetableLocust.isTargetable).toBe(false);
    expect(targetableAphid.isTargetable).toBe(true);

    mockScene.pestsGroup.getChildren.mockReturnValue([targetableAphid, untargetableLocust]);

    // Use a spy on fireSpray to see what it targets
    // fireSpray is private, so we'll cast to any
    const fireSpraySpy = vi.spyOn(offensivePlant as any, 'fireSpray');

    // Trigger shoot by calling update with enough delta
    offensivePlant.update(2001); // fireRate is 2000 in constants

    // Should target targetableAphid despite untargetableLocust being closer
    expect(fireSpraySpy).toHaveBeenCalledWith(targetableAphid);
    expect(fireSpraySpy).not.toHaveBeenCalledWith(untargetableLocust);
  });
});
