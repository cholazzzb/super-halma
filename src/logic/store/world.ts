import { Listener, Store } from "@/shared-logic/store";
import { Piece } from "../domain/piece";
import { Position, PositionId } from "../domain/position";

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
    const posId = position.toId();
    this.setState(
      {
        ...this.state,
        pieces: {
          ...this.state.pieces,
          [posId]: piece,
        },
      },
      `world: add piece @ ${posId}`,
    );
  }

  removePiece(position: Position) {
    const posId = position.toId();
    const { [posId]: _, ...restPieces } = this.state.pieces;

    this.setState(
      {
        ...this.state,
        pieces: restPieces,
      },
      `world: remove piece @ ${posId}`,
    );
  }

  movePiece(from: Position, to: Position) {
    const piece = this.state.pieces[from.toId()];
    if (!piece) return;

    this.removePiece(from);
    this.addPiece(piece, to);
  }

  checkOwnerId(posId: PositionId): string | undefined {
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
