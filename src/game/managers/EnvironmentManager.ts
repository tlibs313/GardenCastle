import Phaser from 'phaser';

export class EnvironmentManager {
  public timeOfDay: 'day' | 'night' = 'day';
  public moistureProbability: number = 0.1;
  private scene: Phaser.Scene;
  private cycleTimer: number = 0;
  private readonly DAY_DURATION = 30000; // 30 seconds for testing
  private readonly NIGHT_DURATION = 30000;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  update(delta: number) {
    this.cycleTimer += delta;
    
    if (this.timeOfDay === 'day' && this.cycleTimer >= this.DAY_DURATION) {
      this.transitionToNight();
    } else if (this.timeOfDay === 'night' && this.cycleTimer >= this.NIGHT_DURATION) {
      this.transitionToDay();
    }
  }

  private transitionToNight() {
    this.timeOfDay = 'night';
    this.cycleTimer = 0;
    this.scene.events.emit('cycle-changed', 'night');
    // Visual feedback handled by scene listener
  }

  private transitionToDay() {
    this.timeOfDay = 'day';
    this.cycleTimer = 0;
    this.scene.events.emit('cycle-changed', 'day');
    this.moistureProbability += 0.1; // Increase rain chance every day
  }
}
