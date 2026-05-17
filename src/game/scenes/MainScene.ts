import Phaser from 'phaser';
import { ObjectivePlant } from '../entities/ObjectivePlant';
import { OffensivePlant } from '../entities/OffensivePlant';
import { Plant } from '../entities/Plant';
import { Aphid } from '../entities/Aphid';
import { Pest } from '../entities/Pest';
import { Seed } from '../entities/Seed';
import { EnvironmentManager } from '../managers/EnvironmentManager';
import { ResearchManager } from '../managers/ResearchManager';
import { PestFactory } from '../managers/PestFactory';
import { StructureFactory } from '../managers/StructureFactory';
import { Structure } from '../entities/Structure';
import { PEST_CONSTANTS, STRUCTURE_CONSTANTS } from '../constants';
import { useCareerStore } from '../../store/useCareerStore';
import { useGameStore } from '../../store/useGameStore';

export class MainScene extends Phaser.Scene {
  public plantsGroup!: Phaser.Physics.Arcade.StaticGroup;
  public structuresGroup!: Phaser.Physics.Arcade.StaticGroup;
  public pestsGroup!: Phaser.Physics.Arcade.Group;
  public seedsGroup!: Phaser.Physics.Arcade.Group;
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private splatterEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  public environmentManager!: EnvironmentManager;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private hoverStats!: Phaser.GameObjects.Container;
  private statsText!: Phaser.GameObjects.Text;
  private buildModeIndicator!: Phaser.GameObjects.Text;

  // Wave Management
  private waveNumber: number = 1;
  private spawnQueue: string[] = [];
  private pestsToSpawn: number = 0;
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

    // Beetle placeholder (Square)
    graphics.fillStyle(0x888888, 1);
    graphics.fillRect(0, 0, 24, 24);
    graphics.generateTexture('beetle-placeholder', 24, 24);
    graphics.clear();

    // Slug placeholder (Rectangle)
    graphics.fillStyle(0xcc33ff, 1); // Brighter Purple
    graphics.fillRect(0, 0, 30, 20);
    graphics.generateTexture('slug-placeholder', 30, 20);
    graphics.clear();

    // Locust placeholder (Triangle)
    graphics.fillStyle(0x00ff00, 1); // Pure Green
    graphics.fillTriangle(10, 0, 0, 20, 20, 20);
    graphics.generateTexture('locust-placeholder', 20, 20);
    graphics.clear();

    // Plant: Rose (Red Circle)
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(15, 15, 15);
    graphics.generateTexture('rose', 30, 30);
    graphics.clear();

    // Plant: Cactus (Green Vertical Rect)
    graphics.fillStyle(0x228b22, 1);
    graphics.fillRect(5, 0, 20, 30);
    graphics.generateTexture('cactus', 30, 30);
    graphics.clear();

    // Plant: Stone (Grey Round Rect)
    graphics.fillStyle(0x708090, 1);
    graphics.fillRoundedRect(0, 5, 30, 20, 8);
    graphics.generateTexture('stone', 30, 30);
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
      
      // Update store stats
      useCareerStore.getState().updateStats({
        pestsPopped: useCareerStore.getState().stats.pestsPopped + 1
      });
      useGameStore.getState().incrementKills();

