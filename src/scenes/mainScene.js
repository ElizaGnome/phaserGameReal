// scenes/mainScene.js
import { preload } from '../js/preload.js';
import { setupAnimations } from '../js/animation.js';
import { setupCollisions, hitPlayer,setUpSteam } from '../js/collision.js';
import {enemyPatrol, initalizeEnemy } from '../js/enemies.js';
import { handleMovement, handleJumping, moveBackground} from '../js/movement.js';
import {movingUp} from '../js/movementForPlatforms.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        preload.call(this);
    }

    create() {
        const config = {
            width: this.sys.game.config.width,
            height: this.sys.game.config.height,
        };

       
       

        this.eggCounter =0;

       //paralax backgroud
       this.exterior =  this.add.image(0,135, 'scenary').setOrigin(0,0).setScale(2.4,2.4);
       
        const background = this.add.image(1024, 288, 'background');
        background.setOrigin(0.5, 0.5);
        background.setScale(2,2);
        this.eggText = this.add.text(16, 16, 'Eggs: 0', {
            fontSize: '30px',
            fill: '#fff',
            fontStyle: 'bold'
        });
        this.cameras.main.setBounds(0, 0, background.width * background.scaleX, background.height * background.scaleY);
        //update the bounds as the player moves for the world based on scaling
        this.physics.world.setBounds(0, 0, background.width * background.scaleX, background.height * background.scaleY);

        setupAnimations(this);

        this.character = this.physics.add.sprite(100, 300, 'characterWalkRight').setOrigin(0.5, 0.5);
        this.character.setScale(1.5);
        this.character.setCollideWorldBounds(true);
        this.character.setBounce(0.2);

        //make it so the camera follows the character
        this.cameras.main.startFollow(this.character,true,0.1,0.1);
        //area where the camera does not move

        //lugage platform 


        this.steamVent = this.physics.add.image(400, 1100, 'steam').setScale(1.5);

       
     

        //collectable 

        this.eggs = this.physics.add.staticGroup();
        this.eggs.create(200, 504, 'egg');
        this.eggs.create(400, 504, 'egg');
        this.eggs.create(600, 504, 'egg');

        //avoidable 

        this.luggageUnmovable = this.physics.add.staticGroup();
        this.luggageUnmovable.create(500, 504, 'egg');
        
        //enemy load
        this.enemy = this.physics.add.sprite(700 , 380, 'enemy').setOrigin(0.5, 0.5).setScale(1.5);
      

        
        
    
        initalizeEnemy( this.enemy,{
            faceDirection: 1,
            patrolArea: {start:700, end:1000},
            speed : 70,
            proximityRadius: 300,
            throwDelay: 200, //as its delta

        });

       
        console.log('Character Y:', this.enemy.y);
        this.physics.world.drawDebug = true;

        //throw items
        this.throw = this.physics.add.group();

        //physics with luggage 

        this.physics.add.collider(
            this.throw,
            this.luggageUnmovable,
            (thrownObject, luggage) =>{
                thrownObject.destroy();
            },
            null,
            this
        );


       

        //physics with chicken
        this.physics.add.overlap(
            this.throw,
            this.character,
            (thrownObject, character) =>{
            hitPlayer(thrownObject, character,this)},
            null,
            this
        );

       


        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.isJumping = false;
        this.facingDirection = 2;
       
        setupCollisions(this);
        setUpSteam(this);
     

   
    }

    update(time,delta) {
        //as long as you are in this scene it updates, so no need for the while loop
        moveBackground(this,2);
        enemyPatrol(this, delta);
        movingUp(this);
       

        this.facingDirection = handleMovement(this, 200, 400);
        this.facingDirection = handleJumping(this, -200, 300);
    }
}
