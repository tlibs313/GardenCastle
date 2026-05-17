import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Structure } from '../Structure';

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
  }

  return {
    default: {
      Physics: { Arcade: { Sprite: MockSprite } },
    },
    Physics: { Arcade: { Sprite: MockSprite } },
  };
});

class TestStructure extends Structure {
  constructor(scene: any, x: number, y: number, type: string, durability: number, anchorSoil: string[]) {
    super(scene, x, y, 'test-texture', type, durability, anchorSoil);
  }
}

describe('Structure Base Class', () => {
  let mockScene: any;

  beforeEach(() => {
    mockScene = {
      add: { existing: vi.fn() },
      physics: { add: { existing: vi.fn() } },
      events: { emit: vi.fn() }
    } as any;
  });

  it('should initialize with correct properties', () => {
    const structure = new TestStructure(mockScene, 100, 100, 'test_structure', 100, ['dirt']);
    
    expect(structure.structureType).toBe('test_structure');
    expect(structure.durability).toBe(100);
    expect(structure.maxDurability).toBe(100);
    expect(structure.anchorSoil).toEqual(['dirt']);
    expect(structure.isBroken).toBe(false);
  });

  it('should take damage correctly', () => {
    const structure = new TestStructure(mockScene, 100, 100, 'test_structure', 100, ['dirt']);
    structure.takeDamage(30);
    expect(structure.durability).toBe(70);
  });

  it('should not have negative durability', () => {
    const structure = new TestStructure(mockScene, 100, 100, 'test_structure', 100, ['dirt']);
    structure.takeDamage(150);
    expect(structure.durability).toBe(0);
  });

  it('should break and emit event when durability reaches 0', () => {
    const structure = new TestStructure(mockScene, 100, 100, 'test_structure', 100, ['dirt']);
    const destroySpy = vi.spyOn(structure, 'destroy');
    
    structure.takeDamage(100);
    
    expect(structure.isBroken).toBe(true);
    expect(mockScene.events.emit).toHaveBeenCalledWith('structure-broken', structure);
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should return correct display name', () => {
    const structure = new TestStructure(mockScene, 100, 100, 'stone_wall', 100, ['rocks']);
    expect(structure.getDisplayName()).toBe('STONE WALL');
  });
});
