import { Plant } from './Plant';

export class DefensivePlant extends Plant {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'stone', 'defensive');
  }
}
