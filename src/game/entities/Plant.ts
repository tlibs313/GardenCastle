import Phaser from 'phaser';
import { Pest } from './Pest';

export abstract class Plant extends Phaser.Physics.Arcade.Sprite {
  public health: number = 100;
  public level: number = 1;
  public plantType: 'objective' | 'defensive' | 'offensive';
  public attachedPests: Pest[] = [];
  public baseGrowthRate: number = 0.01;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: 'objective' | 'defensive' | 'offensive') {
    super(scene, x, y, texture);
    this.plantType = type;
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body
  }

  public attachPest(pest: Pest) {
    if (!this.attachedPests.includes(pest)) {
      this.attachedPests.push(pest);
      pest.isAttached = true;
      pest.setVelocity(0, 0);
      // Position pest on plant
      pest.setPosition(this.x + Phaser.Math.Between(-10, 10), this.y + Phaser.Math.Between(-10, 10));
    }
  }

  public removePest(pest: Pest) {
    this.attachedPests = this.attachedPests.filter(p => p !== pest);
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      // Handle plant death logic later
    }
  }
}
