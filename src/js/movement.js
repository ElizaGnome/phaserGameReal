// movement.js


export function handleMovement(scene, speed, runSpeed) {
    let facingDirection = 2;

 
    scene.character.setVelocityX(0);

    if (scene.character.body.touching.down && !scene.spaceBar.isDown) {
        if (scene.cursors.right.isDown) {
            scene.character.setVelocityX(scene.shift.isDown ? runSpeed : speed);
            scene.character.anims.play(scene.shift.isDown ? 'characterRunRight' : 'characterWalkRight', true);
            facingDirection = 2;
        } else if (scene.cursors.left.isDown) {
            scene.character.setVelocityX(scene.shift.isDown ? -runSpeed : -speed);
            scene.character.anims.play(scene.shift.isDown ? 'characterRunLeft' : 'characterWalkLeft', true);
            facingDirection = 1;
        } else {
            scene.character.anims.stop();
        }
    
    
}


    return facingDirection;
}

export function handleJumping(scene, jumpVelocity, speed) {
    let facingDirection = 2;

    if (scene.spaceBar.isDown && scene.character.body.touching.down) {
        scene.character.setVelocityY(jumpVelocity);
        scene.isJumping = true;

        if (scene.cursors.left.isDown) {
            scene.character.setVelocityX(-speed);
            facingDirection = 1;
            scene.character.anims.play('characterJumpLeft', true);
        } else if (scene.cursors.right.isDown) {
            scene.character.setVelocityX(speed);
            facingDirection = 2;
            scene.character.anims.play('characterJumpRight', true);
        } else {
            scene.character.anims.play(facingDirection === 1 ? 'characterJumpLeft' : 'characterJumpRight', true);
        }
    } else if (!scene.character.body.touching.down) {
        if (scene.cursors.left.isDown) {
            scene.character.setVelocityX(-speed);
            facingDirection = 1;
            scene.character.anims.play('characterJumpLeft', true);
        } else if (scene.cursors.right.isDown) {
            scene.character.setVelocityX(speed);
            facingDirection = 2;
            scene.character.anims.play('characterJumpRight', true);
        } else {
            scene.character.anims.play(facingDirection === 1 ? 'characterJumpLeft' : 'characterJumpRight', true);
        }
    }

    return facingDirection;
}
export function moveBackground(scene,  speed) {
    //check scene has scenary/exterior has loaded
    if(scene.exterior){
        //move left as per train using x axis
        scene.exterior.x -= speed;
         
         if (scene.exterior.x < -scene.exterior.width*1.20) {
            scene.exterior.x = 0;
        }
    }
}
//check the inventory to see if user has the required item, if user has required item prompt use 
//if item used, then remove item from inventory.
//show the E for interaction around the item
export function interactionArea(scene,staticGroup){



    const listedItems = staticGroup.getChildren();
   

    for (let i = 0; i < listedItems.length; i++){

        let item = listedItems[i];

        if(Phaser.Math.Distance.Between(scene.character.x,scene.character.y, item.x, item.y) < 55)
        {
      
            item.setTint(0xff0000);
        
            if (!item.firstInteraction) {
                item.firstInteraction = true;
                scene.scene.launch('DialogueOverlayScene', { item: item }); 
                scene.scene.pause();
        
            }
            else if (scene.inventory.equippable.valve){
                const promptText = scene.add.text(item.x, item.y - 50, 'Press E to use Valve', { fill: '#fff'})
                scene.keyE.once('down',() => {
                    //use valve function should be called here
                    console.log('Player interacted with item');
                    useValve(scene, item);
                    promptText.destroy();
                    item.clearTint();
                });

             }

        }
        else{
                item.clearTint();
            }
        

    }

}
//i need an action that occurs once the useValve is initated 
function useValve(scene, item){

    scene.inventory.equippable.valve = false;
    scene.data.set('inventory', scene.inventory);
    console.log('wooo valve used');

//shut off steam / call animation
    if (scene.emitter) 
        { 
          scene.emitter.stop();
          //scene.physics.world.removeCollider(scene.steamZoneCollider);
          scene.physics.world.removeCollider(scene.steamZoneCollider)
          scene.steamZone.destroy();

          //this is the problem
          scene.door.active = true;
          scene.door.setVisible(true);
          console.log(scene.door);

         } 



}



