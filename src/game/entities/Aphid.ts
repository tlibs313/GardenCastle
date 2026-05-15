import Phaser from 'phaser';
import { Pest } from './Pest';

export class Aphid extends Pest {
  private timeElapsed: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Use a placeholder texture string for now
    super(scene, x, y, 'aphid-placeholder');
  }

  update(time: number, delta: number) {
    if (this.isAttached) return;

    this.timeElapsed += delta;

    // Movement toward (400, 300) with zig-zag effect
    const targetX = 400;
    const targetY = 300;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    
    // Base velocity toward target
    const vx = Math.cos(angle) * this.speed;
    const vy = Math.sin(angle) * this.speed;

    // Zig-zag offset using sin/cos waves
    const zigZagOffset = Math.sin(this.timeElapsed / 200) * 30;
    const ox = Math.cos(angle + Math.PI / 2) * zigZagOffset;
    const oy = Math.sin(angle + Math.PI / 2) * zigZagOffset;

    this.setVelocity(vx + ox, vy + oy);
  }
}
