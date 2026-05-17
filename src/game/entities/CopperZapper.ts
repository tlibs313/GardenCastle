import Phaser from 'phaser';
import { Structure } from './Structure';
import { STRUCTURE_CONSTANTS } from '../constants';
import { MainScene } from '../scenes/MainScene';
import { Pest } from './Pest';

/**
 * An offensive structure that zaps nearby pests.
 * Consumes durability on each shot.
 */
export class CopperZapper extends Structure {
  private nextFireTime: number = 0;
  private readonly COOLDOWN: number = 1000; // 1 second

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      'locust-placeholder',
      STRUCTURE_CONSTANTS.TYPES.ZAPPER,
      STRUCTURE_CONSTANTS.STATS.copper_zapper.durability,
      STRUCTURE_CONSTANTS.ANCHORS.copper_zapper
    );

    this.setTint(0x00aaff); // Tinted blue
    
    // Register update listener
    this.scene.events.on('update', this.update, this);
  }

  update(time: number) {
    if (this.isBroken) return;
    if (time < this.nextFireTime) return;

    const mainScene = this.scene as MainScene;
    if (!mainScene.pestsGroup) return;

    const range = STRUCTURE_CONSTANTS.STATS.copper_zapper.range;
    const damage = STRUCTURE_CONSTANTS.STATS.copper_zapper.damage;
    
    const pests = mainScene.pestsGroup.getChildren() as Pest[];
    let nearestPest: Pest | null = null;
    let minDistance = range;

    pests.forEach((pest) => {
      if (!pest.active) return;
      const distance = Phaser.Math.Distance.Between(this.x, this.y, pest.x, pest.y);
      if (distance <= minDistance) {
        minDistance = distance;
        nearestPest = pest;
      }
    });

    if (nearestPest) {
      this.zap(nearestPest, damage);
      this.nextFireTime = time + this.COOLDOWN;
      this.takeDamage(1);
    }
  }

  private zap(pest: Pest, damage: number) {
    pest.takeDamage(damage);
    this.createZapEffect(pest.x, pest.y);
  }

  private createZapEffect(targetX: number, targetY: number) {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0x00ffff, 1); // Cyan electrical arc
    graphics.moveTo(this.x, this.y);
    
    // Add some jitter to the arc
    const midX = (this.x + targetX) / 2 + (Math.random() - 0.5) * 20;
    const midY = (this.y + targetY) / 2 + (Math.random() - 0.5) * 20;
    
    graphics.lineTo(midX, midY);
    graphics.lineTo(targetX, targetY);
    graphics.strokePath();

    this.scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 100,
      onComplete: () => {
        graphics.destroy();
      }
    });
  }

  protected onBreak() {
    this.scene.events.off('update', this.update, this);
    super.onBreak();
  }
  
  /**
   * Clean up listener if destroyed for other reasons.
   */
  destroy(fromScene?: boolean) {
    // Check if scene still exists to avoid errors during teardown
    if (this.scene) {
      this.scene.events.off('update', this.update, this);
    }
    super.destroy(fromScene);
  }
}
