// checks if a tile index exists in the list supplied
const tileIndexIn = (tile, indexes) => {
  if (tile.index < 0) {
    return false
  }

  const firstgid = _.get(tile, 'tileset[0].firstgid')
  return (
    _.includes(indexes, tile.index - firstgid)
  )
}

class Game extends Phaser.Scene {
  constructor() {
    super('INGAME')

    this.player = new Player(this)
    this.exit = new Exit(this)

    this.currentLevel = 0
  }

  preload() {
    this.load.image('tileset', './assets/tileset.png')
    _.each(levels, level => {
      this.load.tilemapTiledJSON(level);
    })

    this.player.preload.call(this.player)
    this.exit.preload.call(this.exit)
  }

  loadLevel() {
    const level = levels[this.currentLevel]

    if (this.map) {
      this.map.destroy()
    }

    this.map = this.make.tilemap({ key: level.key })
    const { map } = this

    var tiles = map.addTilesetImage('tileset');

    map.createStaticLayer('background', tiles, 0, 0);
    map.createStaticLayer('level', tiles, 0, 0);
    map.createDynamicLayer('trails', tiles, 0, 0);
    const itemLayer = map.createDynamicLayer('items', tiles, 0, 0);
    const playerLayer = map.createDynamicLayer('player', tiles, 0, 0);

    // get switches
    map.setLayer(itemLayer)
    this.switches = map.filterTiles(
      tile => tileIndexIn(tile, [31])
    )
    const exitTile = map.findTile(
      tile => _.get(tile, 'properties.exit')
    )

    this.switchesFound = 0

    this.exit.initialize(exitTile.x, exitTile.y)


    map.setLayer(playerLayer)
    var playerTile = map.findTile(
      tile => tileIndexIn(tile, [22])
    )
    map.removeTileAt(playerTile.x, playerTile.y)
    this.player.initialize(playerTile.x, playerTile.y)

    if (this.canExit()) {
      this.exit.activate()
    }
  }

  create() {
    // Import sounds
    this.openExit = this.sound.add('minecraft_open_door')
    this.buttonPress = this.sound.add('minecraft_menu_click')

    const { player, exit } = this
    player.create.call(player)
    exit.create.call(exit)

    player.emitter.on('move', this.handlePlayerMove, this)

    // define keys
    keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

    this.loadLevel()
  }

  canExit() {
    return this.switches.length <= this.switchesFound
  }

  handlePlayerMove(x, y, deltaX, deltaY, lastMove) {
    const { map, player } = this

    // put a trail where we used to be
    const trailIndex = trail(deltaX, deltaY, lastMove)
    map.putTileAt(trailIndex, x - deltaX, y - deltaY, true, 'trails')

    // draw trail attached to the player
    const underTrailIndex = trail(-deltaX, -deltaY, null)
    map.putTileAt(underTrailIndex, x, y, true, 'trails')

    // check for items in the new tile
    const itemTile = map.getTileAt(x, y, false, 'items')
    if (_.get(itemTile, 'properties.off_switch')) {
      // if there's a switch on new position, flip it on
      const SPR = {
        ON_SWITCH: 31
      }
      this.switchesFound++
      this.buttonPress.play();
      if (this.canExit()) {
        this.openExit.play();
        this.exit.activate()
      }
      map.putTileAt(SPR.ON_SWITCH, x, y, true, 'items')
    } else if (_.get(itemTile, 'properties.exit')) {
      // if we're on the exit, check win condition
      if (this.switches.length <= this.switchesFound) {
        this.currentLevel = this.currentLevel + 1
        if (this.currentLevel < levels.length) {
          this.loadLevel()
        }
        else {
          this.currentLevel = 0
          this.scene.start('MENU')
        }
      }
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyR)) {
      this.loadLevel()
    }
    if (Phaser.Input.Keyboard.JustDown(keyUP)) {
      this.player.y -= 1
      keyUPisDown = true;
    } else {
      keyUPisDown = false;
    }
    if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
      this.player.y += 1
      keyDOWNisDown = true;
    } else {
      keyDOWNisDown = false;
    }
    if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      this.player.x -= 1
      keyLEFTisDown = true;
    } else {
      keyLEFTisDown = false;
    }
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      this.player.x += 1
      keyRIGHTisDown = true;
    } else {
      keyRIGHTisDown = false;
    }

    const { player } = this
    player.update.call(player)
  }
}
