import Phaser from "phaser";
import PlayerBullet from "./RocketMissile";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    player: Phaser.Physics.Arcade.Sprite;
    spawning: boolean = true;
    spawnCounter: number = Phaser.Math.Between(40, 80);
    velocity: number = 0;
    minVelocityX: number = 50;
    maxVelocityX: number = 150;
    initialDirection: number;
    bulletTimer: Phaser.Time.TimerEvent;
    bullets: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Phaser.Physics.Arcade.Sprite, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.player = player;
        this.velocity = Phaser.Math.Between(this.minVelocityX, this.maxVelocityX);
        this.initialDirection = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

        scene.physics.world.enable(this);
        this.body?.setSize(this.width, this.height);
        scene.add.existing(this);

        // Create a timer event to spawn player bullets every 2 seconds
        this.bulletTimer = scene.time.addEvent({
            delay: 2300,
            callback: this.spawnBullet,
            callbackScope: this,
            loop: true
        });

        // Create a group for bullets
        this.bullets = scene.physics.add.group({
            classType: PlayerBullet,
            maxSize: 10,
            runChildUpdate: true
        });
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        if (this.spawning) {
            this.spawnCounter--;
            this.setVelocityY(5 * this.spawnCounter);

            if (this.spawnCounter <= 0) {
                this.spawning = false;
                this.setVelocityX(this.velocity * this.initialDirection);
            }
        }

        if (!this.spawning) {
            if (this.x > Number(this.scene.sys.game.config.width)) {
                this.setVelocityX(-this.velocity);
            }
            else if (this.x < 0) {
                this.setVelocityX(this.velocity);
            }
        }
    }

    // Function to spawn player bullet
    spawnBullet() {
        // Get the first available bullet from the group
        const bullet = this.bullets.get(this.x, this.y, 'rocket-missile', 'down');
        // If a bullet is available, reset it and launch it upwards
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocityY(-500); // Adjust the velocity as needed
        }
    }
}
