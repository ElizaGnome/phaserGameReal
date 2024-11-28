import MainScene from '../scenes/mainScene.js';
import Phaser from 'phaser';

export const gameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: true
        }
    },
    scene: [ MainScene ]
};