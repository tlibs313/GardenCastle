import Phaser from 'phaser';
import { PEST_CONSTANTS } from '../constants';
import { Pest } from '../entities/Pest';
import { Aphid } from '../entities/Aphid';
import { IronCladBeetle } from '../entities/IronCladBeetle';
import { RegenSlug } from '../entities/RegenSlug';
import { CamoLocust } from '../entities/CamoLocust';
import { BossSquirrel } from '../entities/BossSquirrel';

/**
 * Factory for creating different types of pests.
 */
export class PestFactory {
  /**
   * Creates a pest instance based on the provided type.
   * @param type The type of pest to create (from PEST_CONSTANTS.TYPES).
   * @param scene The Phaser scene.
   * @param x Initial x position.
   * @param y Initial y position.
   * @returns A new Pest instance.
   */
  public static createPest(type: string, scene: Phaser.Scene, x: number, y: number): Pest {
    switch (type) {
      case PEST_CONSTANTS.TYPES.BOSS_SQUIRREL:
        return new BossSquirrel(scene, x, y);
      case PEST_CONSTANTS.TYPES.BEETLE:
        return new IronCladBeetle(scene, x, y);
      case PEST_CONSTANTS.TYPES.SLUG:
        return new RegenSlug(scene, x, y);
      case PEST_CONSTANTS.TYPES.LOCUST:
        return new CamoLocust(scene, x, y);
      case PEST_CONSTANTS.TYPES.APHID:
      default:
        return new Aphid(scene, x, y);
    }
  }
}
