export default class JournalOverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JournalOverlayScene' });
    }

  
    create() {
        // Centered container
        const journalContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        journalContainer.setScrollFactor(0);
        const mainSceneData = this.scene.get('MainScene').data;

        this.inventory = mainSceneData.get('inventory');
        console.log('inventory set inside',this.inventory);


        // Background
        const background = this.add.rectangle(0, 0, 600, 400, 0x888888);
        journalContainer.add(background);

        const headerText = this.add.text(-270, -140, new Date().toLocaleDateString(), {fill:  '#000', fontsize: '20px'
        })

        journalContainer.add(headerText);

        const titleText = this.add.text(0, -180, "Hettie's Journal - DO NOT READ", { fill: '#000', fontSize: '24px' }).setOrigin(0.5, 0);
        journalContainer.add(titleText);

        const journalText = this.add.text(-270, -120, "My chicken comrades and I have been abducted. I am not sure for what reason, but I envision torture in my future. I must save my fellow beings before the evil demons with strange wings consume us.", { fill: '#000', wordWrap: { width: 270 } } ); 
        journalContainer.add(journalText);


        // Close button
        const closeButton = this.add.text(270, -180, 'X', { fill: '#000' })
            .setInteractive()
            .on('pointerdown', () => {
                this.closeJournal();
            });
        journalContainer.add(closeButton);
    

        this.updateInventoryDisplay(this.inventory,journalContainer);


        this.input.keyboard.on('keydown-I', () => {
            this.closeJournal();
        });

       

   
    }

    closeJournal() {
        this.scene.stop();
        this.scene.resume('MainScene'); 
    }

    updateInventoryDisplay(inventory, container) {
        const startX = 20; 
        const startY = -120;
        const lineHeight = 30; 
        container.add(this.add.text(startX, startY, `Brown Eggs: ${inventory.collectables.eggs.brown}`, { fill: '#fff' }));
        container.add(this.add.text(startX, startY + lineHeight, `White Eggs: ${inventory.collectables.eggs.white}`, { fill: '#fff' })); 
        container.add(this.add.text(startX, startY + 2 * lineHeight, `Golden Eggs: ${inventory.collectables.eggs.golden}`, { fill: '#fff' }));
        container.add(this.add.text(startX, startY + 4 * lineHeight, `Valve?: ${inventory.equippable.valve}`, { fill: '#fff' }));
    }
}
