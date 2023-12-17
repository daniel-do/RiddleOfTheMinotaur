let keyUP, keyDOWN, keyENTER;

class Controls extends Phaser.Scene {
	constructor() {
		super('CONTROLS')
	}
	preload() {
		this.load.image('cursor', './assets/cursor.png');
		this.load.image('background', './assets/menu_background.png');
		this.load.image('title_image', './assets/title_image.png');
	}
	init(data) {
		this.selection = 0;
		this.choices = [
			{
				name: "controls",
				key: "CREDITS",
                size: 200
			},
            {
				name: "arrows = move",
				key: "MENU",
                size: 60
			},
            {
				name: "enter = select",
                size: 60
			},
            {
				name: "exit thru entrance = back to menu",
                size: 60
			},
			{
				name: "credits",
				key: "CREDITS",
                size: 100
			},
			{
				name: "back",
				key: "MENU",
                size: 100
			},
		];
	}
	create() {
		// Import sounds
        this.scroll = this.sound.add('minecraft_menu_click')
        this.select = this.sound.add('select')

		let bg = this.add.image(0, 0, 'background');
		bg.setOrigin(0);
		this.canSelect = true;
		this.cursor = this.add.image(0, 100, 'cursor').setOrigin(0, 0);
		this.choices.forEach((choice, index) => {
			choice.text = this.add.bitmapText(this.game.config.width / 2, 140 + (100 * (index)), 'pixel_font', choice.name, choice.size).setCenterAlign();
			choice.text.setOrigin(0.5);

		});

		// define keys
		keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
		keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
		keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}
	update() {
		this.cursor.x = ((this.game.config.width / 2) - 20 + Math.sin(this.game.loop.frame * 0.1) * 10) - (this.choices[this.selection + 4].text.width/2) - 100;
		this.cursor.y = 494 + (this.selection) * 100;

		if (Phaser.Input.Keyboard.JustDown(keyUP)) {
			if (this.selection - 1 > -1 && this.selection - 1 < this.choices.length) {
				this.selection -= 1;
				this.scroll.play();
			}
		}
		if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
			if (this.selection + 1 > -1 && this.selection + 1 < this.choices.length) {
				this.selection += 1;
				this.scroll.play();
			}
		}
		if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
			this.select.play();
			this.scene.start(this.choices[this.selection].key);
        }
	}
}

export default Controls;