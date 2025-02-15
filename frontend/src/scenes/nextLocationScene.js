
class NextLocationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NextLocationScene' });
    }

    create() {
        // Add background color
        this.cameras.main.setBackgroundColor('#000');

        // Display the completion message
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, height / 2, 'Task Completed!', {
            fontSize: '64px',
            fill: '#FFA500'
        }).setOrigin(0.5, 0.5);

        // Optionally, you can add a button to return to the main menu or restart
        this.add.text(width / 2, height / 2 + 100, 'Press ENTER to Restart', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('StartScene'); // Restart the main scene or go to another scene
        });
    }
}
export default NextLocationScene;