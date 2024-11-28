// animations.js
export function setupAnimations(scene) {
    scene.anims.create({
        key: 'characterRunRight',
        frames: scene.anims.generateFrameNumbers('characterRunRight', { start: 0, end: 8 }),
        frameRate: 7,
        repeat: -1
    });

    scene.anims.create({
        key: 'characterRunLeft',
        frames: scene.anims.generateFrameNumbers('characterRunLeft', { start: 0, end: 8 }),
        frameRate: 7,
        repeat: -1
    });

    scene.anims.create({
        key: 'characterWalkRight',
        frames: scene.anims.generateFrameNumbers('characterWalkRight', { start: 0, end: 10 }),
        frameRate: 7,
        repeat: -1
    });

    scene.anims.create({
        key: 'characterWalkLeft',
        frames: scene.anims.generateFrameNumbers('characterWalkLeft', { start: 0, end: 10 }),
        frameRate: 7,
        repeat: -1
    });

    scene.anims.create({
        key: 'characterJumpRight',
        frames: [
            { key: 'characterJumpRight', frame: 0 },
            { key: 'characterJumpRight', frame: 1 },
            { key: 'characterJumpRight', frame: 2 },
            { key: 'characterJumpRight', frame: 2 },
            { key: 'characterJumpRight', frame: 2 },
            { key: 'characterJumpRight', frame: 3 },
            { key: 'characterJumpRight', frame: 4 },
            { key: 'characterJumpRight', frame: 5 },
            { key: 'characterJumpRight', frame: 6 }
        ],
        frameRate: 10,
        repeat: 0
    });

    scene.anims.create({
        key: 'characterJumpLeft',
        frames: [
            { key: 'characterJumpLeft', frame: 0 },
            { key: 'characterJumpLeft', frame: 1 },
            { key: 'characterJumpLeft', frame: 2 },
            { key: 'characterJumpLeft', frame: 2 },
            { key: 'characterJumpLeft', frame: 2 },
            { key: 'characterJumpLeft', frame: 3 },
            { key: 'characterJumpLeft', frame: 4 },
            { key: 'characterJumpLeft', frame: 5 },
            { key: 'characterJumpLeft', frame: 6 }
        ],
        frameRate: 10,
        repeat: 0
    });
}
