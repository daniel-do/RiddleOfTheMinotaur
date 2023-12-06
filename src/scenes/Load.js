class Load extends Phaser.Scene {
  constructor(){
    super('LOAD')
  }
  init(){
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    let title = this.add.text(this.game.config.width/2, 20, "loading...", style);
  }
  preload(){
    this.load.bitmapFont('pixel_font', './assets/font.png', './assets/font.fnt');
    this.load.audio('batman_robin_ost', './assets/batman_robin_ost.mp3') 
    this.load.audio('minecraft_menu_click', './assets/minecraft_menu_click.mp3') 
    this.load.audio('minecraft_open_door', './assets/minecraft_open_door.mp3') 
    this.load.audio('select', './assets/select.mp3') 

  }
  create(){
    this.scene.start('MENU');
  }
}
