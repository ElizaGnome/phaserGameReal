// preload.js
export function preload() {
    console.log("Loading assets...");
    this.load.image('scenary', 'assets/base_background.png', {frameWidth:1686, frameHeight:105});
    this.load.image('background', 'assets/base.png');
    this.load.spritesheet('characterWalkRight', 'assets/walk_sprite_sheet.png', { frameWidth: 65, frameHeight: 66 });
    this.load.spritesheet('characterWalkLeft', 'assets/left_walk_sprite_sheet.png', { frameWidth: 65, frameHeight: 66 });
    this.load.spritesheet('characterJumpRight', 'assets/jump_sprite_sheet.png', { frameWidth: 64, frameHeight: 70 });
    this.load.spritesheet('characterJumpLeft', 'assets/left_jump_sprite_sheet.png', { frameWidth: 64, frameHeight: 70 });
    this.load.spritesheet('characterRunLeft', 'assets/left_run_sprite_sheet.png', { frameWidth: 70, frameHeight: 70 });
    this.load.spritesheet('characterRunRight', 'assets/run_sprite_sheet.png', { frameWidth: 70, frameHeight: 70 });
    this.load.image('egg', 'assets/place_holder.png');
    this.load.image("ground",'assets/ground.png');
    this.load.image('enemy', 'assets/placeholder_enemy.png',{frameWidth:104, frameHeight: 192});
    this.load.image('steam', 'assets/steam.png');
    this.load.image('rack', 'assets/staticPlatforms.png');
    this.load.image('platform', 'assets/lugagePlatform.png');
    this.load.image('inv', 'assets/inv.png');
   
    
}

export function preloadMain(){
    this.load.audio('mainMusic', 'assets/main_music.mp3');

};