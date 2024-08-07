const SPEED: number = 0.5;

export default class Character extends Phaser.GameObjects.Container {
  protected character: Phaser.GameObjects.Sprite;
  private step: number;
  private targets: { x: number; y: number }[] = [];
  private animation: string = "assassin-black-idle";
  private bounds: { minX: number; minY: number; maxX: number; maxY: number };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    step: number,
    bounds: { minX: number; minY: number; maxX: number; maxY: number },
  ) {
    super(scene, x, y);

    // Parameters
    this.step = step;
    this.bounds = bounds;

    // Images
    this.character = new Phaser.GameObjects.Sprite(
      scene,
      x,
      y,
      "assassin-black",
    );
    this.character.play(this.animation);

    // Bindings
    const W = this.scene.input.keyboard!.addKey("W");
    const A = this.scene.input.keyboard!.addKey("A");
    const S = this.scene.input.keyboard!.addKey("S");
    const D = this.scene.input.keyboard!.addKey("D");

    // Listeners
    W.on("down", () => this.move("UP"));
    A.on("down", () => this.move("LEFT"));
    S.on("down", () => this.move("DOWN"));
    D.on("down", () => this.move("RIGHT"));

    // Add to container
    this.add(this.character);
  }

  update() {
    if (!this.targets.length) {
      if (this.animation !== "assassin-black-idle") {
        this.animation = "assassin-black-idle";
        this.character.play(this.animation);
      }
      return;
    }

    const target = this.targets[0];
    if (this.character.x === target.x && this.character.y === target.y) {
      this.targets.shift();
      return;
    }

    if (this.character.x < target.x) {
      this.play("RIGHT");
      this.character.x += SPEED;
    } else if (this.character.x > target.x) {
      this.play("LEFT");
      this.character.x -= SPEED;
    } else if (this.character.y < target.y) {
      this.play("DOWN");
      this.character.y += SPEED;
    } else if (this.character.y > target.y) {
      this.play("UP");
      this.character.y -= SPEED;
    }
  }

  play(direction: "UP" | "DOWN" | "LEFT" | "RIGHT") {
    switch (direction) {
      case "UP":
        if (this.animation !== "assassin-black-move-up") {
          this.animation = "assassin-black-move-up";
          this.character.play(this.animation);
        }
        break;
      case "DOWN":
        if (this.animation !== "assassin-black-move-down") {
          this.animation = "assassin-black-move-down";
          this.character.play(this.animation);
        }
        break;
      case "LEFT":
        if (this.animation !== "assassin-black-move-left") {
          this.animation = "assassin-black-move-left";
          this.character.play(this.animation);
        }
        break;
      case "RIGHT":
        if (this.animation !== "assassin-black-move-right") {
          this.animation = "assassin-black-move-right";
          this.character.play(this.animation);
        }
        break;
    }
  }

  move(direction: "UP" | "DOWN" | "LEFT" | "RIGHT") {
    const initial =
      this.targets.length === 0
        ? { x: this.character.x, y: this.character.y }
        : this.targets[this.targets.length - 1];
    switch (direction) {
      case "UP":
        const up = { x: initial.x, y: initial.y - this.step };
        if (up.y < this.bounds.minY) return;
        this.targets.push(up);
        break;
      case "DOWN":
        const down = { x: initial.x, y: initial.y + this.step };
        if (down.y > this.bounds.maxY) return;
        this.targets.push(down);
        break;
      case "LEFT":
        const left = { x: initial.x - this.step, y: initial.y };
        if (left.x < this.bounds.minX) return;
        this.targets.push(left);
        break;
      case "RIGHT":
        const right = { x: initial.x + this.step, y: initial.y };
        if (right.x > this.bounds.maxX) return;
        this.targets.push(right);
        break;
    }
  }
}
