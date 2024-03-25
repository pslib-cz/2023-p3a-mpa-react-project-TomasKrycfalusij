import Phaser from 'phaser';

export default class RocketMissile extends Phaser.Physics.Arcade.Sprite {
    direction: string = "up";

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, direction? : string | undefined, enemy?: boolean) {
        super(scene, x, y, texture, direction);
        scene.add.existing(this).setScale(1.5);
        this.direction = String(direction);
        if (direction === 'down') {
            this.flipY = true;
        }
        scene.physics.world.enable(this);

        // Add animation
        scene.anims.create({
            key: 'rocket-animation',
            frames: scene.anims.generateFrameNumbers('rocket-missile', { start: 0, end: 2 }), // Adjust the frame numbers accordingly
            frameRate: 10,
            repeat: -1 // Set to -1 to loop indefinitely
        });

        // Play the animation
        this.play('rocket-animation');
    }

    // Override preUpdate to handle bullet behavior
    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.direction === "down") {
            this.setVelocityY(500)
        }

        // If the bullet reaches the top of the screen, destroy it
        if (this.y < 0) {
            this.destroy();
        }
    }
}
