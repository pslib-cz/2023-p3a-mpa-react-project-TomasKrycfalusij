import Phaser from "phaser";

import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    player: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Phaser.Physics.Arcade.Sprite, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.player = player;

        // Enable physics for the enemy
        scene.physics.world.enable(this);

        // Set the size of the physics body to match the sprite
        this.body.setSize(this.width, this.height);

        // Add the enemy to the scene
        scene.add.existing(this);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // Calculate direction vector from the enemy to the player
        const direction = new Phaser.Math.Vector2(
            this.player.x - this.x,
            this.player.y - this.y
        ).normalize();

        // Set velocity towards the player
        this.setVelocity(direction.x * 100, direction.y * 100);
    }
}
