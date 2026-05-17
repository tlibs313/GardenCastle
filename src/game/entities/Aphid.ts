import Phaser from 'phaser';
import { Pest } from './Pest';

export class Aphid extends Pest {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'aphid-placeholder');
  }
}
