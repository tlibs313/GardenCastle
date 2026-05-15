import Phaser from 'phaser';

export class Seed extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'seed-placeholder');
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update() {
    // Destroy if out of bounds
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.destroy();
    }
  }
}
