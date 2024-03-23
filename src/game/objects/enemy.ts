export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 100; // Constant speed of the enemy, adjust as needed
    }

    update() {
        // Move the enemy downwards at a constant speed
        this.y += this.speed * this.scene.game.loop.delta / 1000;

        // Check if the enemy has reached the bottom of the screen
        if (this.y > this.scene.sys.canvas.height) {
            // If so, remove the enemy from the scene
            this.destroy();
        }
    }
}
