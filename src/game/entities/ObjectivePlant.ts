import Phaser from 'phaser';
import { Plant } from './Plant';
import { PLANT_CONSTANTS, RESEARCH_CONSTANTS } from '../constants';
import { MainScene } from '../scenes/MainScene';

export class ObjectivePlant extends Plant {
  public growthProgress: number = 0;
  public targetLevel: number = PLANT_CONSTANTS.OBJECTIVE_TARGET_LEVEL;
  private levelText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'rose', 'objective');
    this.levelText = scene.add.text(x, y + 20, `Lvl: ${this.level}`, { fontSize: '12px' }).setOrigin(0.5);      
  }

  public getSpeciesId(): string {
    return 'rose';
  }

  public getDisplayName(): string {
    return 'Royal Rose';
  }

  public getBaseRP(): number {
    return RESEARCH_CONSTANTS.BASE_RP.OBJECTIVE;
  }

  public getDensityMultiplier(count: number): number {
    // Symbiotic: 1.0 + (Count * Symbiotic Factor)
    return 1.0 + count * RESEARCH_CONSTANTS.DENSITY_FACTORS.SYMBIOTIC;
  }

  update(delta: number) {
    super.update(delta);
    
    // Corruption logic: Stop growth if pests are attached
    if (this.attachedPests.length > 0) {
      return;
    }

    if (this.level < this.targetLevel) {
      // Get soil multiplier from environmentManager
      const mainScene = this.scene as MainScene;
      const envManager = mainScene.environmentManager;
      const multiplier = envManager ? envManager.getSoilProperties().growthMultiplier[this.plantType] || 1.0 : 1.0;

      this.growthProgress += delta * this.baseGrowthRate * multiplier;
      if (this.growthProgress >= PLANT_CONSTANTS.GROWTH_TARGET) {
        this.level++;
        this.growthProgress = 0;
        this.levelText.setText(`Lvl: ${this.level}`);
      }
    }
  }}
