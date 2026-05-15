import { describe, it, expect, beforeEach } from 'vitest';
import { useCareerStore } from '../useCareerStore';

describe('useCareerStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    // Note: Since we are using persist, we might need to handle storage if needed,
    // but for unit tests of the state logic, we can just reset manually if possible
    // or rely on the fact that each test gets a fresh state if we were creating the store inside describe.
    // However, useCareerStore is a singleton.
    useCareerStore.setState({
      totalRP: 0,
      unlockedNodes: [],
      stats: {
        pestsPopped: 0,
        plantsHarvested: 0,
        highestDifficultyCleared: 0,
      },
    });
  });

  it('should have initial state', () => {
    const state = useCareerStore.getState();
    expect(state.totalRP).toBe(0);
    expect(state.unlockedNodes).toEqual([]);
    expect(state.stats).toEqual({
      pestsPopped: 0,
      plantsHarvested: 0,
      highestDifficultyCleared: 0,
    });
  });

  it('should add RP', () => {
    useCareerStore.getState().addRP(100);
    expect(useCareerStore.getState().totalRP).toBe(100);
  });

  it('should unlock a node and subtract cost', () => {
    useCareerStore.setState({ totalRP: 100 });
    useCareerStore.getState().unlockNode('test-node', 40);
    expect(useCareerStore.getState().totalRP).toBe(60);
    expect(useCareerStore.getState().unlockedNodes).toContain('test-node');
  });

  it('should update stats', () => {
    useCareerStore.getState().updateStats({ pestsPopped: 50 });
    expect(useCareerStore.getState().stats.pestsPopped).toBe(50);
    expect(useCareerStore.getState().stats.plantsHarvested).toBe(0);
  });
});
