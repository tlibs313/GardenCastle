import Phaser from 'phaser';

export abstract class Pest extends Phaser.Physics.Arcade.Sprite {
  public health: number = 10;
  public maxHealth: number = 10;
  public speed: number = 50;
  public isAttached: boolean = false;
  public isTargetable: boolean = true;
  protected lastHitTime: number = 0;
  protected targetPlant: any = null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    this.lastHitTime = this.scene.time.now;
    if (this.health <= 0) this.die();
  }

  protected die() {
    this.scene.events.emit('pest-squished', this.x, this.y);
    this.destroy();
  }
}
