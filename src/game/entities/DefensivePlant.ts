import { Plant } from './Plant';

export class DefensivePlant extends Plant {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'stone', 'defensive');
  }

  public getSpeciesId(): string {
    return 'stone';
  }

  public getBaseRP(): number {
    return 20;
  }

  public getDensityMultiplier(count: number): number {
    // Soloist: Always 1.0
    return 1.0;
  }
}
