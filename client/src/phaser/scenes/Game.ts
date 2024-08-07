import Character from "../components/character";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  map: Phaser.Tilemaps.Tilemap | null = null;
  character: Character | null = null;
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
    this.map.createLayer("Ground", tileset!);
    this.map.createLayer("Roads", tileset!);
    this.map.createLayer("Center", tileset!);
    this.map.createLayer("North", tileset!);
    this.map.createLayer("NorthEast", tileset!);
    this.map.createLayer("NorthWest", tileset!);
    this.map.createLayer("South", tileset!);
    this.map.createLayer("SouthEast", tileset!);
    this.map.createLayer("SouthWest", tileset!);
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
    this.character = this.add.existing(character);

    // Events
    EventBus.emit("current-scene-ready", this);
  }

  update(time: number, delta: number) {
    this.character?.update();
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
}
