import Character from "../components/character";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  map: Phaser.Tilemaps.Tilemap | null = null;
  player: Character | null = null;
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

    // Camera
    this.cameras.main.scaleManager.scaleMode = Phaser.Scale.ScaleModes.RESIZE;
    this.cameras.main.setZoom(3);
    this.cameras.main.scrollX =
      -this.renderer.width / 2 + this.map.widthInPixels / 2;
    this.cameras.main.scrollY =
      -this.renderer.height / 2 + this.map.heightInPixels / 2;

    // Unit
    const size = this.map!.tileWidth;
    const character = new Character(
      this,
      (size * 3) / 4,
      (size * 3) / 4,
      size,
      {
        minX: 0,
        minY: 0,
        maxX: this.map.widthInPixels - 2 * size,
        maxY: this.map.heightInPixels - 2 * size,
      },
    );
    this.player = this.add.existing(character);
    const hitbox = this.physics.add.existing(this.player.hitbox);

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
    this.physics.add.overlap(hitbox, leave!);
    this.physics.add.overlap(hitbox, center!);
    this.physics.add.overlap(hitbox, north!);
    this.physics.add.overlap(hitbox, northeast!);
    this.physics.add.overlap(hitbox, northwest!);
    this.physics.add.overlap(hitbox, south!);
    this.physics.add.overlap(hitbox, southeast!);
    this.physics.add.overlap(hitbox, southwest!);

    // Events
    EventBus.emit("current-scene-ready", this);
  }

  update(time: number, delta: number) {
    this.player?.update();
    // Update layer's alpha according to the player position
    if (!this.player || !this.map) return;
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
    const layer = this.map!.getLayer(this.layer)?.tilemapLayer;
    layer!.alpha = 1;
    this.layer = "";
    this.leave = false;
  }
}
