import Phaser from 'phaser';
import { Structure } from './Structure';
import { STRUCTURE_CONSTANTS } from '../constants';

/**
 * A durable wall made of stone.
 * Can only be anchored to rocky soil.
 */
export class StoneWall extends Structure {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      'stone',
      STRUCTURE_CONSTANTS.TYPES.WALL,
      STRUCTURE_CONSTANTS.STATS.stone_wall.durability,
      STRUCTURE_CONSTANTS.ANCHORS.stone_wall
    );
  }
}
