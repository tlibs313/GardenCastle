import Phaser from 'phaser';
import { Plant } from './Plant';
import { Seed } from './Seed';
import { Pest } from './Pest';
import { PLANT_CONSTANTS, RESEARCH_CONSTANTS } from '../constants';
import { MainScene } from '../scenes/MainScene';

export class OffensivePlant extends Plant {
  private fireRate: number = PLANT_CONSTANTS.OFFENSIVE_FIRE_RATE;
  private lastFireTime: number = 0;
  private range: number = PLANT_CONSTANTS.OFFENSIVE_RANGE;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'cactus', 'offensive');
  }

  public getSpeciesId(): string {
    return 'cactus';
  }

  public getDisplayName(): string {
    return 'Crystal Cactus';
  }

  public getBaseRP(): number {
    return RESEARCH_CONSTANTS.BASE_RP.OFFENSIVE;
  }

  public getDensityMultiplier(count: number): number {
    // Competitive: 1.0 / (Count * Competitive Factor)
    return 1.0 / (count * RESEARCH_CONSTANTS.DENSITY_FACTORS.COMPETITIVE);
  }

  update(delta: number) {
    super.update(delta);
    
    this.lastFireTime += delta;
    if (this.lastFireTime >= this.fireRate) {
      this.shoot();
      this.lastFireTime = 0;
    }
  }

  private shoot() {
    // Find nearest pest in range
    const mainScene = this.scene as MainScene;
    const pests = mainScene.pestsGroup?.getChildren() as Pest[];
    if (!pests || pests.length === 0) return;

    let nearestPest: Pest | null = null;
    let minDistance = this.range;

    pests.forEach(pest => {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, pest.x, pest.y);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPest = pest;
      }
    });

    if (nearestPest) {
      this.fireSpray(nearestPest);
    }
  }

  private fireSpray(target: Pest) {
    const mainScene = this.scene as MainScene;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    
    // Fire seeds in a cone
    const numSeeds = Phaser.Math.Between(PLANT_CONSTANTS.OFFENSIVE_NUM_SEEDS.MIN, PLANT_CONSTANTS.OFFENSIVE_NUM_SEEDS.MAX);
    for (let i = 0; i < numSeeds; i++) {
      const seed = new Seed(this.scene, this.x, this.y);
      mainScene.seedsGroup?.add(seed);

      const spread = PLANT_CONSTANTS.OFFENSIVE_SPREAD; // Radians
      const targetAngle = angle + (Math.random() * spread - spread / 2);
      
      const speed = PLANT_CONSTANTS.OFFENSIVE_SEED_SPEED;
      seed.setVelocity(Math.cos(targetAngle) * speed, Math.sin(targetAngle) * speed);
    }
  }
}
