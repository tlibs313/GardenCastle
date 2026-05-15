import Phaser from 'phaser';
import { Plant } from './Plant';
import { Seed } from './Seed';
import { Pest } from './Pest';

export class OffensivePlant extends Plant {
  private fireRate: number = 2000; // Fire every 2 seconds
  private lastFireTime: number = 0;
  private range: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'cactus', 'offensive');
  }

  public getSpeciesId(): string {
    return 'cactus';
  }

  public getBaseRP(): number {
    return 10;
  }

  public getDensityMultiplier(count: number): number {
    // Competitive: 1.0 / (Count * 0.5)
    return 1.0 / (count * 0.5);
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
    const pests = (this.scene as any).pestsGroup?.getChildren() as Pest[];
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
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    
    // Fire 3-5 seeds in a cone
    const numSeeds = Phaser.Math.Between(3, 5);
    for (let i = 0; i < numSeeds; i++) {
      const seed = new Seed(this.scene, this.x, this.y);
      (this.scene as any).seedsGroup?.add(seed);

      const spread = 0.2; // Radians
      const targetAngle = angle + (Math.random() * spread - spread / 2);
      
      const speed = 200;
      seed.setVelocity(Math.cos(targetAngle) * speed, Math.sin(targetAngle) * speed);
    }
  }
}
