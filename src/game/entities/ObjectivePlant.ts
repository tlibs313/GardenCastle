import Phaser from 'phaser';
import { Plant } from './Plant';

export class ObjectivePlant extends Plant {
  public growthProgress: number = 0;
  public targetLevel: number = 5;
  private levelText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'rose', 'objective');
    this.levelText = scene.add.text(x, y + 20, `Lvl: ${this.level}`, { fontSize: '12px' }).setOrigin(0.5);      
  }

  update(delta: number) {
    // Corruption logic: Stop growth if pests are attached
    if (this.attachedPests.length > 0) {
      // Deal small damage over time
      this.takeDamage(0.01 * delta);
      return;
    }

    if (this.level < this.targetLevel) {
      // Get soil multiplier from environmentManager
      const envManager = (this.scene as any).environmentManager;
      const multiplier = envManager ? envManager.getSoilProperties().growthMultiplier[this.plantType] || 1.0 : 1.0;

      this.growthProgress += delta * this.baseGrowthRate * multiplier;
      if (this.growthProgress >= 100) {
        this.level++;
        this.growthProgress = 0;
        this.levelText.setText(`Lvl: ${this.level}`);
      }
    }
  }}
