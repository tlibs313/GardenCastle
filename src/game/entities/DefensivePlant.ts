import { Plant } from './Plant';
import { RESEARCH_CONSTANTS } from '../constants';

export class DefensivePlant extends Plant {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'stone', 'defensive');
  }

  public getSpeciesId(): string {
    return 'stone';
  }

  public getDisplayName(): string {
    return 'Wall-Nut Stone';
  }

  public getBaseRP(): number {
    return RESEARCH_CONSTANTS.BASE_RP.DEFENSIVE;
  }

  public getDensityMultiplier(count: number): number {
    // Soloist: Always 1.0
    return 1.0;
  }
}
