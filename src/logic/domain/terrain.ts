import { Position } from './position';

export class Terrain {
  static width = 10;
  static height = 10;

  static inside(position: Position): boolean {
    if (position.x < 0) return false;
    if (position.z < 0) return false;
    if (position.x > Terrain.width - 1) return false;
    if (position.z > Terrain.height - 1) return false;

    return true;
  }
}
