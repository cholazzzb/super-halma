import { PlayerId } from './player';

let nextPieceId = 1;

export type PieceId = `piece-${number}`;
function generatePieceId(): PieceId {
  return `piece-${nextPieceId++}`;
}

export class Piece {
  private _id: PieceId;

  constructor(private _ownerId: PlayerId) {
    this._id = generatePieceId();
  }

  get id() {
    return this._id;
  }

  get ownerId() {
    return this._ownerId;
  }
}
