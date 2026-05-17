import { Structure } from './Structure';
import { STRUCTURE_CONSTANTS } from '../constants';
import { Plant } from './Plant';
import { MainScene } from '../scenes/MainScene';

/**
 * A utility structure that automatically hydrates nearby plants.
 * Consumes durability on each activation.
 */
export class AutoSprinkler extends Structure {
  private timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      'cactus',
      STRUCTURE_CONSTANTS.TYPES.SPRINKLER,
      STRUCTURE_CONSTANTS.STATS.auto_sprinkler.durability,
      STRUCTURE_CONSTANTS.ANCHORS.auto_sprinkler
    );

    this.timer = scene.time.addEvent({
      delay: STRUCTURE_CONSTANTS.STATS.auto_sprinkler.interval,
      callback: this.activate,
      callbackScope: this,
      loop: true
    });
  }

  /**
   * Hydrates nearby plants and takes durability damage.
   */
  private activate() {
    if (this.isBroken) return;

    const radius = 80; // 2 grid units
    const mainScene = this.scene as MainScene;
    
    if (mainScene.plantsGroup) {
      const plants = mainScene.plantsGroup.getChildren() as Plant[];
      let anyHydrated = false;

      plants.forEach((p) => {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, p.x, p.y);
        if (dist <= radius) {
          p.hydration = Math.min(100, p.hydration + 20);
          anyHydrated = true;
        }
      });

      if (anyHydrated) {
        this.createWaterEffect();
        this.takeDamage(1);
      }
    }
  }

  /**
   * Visual feedback for hydration.
   */
  private createWaterEffect() {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0x00aaff, 0.8);
    graphics.strokeCircle(this.x, this.y, 80);

    this.scene.tweens.add({
      targets: graphics,
      alpha: 0,
      scale: 1.2,
      duration: 500,
      onComplete: () => {
        graphics.destroy();
      }
    });
  }

  protected onBreak() {
    if (this.timer) {
      this.timer.remove();
    }
    super.onBreak();
  }
}
