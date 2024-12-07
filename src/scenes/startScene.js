
import { preload } from "../js/preload";
//import MenuScene from './scenes/menuScene.js';

export default class StartScene extends Phaser.Scene {

    constructor() {
        super({ key: 'StartScene' });
    };
    preload() {
        this.load.image('logo', 'assets/2.png');
        this.load.audio('mainMusic', 'assets/main_music.mp3');
        preload.call(this);
        for(let i  = 0; i < 300; i++){
            this.load.image('logo'+i, 'assets/2.png');
        }




        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(300, 290, 400, 40);
       
        const loadingText = this.make.text({
            x: this.cameras.main.width/2,
            y: this.cameras.main.height /2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });




        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: this.cameras.main.width/2,
            y: this.cameras.main.height/2 +22,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);


        this.load.on('progress', (value) => {
         
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(310,295, 380 * value, 30);
        });
                    
        this.load.on('fileprogress', (file) => {
            console.log(file.src);
        });
        this.load.on('complete', ()=> {
            console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

    }

    create() {
        this.music = this.sound.play('mainMusic',{loop: true});
        const logo= this.add.image(this.sys.game.config.width /2, this.sys.game.config.height/2, 'logo');
        logo.setScale(0.5);
        this.logo =logo;


        if (logo) {
            console.log('logo exists',logo);

           

            const fadeOut = this.tweens.add({
                targets: logo,
                alpha:0,
                ease: 'Power1',
                duration: 3000
            });
            fadeOut.on('complete', () => {
                this.scene.start('MenuScene');
            });


            
        }
    }
};  
