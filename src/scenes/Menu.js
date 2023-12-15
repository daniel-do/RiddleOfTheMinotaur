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
		// background music
        this.batman_robin_ost = this.sound.add("batman_robin_ost")
        this.batman_robin_ost.loop = true
        this.batman_robin_ost.play()

		// Import sounds
        this.scroll = this.sound.add('minecraft_menu_click')
        this.select = this.sound.add('select')

		let bg = this.add.image(0, 0, 'background');
		bg.setOrigin(0);
		this.title_image = this.add.image(this.game.config.width / 2, 0, 'title_image');
		this.canSelect = true;
		this.cursor = this.add.image(0, 100, 'cursor').setOrigin(0, 0);
		this.choices.forEach((choice, index) => {
			choice.text = this.add.bitmapText(this.game.config.width / 4, 540 + (80 * index), 'pixel_font', choice.name, choice.size).setCenterAlign();
			choice.text.setOrigin(0.5);

		});
		this.add.bitmapText(this.game.config.width / 2, 504, 'pixel_font', "YOUR GOAL:", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2, 540, 'pixel_font', "answer riddles throughout the", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2, 576, 'pixel_font', "maze to get to the exit", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2, 640, 'pixel_font', "arrow keys to move selection", 36).setCenterAlign();
		this.add.bitmapText(this.game.config.width / 2, 676, 'pixel_font', "ENTER to select", 36).setCenterAlign();

		// define keys
		keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
		keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
		keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	}
	update() {
		this.title_image.y = 250 + (Math.sin(this.game.loop.frame * 0.04) * 20);
		this.cursor.x = ((this.game.config.width / 2) - 20 + Math.sin(this.game.loop.frame * 0.1) * 10) - (this.choices[this.selection].text.width/2) - 320;
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