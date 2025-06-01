import { Position } from './position';

export enum MoveVariant {
  slide = 'slide',
  jump = 'jump',
}

export class Move {
  constructor(
    public variant: MoveVariant,
    public startPos: Position,
    public endPos: Position,
    public sequence: Array<Position>,
  ) {}
}
