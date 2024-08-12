import { Chaser } from "@/dojo/models/chaser";
import { Game } from "@/dojo/models/game";

class GameManager {
  static instance: GameManager;
  public game: Game | null = null;
  public chaser: Chaser | null = null;
  public chasers: Chaser[] = [];
  public create: () => void = () => {};
  public join: (gameId: number) => void = (gameId) => {};
  public move: (direction: number) => void = (direction) => {};

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

  setChaser(chaser: Chaser | null) {
    if (!chaser) return;
    this.chaser = chaser;
  }

  setChasers(chasers: Chaser[]) {
    this.chasers = chasers;
  }

  setCreate(action: () => void) {
    GameManager.instance.create = action;
  }

  setJoin(action: (gameId: number) => void) {
    GameManager.instance.join = action;
  }

  setMove(action: (direction: number) => void) {
    GameManager.instance.move = action;
  }

  callCreate() {
    if (!GameManager.instance.create) return;
    GameManager.instance.create();
  }

  callJoin(gameId: number) {
    if (!GameManager.instance.join) return;
    GameManager.instance.join(gameId);
  }

  callMove(direction: number) {
    if (!GameManager.instance.move) return;
    GameManager.instance.move(direction);
  }

  callMoveUp() {
    GameManager.instance.callMove(1);
  }

  callMoveDown() {
    GameManager.instance.callMove(2);
  }

  callMoveLeft() {
    GameManager.instance.callMove(3);
  }

  callMoveRight() {
    GameManager.instance.callMove(4);
  }
}

export default GameManager;
