// Created by Daniel Do
// Uses Quinten's Procedural Maze Generation: https://github.com/Quinten/phaser3-maze-demo/tree/master
// Phaser's major components used: tilemaps, cameras, bitmaps, animation manager, text objects

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

window.maxSize = 960;

let longestSide = Math.max(window.innerWidth, window.innerHeight);
let zoom = 2 * Math.max(1, Math.floor(longestSide / window.maxSize));

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 1125,
    height: 730,
    backgroundColor: '#8190A7',
    pixelArt: true,
    zoom: zoom,
    physics: {
        default: 'arcade',
        arcade: {}
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

window.game = new Phaser.Game(config);