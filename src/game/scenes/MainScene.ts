import Phaser from 'phaser';
import { ObjectivePlant } from '../entities/ObjectivePlant';
import { Plant } from '../entities/Plant';

export class MainScene extends Phaser.Scene {
  private plants: Plant[] = [];

  constructor() {
    super('MainScene');
  }

  create() {
    // Draw 10x10 garden grid
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x2e7d32, 0.5);
    for (let i = 0; i <= 10; i++) {
      graphics.moveTo(i * 40 + 200, 100);
      graphics.lineTo(i * 40 + 200, 500);
      graphics.moveTo(200, i * 40 + 100);
      graphics.lineTo(600, i * 40 + 100);
    }
    graphics.strokePath();

    // Central Castle Placeholder
    this.add.text(400, 300, '🏰', { fontSize: '48px' }).setOrigin(0.5);

    // Click to plant mechanic
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const gridX = Math.floor((pointer.x - 200) / 40);
      const gridY = Math.floor((pointer.y - 100) / 40);

      if (gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 10) {
        const snappedX = gridX * 40 + 200 + 20;
        const snappedY = gridY * 40 + 100 + 20;

        const plant = new ObjectivePlant(this, snappedX, snappedY);
        this.plants.push(plant);
      }
    });
  }

  update(time: number, delta: number) {
    this.plants.forEach(plant => {
      if (plant.update) {
        plant.update(delta);
      }
    });
  }
}
