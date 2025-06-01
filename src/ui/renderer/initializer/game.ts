import { Position, PositionId } from '@/logic/domain/position';
import { playerStore } from '@/logic/store/player';
import { worldStore } from '@/logic/store/world';
import { Piece } from '../piece';

export function renderPieces() {
  const { pieces } = worldStore.getState();
  const { players } = playerStore.getState();

  const res: Array<Piece> = [];
  for (const posId of Object.keys(pieces)) {
    const positionId = posId as PositionId;
    const position = Position.fromId(positionId);

    const ownerId = pieces[positionId].ownerId;
    const playerColor = players[ownerId].color;
    const playerHighlightColor = players[ownerId].highlightColor;

    const piece = new Piece(playerColor, playerHighlightColor, position);
    piece.userData = { pieceId: pieces[positionId].id };
    res.push(piece);
  }

  return res;
}
