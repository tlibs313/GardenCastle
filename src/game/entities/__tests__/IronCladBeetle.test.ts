import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IronCladBeetle } from '../IronCladBeetle';
import { PEST_CONSTANTS } from '../../constants';

// Mock Phaser
vi.mock('phaser', () => {
  class MockSprite {
    scene: any;
    x: number;
    y: number;
    texture: string;
    scale: number = 1;
    tint: number = 0xffffff;

    constructor(scene: any, x: number, y: number, texture: string) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.texture = texture;
    }

    setScale(scale: number) {
      this.scale = scale;
      return this;
    }

    setTint(tint: number) {
      this.tint = tint;
      return this;
    }

    destroy = vi.fn();
    setInteractive = vi.fn().mockReturnThis();
    on = vi.fn().mockReturnThis();
    setVelocity = vi.fn().mockReturnThis();
  }

  return {
    default: {
      Physics: { Arcade: { Sprite: MockSprite } },
      Math: {
        Angle: {
          Between: vi.fn().mockReturnValue(0)
        }
      }
    },
    Physics: { Arcade: { Sprite: MockSprite } },
    Math: {
      Angle: {
        Between: vi.fn().mockReturnValue(0)
      }
    }
  };
});

describe('IronCladBeetle', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      time: { now: 1000 },
      events: { emit: vi.fn() }
    };
  });

  it('should initialize with beetle constants', () => {
    const beetle = new IronCladBeetle(mockScene, 100, 100);
    
    expect(beetle.health).toBe(PEST_CONSTANTS.BEETLE.HEALTH);
    expect(beetle.maxHealth).toBe(PEST_CONSTANTS.BEETLE.HEALTH);
    expect(beetle.speed).toBe(PEST_CONSTANTS.BEETLE.SPEED);
    expect(beetle.scale).toBe(1.5);
    expect(beetle.tint).toBe(0x888888);
  });

  it('should apply damage reduction', () => {
    const beetle = new IronCladBeetle(mockScene, 100, 100);
    const initialHealth = beetle.health;
    const damageAmount = 10;
    
    beetle.takeDamage(damageAmount);
    
    // DR is 0.1, so 10% damage taken. 10 * 0.1 = 1 damage.
    expect(beetle.health).toBe(initialHealth - (damageAmount * PEST_CONSTANTS.BEETLE.DR));
  });

  it('should die when health reaches 0', () => {
    const beetle = new IronCladBeetle(mockScene, 100, 100);
    const destroySpy = vi.spyOn(beetle, 'destroy');
    
    // Beetle has 50 health, DR is 0.1.
    // 50 / 0.1 = 500 damage needed to kill.
    beetle.takeDamage(500);
    
    expect(beetle.health).toBe(0);
    expect(destroySpy).toHaveBeenCalled();
  });
});
