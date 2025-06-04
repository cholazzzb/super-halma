import { Listener, Store } from "@/shared-logic/store";
import { Star } from "@/ui/renderer/star";
import { Piece } from "../domain/piece";
import { Position, PositionId } from "../domain/position";

interface State {
  pieces: Record<PositionId, Piece>;
  stars: Record<PositionId, Star>;
}

class WorldStore extends Store<State> {
  constructor() {
    super({
      pieces: {},
      stars: {},
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

  addStar(star: Star, position: Position) {
    const posId = position.toId();
    this.setState(
      {
        ...this.state,
        stars: {
          ...this.state.stars,
          [posId]: star,
        },
      },
      `world: add star @ ${posId}`,
    );
  }

  removeStar(position: Position) {
    const posId = position.toId();
    const { [posId]: _, ...restStars } = this.state.stars;

    this.setState(
      {
        ...this.state,
        stars: restStars,
      },
      `world: remove star @ ${posId}`,
    );
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