      if (this.pestsDestroyed >= this.pestsToSpawn) {
        this.harvest();
      }
    });

    // Listen for boss defeated event
    this.events.on('boss-defeated', (lootRP: number) => {
      useCareerStore.getState().addRP(lootRP);
      useGameStore.getState().incrementKills(); // Boss counts as a kill
      console.log(`Boss defeated! Awarded ${lootRP} RP.`);
    });

    // Initialize groups
    this.plantsGroup = this.physics.add.staticGroup();
    this.structuresGroup = this.physics.add.staticGroup();
    this.pestsGroup = this.physics.add.group({
      classType: Aphid,
      runChildUpdate: true
    });
    this.seedsGroup = this.physics.add.group({
      classType: Seed,
      runChildUpdate: true
    });

    // Collision: Pest vs Structure (Blocking and Damage)
    this.physics.add.collider(this.pestsGroup, this.structuresGroup, (pest, structure) => {
      const s = structure as any;
      // Structures take a small amount of "friction" damage when pests touch them
      s.takeDamage(0.1); 
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
      const p = pest as Pest;
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

    // Keys
    if (this.input.keyboard) {
      this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

      const bKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
      bKey.on('down', () => {
        const currentMode = useGameStore.getState().isBuildMode;
        const newMode = !currentMode;
        useGameStore.getState().setBuildMode(newMode);
        this.buildModeIndicator.setVisible(newMode);
        if (newMode) {
          console.log('Build Mode Active. Select structure with 1, 2, 3.');
        }
      });

      const key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
      const key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
      const key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

      key1.on('down', () => {
        if (useGameStore.getState().isBuildMode) {
          useGameStore.getState().setSelectedStructureType(STRUCTURE_CONSTANTS.TYPES.WALL);
          console.log('Selected: Stone Wall');
        }
      });
      key2.on('down', () => {
        if (useGameStore.getState().isBuildMode) {
          useGameStore.getState().setSelectedStructureType(STRUCTURE_CONSTANTS.TYPES.SPRINKLER);
          console.log('Selected: Auto Sprinkler');
        }
      });
      key3.on('down', () => {
        if (useGameStore.getState().isBuildMode) {
          useGameStore.getState().setSelectedStructureType(STRUCTURE_CONSTANTS.TYPES.ZAPPER);
          console.log('Selected: Copper Zapper');
        }
      });

      // Soil toggle for testing
      const sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      const soilTypes = ['dirt', 'sand', 'rocks', 'ash'];
      let soilIndex = 2; // Start with rocks
      sKey.on('down', () => {
        soilIndex = (soilIndex + 1) % soilTypes.length;
        const newSoil = soilTypes[soilIndex];
        this.environmentManager.soilType = newSoil as any;
        console.log(`Soil changed to: ${newSoil}`);
      });
    }

    // Build Mode Indicator
    this.buildModeIndicator = this.add.text(400, 20, 'BUILD MODE ACTIVE', {
      fontSize: '24px',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setVisible(false).setDepth(200);

    // Initial wave setup
    this.startNewWave();

    // Spawn timer
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnPest,
      callbackScope: this,
      loop: true
    });

    // Click to plant mechanic
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Resume audio context on first interaction to avoid browser warnings
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
      this.handlePlanting(pointer);
    });
  }

  spawnPest() {
    if (this.spawnQueue.length === 0) return;

    const type = this.spawnQueue.shift()!;
    let x, y;
    const side = Phaser.Math.Between(0, 3);
    switch(side) {
      case 0: x = Phaser.Math.Between(0, 800); y = -20; break;
      case 1: x = 820; y = Phaser.Math.Between(0, 600); break;
      case 2: x = Phaser.Math.Between(0, 800); y = 620; break;
      default: x = -20; y = Phaser.Math.Between(0, 600); break;
    }
    const pest = PestFactory.createPest(type, this, x, y);
    this.pestsGroup.add(pest);
    this.pestsSpawned++;
  }

  startNewWave() {
    this.pestsSpawned = 0;
    this.pestsDestroyed = 0;
    this.isWaveActive = true;
    
    this.spawnQueue = [];

    if (this.waveNumber === 5) {
      this.spawnQueue = [PEST_CONSTANTS.TYPES.BOSS_SQUIRREL];
      this.pestsToSpawn = 1;
    } else {
      const budget = 10 + (this.waveNumber * 10);
      let currentSpent = 0;

      const availablePests = [PEST_CONSTANTS.TYPES.APHID];
      if (this.waveNumber >= 3) availablePests.push(PEST_CONSTANTS.TYPES.SLUG);
      if (this.waveNumber >= 6) {
        availablePests.push(PEST_CONSTANTS.TYPES.BEETLE);
        availablePests.push(PEST_CONSTANTS.TYPES.LOCUST);
      }

      while (currentSpent < budget) {
        const type = Phaser.Utils.Array.GetRandom(availablePests);
        const cost = PEST_CONSTANTS.BUDGETS[type as keyof typeof PEST_CONSTANTS.BUDGETS];
        
        if (currentSpent + cost <= budget) {
          this.spawnQueue.push(type);
          currentSpent += cost;
        } else if (currentSpent + 1 <= budget) {
          this.spawnQueue.push(PEST_CONSTANTS.TYPES.APHID);
          currentSpent += 1;
        } else {
          break;
        }
      }
      this.pestsToSpawn = this.spawnQueue.length;
    }

    // Summarize incoming pests for the store
    const incomingSummary: Record<string, number> = {};
    this.spawnQueue.forEach(type => {
      incomingSummary[type] = (incomingSummary[type] || 0) + 1;
    });

    useGameStore.getState().setWaveInfo(this.waveNumber, this.pestsToSpawn, incomingSummary);
    this.waveNumber++;
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

    // Sync plant count to store for dashboard
    useGameStore.getState().updatePlantCount(survivingPlants.length);

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
      this.resetWave();
      summary.destroy();
    });
  }

  resetWave() {
    this.startNewWave();
  }

  update(time: number, delta: number) {
    this.environmentManager.update(delta);
    
    let hoveredPlant: Plant | null = null;
    let hoveredStructure: Structure | null = null;
    const pointer = this.input.activePointer;

    const plants = this.plantsGroup.getChildren() as Plant[];
    plants.forEach(p => {
      p.update(delta);
      if (Phaser.Geom.Rectangle.Contains(p.getBounds(), pointer.x, pointer.y)) {
        hoveredPlant = p;
      }
    });

    const structures = this.structuresGroup.getChildren() as Structure[];
    structures.forEach(s => {
      if (Phaser.Geom.Rectangle.Contains(s.getBounds(), pointer.x, pointer.y)) {
        hoveredStructure = s;
      }
    });

    if (hoveredPlant) {
      const hp = hoveredPlant;
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
    } else if (hoveredStructure) {
      const hs = hoveredStructure;
      this.hoverStats.setVisible(true);
      this.hoverStats.setPosition(pointer.x + 10, pointer.y + 10);
      this.statsText.setText(
        `${hs.getDisplayName()}\n` +
        `Durability: ${Math.floor(hs.durability)}/${hs.maxDurability}`
      );
    } else {
      this.hoverStats.setVisible(false);
    }
  }

  // Click to plant mechanic helper
  private handlePlanting(pointer: Phaser.Input.Pointer) {
    const gridX = Math.floor((pointer.x - 200) / 40);
    const gridY = Math.floor((pointer.y - 100) / 40);

    if (gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 10) {
      const snappedX = gridX * 40 + 200 + 20;
      const snappedY = gridY * 40 + 100 + 20;

      // Check if space is occupied
      const occupiedByPlant = this.plantsGroup.getChildren().some((p: any) => p.x === snappedX && p.y === snappedY);
      const occupiedByStructure = this.structuresGroup.getChildren().some((s: any) => s.x === snappedX && s.y === snappedY);
      if (occupiedByPlant || occupiedByStructure) return;

      if (useGameStore.getState().isBuildMode) {
        // Build mode: Place structures
        const structureType = useGameStore.getState().selectedStructureType;
        
        // Check if unlocked in Career Store
        const isUnlocked = useCareerStore.getState().isEntityUnlocked('structure', structureType);
        if (!isUnlocked) {
          console.log(`Structure ${structureType} is not unlocked yet!`);
          const lockedText = this.add.text(pointer.x, pointer.y - 20, 'LOCKED!', { 
            fontSize: '20px', 
            color: '#ff0000', 
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
          }).setOrigin(0.5).setDepth(300);
          
          this.tweens.add({
            targets: lockedText,
            y: lockedText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => lockedText.destroy()
          });
          return;
        }

        const currentSoil = this.environmentManager.soilType;
        const anchors = (STRUCTURE_CONSTANTS.ANCHORS as any)[structureType];

        if (anchors && anchors.includes(currentSoil)) {
          const structure = StructureFactory.create(structureType, this, snappedX, snappedY);
          structure.setDepth(10);
          this.structuresGroup.add(structure);
        } else {
          console.log(`Cannot place ${structureType} on ${currentSoil}. Needs: ${anchors?.join(', ')}`);
        }
        return;
      }

      const { plantCount, plantLimit } = useGameStore.getState();
      
      if (plantCount >= plantLimit) {
        const limitText = this.add.text(pointer.x, pointer.y - 20, 'GARDEN FULL!', { 
          fontSize: '20px', 
          color: '#ff0000', 
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5).setDepth(300);
        
        this.tweens.add({
          targets: limitText,
          y: limitText.y - 50,
          alpha: 0,
          duration: 1000,
          onComplete: () => limitText.destroy()
        });
        return;
      }

      if (this.shiftKey?.isDown && this.environmentManager.soilType !== 'ash') {
        // Cacti (Offensive plants) are intended to be harder to grow, 
        // but let's make them 100% reliable for now to ensure the player can actually play.
        // We can add a cost or specific soil requirement later.
      }

      let plant;
      if (this.shiftKey?.isDown) {
        plant = new OffensivePlant(this, snappedX, snappedY);
      } else {
        plant = new ObjectivePlant(this, snappedX, snappedY);
      }
      plant.setDepth(10);
      this.plantsGroup.add(plant);
      useGameStore.getState().updatePlantCount(this.plantsGroup.getLength());
    }
  }
}

