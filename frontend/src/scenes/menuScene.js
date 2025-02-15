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

         const storedUsername = this.getCookie('username');
       



         if (storedUsername) { 
            // Skip username input and start the game with stored username 
            this.startGame(storedUsername); 
        } 
        else {
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
    console.log('input node value:', inputUsername ? inputUsername.value : 'No input node value');
    
    if (inputUsername && inputUsername.value.trim() !== '') { 
        const value = inputUsername.value;
        console.log('Sending username for check:', value);

        fetch(`https://localhost:5000/username-check?username=${value}`)
            .then(response => {
                console.log('Received response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                if (data && data.available) {
                    const newUser = { name: value };
                    console.log('USERNAME IS NOT USED, USERNAME IS', value);

                    return fetch('https://localhost:5000/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newUser)
                    });
                } else {
                    console.log('USERNAME IS TAKEN');
                    return Promise.reject('Username is taken');
                }
            })
            .then(response => {
                console.log('POST response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('success:', data);
                document.cookie = `username=${value}; path=/;`;
                this.startGame(inputUsername.value);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        
    } else {
        console.log('Input is empty or invalid');
        this.add.text(width / 2, height / 2 + 100,
            'Please enter a username',
            { fontSize: '20px', fill: '#ff0000' })
            .setOrigin(0.5);
        }
    });
  }
}
startGame(username) { 
    this.scene.start('MainScene', { username }); 
}

getCookie(name) {
     let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)')); 
     if (match) return match[2];
      return null; 
    }
}
        
