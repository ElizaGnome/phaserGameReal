

// collision.js
//this actually gets the name set too, so we can do case when 
export function collectItem(character, item, scene) {

    inventoryUpdator(item.name,scene);
    item.destroy();
    
}
//inventory cant be accessed need to determine why.
function inventoryUpdator(itemName, scene){

    console.log(itemName);
  
  
    let collectables= scene.inventory.collectables;
    let equippable= scene.inventory.equippable;

    const itemHandler = {
        eggs: (collectables) => {
            const type = itemName.toString().split('_')[1];
            scene.eggCounter++;
            if (type === 'brown') collectables.eggs.brown += 1;
            else if (type === 'white') collectables.eggs.white += 1;
            else if (type === 'golden') collectables.eggs.golden += 1;
            else if (type === 'saphire') collectables.eggs.saphire += 1;
          },
          posters: (collectables) => {
            const type = itemName.toString().split('_')[1];
            if (type === 'chickenRecipe') icollectables.posters.chickenRecipe += 1;
            else if (type === 'chickenMeme') collectables.posters.chickenMeme += 1;
          },
          
          keys: (collectables) => {
            const type = itemName.toString().split('_')[1];
            if (type === 'iron') collectables.keys.iron += 1;
            else if (type === 'golden') collectables.keys.golden += 1;
          }
    };
   
    if(itemName.toString().split('_')[0] in itemHandler){
        itemHandler[itemName.toString().split('_')[0]](collectables)
    }


    const equippableHandler = {
        valve: (equippable) => { equippable.valve = true;},
        hats: (equippable)=> {
            const type = itemName.toString().split('_')[1];
            equippable.hats += type;
        }
    };
    if(itemName.toString().split('_')[0] in equippableHandler){
        equippableHandler[itemName.toString().split('_')[0]](equippable)
    }
            



    scene.collectables = collectables;
    scene.equippable = equippable;

    let allInventory = {collectables, equippable}
    console.log(allInventory);
    scene.data.set('inventory', allInventory);


}
//this is all the data 
//counting sessions
function onPlayerEnd(scene, winVal){
    //send duration, send deaths, send egg counting
    //add the number of deaths to the db.
    //deaths +1 
    const sessionEndTime = Date.now(); 
    const sessionDuration = (sessionEndTime - scene.sessionStartTime) / 1000;
    console.log('Session duration:', sessionDuration, 'seconds');
    const win= winVal ?? 0;
    // update data by user 
    //change the url when pushed live
    //maybe we should also send the type of egg and valve?
    fetch( 'https://localhost:5000/update-user-data', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: scene.username,
                deathCount: 1,
                playCount: 1,
                eggsCollected: scene.eggCounter,
                sessionDuration: sessionDuration,
                damageTaken: scene.health,
                openedInventory: scene.openedInventory,
                inventory: scene.inventory,
                win: win
            })
        }
    )
    .then(response => response.json())
    .then(data=>
        {
            console.log('data be updateds',data);

    })
    .catch(error =>
    {
        console.error('error people', error);
    });
}



export function damageTaken(scene,damageAmount){
    
    

    scene.health -=damageAmount;
    if(scene.health <=0){
        onPlayerEnd(scene,0);

        scene.scene.start('DeathScene');

    }
    else{
        console.log('health of chicken', scene.health);
        scene.healthBar.clear();  // Clear the previous health bar
        scene.healthBar.fillStyle(0x00ff00, 1);  // Set color to green

        // Update the health bar width based on current health (0 to 200 px)
        scene.healthBar.fillRect(20, 20, scene.health * 2, 25);
        
    }
};

export function hitPlayer(character,thrownItem,  scene){
    //console.log('Character:', character); 
    //console.log('Thrown Item:', thrownItem); 
    console.log('Player was hit!');

    if (thrownItem && thrownItem.body) {
        thrownItem.destroy();
    }


    const flickerEvent = scene.time.addEvent({
        delay: 100,
        repeat: 2,
        callback: () => {
            if (character.tintTopLeft === 0xff0000) {
                character.clearTint(); // Restore normal color
            } else {
                character.setTint(0xff0000); // Set red tint again
            }
        },
        callbackScope: scene,
    });

    scene.time.delayedCall(300, () => {
        character.clearTint();
    }, [], scene);

    

   
 

    damageTaken(scene, 20);

    

}

export function setupCollisions(scene) {
    const ground = scene.physics.add.staticSprite(1024, 550, 'ground');
    ground.setScale(2);
    ground.refreshBody();
    
    scene.physics.add.collider(scene.enemy, ground);
    scene.physics.add.collider(scene.character, ground);
    
    scene.physics.add.overlap(scene.character, scene.eggs,function(character,egg){
        collectItem(character, egg, scene)},
     
      null,
       scene);

    scene.physics.add.collider(scene.character, scene.luggageUnmovable, function () {
        console.log("The chicken collided with the luggage!");
    });
    

    scene.ground = ground;

}



export function setUpSteam(scene){

    const steamGroup = scene.physics.add.group();

    const emitter = scene.add.particles(2000, 500, 'steam',{
            color: [0x000000,0xCC0000,0x505050,0x5C5C5C,0xBDBDBD,0xE4E4E4,0xF8F8F8],
            colorEase: 'quad.out',
            lifespan: 5000,
            angle: { min: -100, max: -80 },
            scale: { start: 0.70, end: 0, ease: 'sine.out' },
            speed: 700,
            advance: 2000,
            blendMode: 'NORMAL',
            alpha: { start: 0.4, end: 0.1 }, 
           
          
            

    });

    const steamZone = scene.add.zone(2000, 500, 100,400);
    
    scene.physics.add.existing(steamZone, false);
    steamZone.body.moves = false;
    scene.steamZone = steamZone;

    const steamZoneCollider= scene.physics.add.overlap(
        scene.character, 
        steamZone, 
        ()=>{
            damageTaken(scene,100);
        }, 
        null,
        scene
    );

    scene.steamZoneCollider = steamZoneCollider;
  

    const platform = scene.physics.add.image(1100,500, 'platform').setScale(1.5).setDirectControl().setImmovable();
    platform.body.allowGravity = false
    let playerIsBelow = false; 
    // Collider to ensure character can stand on the platform
     scene.physics.add.collider(scene.character, platform, (character, platform) => 
        { if (!playerIsBelow && character.body.touching.down && platform.body.touching.up) { character.setVelocityY(platform.body.velocity.y); } });
     scene.physics.add.overlap(scene.character, platform, (character, platform) => { if (character.y > platform.y && character.body.touching.down) { playerIsBelow = true; 
       platform.body.checkCollision.down = false; } else { playerIsBelow = false; 
         platform.body.checkCollision.down = true; 
        } });

    scene.tweens.chain({
        targets: platform,
        loop: -1,
        tweens:[{
            y: 200,
            duration:4000,
            ease:'Sine.InOut',
        },
     {
        y:500, 
        duration:2000,
        ease:'Sine.In',
    },
    ],
    });
    
    scene.emitter = emitter;
    scene.platform = platform;

    const door = scene.physics.add.image(2040, 520, 'door').setInteractive(); 
    door.setOrigin(0.5, 1); 
    door.body.allowGravity = false;
    door.setImmovable(true); 
    door.setDepth(10); 
    door.setVisible(false);
    door.active = false; 

    
    scene.door = door;
    

    scene.door = door;
    scene.physics.add.overlap(scene.character, door, () => { 
        console.log('doorinteraction', door.active);
        if (door.active) { 
            onPlayerEnd(scene,1);
             scene.scene.start('NextLocationScene'); 
            } 
        },
         null, 
         scene);
    
};

