import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    spaceshipContainer: Phaser.GameObjects.Container;
    spaceship: Phaser.GameObjects.Sprite;
    spaceshipFire: Phaser.GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    speed: number;
    acceleration: number;
    maxSpeed: number;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('rocket-boosters', 'assets/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Engines/PNGs/Main Ship - Engines - Supercharged Engine.png');
        this.load.image('background', 'assets/space-background.jpg');
    }

    create() {
        this.camera = this.cameras.main;
        this.background = this.add.image(0, 0, 'background').setOrigin(0);
        
        this.spaceshipContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.height);
    
        // Add rocket boosters to the container
        this.spaceshipFire = this.add.sprite(0, -32, 'rocket-boosters', 0).setScale(2);
        this.spaceshipContainer.add(this.spaceshipFire);

            // Add spaceship to the container
        this.spaceship = this.add.sprite(0, 0, 'dude')
            .setScale(2)
            .setOrigin(0.5, 1);
        this.spaceshipContainer.add(this.spaceship);

        // Enable cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set initial speed parameters
        this.speed = 0;
        this.acceleration = 0.1;
        this.maxSpeed = 5;

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        // Accelerate if the arrow key is held down
        if (this.cursors.left.isDown && this.speed > -this.maxSpeed) {
            this.speed -= this.acceleration;
            // Rotate the spaceship slightly to the left
            this.spaceshipContainer.rotation = Phaser.Math.Angle.RotateTo(this.spaceshipContainer.rotation, -0.2, 0.01);
        } else if (this.cursors.right.isDown && this.speed < this.maxSpeed) {
            this.speed += this.acceleration;
            // Rotate the spaceship slightly to the right
            this.spaceshipContainer.rotation = Phaser.Math.Angle.RotateTo(this.spaceshipContainer.rotation, 0.2, 0.01);
        } else {
            // Decelerate gradually if no arrow key is pressed
            if (this.speed > 0) {
                this.speed = Math.max(0, this.speed - this.acceleration);
            } else if (this.speed < 0) {
                this.speed = Math.min(0, this.speed + this.acceleration);
            }
            // Reset the rotation when no arrow key is pressed
            this.spaceshipContainer.rotation = Phaser.Math.Angle.RotateTo(this.spaceshipContainer.rotation, 0, 0.01);
        }
    
        // Move the spaceship based on the current speed
        this.spaceshipContainer.x += this.speed;
    
        // Ensure the spaceship stays within the screen boundaries
        const halfWidth = this.spaceship.width / 2;
        const minX = halfWidth;
        const maxX = this.cameras.main.width - halfWidth;
    
        // Check if the spaceship has reached the screen boundaries
        if (this.spaceshipContainer.x < minX || this.spaceshipContainer.x > maxX) {
            this.speed = 0; // Stop the spaceship instantly
            this.spaceshipContainer.x = Phaser.Math.Clamp(this.spaceshipContainer.x, minX, maxX); // Clamp the position
        }
    }
    
    changeScene() {
        this.scene.start('GameOver');
    }
}
