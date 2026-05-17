import Phaser from 'phaser';

/**
 * Base class for all placeable structures in the garden.
 * Handles durability, breaking, and soil requirements.
 */
export abstract class Structure extends Phaser.Physics.Arcade.Sprite {
  public durability: number;
  public maxDurability: number;
  public anchorSoil: string[];
  public isBroken: boolean = false;
  public structureType: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type: string, durability: number, anchorSoil: string[]) {
    super(scene, x, y, texture);
    this.structureType = type;
    this.durability = durability;
    this.maxDurability = durability;
    this.anchorSoil = anchorSoil;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static by default
  }

  /**
   * Reduces durability by the specified amount.
   * Breaks the structure if durability reaches 0.
   */
  public takeDamage(amount: number) {
    this.durability -= amount;
    if (this.durability <= 0) {
      this.durability = 0;
      this.onBreak();
    }
  }

  /**
   * Called when durability reaches 0.
   * Destroys the structure and emits an event.
   */
  protected onBreak() {
    this.isBroken = true;
    this.scene.events.emit('structure-broken', this);
    this.destroy();
  }

  /**
   * Returns a user-friendly name for the structure type.
   */
  public getDisplayName(): string {
    return this.structureType.replace('_', ' ').toUpperCase();
  }
}
