import { describe, it, expect, vi } from 'vitest';
import { ResearchManager } from '../ResearchManager';
import { Plant } from '../../entities/Plant';
import { RESEARCH_CONSTANTS, PLANT_CONSTANTS } from '../../constants';

// Mock Plant to avoid Phaser dependencies
vi.mock('../../entities/Plant', () => {
  return {
    Plant: class {
      health: number;
      maxHealth: number = 100;
      plantType: 'objective' | 'defensive' | 'offensive';
      texture: { key: string };

      constructor(type: 'objective' | 'defensive' | 'offensive', texture: string, health: number = 100) {
        this.plantType = type;
        this.texture = { key: texture };
        this.health = health;
      }

      getSpeciesId() {
        return this.texture.key;
      }

      getBaseRP() {
        switch (this.plantType) {
          case 'objective': return 50;
          case 'defensive': return 20;
          case 'offensive': return 10;
        }
      }

      getDensityMultiplier(count: number) {
        if (this.texture.key === 'rose' || this.texture.key === 'sunflower') {
          return 1.0 + count * 0.1;
        }
        if (this.texture.key === 'cactus' || this.texture.key === 'venus_chainsaw') {
          return 1.0 / (count * 0.5);
        }
        return 1.0;
      }
    }
  };
});

// Concrete class for testing to avoid "cannot instantiate abstract class" error
class MockPlant extends Plant {
  constructor(type: 'objective' | 'defensive' | 'offensive', texture: string, health: number = 100) {
    // At runtime, the mocked Plant constructor expects (type, texture, health)
    // We pass 5 arguments to satisfy the real Plant constructor's TS signature
    super(type as any, texture as any, health as any, undefined as any, undefined as any);
  }

  // Implementation to satisfy abstract class requirements
  getSpeciesId(): string {
    return (this as any).texture.key;
  }

  getBaseRP(): number {
    switch (this.plantType) {
      case 'objective': return 50;
      case 'defensive': return 20;
      case 'offensive': return 10;
    }
  }

  getDensityMultiplier(count: number): number {
    const key = (this as any).texture.key;
    if (key === 'rose' || key === 'sunflower') {
      return 1.0 + count * 0.1;
    }
    if (key === 'cactus' || key === 'venus_chainsaw') {
      return 1.0 / (count * 0.5);
    }
    return 1.0;
  }
}

describe('ResearchManager', () => {
  describe('calculateRP', () => {
    it('should calculate base RP for different plant types', () => {
      const plants = [
        new MockPlant('objective', 'rose', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
        new MockPlant('defensive', 'stone', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
        new MockPlant('offensive', 'cactus', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
      ];
      
      // Obj: (50 + 10) * 1 * (1.1 for count 1) = 66
      // Def: (20 + 10) * 1 * (1.0 for count 1) = 30
      // Off: (10 + 10) * 1 * (1 / (1 * 0.5) = 2.0 for count 1) = 40
      // Total: 66 + 30 + 40 = 136
      const rp = ResearchManager.calculateRP(plants, 1);
      expect(rp).toBe(136);
    });

    it('should apply difficulty multiplier', () => {
      const plants = [new MockPlant('defensive', 'stone', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant];
      // (20 + 10) * 2 * 1.0 = 60
      const rp = ResearchManager.calculateRP(plants, 2);
      expect(rp).toBe(60);
    });

    it('should scale health bonus based on current health', () => {
      const plants = [
        new MockPlant('defensive', 'stone', 50) as unknown as Plant, // (20 + 5) = 25
      ];
      const rp = ResearchManager.calculateRP(plants, 1);
      expect(rp).toBe(25);
    });

    it('should apply symbiotic bonus for Roses/Sunflowers', () => {
      const plants = [
        new MockPlant('objective', 'rose', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
        new MockPlant('objective', 'rose', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
      ];
      // Base: (50 + 10) * 2 = 120
      // Density Mult: 1.0 + (2 * 0.1) = 1.2
      // Total: 120 * 1.2 = 144
      const rp = ResearchManager.calculateRP(plants, 1);
      expect(rp).toBe(144);
    });

    it('should apply competitive penalty for Cacti/Venus Chainsaws', () => {
      const plants3 = [
        new MockPlant('offensive', 'cactus', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
        new MockPlant('offensive', 'cactus', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
        new MockPlant('offensive', 'cactus', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
      ];
      // Base: (10 + 10) * 3 = 60
      // Density Mult: 1.0 / (3 * 0.5) = 0.666...
      // Total: 60 * 0.666... = 40
      const rp = ResearchManager.calculateRP(plants3, 1);
      expect(rp).toBe(40);
    });

    it('should return floor of total RP', () => {
      const plants = [new MockPlant('defensive', 'stone', 45) as unknown as Plant];
      // (20 + 4.5) * 1 = 24.5 -> 24
      const rp = ResearchManager.calculateRP(plants, 1);
      expect(rp).toBe(24);
    });

    it('should calculate RP correctly for a mix of species', () => {
      const plants = [
        new MockPlant('objective', 'rose', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
        new MockPlant('objective', 'rose', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
        new MockPlant('offensive', 'cactus', PLANT_CONSTANTS.MAX_HEALTH) as unknown as Plant,
      ];
      // Rose 1: (50 + 10) * 1 * (1.0 + 2 * 0.1 = 1.2) = 72
      // Rose 2: (50 + 10) * 1 * (1.0 + 2 * 0.1 = 1.2) = 72
      // Cactus: (10 + 10) * 1 * (1.0 / (1 * 0.5) = 2.0) = 40
      // Total: 72 + 72 + 40 = 184
      const rp = ResearchManager.calculateRP(plants, 1);
      expect(rp).toBe(184);
    });
  });
});
