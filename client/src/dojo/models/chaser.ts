import { ComponentValue } from "@dojoengine/recs";
import { MAP_WIDTH } from "../constants";

export class Chaser {
  public playerId: string;
  public gameId: number;
  public position: number;
  public alive: boolean;
  public invincible: boolean;
  public killCount: number;
  public treasuryCount: number;

  constructor(chaser: ComponentValue) {
    this.playerId = chaser.player_id;
    this.gameId = chaser.game_id;
    this.position = chaser.position;
    this.alive = chaser.alive ? true : false;
    this.invincible = chaser.invincible ? true : false;
    this.killCount = chaser.kill_count;
    this.treasuryCount = chaser.treasury_count;
  }

  getX() {
    return this.position % MAP_WIDTH;
  }

  getY() {
    return Math.floor(this.position / MAP_WIDTH);
  }
}
