import { Game } from "@/dojo/game/models/game";

class GameManager {
  static instance: GameManager;
  public game: Game | null = null;

  constructor() {
    if (GameManager.instance) {
      return GameManager.instance;
    }
    GameManager.instance = this;
  }

  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  setGame(game: Game | null) {
    if (!game) return;
    this.game = game;
  }
}

export default GameManager;
