import { Group } from "three";

import { Position } from "@/logic/domain/position";
import { Terrain } from "@/logic/domain/terrain";
import { Tile } from "./tile";

export class World extends Group {
  public name = "world";
  public terrain: Array<Tile> = [];

  constructor(
    public width: number,
    public height: number,
  ) {
    super();

    this.createTerrain();
  }

  createTerrain() {
    for (let x = 0; x < Terrain.width; x++) {
      for (let z = 0; z < Terrain.height; z++) {
        const tile = new Tile(Position.fromArray([x, z]));
        this.add(tile);
        this.terrain.push(tile);
      }
    }
  }
}
