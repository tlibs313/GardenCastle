import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    // Draw 10x10 garden grid
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x2e7d32, 0.5);
    for (let i = 0; i <= 10; i++) {
      graphics.moveTo(i * 40 + 200, 100);
      graphics.lineTo(i * 40 + 200, 500);
      graphics.moveTo(200, i * 40 + 100);
      graphics.lineTo(600, i * 40 + 100);
    }
    graphics.strokePath();

    // Central Castle Placeholder
    this.add.text(400, 300, '🏰', { fontSize: '48px' }).setOrigin(0.5);
  }
}
