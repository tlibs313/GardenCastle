import Phaser from 'phaser';
import { ObjectivePlant } from '../entities/ObjectivePlant';
import { OffensivePlant } from '../entities/OffensivePlant';
import { Plant } from '../entities/Plant';
import { Aphid } from '../entities/Aphid';
import { Pest } from '../entities/Pest';
import { Seed } from '../entities/Seed';

export class MainScene extends Phaser.Scene {
  public plantsGroup!: Phaser.Physics.Arcade.StaticGroup;
  public pestsGroup!: Phaser.Physics.Arcade.Group;
  public seedsGroup!: Phaser.Physics.Arcade.Group;
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private splatterEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super('MainScene');
  }

  preload() {
    const graphics = this.add.graphics();
    
    // Aphid placeholder
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(10, 10, 10);
    graphics.generateTexture('aphid-placeholder', 20, 20);
    graphics.clear();

    // Seed placeholder
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(5, 5, 5);
    graphics.generateTexture('seed-placeholder', 10, 10);
    graphics.clear();

    // Splatter particle placeholder
    graphics.fillStyle(0x00ff00, 0.8);
    graphics.fillRect(0, 0, 4, 4);
    graphics.generateTexture('splatter-particle', 4, 4);
    
    graphics.destroy();
  }

  create() {
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x2e7d32, 0.5);
    for (let i = 0; i <= 10; i++) {
      graphics.moveTo(i * 40 + 200, 100);
      graphics.lineTo(i * 40 + 200, 500);
      graphics.moveTo(200, i * 40 + 100);
      graphics.lineTo(600, i * 40 + 100);
    }
    graphics.strokePath();

    this.add.text(400, 300, '🏰', { fontSize: '48px' }).setOrigin(0.5);

    // Particles
    this.splatterEmitter = this.add.particles(0, 0, 'splatter-particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 800,
      gravityY: 100,
      emitting: false
    });

    // Listen for squish event
    this.events.on('pest-squished', (x: number, y: number) => {
      this.splatterEmitter.explode(15, x, y);
    });

    // Keys
    if (this.input.keyboard) {
      this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    // Initialize groups
    this.plantsGroup = this.physics.add.staticGroup();
    this.pestsGroup = this.physics.add.group({
      classType: Aphid,
      runChildUpdate: true
    });
    this.seedsGroup = this.physics.add.group({
      classType: Seed,
      runChildUpdate: true
    });

    // Collision: Pest vs Plant (Attachment)
    this.physics.add.overlap(this.pestsGroup, this.plantsGroup, (pest, plant) => {
      const p = pest as Pest;
      const pl = plant as Plant;
      if (!p.isAttached) {
        pl.attachPest(p);
      }
    });

    // Collision: Seed vs Pest
    this.physics.add.overlap(this.seedsGroup, this.pestsGroup, (seed, pest) => {
      const s = seed as Seed;
      const p = pest as Aphid;
      p.squish();
      s.destroy();
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

        let plant;
        if (this.shiftKey?.isDown) {
          plant = new OffensivePlant(this, snappedX, snappedY);
        } else {
          plant = new ObjectivePlant(this, snappedX, snappedY);
        }
        this.plantsGroup.add(plant);
      }
    });
  }

  spawnPest() {
    let x, y;
    const side = Phaser.Math.Between(0, 3);
    switch(side) {
      case 0: x = Phaser.Math.Between(0, 800); y = -20; break;
      case 1: x = 820; y = Phaser.Math.Between(0, 600); break;
      case 2: x = Phaser.Math.Between(0, 800); y = 620; break;
      default: x = -20; y = Phaser.Math.Between(0, 600); break;
    }
    const aphid = new Aphid(this, x, y);
    this.pestsGroup.add(aphid);
  }

  update(time: number, delta: number) {
    this.plantsGroup.getChildren().forEach(plant => {
      (plant as Plant).update(delta);
    });
  }
}
