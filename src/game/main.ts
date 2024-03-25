import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';


// Define the dimensions based on the device type
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

if (screenWidth > screenHeight) {
    screenWidth = screenHeight
}

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    }
};

const StartGame = (parent: string) => {
    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
