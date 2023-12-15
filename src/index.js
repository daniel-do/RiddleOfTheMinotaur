import Phaser from '../lib/phaser31501.js';
import Load from './scenes/Load.js';
import Menu from './scenes/Menu.js';
import Controls from './scenes/Controls.js';
import Credits from './scenes/Credits.js';
import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import StartPosition from './plugins/StartPosition.js';
import SimplePlatformerControls from './plugins/SimplePlatformerControls.js';
import MazePlugin from './plugins/MazePlugin.js';
import MazeLevel from './scenes/MazeLevel.js';

window.fadeColor = { r: 5, g: 4, b: 4 };

// this controls how much the pixels are scaled, try changing it and have fun
window.maxSize = 960;
//window.maxSize = 640;
//window.maxSize = 320;

let longestSide = Math.max(window.innerWidth, window.innerHeight);
let zoom = 2 * Math.max(1, Math.floor(longestSide / window.maxSize));

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 885,//,
    height: 730,//window.innerHeight / zoom,
    backgroundColor: '#8190A7',
    pixelArt: true,
    zoom: zoom,
    //scale: Phaser.Scale.FIT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            //debug: true
        }
    },
    plugins: {
        scene: [
            { key: 'simplePlatformerControls', plugin: SimplePlatformerControls, mapping: 'controls' }
        ],
        global: [
            { key: 'startPosition', plugin: StartPosition, mapping: 'startPosition', start: true },
            { key: 'MazePlugin', plugin: MazePlugin, mapping: 'maze', start: true }
        ]
    },
    input: {
        gamepad: true
    },
    scene: [
        Load,
        Menu,
        Controls,
        Credits,
        Boot,
        Preloader,
        MazeLevel
    ]
};

// start game
window.game = new Phaser.Game(config);

// reserve keyboard vars
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keyR, keyENTER
let keyUPisDown = false
let keyDOWNisDown = false
let keyLEFTisDown = false
let keyRIGHTisDown = false