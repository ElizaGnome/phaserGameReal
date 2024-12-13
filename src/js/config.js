import MainScene from '../scenes/mainScene.js';
import StartScene from '../scenes/startScene.js';
import MenuScene from '../scenes/menuScene.js';
import Phaser from 'phaser';
import DeathScene from '../scenes/deathScene.js';
import JournalOverlayScene from '../scenes/overlayScene.js';
import DialogueOverlayScene from '../scenes/dialogueSection.js'
import NextLocationScene from '../scenes/nextLocationScene.js';

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
    scene: [StartScene,
            MenuScene, 
            MainScene, 
            DeathScene, 
            JournalOverlayScene,
            DialogueOverlayScene,
            NextLocationScene
        ]
};