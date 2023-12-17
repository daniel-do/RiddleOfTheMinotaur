// Credit: Quinten https://github.com/Quinten/phaser3-maze-demo/tree/master

import Level from './Level.js';

let keyONE, keyTWO, keyTHREE;

class MazeLevel extends Level {

    constructor (config)
    {
        super((config) ? config : { key: 'mazelevel' });
        this.prefabShardWidth = 128; // 16 tiles of 8 pixels
        this.prefabShardHeight = 128;
        this.prefabMapWidth = 0;
        this.prefabMapHeight = 0;
    }

    preload() {
		this.load.image('dragon', './assets/dragon.png');
        this.load.image('prompt1', './assets/promptLast.png');
        this.load.image('prompt2', './assets/prompt2.png');
        this.load.image('prompt3', './assets/prompt3.png');
        this.load.image('prompt4', './assets/prompt4.png');
        this.load.image('prompt5', './assets/prompt5.png');
        this.load.image('prompt6', './assets/prompt6.png');
        this.load.image('prompt7', './assets/prompt7.png');
        this.load.image('promptLast', './assets/prompt1.png');
        this.load.audio('correctAnswer', './assets/correct_answer.mp3')
        this.load.audio('wrongAnswer', './assets/wrong_answer.mp3')
	}

    create()
    {
        super.create();

        // Add the player
        this.addPlayer({ x: this.startPosition.x, y: this.startPosition.y });

        // generate the maze 
        let maze = this.maze.generate(32, 8);
        // make the topLeft and bottomRight of the maze open so we can add exits
        this.maze.openTopLeft();
        this.maze.openBottomRight();

        // calculate total size in pixels
        this.prefabMapWidth = this.prefabShardWidth * this.maze.gridWidth;
        this.prefabMapHeight = this.prefabShardHeight * this.maze.gridHeight;
        // clip the camera and physics,
        // make the camera a little smaller
        // so the player can walk off the screen
        this.cameras.main.setBounds(16, 0, this.prefabMapWidth - 32, this.prefabMapHeight);
        this.physics.world.setBounds(0, 0, this.prefabMapWidth, this.prefabMapHeight);

        // get the merged tile data
        let tiledata = this.maze.createMapData({ key: 'map', shardW: 16, shardH: 16 });

        // create the map
        let map = this.make.tilemap({ data: tiledata, tileWidth: 8, tileHeight: 8});
        let tiles = map.addTilesetImage('tiles', 'tiles', 8, 8, 0, 0);
        let layer = map.createStaticLayer(0, tiles, 0, 0);
        map.setCollisionBetween(192, 255);
        this.physics.add.collider(this.player, layer);

        // add exit zones
        this.addExit({ scene: 'mazelevel', w: 496, startX: 4032, startY: 960, facing: 'left' });
        this.addExit({ scene: 'mazelevel', x: 4080, startX: 64, startY: 64, facing: 'right' });

        this.cameras.main.setBackgroundColor('#8190A7');

        // (see Level.js)
        this.postCreate();

        // import images
        this.dragon1 = this.add.image(192, 192, 'dragon').setScale(0.2);
        this.dragon2 = this.add.image(832, 320, 'dragon').setScale(0.2);
        this.dragon3 = this.add.image(576, 704, 'dragon').setScale(0.2);
        this.dragon4 = this.add.image(1344, 576, 'dragon').setScale(0.2);
        this.dragon5 = this.add.image(2112, 960, 'dragon').setScale(0.2);
        this.dragon6 = this.add.image(3904, 960, 'dragon').setScale(0.2);
        this.dragon7 = this.add.image(4032, 832, 'dragon').setScale(0.2);
        this.dragonLast = this.add.image(3904, 832, 'dragon').setScale(0.2);
        this.prompt1 = this.add.image(this.dragon1.x, this.dragon1.y, 'prompt1');
        this.prompt1.setVisible(false);
        this.prompt2 = this.add.image(this.dragon2.x, this.dragon2.y, 'prompt2');
        this.prompt2.setVisible(false);
        this.prompt3 = this.add.image(this.dragon3.x, this.dragon3.y, 'prompt3');
        this.prompt3.setVisible(false);
        this.prompt4 = this.add.image(this.dragon4.x, this.dragon4.y, 'prompt4');
        this.prompt4.setVisible(false);
        this.prompt5 = this.add.image(this.dragon5.x, this.dragon5.y - 100, 'prompt5');
        this.prompt5.setVisible(false);
        this.prompt6 = this.add.image(this.dragon6.x, this.dragon6.y - 100, 'prompt6');
        this.prompt6.setVisible(false);
        this.prompt7 = this.add.image(this.dragon7.x - 100, this.dragon7.y, 'prompt7');
        this.prompt7.setVisible(false);
        this.promptLast = this.add.image(this.dragonLast.x, this.dragonLast.y, 'promptLast');
        this.promptLast.setVisible(false);

        this.prompt1Activated = false;
        this.prompt2Activated = false;
        this.prompt3Activated = false;
        this.prompt4Activated = false;
        this.prompt5Activated = false;
        this.prompt6Activated = false;
        this.prompt7Activated = false;
        this.promptLastActivated = false;

        // define keys
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        keyTHREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

        // Import sounds
        this.correctAnswer = this.sound.add('correctAnswer', {volume: 0.25});
        this.wrongAnswer = this.sound.add('wrongAnswer', {volume: 3});

    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
        this.checkExits();

        // move dragons up and down
        this.dragon1.y = 192 + (Math.sin(this.game.loop.frame * 0.04) * 10);
        this.dragon2.y = 320 + (Math.sin(this.game.loop.frame * 0.04) * 10);
        this.dragon3.y = 704 + (Math.sin(this.game.loop.frame * 0.04) * 10);
        this.dragon4.y = 576 + (Math.sin(this.game.loop.frame * 0.04) * 10);
        this.dragon5.y = 960 + (Math.sin(this.game.loop.frame * 0.04) * 10);
        this.dragon6.y = 960 + (Math.sin(this.game.loop.frame * 0.04) * 10);
        this.dragon7.y = 832 + (Math.sin(this.game.loop.frame * 0.04) * 10);
        this.dragonLast.y = 832 + (Math.sin(this.game.loop.frame * 0.04) * 10);

        // best university
        if (this.prompt1Activated == false) {
            // if player is near the dragon
            if (this.player.x >= (this.dragon1.x - 30) && this.player.x <= (this.dragon1.x + 30) && this.player.y >= (this.dragon1.y - 30) && this.player.y <= (this.dragon1.y + 30)) {
                this.prompt1.setVisible(true);
                this.dragon1.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) {
                    this.prompt1.setVisible(false);
                    this.prompt1Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
                    this.prompt1.setVisible(false);
                    this.prompt1Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) { // correct answer
                    this.prompt1.setVisible(false);
                    this.prompt1Activated = true;
                    this.correctAnswer.play();
                }
            }
        }

