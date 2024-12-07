export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Title
        this.add.text(width / 2, height / 4, 'Main Menu', {
            font: '40px Arial',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // "Start Game" button
        const startButton = this.add.text(width / 2, height / 2, 'Start Game', {
            font: '30px Arial',
            fill: '#ff0',
        })
            .setOrigin(0.5)
            .setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('MainScene'); 
        });

    }
}
