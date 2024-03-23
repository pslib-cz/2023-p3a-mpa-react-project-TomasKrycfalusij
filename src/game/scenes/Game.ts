import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    spaceshipContainer: Phaser.GameObjects.Container;
    spaceship: Phaser.GameObjects.Sprite;
    spaceshipBoosters: Phaser.GameObjects.Sprite;
    spaceshipFire: Phaser.GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    verticalSpeed: number;
    verticalAcceleration: number;
    horizontalSpeed: number;
    horizontalAcceleration: number;
    maxSpeed: number;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('rocket-boosters', 'assets/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Engines/PNGs/Main Ship - Engines - Supercharged Engine.png');
        this.load.spritesheet('spaceship-fire', 'assets/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Engine Effects/PNGs/Main Ship - Engines - Supercharged Engine - Spritesheet.png', { frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
        this.load.image('background', 'assets/space-background.jpg');
    }

    create() {
        this.camera = this.cameras.main;
        this.background = this.add.image(0, 0, 'background').setOrigin(0);


        const button = this.add.text(this.cameras.main.width - 10, 10, 'Main Menu', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' })
        .setOrigin(1, 0)
        .setInteractive();

        button.on('pointerup', () => {
            this.scene.start('MainMenu');
        });

        const config2 = {
            key: 'explodeAnimation',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23 }),
            frameRate: 20,
            repeat: -1
        };
        this.anims.create(config2);
        this.add.sprite(400, 300, 'explosion').play('explodeAnimation');

        
        //  ----- ROCKET ----- //
        this.spaceshipContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.height - 10);
    
        // Add rocket boosters to the container
        this.spaceshipBoosters = this.add.sprite(0, -32, 'rocket-boosters').setScale(2);
        this.spaceshipContainer.add(this.spaceshipBoosters);

        this.anims.create({
            key: 'spaceship-fire-animation-idle',
            frames: this.anims.generateFrameNumbers('spaceship-fire', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 1
        });
        this.anims.create({
            key: 'spaceship-fire-animation-on',
            frames: this.anims.generateFrameNumbers('spaceship-fire', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: 1
        });

        this.spaceshipFire = this.add.sprite(0, -32, 'spaceship-fire', 0).setScale(2)
        // this.spaceshipFire.play('spaceship-fire-animation-idle');
        this.spaceshipContainer.add(this.spaceshipFire);

            // Add spaceship to the container
        this.spaceship = this.add.sprite(0, 0, 'dude')
            .setScale(2)
            .setOrigin(0.5, 1);
        this.spaceshipContainer.add(this.spaceship);

        // Enable cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set initial verticalSpeed parameters
        this.verticalSpeed = 0;
        this.verticalAcceleration = 0.1;
        this.horizontalSpeed = 0;
        this.horizontalAcceleration = 0.1;
        this.maxSpeed = 5;

        //  ----- ROCKET ----- //

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        // Update the background position based on the player's X position
        this.background.x = -(this.spaceshipContainer.x * 0.3);
        this.background.y = -(this.spaceshipContainer.y * 0.3);
        // Check if the left or right arrow key is pressed
        const isLeftPressed = this.cursors.left.isDown;
        const isRightPressed = this.cursors.right.isDown;
        const isUpPressed = this.cursors.up.isDown;
        const isDownPressed = this.cursors.down.isDown;
            
        // Play the appropriate animation based on key state
        if (isLeftPressed || isRightPressed || isUpPressed || isDownPressed) {
            // If a key is pressed, play the 'spaceship-fire-animation-on' animation
            this.spaceshipFire.playAfterRepeat('spaceship-fire-animation-on').setScale(2);
        } else {
            // If no key is pressed, play the 'spaceship-fire-animation-idle' animation
            this.spaceshipFire.playAfterRepeat('spaceship-fire-animation-idle').setScale(2);
        }

        if (isLeftPressed && this.horizontalSpeed > -this.maxSpeed) {
            this.horizontalSpeed -= this.horizontalAcceleration;
            this.spaceshipContainer.rotation = Phaser.Math.Angle.RotateTo(this.spaceshipContainer.rotation, -0.2, 0.01);
        } else if (isRightPressed && this.horizontalSpeed < this.maxSpeed) {
            this.horizontalSpeed += this.horizontalAcceleration;
            this.spaceshipContainer.rotation = Phaser.Math.Angle.RotateTo(this.spaceshipContainer.rotation, 0.2, 0.01);
        } else {
            if (this.horizontalSpeed > 0) {
                this.horizontalSpeed = Math.max(0, this.horizontalSpeed - this.horizontalAcceleration / 2);
            } else if (this.horizontalSpeed < 0) {
                this.horizontalSpeed = Math.min(0, this.horizontalSpeed + this.horizontalAcceleration / 2);
            }
            this.spaceshipContainer.rotation = Phaser.Math.Angle.RotateTo(this.spaceshipContainer.rotation, 0, 0.01);
        }
        
        if (isUpPressed && this.verticalSpeed > -this.maxSpeed) {
            this.verticalSpeed -= this.verticalAcceleration;
        } else if (isDownPressed && this.verticalSpeed < this.maxSpeed) {
            this.verticalSpeed += this.verticalAcceleration;
        } else {
            if (this.verticalSpeed > 0) {
                this.verticalSpeed = Math.max(0, this.verticalSpeed - this.verticalAcceleration / 2);
            } else if (this.verticalSpeed < 0) {
                this.verticalSpeed = Math.min(0, this.verticalSpeed + this.verticalAcceleration / 2);
            }
        }
                
        // Move the spaceship based on the current verticalSpeed
        this.spaceshipContainer.x += this.horizontalSpeed;
        this.spaceshipContainer.y += this.verticalSpeed;
        
    
        // Ensure the spaceship stays within the screen boundaries
        const halfWidth = this.spaceshipContainer.width / 2;
        const halfHeight = this.spaceshipContainer.height / 2;
        const minX = halfWidth;
        const minY = this.cameras.main.height / 2 - halfHeight - 200;
        const maxX = this.cameras.main.width - halfWidth;
        const maxY = this.cameras.main.height - halfHeight;
    
        if (this.spaceshipContainer.x < minX || this.spaceshipContainer.x > maxX ) {
            this.horizontalSpeed = 0; // Stop the spaceship instantly
            this.spaceshipContainer.x = Phaser.Math.Clamp(this.spaceshipContainer.x, minX, maxX);
        }
        if (this.spaceshipContainer.y < minY || this.spaceshipContainer.y > maxY) {
            this.verticalSpeed = 0;
            this.spaceshipContainer.y = Phaser.Math.Clamp(this.spaceshipContainer.y, minY, maxY);
        }
    }
    
    
    changeScene() {
        this.scene.start('GameOver');
    }
}
