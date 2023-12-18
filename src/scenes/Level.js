// Credit: Quinten https://github.com/Quinten/phaser3-maze-demo/tree/master

import Player from '../sprites/Player.js';

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });

        this.player = undefined;
        this.exits = undefined;
    }

    create()
    {
        this.cameras.main.setRoundPixels(true);
        this.controls.start();

        this.exits = [];
        this.cameras.main.setBackgroundColor('#00FF00');
        this.cameras.main.flash(3000, fadeColor.r, fadeColor.g, fadeColor.b);
    }

    addPlayer({
        x = 64,
        y = 64
    } = {}) {
        this.player = new Player(this, x, y, 'player', 0, this.startPosition.facing);
        this.cameras.main.startFollow(this.player, true);
    }

    addExit({
        x = -480,
        y = 0,
        w = 512,
        h = 2048,
        startX = 64,
        startY = 64,
        facing = 'right',
        scene = false
    } = {}) {
        if (!scene) {
            return;
        }
        let exit = {
            rect: new Phaser.Geom.Rectangle(x, y, w, h),
            startX: startX,
            startY: startY,
            facing: facing,
            scene: scene
        };
        this.exits.push(exit);
    }

    checkExits()
    {
        if (!this.exits || !this.exits.length || !this.player) {
            return;
        }
        for (let exit of this.exits) {
            if (Phaser.Geom.Rectangle.ContainsPoint(exit.rect, this.player)) {
                if (this.player.x >= 4000) {
                    this.scene.start("VICTORY");
                } else {
                    this.scene.start("MENU");
                }
            }
        }
    }

    leaveThroughExit({
        startX = 0,
        startY = 0,
        facing = 'right',
        scene = false
    } = {}) {
        if (!scene) {
            return;
        }
        this.startPosition.setExit({ x: startX, y: startY, facing: facing, scene: scene });
    }
}

export default Level;
