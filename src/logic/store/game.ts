import { Listener, Store } from "@/shared-logic/store";
import { Player } from "../domain/player";
import { logger } from "@/shared-logic/logger";

interface GameState {
  playerSequence: Array<Player>;
  playerTurn: Player | undefined;
  turn: number;
}

class GameStore extends Store<GameState> {
  constructor() {
    const playerSequence: Array<Player> = [];

    super({
      playerSequence,
      playerTurn: undefined,
      turn: 1,
    });
  }

  addPlayer(player: Player) {
    const playerSequence = [...this.state.playerSequence, player];

    const playerTurn =
      playerSequence.length === 1 ? player : this.state.playerTurn;

    this.state = {
      ...this.state,
      playerSequence,
      playerTurn,
    };
    super.emitChange(`game: add player: ${player.id}`);
  }

  nextTurn() {
    const { playerSequence, playerTurn, turn } = this.state;

    if (playerSequence.length === 0) {
      logger.warn("Cannot advance turn: no players in the game.");
      return;
    }

    let currentPlayerIndex = -1;
    if (playerTurn) {
      currentPlayerIndex = playerSequence.findIndex(
        (pl) => pl.id === playerTurn.id,
      );

      if (currentPlayerIndex === -1) {
        logger.error(
          `Current player ${playerTurn.id} not found in sequence. Defaulting to the first player.`,
        );
      }
    }

    const nextPlayerIndex = (currentPlayerIndex + 1) % playerSequence.length;
    const nextPlayer = playerSequence[nextPlayerIndex];

    this.state = {
      ...this.state,
      playerTurn: nextPlayer,
      turn: turn + (nextPlayerIndex === 0 ? 1 : 0),
    };
    super.emitChange(
      `game: next turn: ${this.state.turn}, player: ${nextPlayer.id}`,
    );
  }
}

/**
 * Singleton instance
 */
export const gameStore = new GameStore();

/**
 * Hook-compatible selector
 */
export function getGameState(): GameState {
  return gameStore.getState();
}

/**
 * Hook-compatible subscribe function
 */
export function subscribeToGameStore(listener: Listener): () => void {
  return gameStore.subscribe(listener);
}
