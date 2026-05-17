import Phaser from 'phaser';
import { Pest } from './Pest';
import { PEST_CONSTANTS } from '../constants';

export class CamoLocust extends Pest {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'locust-placeholder');
    this.isTargetable = false;
    this.health = PEST_CONSTANTS.LOCUST.HEALTH;
    this.maxHealth = PEST_CONSTANTS.LOCUST.HEALTH;
    this.speed = PEST_CONSTANTS.LOCUST.SPEED;
    
    // Stealthy visual
    this.setTint(0x55ff55);
    this.setAlpha(0.6);
  }
}
