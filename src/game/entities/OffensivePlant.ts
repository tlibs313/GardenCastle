import { Plant } from './Plant';

export class OffensivePlant extends Plant {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'cactus', 'offensive');
  }
}
