// Credit: Quinten https://github.com/Quinten/phaser3-maze-demo/tree/master

import Player from '../sprites/Player.js';

let keyONE, keyTWO, keyTHREE;

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.gamepaused = undefined;

        this.player = undefined;
        this.exits = undefined;
    }

    preload() {
		this.load.image('riddle', './assets/riddle.png');
	}

    create()
    {
        this.cameras.main.setRoundPixels(true);
        // start controls
        this.controls.start();

        this.exits = [];
        this.cameras.main.setBackgroundColor('#00FF00');

    }

    postCreate()
    {
        this.gamepaused = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gamepaused');
        this.gamepaused.visible = false;
        this.gamepaused.setScrollFactor(0);
        this.gamepaused.setDepth(3);

        this.resizeField(this.sys.game.config.width, this.sys.game.config.height);
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
                // Resize game configs
                this.sys.game.renderer.resize(1125, 730, 1.0);
                this.sys.game.config.width = 1125;
                this.sys.game.config.height = 1125;
                this.sys.canvas.style.width = 1125 + 'px';
                this.sys.canvas.style.height = 730 + 'px';
                this.scene.start("LOAD");
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
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.start(scene);
        }, this);
        fadeColor = { r: 5, g: 4, b: 4 };
        this.cameras.main.fadeOut(3000, fadeColor.r, fadeColor.g, fadeColor.b);
    }

    resizeField(w, h)
    {
        this.gamepaused.x = w / 2;
        this.gamepaused.y = h / 2;
        if (this.centerMap) {
            this.cameras.main.setBounds((this.centerMap.widthInPixels - w) / 2, (this.centerMap.heightInPixels - h) / 2, w, h);
        }
    }

    onGamePause()
    {
        this.gamepaused.visible = true;
    }

    onGameResume()
    {
        this.gamepaused.visible = false;
    }
}

export default Level;
