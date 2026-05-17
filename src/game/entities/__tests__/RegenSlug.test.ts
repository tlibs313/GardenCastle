import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegenSlug } from '../RegenSlug';
import { PEST_CONSTANTS } from '../../constants';

// Mock Phaser
vi.mock('phaser', () => {
  class MockSprite {
    scene: any;
    x: number;
    y: number;
    texture: string;
    health: number = 10;
    maxHealth: number = 10;
    speed: number = 50;
    damageRate: number = 0.01;
    isAttached: boolean = false;
    isTargetable: boolean = true;
    targetPlant: any = null;
    lastHitTime: number = 0;

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
    setPosition = vi.fn().mockReturnThis();
    setTint = vi.fn().mockReturnThis();
    clearTint = vi.fn().mockReturnThis();
  }

  return {
    default: {
      Physics: { Arcade: { Sprite: MockSprite } },
      Math: {
        Angle: {
          Between: vi.fn().mockReturnValue(0)
        },
        Between: vi.fn().mockReturnValue(0)
      }
    },
    Physics: { Arcade: { Sprite: MockSprite } },
    Math: {
      Angle: {
        Between: vi.fn().mockReturnValue(0)
      },
      Between: vi.fn().mockReturnValue(0)
    }
  };
});

describe('RegenSlug', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      time: { now: 1000 },
      events: { emit: vi.fn() }
    };
  });

  it('should initialize with slug constants', () => {
    const slug = new RegenSlug(mockScene, 100, 100);
    expect(slug.maxHealth).toBe(PEST_CONSTANTS.SLUG.HEALTH);
    expect(slug.health).toBe(PEST_CONSTANTS.SLUG.HEALTH);
    expect(slug.speed).toBe(PEST_CONSTANTS.SLUG.SPEED);
  });

  it('should recover health after delay', () => {
    const slug = new RegenSlug(mockScene, 100, 100);
    slug.health = 10; // Damaged
    slug.takeDamage(0); // Updates lastHitTime to mockScene.time.now (1000)
    
    // Update before delay (1000 + 1000 = 2000, delay is 2000)
    mockScene.time.now = 2000;
    slug.update(2000, 1000);
    expect(slug.health).toBe(10); // No regen yet
    
    // Update after delay
    mockScene.time.now = 3500; // 2500ms after last hit
    slug.update(3500, 1000); // 1 second delta
    expect(slug.health).toBeGreaterThan(10);
    expect(slug.health).toBe(10 + PEST_CONSTANTS.SLUG.REGEN_RATE);
  });

  it('should clamp recovery to maxHealth', () => {
    const slug = new RegenSlug(mockScene, 100, 100);
    slug.health = PEST_CONSTANTS.SLUG.HEALTH - 0.1;
    mockScene.time.now = 4000;
    slug.update(4000, 1000);
    expect(slug.health).toBe(PEST_CONSTANTS.SLUG.HEALTH);
  });

  it('should heal when dealing damage (Life Steal)', () => {
    const slug = new RegenSlug(mockScene, 100, 100);
    const mockPlant = {
      takeDamage: vi.fn()
    };
    slug.isAttached = true;
    slug.targetPlant = mockPlant as any;
    slug.health = 10;
    
    const delta = 1000;
    const expectedDamage = slug.damageRate * delta;
    const expectedHeal = expectedDamage * PEST_CONSTANTS.SLUG.LIFE_STEAL_MULT;
    
    slug.update(5000, delta);
    
    expect(mockPlant.takeDamage).toHaveBeenCalledWith(expectedDamage);
    expect(slug.health).toBe(10 + expectedHeal);
  });
});
