// movement.js
import { showDialogue } from '../ui/chickenInventoryWindow.js';

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

//show the E for interaction around the item
export function interactionArea(scene,staticGroup){


    const listedItems = staticGroup.getChildren();
   

    for (let i = 0; i < listedItems.length; i++){

        let item = listedItems[i];

        if(Phaser.Math.Distance.Between(scene.character.x,scene.character.y, item.x, item.y) < 50)
        {
      
            item.setTint(0xff0000);
            

            scene.keyE.on('down',() => {
                console.log('Player interacted with item');
                    if (!item.firstInteraction) {
                        item.firstInteraction = true;
                        showDialogue(scene, item);
                    }

                // Add your interaction logic here

                item.clearTint();
            });



            
        

        }

    }
}


