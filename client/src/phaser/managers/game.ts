import { Chaser } from "@/dojo/models/chaser";
import { Game } from "@/dojo/models/game";

class GameManager {
  static instance: GameManager;
  public game: Game | null = null;
  public chaser: Chaser | null = null;
  public chasers: { [key: string]: Chaser } = {};
  public create: () => void = () => {};
  public join: (gameId: number) => void = (gameId) => {};
  public move: (direction: number) => Promise<void> = async (direction) => {};
  public processing: boolean = false;

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
    this.processing = false;
  }

  setChaser(chaser: Chaser | null) {
    if (!chaser) return;
    this.chaser = chaser;
  }

  setChasers(chasers: Chaser[]) {
    chasers.forEach((chaser) => {
      this.chasers[chaser.getKey()] = chaser;
    });
  }

  setCreate(action: () => void) {
    GameManager.instance.create = action;
  }

  setJoin(action: (gameId: number) => void) {
    GameManager.instance.join = action;
  }

  setMove(action: (direction: number) => Promise<void>) {
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
    this.processing = true;
    GameManager.instance.callMove(1);
  }

  callMoveDown() {
    this.processing = true;
    GameManager.instance.callMove(2);
  }

  callMoveLeft() {
    this.processing = true;
    GameManager.instance.callMove(3);
  }

  callMoveRight() {
    this.processing = true;
    GameManager.instance.callMove(4);
  }
}

export default GameManager;
