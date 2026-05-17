import Phaser from 'phaser';
import { StoneWall } from '../entities/StoneWall';
import { AutoSprinkler } from '../entities/AutoSprinkler';
import { CopperZapper } from '../entities/CopperZapper';
import { STRUCTURE_CONSTANTS } from '../constants';
import { Structure } from '../entities/Structure';

/**
 * Factory for creating different types of structures.
 */
export class StructureFactory {
  /**
   * Creates a structure of the specified type.
   * @param type The type of structure to create.
   * @param scene The Phaser scene.
   * @param x The x-coordinate.
   * @param y The y-coordinate.
   * @returns The created structure instance.
   */
  static create(type: string, scene: Phaser.Scene, x: number, y: number): Structure {
    switch (type) {
      case STRUCTURE_CONSTANTS.TYPES.WALL:
        return new StoneWall(scene, x, y);
      case STRUCTURE_CONSTANTS.TYPES.SPRINKLER:
        return new AutoSprinkler(scene, x, y);
      case STRUCTURE_CONSTANTS.TYPES.ZAPPER:
        return new CopperZapper(scene, x, y);
      default:
        throw new Error(`Unknown structure type: ${type}`);
    }
  }
}
