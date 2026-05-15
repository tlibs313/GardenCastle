import { describe, test, expect } from 'vitest';
import { RESEARCH_TREES } from '../researchTrees';

describe('Research Trees Data', () => {
  test('should have water, tool, and biology paths', () => {
    expect(RESEARCH_TREES).toHaveProperty('water');
    expect(RESEARCH_TREES).toHaveProperty('tool');
    expect(RESEARCH_TREES).toHaveProperty('biology');
  });

  test('water path should be linear with prerequisites', () => {
    const waterNodes = RESEARCH_TREES.water;
    expect(waterNodes.length).toBeGreaterThan(0);
    
    // Check linear structure (except for the first node)
    waterNodes.forEach((node, index) => {
      if (index > 0) {
        expect(node.prerequisiteId).toBe(waterNodes[index - 1].id);
      } else {
        expect(node.prerequisiteId).toBeUndefined();
      }
    });
  });

  test('nodes should have required properties', () => {
    const allNodes = [
      ...RESEARCH_TREES.water,
      ...RESEARCH_TREES.tool,
      ...RESEARCH_TREES.biology,
    ];

    allNodes.forEach(node => {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('name');
      expect(node).toHaveProperty('description');
      expect(node).toHaveProperty('cost');
      expect(node).toHaveProperty('effect');
      expect(node.effect).toHaveProperty('type');
    });
  });

  test('effects should have correct properties based on type', () => {
    RESEARCH_TREES.water.forEach(node => {
      if (node.effect.type === 'modifier') {
        expect(node.effect).toHaveProperty('stat');
        expect(node.effect).toHaveProperty('value');
      }
    });

    RESEARCH_TREES.biology.forEach(node => {
      if (node.effect.type === 'unlock_plant') {
        expect(node.effect).toHaveProperty('plantId');
      }
    });
  });
});
