import { ComponentValue } from "@dojoengine/recs";
import { MAP_WIDTH } from "../constants";

export class Game {
  public id: number;
  public mapId: number;
  public treasury: number;
  public chasers: string;
  public seed: string;

  constructor(game: ComponentValue) {
    this.id = game.id;
    this.mapId = game.map_id;
    this.treasury = game.treasury;
    this.chasers = game.chasers;
    this.seed = game.seed.toString(16);
  }

  getTreasuryX() {
    return this.treasury % MAP_WIDTH;
  }

  getTreasuryY() {
    return Math.floor(this.treasury / MAP_WIDTH);
  }
}
