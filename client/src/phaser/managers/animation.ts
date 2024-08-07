import Phaser from "phaser";

class AnimationManager {
  static instance: AnimationManager;

  constructor() {
    if (AnimationManager.instance) {
      return AnimationManager.instance;
    }
    AnimationManager.instance = this;
  }

  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  addAnimations(scene: Phaser.Scene) {
    // Animations
    scene.anims.create({
      key: `assassin-black-idle`,
      frames: scene.anims.generateFrameNumbers(`assassin-black`, {
        start: 0,
        end: 1,
      }),
      frameRate: 3,
      repeat: -1,
    });
    scene.anims.create({
      key: `assassin-black-move-down`,
      frames: scene.anims.generateFrameNumbers(`assassin-black`, {
        start: 1,
        end: 4,
      }),
      frameRate: 5,
      repeat: -1,
    });
    scene.anims.create({
      key: `assassin-black-move-right`,
      frames: scene.anims.generateFrameNumbers(`assassin-black`, {
        start: 1 + 29 * 2,
        end: 4 + 29 * 2,
      }),
      frameRate: 5,
      repeat: -1,
    });
    scene.anims.create({
      key: `assassin-black-move-up`,
      frames: scene.anims.generateFrameNumbers(`assassin-black`, {
        start: 1 + 29 * 4,
        end: 4 + 29 * 4,
      }),
      frameRate: 5,
      repeat: -1,
    });
    scene.anims.create({
      key: `assassin-black-move-left`,
      frames: scene.anims.generateFrameNumbers(`assassin-black`, {
        start: 1 + 29 * 6,
        end: 4 + 29 * 6,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }
}

export default AnimationManager;
