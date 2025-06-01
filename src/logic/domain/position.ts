import { MoveDirection } from './move-finder';
import { Terrain } from './terrain';

export type PositionId = `${number},${number}`;
export type PositionArray = [number, number];

export class Position {
  constructor(
    private _x: number,
    private _z: number,
  ) {}

  /**
   * Getter
   */

  get x() {
    return this._x;
  }

  get z() {
    return this._z;
  }

  toArray() {
    return [this._x, this._z];
  }

  toId(): PositionId {
    return `${this._x},${this._z}`;
  }

  add(b: MoveDirection): Position | undefined {
    const nextPos = new Position(this._x + b[0], this._z + b[1]);
    if (Terrain.inside(nextPos)) return nextPos;
    return undefined;
  }

  static equals(a: Position, b: Position) {
    return a.x === b.x && a.z === b.z;
  }

  static toArray(x: number, z: number) {
    return [x, z];
  }

  static toId(x: number, z: number): PositionId {
    return `${x},${z}`;
  }

  static fromArray([x, z]: PositionArray) {
    return new Position(x, z);
  }

  static fromId(xz: PositionId) {
    const [x, z] = xz.split(',').map(Number);
    return new Position(x, z);
  }
}
