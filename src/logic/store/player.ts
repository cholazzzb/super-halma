import { Listener, Store } from '@/shared-logic/store';
import { Player, PlayerId } from '../domain/player';

interface PlayerState {
  players: Record<PlayerId, Player>;
}

class PlayerStore extends Store<PlayerState> {
  constructor() {
    super({
      players: {},
    });
  }

  addPlayer(pl: Player) {
    this.state = {
      ...this.state,
      players: { ...this.state.players, [pl.id]: pl },
    };
    super.emitChange();
  }

  removePlayer(playerId: PlayerId) {
    delete this.state.players[playerId];
    super.emitChange();
  }
}

/**
 * Singleton instance
 */
export const playerStore = new PlayerStore();

/**
 * Hook-compatible selector
 */
export function getPlayerState() {
  return playerStore.getState();
}

/**
 * Hook-compatible subscribe function
 */
export function subscribeToPlayerStore(listener: Listener) {
  return playerStore.subscribe(listener);
}
