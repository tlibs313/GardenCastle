import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BossSquirrel } from '../BossSquirrel';
import { PEST_CONSTANTS } from '../../constants';
import Phaser from 'phaser';

// Mock Phaser
vi.mock('phaser', () => {
  class MockSprite {
    public x: number = 0;
    public y: number = 0;
    public width: number = 32;
    public height: number = 32;
    public scene: any;
    public health: number = 10;
    public maxHealth: number = 10;

    constructor(scene: any, x: number, y: number, texture: string) {
      this.scene = scene;
      this.x = x;
      this.y = y;
    }

    setInteractive() { return this; }
    on() { return this; }
    off() { return this; }
    destroy() { }
    setTint() { }
    clearTint() { }
    setVelocity() { }
    setScale() { }
    setDepth() { return this; }
    getBounds() { return { x: this.x, y: this.y, width: this.width, height: this.height }; }
  }

  class MockGraphics {
    scene: any;
    constructor(scene: any) { this.scene = scene; }
    clear() { return this; }
    fillStyle() { return this; }
    fillRect() { return this; }
    lineStyle() { return this; }
    strokeRect() { return this; }
    destroy() { }
    setVisible() { return this; }
    setDepth() { return this; }
  }

  return {
    default: {
      GameObjects: {
        Sprite: MockSprite,
        Graphics: MockGraphics,
      },
      Physics: {
        Arcade: {
          Sprite: MockSprite,
        },
      },
      Math: {
        Angle: {
          Between: vi.fn().mockReturnValue(0),
        },
      },
    },
  };
});

describe('BossSquirrel', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = {
      add: {
        existing: vi.fn(),
        graphics: vi.fn(() => ({
          clear: vi.fn().mockReturnThis(),
          fillStyle: vi.fn().mockReturnThis(),
          fillRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeRect: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
          setVisible: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
        })),
      },
      physics: {
        add: {
          existing: vi.fn(),
        },
      },
      events: {
        emit: vi.fn(),
      },
      time: {
        now: 0,
        addEvent: vi.fn(),
      },
    };
  });

  it('should initialize with boss constants', () => {
    const squirrel = new BossSquirrel(mockScene, 100, 100);
    expect(squirrel.health).toBe(PEST_CONSTANTS.BOSS.HEALTH);
    expect(squirrel.maxHealth).toBe(PEST_CONSTANTS.BOSS.HEALTH);
  });

  it('should take damage and get stunned on manual hit', () => {
    const squirrel = new BossSquirrel(mockScene, 100, 100);
    const initialHealth = squirrel.health;
    
    // Simulate pointerdown which should call manualHit
    squirrel.manualHit();
    
    expect(squirrel.health).toBe(initialHealth - PEST_CONSTANTS.BOSS.CLICK_DAMAGE);
    expect((squirrel as any).isStunned).toBe(true);
  });

  it('should enter dizzy state at 0 health', () => {
    const squirrel = new BossSquirrel(mockScene, 100, 100);
    squirrel.health = PEST_CONSTANTS.BOSS.CLICK_DAMAGE;
    
    squirrel.manualHit();
    
    expect(squirrel.health).toBe(0);
    expect((squirrel as any).isDizzy).toBe(true);
    expect(mockScene.events.emit).not.toHaveBeenCalledWith('pest-squished', expect.anything(), expect.anything());
  });

  it('should die only after a click in dizzy state', () => {
    const squirrel = new BossSquirrel(mockScene, 100, 100);
    squirrel.health = 0;
    (squirrel as any).isDizzy = true;
    
    squirrel.manualHit();
    
    expect(mockScene.events.emit).toHaveBeenCalledWith('pest-squished', expect.anything(), expect.anything());
  });
});
