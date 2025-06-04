import { Listener, Store } from "@/shared-logic/store";
import { PlayerId } from "../domain/player";
import { Star, StarColor } from "../domain/star";

interface State {
  starCount: Record<PlayerId, Record<StarColor, Star>>;
}

class StarStore extends Store<State> {
  constructor() {
    super({
      starCount: {},
    });
  }

  addStar(playerId: PlayerId, color: StarColor, amount = 1): void {
    if (amount <= 0) {
      throw new Error("Amount should be greater than zero. No stars added.");
    }

    const nextState = { ...this.state };
    const playerStars = nextState.starCount[playerId] || {};
    const existingStar = playerStars[color];
    const updatedPlayerStars = existingStar
      ? {
          ...playerStars,
          [color]: { ...existingStar, count: existingStar.count + amount },
        }
      : {
          ...playerStars,
          [color]: (() => {
            const newStar = Star.fromColor(color);
            newStar.addStar(amount);
            return newStar;
          })(),
        };

    this.setState({
      starCount: {
        ...nextState.starCount,
        [playerId]: updatedPlayerStars,
      },
    });
  }
}

/**
 * Singleton instance
 */
export const starStore = new StarStore();

/**
 * Hook-compatible selector
 */
export function getStarState(): State {
  return starStore.getState();
}

/**
 * Hook-compatible subscribe function
 */
export function subscribeToStarStore(listener: Listener): () => void {
  return starStore.subscribe(listener);
}
