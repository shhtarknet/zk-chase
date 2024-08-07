import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import GameManager from "../managers/game";

export class GameOver extends Scene {
  start: Phaser.GameObjects.Container | null = null;

  constructor() {
    super("GameOver");
  }

  create() {
    this.add
      .text(this.renderer.width / 2, this.renderer.height / 2, "Game Over", {
        fontFamily: "Indie Flower",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(1);

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    if (
      !!GameManager.getInstance().game &&
      !GameManager.getInstance()?.game?.isOver()
    ) {
      this.toGame();
    }
    this.start?.update();
  }

  toGame() {
    this.scene.start("Game");
  }

  toMenu() {
    this.scene.start("Menu");
  }
}
