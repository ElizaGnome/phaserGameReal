



export function initalizeEnemy(enemy, config) {
    enemy.setCollideWorldBounds(true);
    enemy.body.setAllowGravity(false);
    enemy.patrolArea = config.patrolArea || { start: 0, end: 0 };
    enemy.speed = config.speed || 50;
    enemy.direction = 1; 
    enemy.faceDirection = config.faceDirection;

    // Proximity detection
    enemy.throwCooldown = false;
    enemy.playerInAreaTimer = 0;
    enemy.throwDelay = config.throwDelay || 12000;//milsecs as we are using delta
    enemy.proximityRadius = config.proximityRadius || 100;
}

function throwItem(enemy,scene){

    
   

    if (scene.character.x < enemy.patrolArea.end && enemy.faceDirection ===0
         || scene.character.x > enemy.patrolArea.start && enemy.faceDirection ===1 ) {

        
        enemy.throwCooldown = true; 
        


        //change this to the real item later -currently placeholder
        const items = scene.throw.create(enemy.x, enemy.y, 'egg');
        items.body.allowGravity = false;

        scene.physics.moveTo(items, scene.character.x, scene.character.y, 200);

        //delay destroy, but you want it to destroy
    
        scene.time.delayedCall(3000, ()=> items.destroy());
        scene.time.delayedCall(2000, ()=> (enemy.throwCooldown = false));
    }
}

export function enemyPatrol(scene,delta){
    //left = 0
    //if the enemy is located within the radius of start
   
    if (scene.enemy.x <= scene.enemy.patrolArea.start){
        scene.direction =1;
        scene.enemy.faceDirection = 1;


    }
    else if (scene.enemy.x > scene.enemy.patrolArea.end){
        scene.direction =-1;
        scene.enemy.faceDirection =0;
    }

    //we want the speed of motion to be the same
    scene.enemy.setVelocityX(scene.enemy.speed * scene.direction);

    //calculate the distance between with the inbuilt function Math.Diostance.Between

    let distance = Phaser.Math.Distance.Between(
        scene.character.x,
        scene.character.y,
        scene.enemy.x,
        scene.enemy.y);

    if (distance < scene.enemy.proximityRadius){

        scene.enemy.playerInAreaTimer += delta;

        

        if(scene.enemy.playerInAreaTimer >= scene.enemy.throwDelay
             && !scene.enemy.throwCooldown){
               
                throwItem(scene.enemy, scene);
             }


    }else {
        scene.enemy.playerInAreaTimer = 0; //lets make it reset so we can murder chickens
    }





};
