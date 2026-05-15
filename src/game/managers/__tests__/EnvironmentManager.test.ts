import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnvironmentManager } from '../EnvironmentManager';
import Phaser from 'phaser';

describe('EnvironmentManager', () => {
  let scene: Phaser.Scene;
  let envManager: EnvironmentManager;

  beforeEach(() => {
    // Mock Phaser.Scene
    scene = {
      events: {
        emit: vi.fn()
      }
    } as unknown as Phaser.Scene;
    envManager = new EnvironmentManager(scene);
  });

  it('should start at Day with 0.1 moisture probability', () => {
    expect(envManager.timeOfDay).toBe('day');
    expect(envManager.moistureProbability).toBe(0.1);
  });

  it('should transition to Night after DAY_DURATION', () => {
    // DAY_DURATION is 30000ms
    envManager.update(30000);
    expect(envManager.timeOfDay).toBe('night');
    expect(scene.events.emit).toHaveBeenCalledWith('cycle-changed', 'night');
  });

  it('should transition back to Day after NIGHT_DURATION and increase moisture chance', () => {
    // Transition to night first
    envManager.update(30000);
    expect(envManager.timeOfDay).toBe('night');

    // Transition to day
    envManager.update(30000);
    expect(envManager.timeOfDay).toBe('day');
    expect(envManager.moistureProbability).toBeCloseTo(0.2);
    expect(scene.events.emit).toHaveBeenCalledWith('cycle-changed', 'day');
  });
});
