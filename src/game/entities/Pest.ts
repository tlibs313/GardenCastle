import Phaser from 'phaser';
import { Plant } from './Plant';

export abstract class Pest extends Phaser.Physics.Arcade.Sprite {
  public health: number = 10;
  public maxHealth: number = 10;
  public speed: number = 50;
  public damageRate: number = 0.01;
  public isAttached: boolean = false;
  public isTargetable: boolean = true;
  public targetPlant: Plant | null = null;
  protected lastHitTime: number = 0;
  private timeElapsed: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.on('pointerdown', () => {
      this.squish();
    });
  }

  /**
   * Called when the pest is manually squished or hit by a projectile that insta-kills.
   */
  public squish() {
    this.die();
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    this.lastHitTime = this.scene.time.now;
    if (this.health <= 0) this.die();
  }

  protected die() {
    if (this.targetPlant) {
      this.targetPlant.removePest(this);
    }
    this.scene.events.emit('pest-squished', this.x, this.y);
    this.destroy();
  }

  update(time: number, delta: number) {
    if (this.isAttached) {
      if (this.targetPlant) {
        this.targetPlant.takeDamage(this.damageRate * delta);
      }
      return;
    }

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
