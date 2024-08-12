import { ComponentValue } from "@dojoengine/recs";

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
}
