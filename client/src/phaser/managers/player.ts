import { Player } from "@/dojo/models/player";

class PlayerManager {
  static instance: PlayerManager;
  public player: Player | null = null;
  public username: string = "Nafnlaust";
  public signup: (name: string) => void = (name) => {};
  public rename: (name: string) => void = (name) => {};

  constructor() {
    if (PlayerManager.instance) {
      return PlayerManager.instance;
    }
    PlayerManager.instance = this;
  }

  static getInstance() {
    if (!PlayerManager.instance) {
      PlayerManager.instance = new PlayerManager();
    }
    return PlayerManager.instance;
  }

  setPlayer(player: Player | null) {
    PlayerManager.instance.player = player;
  }

  setUsername(username: string) {
    PlayerManager.instance.username = username;
  }

  setSignup(action: (name: string) => void) {
    PlayerManager.instance.signup = action;
  }

  setRename(action: (name: string) => void) {
    PlayerManager.instance.signup = action;
  }

  callSignup() {
    if (
      !PlayerManager.instance.signup ||
      !!PlayerManager.instance.player ||
      !PlayerManager.instance.username
    )
      return;
    PlayerManager.instance.signup(PlayerManager.instance.username);
  }

  callRename() {
    if (
      !PlayerManager.instance.rename ||
      !PlayerManager.instance.player ||
      !PlayerManager.instance.username
    )
      return;
    PlayerManager.instance.rename(PlayerManager.instance.username);
  }
}

export default PlayerManager;
