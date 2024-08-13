const ALPHA_SPEED: number = 0.01;

export default class Treasury extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;
  private animation: string = "treasury";
  private animating: boolean = false;
  private animated: boolean = false;
  private nextX: number;
  private nextY: number;
  private step: number;
  private offset: number;
  private dx: number = 4;
  private dy: number = -2;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    offset: number,
    step: number,
  ) {
    super(scene, x, y);

    // Settings
    this.nextX = x;
    this.nextY = y;
    this.offset = offset;
    this.step = step;

    // Images
    const spriteX = this.step * this.nextX + this.offset + this.dx;
    const spriteY = this.step * this.nextY + this.offset + this.dy;
    this.sprite = new Phaser.GameObjects.Sprite(
      scene,
      spriteX,
      spriteY,
      "treasury",
    ).setOrigin(0.5, 0.5);
    this.sprite.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      () => (this.animated = true),
    );

    // Add to container
    this.add(this.sprite);
  }

  update(x: number, y: number) {
    if (!this.visible) return;

    if (this.nextX !== x || this.nextY !== y) {
      this.nextX = x;
      this.nextY = y;
      this.sprite.play(this.animation);
      this.animating = true;
      return;
    }

    if (this.animating && this.animated) {
      const alpha = this.alpha - Math.min(this.alpha, ALPHA_SPEED);
      this.setAlpha(alpha);
      if (alpha === 0) {
        this.sprite.x = this.step * this.nextX + this.offset + this.dx;
        this.sprite.y = this.step * this.nextY + this.offset + this.dy;
        this.setAlpha(1);
        this.sprite.anims.previousFrame();
        this.animating = false;
        this.animated = false;
      }
    }
  }
}
