import Phaser from 'phaser';
import { Pest } from './Pest';
import { PEST_CONSTANTS } from '../constants';

export class RegenSlug extends Pest {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'slug-placeholder');
    
    this.health = PEST_CONSTANTS.SLUG.HEALTH;
    this.maxHealth = PEST_CONSTANTS.SLUG.HEALTH;
    this.speed = PEST_CONSTANTS.SLUG.SPEED;
    
    // Whimsical purple/green tint
    this.setTint(0x9933ff);
  }

  update(time: number, delta: number) {
    // 1. Life Steal (if attached)
    if (this.isAttached && this.targetPlant) {
      const damageDealt = this.damageRate * delta;
      this.targetPlant.takeDamage(damageDealt);
      
      // Heals based on damage dealt
      const healAmount = damageDealt * PEST_CONSTANTS.SLUG.LIFE_STEAL_MULT;
      this.health = Math.min(this.maxHealth, this.health + healAmount);
      
      // No movement if attached
      return;
    }

    // 2. Base movement (if not attached)
    super.update(time, delta);

    // 3. Health Recovery (if not full)
    if (this.health < this.maxHealth) {
      if (this.scene.time.now - this.lastHitTime > PEST_CONSTANTS.SLUG.REGEN_DELAY) {
        const regenAmount = PEST_CONSTANTS.SLUG.REGEN_RATE * (delta / 1000);
        this.health = Math.min(this.maxHealth, this.health + regenAmount);
      }
    }
  }
}
