import { describe, it, expect, beforeEach } from 'vitest';
import { useCareerStore } from '../useCareerStore';

describe('useCareerStore', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
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

  it('should have correct initial state', () => {
    const state = useCareerStore.getState();
    expect(state.totalRP).toBe(0);
    expect(state.unlockedNodes).toEqual([]);
    expect(state.stats).toEqual({
      pestsPopped: 0,
      plantsHarvested: 0,
      highestDifficultyCleared: 0,
    });
  });

  it('should add RP correctly', () => {
    useCareerStore.getState().addRP(100);
    expect(useCareerStore.getState().totalRP).toBe(100);
    
    useCareerStore.getState().addRP(50);
    expect(useCareerStore.getState().totalRP).toBe(150);
  });

  it('should unlock a node and subtract RP cost', () => {
    useCareerStore.setState({ totalRP: 100 });
    useCareerStore.getState().unlockNode('test-node', 40);
    
    expect(useCareerStore.getState().totalRP).toBe(60);
    expect(useCareerStore.getState().unlockedNodes).toContain('test-node');
  });

  it('should not unlock a node if RP is insufficient', () => {
    useCareerStore.setState({ totalRP: 30 });
    useCareerStore.getState().unlockNode('expensive-node', 40);
    
    expect(useCareerStore.getState().totalRP).toBe(30);
    expect(useCareerStore.getState().unlockedNodes).not.toContain('expensive-node');
  });

  it('should not unlock a node if it is already unlocked', () => {
    useCareerStore.setState({ 
      totalRP: 100, 
      unlockedNodes: ['already-unlocked'] 
    });
    
    useCareerStore.getState().unlockNode('already-unlocked', 40);
    
    // RP should not be subtracted again
    expect(useCareerStore.getState().totalRP).toBe(100);
    expect(useCareerStore.getState().unlockedNodes).toEqual(['already-unlocked']);
  });

  it('should update stats correctly', () => {
    useCareerStore.getState().updateStats({ pestsPopped: 50 });
    expect(useCareerStore.getState().stats.pestsPopped).toBe(50);
    expect(useCareerStore.getState().stats.plantsHarvested).toBe(0);
    
    useCareerStore.getState().updateStats({ plantsHarvested: 10 });
    expect(useCareerStore.getState().stats.plantsHarvested).toBe(10);
    expect(useCareerStore.getState().stats.pestsPopped).toBe(50);
  });
});
