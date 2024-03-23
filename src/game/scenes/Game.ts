import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Enemy from '../objects/enemy';
/*
import { useContext } from 'react';
import { AppContext, AppContextState } from '../../components/context';
*/

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.TileSprite;
    player: Phaser.GameObjects.Container;
    spaceship: Phaser.GameObjects.Sprite;
    spaceshipBoosters: Phaser.GameObjects.Sprite;
    spaceshipFire: Phaser.GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    verticalSpeed: number;
    verticalAcceleration: number;
    horizontalSpeed: number;
    horizontalAcceleration: number;
    maxSpeed: number;
    score: number;
    scoreText: Phaser.GameObjects.Text;
    scoreUpdateInterval: any;
    spawnTimer: Phaser.Time.TimerEvent;

    constructor() {
        super('Game');
        this.score = parseInt(localStorage.getItem('score') || '0', 10); // Initialize score from local storage
    }

    preload() {
        this.load.image('rocket-boosters', 'assets/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Engines/PNGs/Main Ship - Engines - Supercharged Engine.png');
        this.load.spritesheet('spaceship-fire', 'assets/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Engine Effects/PNGs/Main Ship - Engines - Supercharged Engine - Spritesheet.png', { frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
        this.load.image('background', 'assets/spacetile.png');
    }

    create() {


        /*
        const spawnEnemies = false;
        this.spawnTimer = this.time.addEvent({
            delay: 3000, // 3 seconds interval
            callback: this.spawnEnemies,
            callbackScope: this,
            loop: spawnEnemies
        });
        */
    
        this.background = this.add.tileSprite(500, 500, this.cameras.main.width + 600, this.cameras.main.height + 600, 'background').setOrigin(0).setScale(1.5);

        this.scoreText = this.add.text(10, 10, this.score.toString(), { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });

        this.scoreUpdateInterval = setInterval(() => {
            this.updateScore(1);
        }, 1000);
       
        const button = this.add.text(this.cameras.main.width - 10, 10, 'Main Menu', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' })
            .setOrigin(1, 0)
            .setInteractive()

        button.on('pointerup', () => {
            this.scene.start('MainMenu');
        });


        /*
        const config2 = {
            key: 'explodeAnimation',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 23 }),
            frameRate: 20,
            repeat: -1
        };
        this.anims.create(config2);
        this.add.sprite(400, 300, 'explosion').play('explodeAnimation');
        */

        
        //  ----- ROCKET ----- //
        this.player = this.add.container(this.cameras.main.centerX, this.cameras.main.height - 10);
    
        // Add rocket boosters to the container
        this.spaceshipBoosters = this.add.sprite(0, -32, 'rocket-boosters').setScale(2);
        this.player.add(this.spaceshipBoosters);

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
        this.player.add(this.spaceshipFire);

            // Add spaceship to the container
        this.spaceship = this.add.sprite(0, 0, 'dude')
            .setScale(2)
            .setOrigin(0.5, 1);
        this.player.add(this.spaceship);

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

    spawnEnemies() {
        const x = Phaser.Math.Between(0, this.cameras.main.width);
        const y = -100; // Spawn 100 pixels above the screen
    
        // Create the enemy
        const enemy = new Enemy(this, x, y, 'enemyTexture');
    
        // Add physics to the enemy
        this.physics.add.existing(enemy);
    
        // Set velocity to make the enemy move down
        enemy.setVelocity(0, 100); // Adjust the velocity as needed
    
        // Remove the enemy when it's below the screen height
        enemy.update = () => {
            if (enemy.y > this.cameras.main.height) {
                enemy.destroy();
            }
        };
    }
    

    updateScore(value: number) {
        this.score += value;
        localStorage.setItem('score', this.score.toString());
    }

    saveScore() {
        localStorage.setItem('score', this.score.toString());
    }

    update() {
        // Update the background position based on the player's X position
        this.background.tilePositionY -= 0.3;
        this.background.x = -(this.player.x * 0.3);
        this.background.y = -(this.player.y * 0.3);
        
        // Check if the left or right arrow key is pressed
        const isLeftPressed = this.cursors.left.isDown;
        const isRightPressed = this.cursors.right.isDown;
        const isUpPressed = this.cursors.up.isDown;
        const isDownPressed = this.cursors.down.isDown;
    
        if (isRightPressed) {
            this.background.tilePositionX += 0.7
        }
        else if (isLeftPressed) {
            this.background.tilePositionX -= 0.7
        }
            
        // Play the appropriate animation based on key state
        if (isLeftPressed || isRightPressed || isUpPressed) {
            // If a key is pressed, play the 'spaceship-fire-animation-on' animation
            this.spaceshipFire.playAfterRepeat('spaceship-fire-animation-on').setScale(2);
        } else {
            // If no key is pressed, play the 'spaceship-fire-animation-idle' animation
            this.spaceshipFire.playAfterRepeat('spaceship-fire-animation-idle').setScale(2);
        }
    
        if (isLeftPressed && this.horizontalSpeed > -this.maxSpeed) {
            this.horizontalSpeed -= this.horizontalAcceleration;
        } else if (isRightPressed && this.horizontalSpeed < this.maxSpeed) {
            this.horizontalSpeed += this.horizontalAcceleration;
        }
        
        // Update rotation based on horizontal speed
        this.player.rotation = Phaser.Math.Angle.RotateTo(this.player.rotation, this.horizontalSpeed * 0.08, 0.01);
        this.player.scaleY = -(Math.abs(this.verticalSpeed)) / 30 + 1;
        
    
        // Decelerate gradually if no arrow key is pressed
        if (!(isLeftPressed || isRightPressed)) {
            if (this.horizontalSpeed > 0) {
                this.horizontalSpeed = Math.max(0, this.horizontalSpeed - this.horizontalAcceleration / 2);
            } else if (this.horizontalSpeed < 0) {
                this.horizontalSpeed = Math.min(0, this.horizontalSpeed + this.horizontalAcceleration / 2);
            }
        }
        
        
        if (isUpPressed && this.verticalSpeed > -this.maxSpeed) {
            this.verticalSpeed -= this.verticalAcceleration;
        } else if (isDownPressed && this.verticalSpeed < this.maxSpeed - 2) {
            this.verticalSpeed += this.verticalAcceleration;
        } else {
            if (this.verticalSpeed > 0) {
                this.verticalSpeed = Math.max(0, this.verticalSpeed - this.verticalAcceleration / 2);
            } else if (this.verticalSpeed < 0) {
                this.verticalSpeed = Math.min(0, this.verticalSpeed + this.verticalAcceleration / 2);
            }
        }
                
        // Move the spaceship based on the current verticalSpeed
        this.player.x += this.horizontalSpeed;
        this.player.y += this.verticalSpeed;
    
        // Update the score text to reflect the current score value
        this.scoreText.setText(this.score.toString());
    
        // Ensure the spaceship stays within the screen boundaries
        const halfWidth = this.player.width / 2;
        const halfHeight = this.player.height / 2;
        const minX = halfWidth;
        const minY = this.cameras.main.height / 2 - halfHeight - 200;
        const maxX = this.cameras.main.width - halfWidth;
        const maxY = this.cameras.main.height - halfHeight;
    
        if (this.player.x < minX || this.player.x > maxX ) {
            this.horizontalSpeed = 0; // Stop the spaceship instantly
            this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);
        }
        if (this.player.y < minY || this.player.y > maxY) {
            this.verticalSpeed = 0;
            this.player.y = Phaser.Math.Clamp(this.player.y, minY, maxY);
        }
    }
    
    
    changeScene() {
        this.scene.start('GameOver');
    }
}
