import Phaser from 'phaser';
import { Pest } from './Pest';
import { MainScene } from '../scenes/MainScene';
import { PLANT_CONSTANTS } from '../constants';

export abstract class Plant extends Phaser.Physics.Arcade.Sprite {
  public health: number = PLANT_CONSTANTS.MAX_HEALTH;
  public maxHealth: number = PLANT_CONSTANTS.MAX_HEALTH;
  public level: number = PLANT_CONSTANTS.BASE_LEVEL;
  public plantType: 'objective' | 'defensive' | 'offensive';
  public attachedPests: Pest[] = [];
  public baseGrowthRate: number = PLANT_CONSTANTS.BASE_GROWTH_RATE;

  public hydration: number = PLANT_CONSTANTS.INITIAL_HYDRATION;
  public lightLevel: number = PLANT_CONSTANTS.INITIAL_LIGHT_LEVEL;
  public isWilting: boolean = false;
  public isGlowing: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: 'objective' | 'defensive' | 'offensive') {
    super(scene, x, y, texture);
    this.plantType = type;
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body
  }

  public abstract getSpeciesId(): string;
  public abstract getDisplayName(): string;
  public abstract getBaseRP(): number;
  public abstract getDensityMultiplier(count: number): number;

  public update(delta: number) {
    // Decrease hydration slowly over time
    this.hydration -= PLANT_CONSTANTS.HYDRATION_DECREASE_RATE * delta;
    if (this.hydration < 0) this.hydration = 0;

    // Calculate lightLevel based on environment manager
    const mainScene = this.scene as MainScene;
    if (mainScene.environmentManager) {
      this.lightLevel = mainScene.environmentManager.timeOfDay === 'day' 
        ? PLANT_CONSTANTS.LIGHT_LEVELS.DAY 
        : PLANT_CONSTANTS.LIGHT_LEVELS.NIGHT;
    }

    // Update wilting and glowing flags
    this.isWilting = this.hydration < PLANT_CONSTANTS.THRESHOLDS.WILTING || this.lightLevel < PLANT_CONSTANTS.THRESHOLDS.WILTING;
    this.isGlowing = this.hydration > PLANT_CONSTANTS.THRESHOLDS.GLOWING && this.lightLevel > PLANT_CONSTANTS.THRESHOLDS.GLOWING;

    // Apply visual feedback
    if (this.isWilting) {
      this.setTint(PLANT_CONSTANTS.TINTS.WILTING);
    } else if (this.isGlowing) {
      this.setTint(PLANT_CONSTANTS.TINTS.GLOWING);
    } else {
      this.clearTint();
    }
  }

  public attachPest(pest: Pest) {
    if (!this.attachedPests.includes(pest)) {
      this.attachedPests.push(pest);
      pest.isAttached = true;
      pest.targetPlant = this;
      pest.setVelocity(0, 0);
      // Position pest on plant
      const offset = PLANT_CONSTANTS.PEST_OFFSET_RANGE;
      pest.setPosition(this.x + Phaser.Math.Between(-offset, offset), this.y + Phaser.Math.Between(-offset, offset));
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
