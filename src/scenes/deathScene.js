export default class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DeathScene' });
    }

    
    preload() {
        // Preload assets (if needed)
        this.load.image('logo', 'path/to/logo.png'); // Replace with your actual logo path
    }

    create() {
        // Get the center of the screen
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add the logo at the center
        const logo = this.add.image(width / 2, height / 2, 'logo');
        logo.setOrigin(0.5, 0.5).setScale(0.5).setAlpha(0);

        // Fade in the logo
        this.tweens.add({
            targets: logo,
            alpha: 1,
            ease: 'Quad.easeIn',
            duration: 3000,
            onComplete: () => {
                // After the fade, wait a bit and go to the menu
                this.time.delayedCall(400, () => {
                    this.scene.start('MenuScene'); // Replace with your menu scene key
                });
            },
        });
    }
}