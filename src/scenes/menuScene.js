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

        
         //lets create a user name
        this.add.text(width / 2, height / 2 - 50, 'Enter YOUR username: ', 
            {
            fontSize: '32px',
            fill: '#ffffff'
        } 
        ).setOrigin(0.5);
    //the bits in style are css
        const inputElement = this.add.dom(
            width /2,
            height/2 , 
            'input',{
                type: 'text', 
                name: 'username', 
                placeholder: 'Username', 
                style: 'font-size:20px; width: 200px; padding: 10px;'
            }
        ).setOrigin(0.5);

        console.log('input value', inputElement);

        // "Start Game" button
    const startButton = this.add.dom( width / 2, height / 2 + 50, 
    'button', { style: 'font-size: 20px; padding: 10px 20px;' }, 
    'Start Game' ).setOrigin(0.5);
           
        startButton.addListener('click');
         startButton.on('click', () => { 
            const inputUsername = inputElement.node;
            console.log('input node value', inputUsername.value);
             if (inputUsername && inputUsername.value.trim() !=='') { 

                //this is the code area that communicates with the backend docker container
                //fetch end point, get respons then do something





                this.scene.start('MainScene', { username: inputUsername.value });
             } 
             else { 
                this.add.text( width / 2, height / 2 + 100,
                     'Please enter a username',
                      { fontSize: '20px', fill: '#ff0000' } )
                      .setOrigin(0.5);
                     }

        });
    }
}

