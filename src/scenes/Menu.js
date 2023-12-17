let keyUP, keyDOWN, keyENTER;

class Menu extends Phaser.Scene {
	constructor() {
		super('MENU')
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
				name: "play",
				key: "boot",
				size: 80
			},
			{
				name: "controls",
				key: "CONTROLS",
				size: 80
			},
			{
				name: "credits",
				key: "CREDITS",
				size: 80
			},
		];
	}
	create() {
		// Import sounds
        this.scroll = this.sound.add('minecraft_menu_click')
        this.select = this.sound.add('select')

		let bg = this.add.image(0, 0, 'background');
		bg.setOrigin(0);
		this.title_image = this.add.image(this.game.config.width / 2, 0, 'title_image');
		this.canSelect = true;
		this.cursor = this.add.image(0, 100, 'cursor').setOrigin(0, 0);
		this.choices.forEach((choice, index) => {
			choice.text = this.add.bitmapText(this.game.config.width / 4 + 250, 580 + (80 * index), 'pixel_font', choice.name, choice.size).setCenterAlign();
			choice.text.setOrigin(1);

		});
		this.add.bitmapText(this.game.config.width / 2 + 10, 486, 'pixel_font', "YOUR GOAL:", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2 + 10, 522, 'pixel_font', "answer riddles throughout the maze", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2 + 10, 558, 'pixel_font', "by encountering monsters that are", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2 + 10, 594, 'pixel_font', "blocking your path to get to the exit", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2 + 10, 666, 'pixel_font', "arrow keys to move selection", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2 + 10, 702, 'pixel_font', "ENTER to select", 36).setCenterAlign();

		// define keys
		keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
		keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
		keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}
	update() {
		this.title_image.y = 240 + (Math.sin(this.game.loop.frame * 0.04) * 20);
		this.cursor.x = ((this.game.config.width / 2) + 100 + Math.sin(this.game.loop.frame * 0.1) * 10) - (this.choices[this.selection].text.width/2) - 380;
		this.cursor.y = 494 + (this.selection * 80);

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

export default Menu;