import Phaser from 'phaser';

export abstract class Pest extends Phaser.Physics.Arcade.Sprite {
  public health: number = 10;
  public speed: number = 50;
  public isAttached: boolean = false;
  protected targetPlant: any = null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
