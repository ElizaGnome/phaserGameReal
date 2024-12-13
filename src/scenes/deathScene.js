export default class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DeathScene' });
    }

    
    preload() {
        // Preload assets (if needed)
        this.load.image('logo', 'path/to/logo.png'); // Replace with your actual logo path
    }

    create() { 
        const width = this.cameras.main.width; 
        const height = this.cameras.main.height;
        const deathText = this.add.text(width / 2, height / 2 - 50, 'You Died', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5, 0.5);
        const promptText = this.add.text(width / 2, height / 2 + 50, 'Press ENTER to Try Again', { fontSize: '32px', fill: '#ffffff'  }).setOrigin(0.5, 0.5); 
        
        this.input.keyboard.on('keydown-ENTER', () => { 
            this.scene.start('StartScene');  }); }
}