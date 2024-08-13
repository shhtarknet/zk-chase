import Character from "../components/character";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import PlayerManager from "../managers/player";
import GameManager from "../managers/game";
import Treasury from "../components/treasury";

export class Game extends Scene {
  map: Phaser.Tilemaps.Tilemap | null = null;
  bounds: { minX: number; minY: number; maxX: number; maxY: number } = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  };
  player: Character | null = null;
  chasers: { [key: string]: Character } = {};
  treasury: Treasury | null = null;
  layer: string = "";
  leave: boolean = false;
  animatedTiles: any = undefined;

  constructor() {
    super("Game");
  }

  init() {}

  preload() {
    // Tilemap
    this.load.scenePlugin(
      "AnimatedTiles",
      "https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js",
      "animatedTiles",
      "animatedTiles",
    );
    this.load.image("tiles", "assets/tilemaps/tileset.png");
    this.load.tilemapTiledJSON("tilemap", "assets/tilemaps/tilemap.json");
  }

  create() {
    // Tilemap
    this.map = this.make.tilemap({
      key: "tilemap",
      width: this.renderer.width,
      height: this.renderer.height,
    });
    const tileset = this.map.addTilesetImage("tilemap", "tiles");
    const leave = this.map.createLayer("Leave", tileset!);
    this.map.createLayer("Ground", tileset!);
    this.map.createLayer("Roads", tileset!);
    const center = this.map.createLayer("Center", tileset!);
    const north = this.map.createLayer("North", tileset!);
    const northeast = this.map.createLayer("NorthEast", tileset!);
    const northwest = this.map.createLayer("NorthWest", tileset!);
    const south = this.map.createLayer("South", tileset!);
    const southeast = this.map.createLayer("SouthEast", tileset!);
    const southwest = this.map.createLayer("SouthWest", tileset!);
    this.animatedTiles.init(this.map);
    const size = this.map!.tileWidth;
    this.bounds = {
      minX: 0,
      minY: 0,
      maxX: this.map.widthInPixels - 2 * size,
      maxY: this.map.heightInPixels - 2 * size,
    };

    // Camera
    this.cameras.main.scaleManager.scaleMode = Phaser.Scale.ScaleModes.RESIZE;
    this.cameras.main.setZoom(3);
    this.cameras.main.scrollX =
      -this.renderer.width / 2 + this.map.widthInPixels / 2;
    this.cameras.main.scrollY =
      -this.renderer.height / 2 + this.map.heightInPixels / 2;

    // Unit
    const character = new Character(
      this,
      (size * 3) / 4,
      (size * 3) / 4,
      (size * 3) / 4,
      size,
      this.bounds,
      true,
    );
    this.player = this.add.existing(character);
    this.player.setVisible(false);
    const hitbox = this.physics.add.existing(this.player.hitbox);

    // Treasury
    const game = GameManager.getInstance().game;
    this.treasury = new Treasury(
      this,
      game?.getTreasuryX() || (3 * this.map.widthInPixels) / size / 7,
      game?.getTreasuryY() || (3 * this.map.heightInPixels) / size / 7,
      size,
      size,
    );
    this.add.existing(this.treasury);

    // Triggers
    leave!.setTileIndexCallback([130], this.handleLeave, this);
    center!.setTileIndexCallback(
      [191, 193, 194, 195, 196, 197, 217, 219, 223, 224, 245, 247, 248, 249],
      () => this.handleEnter("Center"),
      this,
    );
    north!.setTileIndexCallback(
      [202, 203, 204, 256, 257, 258],
      () => this.handleEnter("North"),
      this,
    );
    northeast!.setTileIndexCallback(
      [202, 203, 204, 206, 232, 256, 257, 258, 260],
      () => this.handleEnter("NorthEast"),
      this,
    );
    northwest!.setTileIndexCallback(
      [202, 204, 205, 229, 231, 233, 256, 258, 259],
      () => this.handleEnter("NorthWest"),
      this,
    );
    south!.setTileIndexCallback(
      [202, 203, 204, 256, 257, 258],
      () => this.handleEnter("South"),
      this,
    );
    southeast!.setTileIndexCallback(
      [202, 204, 205, 229, 231, 233, 256, 258, 259],
      () => this.handleEnter("SouthEast"),
      this,
    );
    southwest!.setTileIndexCallback(
      [202, 203, 204, 206, 232, 256, 257, 258, 260],
      () => this.handleEnter("SouthWest"),
      this,
    );
    this.setOverlaps(hitbox);

    // Depths
    this.treasury.setDepth(0);
    this.player.setDepth(1);

    // Events
    EventBus.emit("current-scene-ready", this);
  }

  setOverlaps(hitbox: Phaser.GameObjects.Rectangle) {
    const layers = this.map!.layers;
    layers.forEach((layer) => {
      this.physics.add.overlap(hitbox, layer.tilemapLayer);
    });
  }

  update() {
    // Update trasury
    const game = GameManager.getInstance().game;
    if (!!game && !!this.treasury) {
      this.treasury.update(game.getTreasuryX(), game.getTreasuryY());
    }
    // Update player chaser
    const chaser = GameManager.getInstance().chaser;
    if (!!chaser) {
      this.player?.setVisible(true);
      this.player?.update(chaser);
    }
    // Update chasers
    const chasers = GameManager.getInstance().chasers;
    Object.values(chasers).forEach((chaser) => {
      if (!this.chasers[chaser.getKey()]) {
        // Create new chaser not already registered
        const size = this.map!.tileWidth;
        const character = new Character(
          this,
          (size * 3) / 4,
          (size * 3) / 4,
          (size * 3) / 4,
          size,
          this.bounds,
          false,
        );
        this.chasers[chaser.getKey()] = this.add.existing(character);
        this.setOverlaps(character.hitbox);
      } else {
        // Update others
        this.chasers[chaser.getKey()]?.update(chaser);
      }
    });
  }

  resize(
    gameSize: { width: number; height: number },
    baseSize: number,
    displaySize: number,
    resolution: number,
  ) {}

  toGameOver() {
    this.scene.start("GameOver");
  }

  handleEnter(name: string) {
    if (this.layer === name) return;
    this.layer = name;
    console.log("Enter", this.layer);
    this.player!.hide();
    const layer = this.map!.getLayer(this.layer)?.tilemapLayer;
    layer!.alpha = 0.5;
  }

  handleLeave() {
    if (!this.layer) return;
    if (!this.leave) {
      this.leave = true;
      return;
    }
    console.log("Leave", this.layer);
    this.player!.show();
    const layer = this.map!.getLayer(this.layer)?.tilemapLayer;
    layer!.alpha = 1;
    this.layer = "";
    this.leave = false;
  }
}
