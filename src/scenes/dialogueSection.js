export default class DialogueOverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DialogueOverlayScene' });
    }

  
    create(data) {

    //pause the dialogue 
    const item = data.item;
    console.log('dialogue', item);

    console.log(item)
    
        this.dialogueBox = this.add.rectangle(1024/2, 480, 1024 -(2*50),  100, 0xFFA500);
        this.dialogueText = this.add.text(70, 480, '', { fill: '#ffffff', wordWrap: { width: 700 }, fontSize: '18px'});
       console.log('Dialogue box and text initialized');
     
    this.currentLine = 0;

    if(item.name === 'leaver'){
        this.dialogueLines = [
            "Welcome to the world of Phaser!",
            "In this adventure, you will explore many wonders.", 
            "Remember to keep an eye out for hidden treasures!",
        ];
       this.displayDialogue();
       this.input.keyboard.on('keydown-ENTER', () =>
         { this.advanceDialogue();

         });
      
    }
}

 displayDialogue(){
    { if (this.dialogueLines && this.dialogueLines[this.currentLine]) {
         this.dialogueText.setText(this.dialogueLines[this.currentLine]);
          console.log('Displaying dialogue line:', this.dialogueLines[this.currentLine]); 
        } 
    else { 
        console.log('No dialogue line to display');
        }
    }
 }
advanceDialogue(){
    this.currentLine ++;
    if(this.currentLine < this.dialogueLines.length){
        this.displayDialogue();
    }
    else{
        this.endDialogue();
    }
}

endDialogue(){
    this.showingDialogue = false;
    this.dialogueText.setText('');
    this.scene.stop();
    this.scene.resume('MainScene');
}
}