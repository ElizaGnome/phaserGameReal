// collision.js
export function collectItem(character, item) {
    item.destroy();
    console.log('Item collected!');
    this.eggCounter++; 
    this.eggText.setText('Eggs: ' + this.eggCounter);
}

export function hitPlayer( character,thownItem, scene){
    console.log('Player was hit!');


    const flickerEvent = scene.time.addEvent({
        delay: 100,
        repeat: 3,
        callback: () => {
            if (character.tintTopLeft === 0xff0000) {
                character.clearTint(); // Restore normal color
            } else {
                character.setTint(0xff0000); // Set red tint again
            }
        },
        callbackScope: scene,
    });

    // Ensure the tint is cleared after flickering ends
    scene.time.delayedCall(300, () =>{ character.clearTint();},[],scene);
 

   

}

export function setupCollisions(scene) {
    const ground = scene.physics.add.staticSprite(1024, 550, 'ground');
    ground.setScale(2);
    ground.refreshBody();
    
    scene.physics.add.collider(scene.enemy, ground);
    scene.physics.add.collider(scene.character, ground);
    
    scene.physics.add.overlap(scene.character, scene.eggs, collectItem, null, scene);

    scene.physics.add.collider(scene.character, scene.luggageUnmovable, function () {
        console.log("The chicken collided with the luggage!");
    });
    

    scene.ground = ground;

}



export function setUpSteam(scene){

    
     const platform = scene.physics.add.sprite(1100,500, 'platform').setScale(1.5);
    platform.setImmovable(true);
    platform.body.setAllowGravity(false);

 


    let emitter = scene.add.particles(scene.steamVent.x, scene.steamVent.y, 'steam',{
        x:scene.steamVent.x,
        y:scene.steamVent.y,
        speed:{min: 60, max: 100},
        angle:{min: 260, max: 280},
        gravityY:0,
        lifespan: 500,
        quantity: 3,
        scale: {start:0.2, end:0},
        frequency: -1


    });
    
    scene.physics.add.collider(platform, scene.ground);
    scene.physics.add.collider(scene.character, platform);
    scene.platform = platform;


activateSteam(scene);
}

export function activateSteam(scene) {
    console.log('Activating steam cycle');
    scene.time.delayedCall(1000, () => {
        console.log('Steam vent active');
        scene.steamVent.setAlpha(1); // Activate steam vent
        scene.steamVentActive = true; // Enable upward movement
        scene.platformMovingUp = true;
    });

    scene.time.delayedCall(4000, () => {
        console.log('Steam vent deactivating');
        scene.steamVent.setAlpha(0); // Deactivate steam vent
        scene.steamVentActive = false; // Allow falling
    });
}



