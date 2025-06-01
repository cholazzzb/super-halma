import { Listener, Store } from '@/shared-logic/store';
import { Piece } from '../domain/piece';
import { Position, PositionId } from '../domain/position';

interface State {
  pieces: Record<PositionId, Piece>;
}

class WorldStore extends Store<State> {
  constructor() {
    super({
      pieces: {},
    });
  }

  addPiece(piece: Piece, position: Position) {
    this.state = {
      ...this.state,
      pieces: { ...this.state.pieces, [position.toId()]: piece },
    };
    super.emitChange(`world: add piece: ${position}`);
  }

  removePiece(position: Position) {
    this.state = {
      ...this.state,
    };
    delete this.state.pieces[position.toId()];
    super.emitChange(`world: delete piece: ${position}`);
  }

  movePiece(initPos: Position, nextPos: Position) {
    const piece = this.state.pieces[initPos.toId()];
    this.removePiece(initPos);
    this.addPiece(piece, nextPos);
  }

  checkOwnerId(posId: PositionId) {
    return this.state.pieces[posId]?.ownerId;
  }
}

/**
 * Singleton instance
 */
export const worldStore = new WorldStore();

/**
 * Hook-compatible selector
 */
export function getWorldState() {
  return worldStore.getState();
}

/**
 * Hook-compatible subscribe function
 */
export function subscribeToWorldStore(listener: Listener) {
  return worldStore.subscribe(listener);
}
