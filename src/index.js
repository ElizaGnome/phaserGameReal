const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }, // Gravity pulling the character down
            debug: true // Enable debug to see physics bodies
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    console.log("Loading assets...");
    this.load.image('background', 'assets/base.png'); // Ensure path is correct
    this.load.spritesheet('characterWalkRight', 'assets/walk_sprite_sheet.png', { frameWidth: 65, frameHeight: 66 });
    this.load.spritesheet('characterWalkLeft', 'assets/left_walk_sprite_sheet.png', { frameWidth: 65, frameHeight: 66 });
    this.load.spritesheet('characterJumpRight', 'assets/jump_sprite_sheet.png', { frameWidth: 64, frameHeight: 70 });
    this.load.spritesheet('characterJumpLeft', 'assets/left_jump_sprite_sheet.png', { frameWidth: 64, frameHeight: 70 });

    this.load.spritesheet('characterRunLeft', 'assets/left_run_sprite_sheet.png', { frameWidth: 70, frameHeight: 70 });
    this.load.spritesheet('characterRunRight', 'assets/run_sprite_sheet.png', { frameWidth: 70, frameHeight: 70 });

    this.load.image("ground",'assets/ground.png')
}

function create() {
    // Background
    const background = this.add.image(512, 288, 'background');
    background.setOrigin(0.5, 0.5);
    background.setScale(config.width / background.width, config.height / background.height);

    // Initialize ground
    const ground = this.physics.add.staticSprite(512, 550, 'ground'); // Ground object
    ground.setScale(2); // Scale ground to fill width of the game
    ground.refreshBody(); // Refresh the physics body for scaling

    // Initialize character sprite with physics
    
    this.character = this.physics.add.sprite(100, 300, 'characterWalkRight').setOrigin(0.5, 0.5);
    this.character.setScale(1.5);
    this.character.setCollideWorldBounds(true);
    this.character.setBounce(0.2);

    // Enable collision between character and ground
    this.physics.add.collider(this.character, ground);

    // Initialize jumping state
    this.isJumping = false;

    // Running 
    this.anims.create({
        key: 'characterRunRight',
        frames:this.anims.generateFrameNumbers('characterRunRight', { start: 0, end: 8 }),
        frameRate:7,  
        repeat: -1


    })

    this.anims.create({
        key: 'characterRunLeft',
        frames: this.anims.generateFrameNumbers('characterRunLeft', { start: 0, end: 8 }),
        frameRate:7,
        repeat: -1

    })


    this.anims.create({
        key: 'characterWalkRight',
        frames: this.anims.generateFrameNumbers('characterWalkRight', { start: 0, end: 10 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'characterWalkLeft',
        frames: this.anims.generateFrameNumbers('characterWalkLeft', { start: 0, end: 10 }),
        frameRate: 7,
        repeat: -1
    });
  
    this.anims.create({
        key: 'characterJumpRight',
        frames: [
            { key: 'characterJumpRight', frame: 0 }, // Push-off
            { key: 'characterJumpRight', frame: 1 }, 
            { key: 'characterJumpRight', frame: 2 }, // In-air (slow)
            { key: 'characterJumpRight', frame: 2 }, 
            { key: 'characterJumpRight', frame: 2 }, 
            { key: 'characterJumpRight', frame: 3 }, 
            { key: 'characterJumpRight', frame: 4 }, 
            { key: 'characterJumpRight', frame: 5 },
            { key: 'characterJumpRight', frame: 6 }, // Landing
        ],
        frameRate: 10   ,
        repeat: 0
    });
      
    this.anims.create({
        key: 'characterJumpLeft',
        frames: [
            { key: 'characterJumpLeft', frame: 0 }, // Push-off
            { key: 'characterJumpLeft', frame: 1 }, 
            { key: 'characterJumpLeft', frame: 2 }, 
            { key: 'characterJumpLeft', frame: 2 }, 
            { key: 'characterJumpLeft', frame: 2 }, 
            { key: 'characterJumpLeft', frame: 3 }, 
            { key: 'characterJumpLeft', frame: 4 }, 
            { key: 'characterJumpLeft', frame: 5 },
            { key: 'characterJumpLeft', frame: 6 }, // Landing
        ],
        frameRate: 10   ,
        repeat: 0
    });
      

    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
}

function update() {
    const speed = 160;
    const jumpVelocity = -200;
    const runSpeed = speed + 300; 
    let facingDirection = 2; // facing right 2, facing left 1
    
    
    this.character.setVelocityX(0);
 
    if (this.character.body.touching.down && !this.spaceBar.isDown) {
        if (this.cursors.right.isDown) {
            this.character.setVelocityX(this.shift.isDown ? runSpeed : speed) ;
            this.character.anims.play(this.shift.isDown ? 'characterRunRight' : 'characterWalkRight', true); // Play appropriate animation
            facingDirection = 2;
        } else if (this.cursors.left.isDown) {
            this.character.setVelocityX(this.shift.isDown ? -runSpeed : -speed ) ;
            this.character.anims.play(this.shift.isDown ? 'characterRunLeft' : 'characterWalkLeft', true); // Play appropriate animation

            facingDirection = 1;
        } else {
       
            this.character.anims.stop();
        }
    }


// Jump handling
if (this.spaceBar.isDown && this.character.body.touching.down) {
    this.character.setVelocityY(jumpVelocity); 
    this.isJumping = true; 

    if (this.cursors.left.isDown) {
        this.character.setVelocityX(-speed); 
        facingDirection = 1;
        this.character.anims.play('characterJumpLeft', true); 
    } else if (this.cursors.right.isDown) {
        this.character.setVelocityX(speed); 
        facingDirection = 2; 
        this.character.anims.play('characterJumpRight', true); 
    } else {

        this.character.anims.play(facingDirection === 1 ? 'characterJumpLeft' : 'characterJumpRight', true);
    }
} else if (!this.character.body.touching.down) {
    // If already jumping and not touching down
    if (this.cursors.left.isDown) {
        this.character.setVelocityX(-speed); 
        facingDirection = 1; 
        this.character.anims.play('characterJumpLeft', true);
    } else if (this.cursors.right.isDown) {
        this.character.setVelocityX(speed); 
        facingDirection = 2; 
        this.character.anims.play('characterJumpRight', true);
    } else {
        this.character.anims.play(facingDirection === 1 ? 'characterJumpLeft' : 'characterJumpRight', true);
    }
}

    this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

 if (this.cursors.shift.isDown && this.character.body.touching.down){ 
    console.log('dude');
    

    if(this.cursors.left.isDown){
        
        this.character.setVelocityX(-(speed +100)); 

    }
    else if (this.cursors.right.isDown)
    {
        this.character.setVelocityX((speed +100)); 


    }

 }




    if (this.character.body.touching.down) {
        this.isJumping = false;
    }
    
    
}
