
//this is the initial dialogue sequence 


export function healthStats(scene){

        scene.healthBarBack = scene.add.graphics();
        scene.healthBarBack.fillStyle(0x000000, 0.5);
        scene.healthBarBack.fillRect(20, 20, 200, 25);
        scene.healthBarBack.setScrollFactor(0);

   
        scene.healthBar = scene.add.graphics();
        scene.healthBar.fillStyle(0x00ff00, 1); 
        scene.healthBar.fillRect(20, 20, 200, 25);
        scene.healthBar.setScrollFactor(0);

};


export function setInventory () {
return{
    collectables: {
        eggs: {
            brown: 0,
            white: 0,
            golden: 0,
            saphire:0,
        },
        posters: {
            chickenRecipe: 0,
            chickenMeme: 0
        },
        keys: {
            iron: 0,
            golden: 0
        }
    },
    // Equippable items (Valve, hats, etc.)
    equippable: {
        valve: false,
        hats: [] // Multiple hats can be equipped
    }
};
}


