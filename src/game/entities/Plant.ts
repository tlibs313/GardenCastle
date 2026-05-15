import Phaser from 'phaser';
import { Pest } from './Pest';
import { MainScene } from '../scenes/MainScene';

export abstract class Plant extends Phaser.Physics.Arcade.Sprite {
  public health: number = 100;
  public maxHealth: number = 100;
  public level: number = 1;
  public plantType: 'objective' | 'defensive' | 'offensive';
  public attachedPests: Pest[] = [];
  public baseGrowthRate: number = 0.01;

  public hydration: number = 80;
  public lightLevel: number = 50;
  public isWilting: boolean = false;
  public isGlowing: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: 'objective' | 'defensive' | 'offensive') {
    super(scene, x, y, texture);
    this.plantType = type;
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body
  }

  public abstract getSpeciesId(): string;
  public abstract getBaseRP(): number;
  public abstract getDensityMultiplier(count: number): number;

  public update(delta: number) {
    // Decrease hydration slowly over time
    this.hydration -= 0.001 * delta;
    if (this.hydration < 0) this.hydration = 0;

    // Calculate lightLevel based on environment manager
    const mainScene = this.scene as MainScene;
    if (mainScene.environmentManager) {
      this.lightLevel = mainScene.environmentManager.timeOfDay === 'day' ? 100 : 20;
    }

    // Update wilting and glowing flags
    this.isWilting = this.hydration < 30 || this.lightLevel < 30;
    this.isGlowing = this.hydration > 80 && this.lightLevel > 80;

    // Apply visual feedback
    if (this.isWilting) {
      this.setTint(0x884400);
    } else if (this.isGlowing) {
      this.setTint(0xffff00);
    } else {
      this.clearTint();
    }
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
