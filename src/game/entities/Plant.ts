import Phaser from 'phaser';

export abstract class Plant extends Phaser.GameObjects.Sprite {
  public health: number = 100;
  public level: number = 1;
  public plantType: 'objective' | 'defensive' | 'offensive';

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: 'objective' | 'defensive' | 'offensive') {
    super(scene, x, y, texture);
    this.plantType = type;
    scene.add.existing(this);
  }
}
