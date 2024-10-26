class Example extends Phaser.Scene
{
    preload ()
    {
     

        this.load.image('base', './src/assets/base.png');

    }

    create ()
    {
        this.add.image(400, 300, 'base');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
   
};

const game = new Phaser.Game(config);