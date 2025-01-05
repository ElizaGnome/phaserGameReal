// scenes/mainScene.js
import { setupAnimations } from '../js/animation.js';
import { setupCollisions, hitPlayer,setUpSteam } from '../js/collision.js';
import {enemyPatrol, initalizeEnemy } from '../js/enemies.js';
import { handleMovement, handleJumping, moveBackground, interactionArea} from '../js/movement.js';
import {healthStats, setInventory} from '../ui/chickenInventoryWindow.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.sessionStartTime = Date.now();
        this.openedInventory = 0; 
        this.bufferLimit = 10;
        this.buffer = [];
    }
    init(data) { 
        this.username = data.username; 

     }

   

    create() {
        const config = {
            width: this.sys.game.config.width,
            height: this.sys.game.config.height,
        };
        this.inventory = setInventory();
        this.data.set('inventory', this.inventory);
         //lets create the x, y storage facility 
         this.data.set('positions', []);     

        

       
       
        this.health = 100;
        this.eggCounter =0;

       //paralax backgroud
       this.exterior =  this.add.image(0,135, 'scenary').setOrigin(0,0).setScale(2.4,2.4);
       
        const background = this.add.image(1024, 288, 'background');
        background.setOrigin(0.5, 0.5);
        background.setScale(2,2);
    
        this.cameras.main.setBounds(0, 0, background.width * background.scaleX, background.height * background.scaleY);
        //update the bounds as the player moves for the world based on scaling
        this.physics.world.setBounds(0, 0, background.width * background.scaleX, background.height * background.scaleY);

       

        
        
          //interactable - needs to be changed to actual lever
          this.interactiveItem = this.physics.add.staticGroup();
          const lever = this.interactiveItem.create(48, 444, 'valveArea').setScale(2.4);
          lever.firstInteraction = false;
          lever.name = 'leaver';

          this.valveLayer = this.add.image(48, 444,'valveLayer').setScale(2).setVisible(false);



        //set the graphics for the health 
        healthStats(this);
      

        
  
        
        setupAnimations(this);

        this.character = this.physics.add.sprite(100, 300, 'characterWalkRight').setOrigin(0.5, 0.5);
        this.character.setScale(1.5);
        this.character.setCollideWorldBounds(true);
        this.character.setBounce(0.2);


        //set first position
        this.addPosition( this.character.x, this.character.y);

        //make it so the camera follows the character
        this.cameras.main.startFollow(this.character,true,0.1,0.1);
        //area where the camera does not move

        //lugage platform 

        this.staticPlatforms = this.physics.add.staticGroup();
        this.staticPlatforms .create(1400, 200, 'rack');
        this.staticPlatforms .create(1600, 140, 'rack');
        this.staticPlatforms .create(900, 140, 'rack');
        this.physics.add.collider(this.character, this.staticPlatforms);




       
     

        //collectable 

        this.eggs = this.physics.add.staticGroup();
        this.eggs.create(200, 504, 'eggBrown').setName('eggs_brown');
        this.eggs.create(400, 504, 'eggBrown').setName('eggs_brown');
        this.eggs.create(1600, 118, 'eggGold').setName('eggs_golden');
        this.eggs.create(900, 118, 'eggGold').setName('eggs_golden');
        this.eggs.create(600, 504, 'eggWhite').setName('eggs_white');
        this.eggs.create(1400, 178, 'eggGreen').setName('eggs_saphire');
        this.eggs.create(600, 504, 'eggWhite').setName('eggs_white');
        this.eggs.create(1800, 504, 'eggWhite').setName('eggs_white');


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
            ( character,thrownObject,) =>{
                    hitPlayer( character,thrownObject,this); 
                    console.log('thrown item');
              
            },
            null,
            this
        );

       


        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyE = this.input.keyboard.addKey("E");
        

        this.isJumping = false;
        this.facingDirection = 2;
        setUpSteam(this);
        //this also deals with eggs and feathers
        setupCollisions(this);
        //this is meant to be for the inventory
        //this.data.set('inventory', this.inventory);
        


        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.input.keyboard.on('keydown-I', () => this.toggleInventory(), this);

       

     
       
        
   
    }

    update(time,delta) {
        if (this.gamePaused) {
            return; // Skip the rest of the update logic
        }
        //as long as you are in this scene it updates, so no need for the while loop
        moveBackground(this,2);
        enemyPatrol(this, delta);
        interactionArea(this,this.interactiveItem);
       

        this.facingDirection = handleMovement(this, 200, 400);
        this.facingDirection = handleJumping(this, -300, 340);
        console.log('COUNTER ', this.eggCounter);
        if(this.eggCounter === 8){
            this.eggs.create(900,504, 'valveDrop').setName('valve');
            this.eggCounter =0; 
        }


        // position data :
        let positionSet =  this.data.get('positions')
        let lastPosition = positionSet[positionSet.length -1];
        console.log('lastPosiition', lastPosition ,'and lets check charactyer', this.character.x, this.character.y)
        if(lastPosition[2]!= this.character.x
             || lastPosition[3] != this.character.y){
                console.log('apparently its fine');
                this.addPosition( this.character.x, this.character.y);
        }
    }

 addPosition(x, y) 
 { 
    const newPosition = [this.username, new Date(), x, y]; 
    this.buffer.push(newPosition); 

    let positionSet = this.data.get('positions'); 
    positionSet.push(newPosition); 
    this.data.set('positions', positionSet);



    if (this.buffer.length >= this.bufferLimit) 
        { this.sendToApi(); 
            this.clearBuffer(); }

    }
    toggleInventory() {

            this.openedInventory +-1;
        
            this.scene.pause(); // Pause the main game scene
            this.scene.launch('JournalOverlayScene'); // Open the overlay
        }


        //NEED TO CREATE THE TABLE. PROBABLY USERNAME - DaTETIME, X, AND Y.

       async sendToApi() { 

            //map can be applied to each element in array then use item to say when item do x
            const fetchPromises =this.buffer.map(item=>  {

                const dataSend = {
                    user_name: item[0],
                    timestamp: item[1],
                    x: item[2],
                    y: item[3]

                };
           return fetch('https://localhost:5000/user-position', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(dataSend)
            })
            .then(response => response.json()) 
            .then(data => { console.log('Success:', data); }) 
            .catch(error => { console.error('Error:', error); })
       });
        
        await Promise.all(fetchPromises);
        this.clearBuffer(); 
        
    } 

    clearBuffer(){
        this.buffer = []; 




    }
 }  
    