        // batman's sidekick
        if (this.prompt2Activated == false) {
            if (this.player.x >= (this.dragon2.x - 30) && this.player.x <= (this.dragon2.x + 30) && this.player.y >= (this.dragon2.y - 30) && this.player.y <= (this.dragon2.y + 30)) {
                this.prompt2.setVisible(true);
                this.dragon2.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) { // correct answer
                    this.prompt2.setVisible(false);
                    this.prompt2Activated = true;
                    this.correctAnswer.play();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
                    this.prompt2.setVisible(false);
                    this.prompt2Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) {
                    this.prompt2.setVisible(false);
                    this.prompt2Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                }
            }
        }

        // not dog breed
        if (this.prompt3Activated == false) {
            if (this.player.x >= (this.dragon3.x - 30) && this.player.x <= (this.dragon3.x + 30) && this.player.y >= (this.dragon3.y - 30) && this.player.y <= (this.dragon3.y + 30)) {
                this.prompt3.setVisible(true);
                this.dragon3.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) {
                    this.prompt3.setVisible(false);
                    this.prompt3Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
                    this.prompt3.setVisible(false);
                    this.prompt3Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) { // correct answer
                    this.prompt3.setVisible(false);
                    this.prompt3Activated = true;
                    this.correctAnswer.play();
                }
            }
        }

        // primary color
        if (this.prompt4Activated == false) {
            if (this.player.x >= (this.dragon4.x - 30) && this.player.x <= (this.dragon4.x + 30) && this.player.y >= (this.dragon4.y - 30) && this.player.y <= (this.dragon4.y + 30)) {
                this.prompt4.setVisible(true);
                this.dragon4.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) {
                    this.prompt4.setVisible(false);
                    this.prompt4Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) { // correct answer
                    this.prompt4.setVisible(false);
                    this.prompt4Activated = true;
                    this.correctAnswer.play();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) {
                    this.prompt4.setVisible(false);
                    this.prompt4Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                }
            }
        }

        // disney park
        if (this.prompt5Activated == false) {
            if (this.player.x >= (this.dragon5.x - 30) && this.player.x <= (this.dragon5.x + 30) && this.player.y >= (this.dragon5.y - 30) && this.player.y <= (this.dragon5.y + 30)) {
                this.prompt5.setVisible(true);
                this.dragon5.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) {
                    this.prompt5.setVisible(false);
                    this.prompt5Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) { // correct answer
                    this.prompt5.setVisible(false);
                    this.prompt5Activated = true;
                    this.correctAnswer.play();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) {
                    this.prompt5.setVisible(false);
                    this.prompt5Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                }
            }
        }

        // batman year created
        if (this.prompt6Activated == false) {
            if (this.player.x >= (this.dragon6.x - 30) && this.player.x <= (this.dragon6.x + 30) && this.player.y >= (this.dragon6.y - 30) && this.player.y <= (this.dragon6.y + 30)) {
                this.prompt6.setVisible(true);
                this.dragon6.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) { // correct answer
                    this.prompt6.setVisible(false);
                    this.prompt6Activated = true;
                    this.correctAnswer.play();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
                    this.prompt6.setVisible(false);
                    this.prompt6Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) {
                    this.prompt6.setVisible(false);
                    this.prompt6Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                }
            }
        }

        // batman favorite color
        if (this.prompt7Activated == false) {
            if (this.player.x >= (this.dragon7.x - 30) && this.player.x <= (this.dragon7.x + 30) && this.player.y >= (this.dragon7.y - 30) && this.player.y <= (this.dragon7.y + 30)) {
                this.prompt7.setVisible(true);
                this.dragon7.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) {
                    this.prompt7.setVisible(false);
                    this.prompt7Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) {
                    this.prompt7.setVisible(false);
                    this.prompt7Activated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) { // correct answer
                    this.prompt7.setVisible(false);
                    this.prompt7Activated = true;
                    this.correctAnswer.play();
                }
            }
        }

        // shortest distance nome alaska
        if (this.promptLastActivated == false) {
            if (this.player.x >= (this.dragonLast.x - 30) && this.player.x <= (this.dragonLast.x + 30) && this.player.y >= (this.dragonLast.y - 30) && this.player.y <= (this.dragonLast.y + 30)) {
                this.promptLast.setVisible(true);
                this.dragonLast.destroy();

                if (Phaser.Input.Keyboard.JustDown(keyONE)) {
                    this.promptLast.setVisible(false);
                    this.promptLastActivated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                } else if (Phaser.Input.Keyboard.JustDown(keyTWO)) { // correct answer
                    this.promptLast.setVisible(false);
                    this.promptLastActivated = true;
                    this.correctAnswer.play();
                } else if (Phaser.Input.Keyboard.JustDown(keyTHREE)) {
                    this.promptLast.setVisible(false);
                    this.promptLastActivated = true;
                    this.wrongAnswer.play();
                    this.scene.restart();
                }
            }
        }
    }
}

export default MazeLevel;
