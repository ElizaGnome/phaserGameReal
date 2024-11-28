import { activateSteam } from '../js/collision.js';

export function movingUp(scene) {
    scene.physics.add.collider(
        scene.character, // The character sprite
        scene.platform,  // The moving platform
        (sprite, platform) => collisionMovingPlatform(sprite, platform, scene), // Pass scene to collision callback
        (sprite, platform) => isCollisionFromTop(sprite, platform, scene), // Pass scene to filter callback
        scene // The scene object
    );

    // Allow gravity for t he character so it falls when off the platform
    scene.character.body.setAllowGravity(true); 

    // Handle platform moving upwards
    if (scene.steamVentActive && scene.platformMovingUp) {


        scene.platform.body.setAllowGravity(false); // Gravity off while moving up

        // Move the platform up manually
        scene.platform.y -= 2; // Move up
        scene.platform.setPosition(scene.platform.x, scene.platform.y); // Update the physics body position

        // Stop moving up once it reaches the top limit
        if (scene.platform.y <= 200) {
            scene.platform.y = 200; // Clamp to top limit
            scene.platform.setPosition(scene.platform.x, scene.platform.y); // Update the physics body position
            scene.platformMovingUp = false; // Stop upward movement
           
        }
    }

    // Handle platform falling down
    else if (!scene.steamVentActive && !scene.platformMovingUp) {
        

        scene.platform.body.setAllowGravity(false); // Control descent without gravity

        // Move the platform down manually
        scene.platform.y += 2; // Move down
        scene.platform.setPosition(scene.platform.x, scene.platform.y); // Update the physics body position

        // Stop falling once it reaches the bottom limit
        if (scene.platform.y >= 500) {
            scene.platform.y = 500; // Clamp to bottom limit
            scene.platform.setPosition(scene.platform.x, scene.platform.y); // Update the physics body position
            console.log('restart scene')
            activateSteam(scene); // Restart the cycle
        }
    }
    updateCharacterPositionOnPlatform(scene);

}

// Collision callback - Detects when the sprite is touching the platform from the top
function collisionMovingPlatform(sprite, platform, scene) {
    if (platform.body.touching.up && sprite.body.touching.down) {
        sprite.isOnPlatform = true;
        sprite.currentPlatform = platform; // Keep track of the current platform
    }
}

// Collision filter - Only allow collisions if the sprite is below the platform (falling down onto it)
function isCollisionFromTop(sprite, platform, scene) {
    return platform.body.y > sprite.body.y; // Ensure the character is below the platform to collide
}

function updateCharacterPositionOnPlatform(scene) {
    if (scene.character.isOnPlatform && scene.character.currentPlatform === scene.platform) {
        // Update the position of the character based on the platform's position
        scene.character.x = scene.platform.x;
        scene.character.y = scene.platform.y - scene.platform.height / 2 - scene.character.height / 2;

        // Ensure the character stays attached to the platform
        // Stop vertical movement if the character is moving with the platform
        if (scene.character.body.velocity.y > 0) {
            scene.character.body.velocity.y = 0; // Prevent falling through the platform
        }

        // Allow horizontal movement (left/right) on the platform
        if (scene.character.body.velocity.x !== 0) {
            scene.character.body.velocity.x = scene.character.body.velocity.x; // Keep current horizontal speed
        }
    }
}