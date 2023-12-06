let config = {
  type: Phaser.AUTO,
  width: 160,
  height: 160,
  pixelArt: true,
  scene: [ Load, Menu, Controls, Credits, Game ],
};

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keyR, keyENTER
let keyUPisDown = false
let keyDOWNisDown = false
let keyLEFTisDown = false
let keyRIGHTisDown = false