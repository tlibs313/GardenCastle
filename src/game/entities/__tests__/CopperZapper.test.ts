import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CopperZapper } from '../CopperZapper';
import { STRUCTURE_CONSTANTS } from '../../constants';

// Mock Phaser
vi.mock('phaser', () => {
  class MockSprite {
    scene: any;
    x: number;
    y: number;
    texture: string;
    active: boolean = true;
    constructor(scene: any, x: number, y: number, texture: string) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.texture = texture;
    }
    destroy = vi.fn();
    setInteractive = vi.fn().mockReturnThis();
    on = vi.fn().mockReturnThis();
    setTint = vi.fn().mockReturnThis();
    getBounds = vi.fn().mockReturnValue({ x: 0, y: 0, width: 32, height: 32 });
  }

  return {
    default: {
      Physics: { Arcade: { Sprite: MockSprite } },
      Math: {
        Distance: {
          Between: (x1: number, y1: number, x2: number, y2: number) => {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          }
        }
      }
    },
    Physics: { Arcade: { Sprite: MockSprite } },
    Math: {
      Distance: {
        Between: (x1: number, y1: number, x2: number, y2: number) => {
          return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
      }
    }
  };
});

describe('CopperZapper', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = {
      add: { 
        existing: vi.fn(),
        graphics: vi.fn().mockReturnValue({
          lineStyle: vi.fn().mockReturnThis(),
          moveTo: vi.fn().mockReturnThis(),
          lineTo: vi.fn().mockReturnThis(),
          strokePath: vi.fn().mockReturnThis(),
          destroy: vi.fn()
        })
      },
      physics: { add: { existing: vi.fn() } },
      events: { 
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn()
      },
      time: { now: 0 },
      tweens: {
        add: vi.fn()
      },
      pestsGroup: {
        getChildren: vi.fn().mockReturnValue([])
      }
    } as any;
  });

  it('should initialize correctly', () => {
    const zapper = new CopperZapper(mockScene, 100, 100);
    expect(zapper.structureType).toBe(STRUCTURE_CONSTANTS.TYPES.ZAPPER);
    expect(zapper.durability).toBe(STRUCTURE_CONSTANTS.STATS.copper_zapper.durability);
    expect(mockScene.events.on).toHaveBeenCalledWith('update', expect.any(Function), zapper);
  });

  it('should zap a pest within range', () => {
    const zapper = new CopperZapper(mockScene, 100, 100);
    const mockPest = {
      x: 120,
      y: 100,
      active: true,
      takeDamage: vi.fn()
    };
    mockScene.pestsGroup.getChildren.mockReturnValue([mockPest]);

    zapper.update(1000);

    expect(mockPest.takeDamage).toHaveBeenCalledWith(STRUCTURE_CONSTANTS.STATS.copper_zapper.damage);
    expect(zapper.durability).toBe(STRUCTURE_CONSTANTS.STATS.copper_zapper.durability - 1);
  });

  it('should not zap a pest out of range', () => {
    const zapper = new CopperZapper(mockScene, 100, 100);
    const mockPest = {
      x: 200, // Range is 80
      y: 100,
      active: true,
      takeDamage: vi.fn()
    };
    mockScene.pestsGroup.getChildren.mockReturnValue([mockPest]);

    zapper.update(1000);

    expect(mockPest.takeDamage).not.toHaveBeenCalled();
    expect(zapper.durability).toBe(STRUCTURE_CONSTANTS.STATS.copper_zapper.durability);
  });

  it('should respect cooldown', () => {
    const zapper = new CopperZapper(mockScene, 100, 100);
    const mockPest = {
      x: 120,
      y: 100,
      active: true,
      takeDamage: vi.fn()
    };
    mockScene.pestsGroup.getChildren.mockReturnValue([mockPest]);

    zapper.update(1000); // First shot
    expect(mockPest.takeDamage).toHaveBeenCalledTimes(1);

    zapper.update(1500); // Cooldown is 1000ms
    expect(mockPest.takeDamage).toHaveBeenCalledTimes(1);

    zapper.update(2001); // After cooldown
    expect(mockPest.takeDamage).toHaveBeenCalledTimes(2);
  });

  it('should clean up listener on break', () => {
    const zapper = new CopperZapper(mockScene, 100, 100);
    zapper.takeDamage(zapper.durability);
    
    expect(mockScene.events.off).toHaveBeenCalledWith('update', expect.any(Function), zapper);
  });
});
