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

    this.load.image('tiles', 'assets/tiles.png');
    for (let m = 0; m < 16; m++) {
        this.load.tilemapTiledJSON('map' + m, 'assets/map' + m + '.json');
    }
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });

  }
  create(){
    this.scene.start('MENU');
    // background music
    this.batman_robin_ost = this.sound.add("batman_robin_ost", {volume: 0.5})
    this.batman_robin_ost.loop = true
    this.batman_robin_ost.play()
  }
}

export default Load;