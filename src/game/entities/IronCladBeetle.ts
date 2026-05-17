import Phaser from 'phaser';
import { Pest } from './Pest';
import { PEST_CONSTANTS } from '../constants';

/**
 * Iron-Clad Beetle: A high-health pest with significant damage reduction.
 */
export class IronCladBeetle extends Pest {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'beetle-placeholder');

    this.health = PEST_CONSTANTS.BEETLE.HEALTH;
    this.maxHealth = PEST_CONSTANTS.BEETLE.HEALTH;
    this.speed = PEST_CONSTANTS.BEETLE.SPEED;

    // Visual distinction
    this.setScale(1.5);
    this.setTint(0x888888); // Metallic grey
  }

  /**
   * Overrides takeDamage to apply damage reduction (DR).
   * @param amount The base damage amount.
   */
  public override takeDamage(amount: number): void {
    const reducedDamage = amount * PEST_CONSTANTS.BEETLE.DR;
    super.takeDamage(reducedDamage);
  }
}
