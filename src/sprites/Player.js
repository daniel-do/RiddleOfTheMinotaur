// Credit: Quinten https://github.com/Quinten/phaser3-maze-demo/tree/master

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, frame, facing) {
        super(scene, x, y, key, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setDepth(1);
        this.setSize(8, 24, true);
        this.setOffset(12, 8, true);
        this.setCollideWorldBounds(true);

        this.speedMax = 120;
        this.speedChange = 10;

        this.facing = facing || 'right';
        this.idle = false;
        this.moveSpeed = 0;
        this.ani = 'idle-left';

        let anims = this.anims.animationManager;
        if (!anims.get('idle-left')) {
            anims.create({
                key: 'idle-left',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('idle-right')) {
            anims.create({
                key: 'idle-right',
                frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('run-left')) {
            anims.create({
                key: 'run-left',
                frames: anims.generateFrameNumbers('player', { start: 5, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('run-right')) {
            anims.create({
                key: 'run-right',
                frames: anims.generateFrameNumbers('player', { start: 1, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    update(controls) {

        this.body.setVelocityX(0);
        this.body.setVelocityY(0);

        if (controls.left) {
            this.moveSpeed -= this.speedChange;
            this.moveSpeed = Math.max(this.moveSpeed, -this.speedMax);
            this.body.setVelocityX(this.moveSpeed);
            this.facing = 'left';
            this.idle = false;
        } else if (controls.right) {
            this.moveSpeed += this.speedChange;
            this.moveSpeed = Math.min(this.moveSpeed, this.speedMax);
            this.body.setVelocityX(this.moveSpeed);
            this.facing = 'right';
            this.idle = false;
        } else if (controls.up) {
            this.moveSpeed -= this.speedChange;
            this.moveSpeed = Math.max(this.moveSpeed, -this.speedMax);
            this.body.setVelocityY(this.moveSpeed);
            this.idle = false;
        } else if (controls.down) {
            this.moveSpeed += this.speedChange;
            this.moveSpeed = Math.min(this.moveSpeed, this.speedMax);
            this.body.setVelocityY(this.moveSpeed);
            this.idle = false;
        } else {
            this.moveSpeed += (0 - this.moveSpeed) / 2;
            this.body.setVelocityX(this.moveSpeed);
            this.body.setVelocityY(this.moveSpeed);
            this.idle = true;
        }

        if (this.idle) {
            if (this.facing === 'left') {
                this.ani = 'idle-left';
            } else {
                this.ani = 'idle-right';
            }
        } else {
            if (this.facing === 'left') {
                this.ani = 'run-left';
            } else {
                this.ani = 'run-right';
            }
        }
        this.anims.play(this.ani, true);
    }
}

export default Player;