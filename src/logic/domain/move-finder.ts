import { Move, MoveVariant } from './move';
import { Position, PositionId } from './position';

export type MoveDirection = [number, number];

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Direction {
  static Bottom: MoveDirection = [0, 1];
  static BottomRight: MoveDirection = [1, 1];
  static BottomLeft: MoveDirection = [-1, 1];
  static Left: MoveDirection = [-1, 0];
  static Right: MoveDirection = [1, 0];
  static Upper: MoveDirection = [0, -1];
  static UpperRight: MoveDirection = [1, -1];
  static UpperLeft: MoveDirection = [-1, -1];

  static all = [
    Direction.Bottom,
    Direction.BottomRight,
    Direction.BottomLeft,
    Direction.Left,
    Direction.Right,
    Direction.Upper,
    Direction.UpperRight,
    Direction.UpperLeft,
  ];

  static multiply(dir: MoveDirection, multipler: number): [number, number] {
    return [dir[0] * multipler, dir[1] * multipler];
  }
}

class Visited {
  constructor(public values = new Set<PositionId>()) {}
  add(value: PositionId) {
    this.values.add(value);
    return this;
  }
  copy(): Visited {
    return new Visited(this.values);
  }
}
type QueueEl = { visited: Visited; sequence: Array<PositionId> };
export class MoveFinder {
  /**
   *
   * @param map all pieces position in terrain. this draws a map filled with pieces
   */
  constructor(private map: Set<PositionId>) {}
  public getAllMoves(startPos: Position): Array<Move> {
    return [...this.findSlideMove(startPos), ...this.findJumpMove(startPos)];
  }

  private findSlideMove(startPos: Position): Array<Move> {
    return Direction.all
      .map((dir) => startPos.add(dir))
      .filter((endPosition) => endPosition !== undefined) // undefined is out of board/terrain
      .filter((ep) => !this.map.has(ep.toId())) // detect collision
      .map((ep) => new Move(MoveVariant.slide, startPos, ep, [startPos, ep]));
  }

  private findJumpMove(initPos: Position): Array<Move> {
    const moves: Array<Move> = [];
    const queue: Array<QueueEl> = [
      { visited: new Visited(), sequence: [initPos.toId()] },
    ];

    while (queue.length > 0) {
      const { visited, sequence } = queue.shift()!;
      for (const dir of Direction.all) {
        const startPosId = sequence[sequence.length - 1];
        const startPos = Position.fromId(startPosId);

        const neighborPos = startPos.add(dir);
        const validNeighbor = !!(
          neighborPos && this.map.has(neighborPos.toId())
        );

        const endPos = startPos.add(Direction.multiply(dir, 2));
        const validEndPos = !!(
          endPos &&
          !this.map.has(endPos.toId()) &&
          !visited.values.has(endPos.toId())
        );

        if (validNeighbor && validEndPos) {
          const newSequence = [...sequence, endPos.toId()];

          const newEl = {
            visited: visited.copy().add(startPosId),
            sequence: newSequence,
          };
          queue.push(newEl);

          moves.push(
            new Move(
              MoveVariant.jump,
              initPos,
              endPos,
              newSequence.map((se) => Position.fromId(se)),
            ),
          );
        }
      }
    }

    return moves;
  }
}
