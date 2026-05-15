import Phaser from 'phaser';
import { ObjectivePlant } from '../entities/ObjectivePlant';
import { OffensivePlant } from '../entities/OffensivePlant';
import { Plant } from '../entities/Plant';
import { Aphid } from '../entities/Aphid';
import { Pest } from '../entities/Pest';
import { Seed } from '../entities/Seed';
import { EnvironmentManager } from '../managers/EnvironmentManager';
import { ResearchManager } from '../managers/ResearchManager';
import { useCareerStore } from '../../store/useCareerStore';
import { useGameStore } from '../../store/useGameStore';

export class MainScene extends Phaser.Scene {
  public plantsGroup!: Phaser.Physics.Arcade.StaticGroup;
  public pestsGroup!: Phaser.Physics.Arcade.Group;
  public seedsGroup!: Phaser.Physics.Arcade.Group;
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private splatterEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  public environmentManager!: EnvironmentManager;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private hoverStats!: Phaser.GameObjects.Container;
  private statsText!: Phaser.GameObjects.Text;

  // Wave Management
  private pestsToSpawn: number = 5;
  private pestsSpawned: number = 0;
  private pestsDestroyed: number = 0;
  private isWaveActive: boolean = true;
  private difficulty: number = 1.0;

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
      this.pestsDestroyed++;
      
      // Update store stat
      useCareerStore.getState().updateStats({
        pestsPopped: useCareerStore.getState().stats.pestsPopped + 1
      });

      if (this.pestsDestroyed >= this.pestsToSpawn) {
        this.harvest();
      }
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

    // Environment
    this.environmentManager = new EnvironmentManager(this);
    this.environmentManager.soilType = 'sand';
    
    this.nightOverlay = this.add.rectangle(400, 300, 800, 600, 0x000033, 0);
    this.nightOverlay.setDepth(100);

    this.events.on('cycle-changed', (cycle: 'day' | 'night') => {
      if (cycle === 'night') {
        this.tweens.add({
          targets: this.nightOverlay,
          fillAlpha: 0.4,
          duration: 2000
        });
      } else {
        this.tweens.add({
          targets: this.nightOverlay,
          fillAlpha: 0,
          duration: 2000
        });
      }
    });

    this.events.on('weather-changed', (event: string) => {
      if (event === 'rain') {
        this.plantsGroup.getChildren().forEach(gameObject => {
          const p = gameObject as Plant;
          p.hydration = 100;
        });
      }
    });

    // Hover Stats
    this.statsText = this.add.text(0, 0, '', { fontSize: '12px', color: '#fff', backgroundColor: '#000', padding: { x: 5, y: 5 } });
    this.hoverStats = this.add.container(0, 0, [this.statsText]);
    this.hoverStats.setDepth(200);
    this.hoverStats.setVisible(false);

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

        if (this.shiftKey?.isDown && this.environmentManager.soilType !== 'ash' && Math.random() > 0.8) {
          console.log("Cannot plant this here! Need Ash soil.");
          return;
        }

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
    if (this.pestsSpawned >= this.pestsToSpawn) return;

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
    this.pestsSpawned++;
  }

  harvest() {
    if (!this.isWaveActive) return;
    this.isWaveActive = false;

    const survivingPlants = this.plantsGroup.getChildren() as Plant[];
    const earnedRP = ResearchManager.calculateRP(survivingPlants, this.difficulty);

    // Update Career Store
    const careerStore = useCareerStore.getState();
    careerStore.addRP(earnedRP);
    careerStore.updateStats({
      plantsHarvested: careerStore.stats.plantsHarvested + survivingPlants.length,
      highestDifficultyCleared: Math.max(careerStore.stats.highestDifficultyCleared, this.difficulty)
    });

    // Show Summary
    const summary = this.add.container(400, 300);
    summary.setDepth(500);

    const bg = this.add.rectangle(0, 0, 300, 200, 0x000000, 0.8);
    const title = this.add.text(0, -70, 'WAVE COMPLETE', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
    const rpText = this.add.text(0, -20, `RP Earned: ${earnedRP}`, { fontSize: '18px', color: '#00ff00' }).setOrigin(0.5);
    const plantsText = this.add.text(0, 10, `Plants Harvested: ${survivingPlants.length}`, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    
    const btn = this.add.rectangle(0, 60, 150, 40, 0x4f46e5).setInteractive();
    const btnText = this.add.text(0, 60, 'Open Evolution Hub', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);

    summary.add([bg, title, rpText, plantsText, btn, btnText]);

    btn.on('pointerdown', () => {
      useGameStore.getState().setHubOpen(true);
      // Reset for next wave or just stay in hub
      this.resetWave();
      summary.destroy();
    });
  }

  resetWave() {
    this.pestsSpawned = 0;
    this.pestsDestroyed = 0;
    this.isWaveActive = true;
    this.pestsToSpawn += 5; // Increase difficulty
    // Optionally clear plants or keep them
  }

  update(time: number, delta: number) {
    this.environmentManager.update(delta);
    
    let hovered: Plant | null = null;
    const pointer = this.input.activePointer;

    this.plantsGroup.getChildren().forEach(gameObject => {
      const p = gameObject as Plant;
      p.update(delta);
      
      if (Phaser.Geom.Rectangle.Contains(p.getBounds(), pointer.x, pointer.y)) {
        hovered = p;
      }
    });

    if (hovered) {
      const hp = hovered as Plant;
      this.hoverStats.setVisible(true);
      this.hoverStats.setPosition(pointer.x + 10, pointer.y + 10);
      const typeDisplay = hp.plantType.charAt(0).toUpperCase() + hp.plantType.slice(1);
      this.statsText.setText(
        `${hp.getDisplayName()}\n` +
        `Type: ${typeDisplay}\n` +
        `HP: ${Math.floor(hp.health)}\n` +
        `Level: ${hp.level}\n` +
        `Water: ${Math.floor(hp.hydration)}%\n` +
        `Light: ${Math.floor(hp.lightLevel)}%`
      );
    } else {
      this.hoverStats.setVisible(false);
    }
  }
}

