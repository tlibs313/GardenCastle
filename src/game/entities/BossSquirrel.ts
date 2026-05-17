import Phaser from 'phaser';
import { Pest } from './Pest';
import { PEST_CONSTANTS } from '../constants';

export class BossSquirrel extends Pest {
  private healthBar: Phaser.GameObjects.Graphics;
  private isStunned: boolean = false;
  private isDizzy: boolean = false;
  private stunTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'squirrel-placeholder');
    
    this.health = PEST_CONSTANTS.BOSS.HEALTH;
    this.maxHealth = PEST_CONSTANTS.BOSS.HEALTH;
    this.speed = 30; // Bosses are slower
    
    this.healthBar = scene.add.graphics();
    this.healthBar.setDepth(1001); // Above most things
    
    // Override default squish behavior from Pest
    this.off('pointerdown');
    this.on('pointerdown', () => {
      this.manualHit();
    });

    this.setScale(2); // Make it big
  }

  public manualHit() {
    if (this.isDizzy) {
      this.die();
      return;
    }

    this.takeDamage(PEST_CONSTANTS.BOSS.CLICK_DAMAGE);
    this.stun();
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    this.lastHitTime = this.scene.time.now;
    
    if (this.health <= 0) {
      this.health = 0;
      this.enterDizzyState();
    }
  }

  private stun() {
    if (this.isDizzy) return;

    this.isStunned = true;
    this.setVelocity(0, 0);
    this.setTint(0xffff00); // Yellow tint for stun

    if (this.stunTimer) this.stunTimer.remove();
    
    this.stunTimer = this.scene.time.addEvent({
      delay: PEST_CONSTANTS.BOSS.STUN_DURATION,
      callback: () => {
        this.isStunned = false;
        this.clearTint();
      },
      callbackScope: this
    });
  }

  private enterDizzyState() {
    this.isDizzy = true;
    this.isStunned = false;
    if (this.stunTimer) this.stunTimer.remove();
    
    this.setVelocity(0, 0);
    this.setTint(0xff0000); // Red tint for dizzy
  }

  protected die() {
    // Award bonus RP for boss defeat
    this.scene.events.emit('boss-defeated', PEST_CONSTANTS.BOSS.LOOT_RP);
    super.die();
  }

  private drawHealthBar() {
    this.healthBar.clear();
    
    const x = this.x - 40;
    const y = this.y - 50;
    const width = 80;
    const height = 10;
    
    // Background
    this.healthBar.fillStyle(0x000000);
    this.healthBar.fillRect(x, y, width, height);
    
    // Health
    const healthWidth = (this.health / this.maxHealth) * width;
    this.healthBar.fillStyle(this.isDizzy ? 0xff0000 : 0x00ff00);
    this.healthBar.fillRect(x, y, healthWidth, height);

    // Border
    this.healthBar.lineStyle(1, 0xffffff);
    this.healthBar.strokeRect(x, y, width, height);
  }

  update(time: number, delta: number) {
    if (this.isDizzy || this.isStunned) {
      this.drawHealthBar();
      return;
    }

    super.update(time, delta);
    this.drawHealthBar();
  }

  destroy(fromScene?: boolean) {
    this.healthBar.destroy();
    super.destroy(fromScene);
  }
}
