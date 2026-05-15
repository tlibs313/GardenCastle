import Phaser from 'phaser';
import { ObjectivePlant } from '../entities/ObjectivePlant';
import { Plant } from '../entities/Plant';
import { Aphid } from '../entities/Aphid';

export class MainScene extends Phaser.Scene {
  private plants: Plant[] = [];
  private pests!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('MainScene');
  }

  preload() {
    // Create a simple colored circle for aphid placeholder
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(10, 10, 10);
    graphics.generateTexture('aphid-placeholder', 20, 20);
    graphics.destroy();
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
    this.add.text(400, 300, '??', { fontSize: '48px' }).setOrigin(0.5);

    // Physics groups
    this.pests = this.physics.add.group({
      classType: Aphid,
      runChildUpdate: true
    });

    // Spawn timer
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnPest,
      callbackScope: this,
      loop: true
    });

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

  spawnPest() {
    let x, y;
    const side = Phaser.Math.Between(0, 3);
    
    switch(side) {
      case 0: // Top
        x = Phaser.Math.Between(0, 800);
        y = -20;
        break;
      case 1: // Right
        x = 820;
        y = Phaser.Math.Between(0, 600);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(0, 800);
        y = 620;
        break;
      default: // Left
        x = -20;
        y = Phaser.Math.Between(0, 600);
        break;
    }

    const aphid = new Aphid(this, x, y);
    this.pests.add(aphid);
  }

  update(time: number, delta: number) {
    this.plants.forEach(plant => {
      if (plant.update) {
        plant.update(delta);
      }
    });
    
    // Pests group runChildUpdate: true handles their individual update()
  }
}
