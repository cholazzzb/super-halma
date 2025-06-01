import { Listener, Store } from '@/shared-logic/store';
import { PositionId } from '../domain/position';

interface State {
  hoveredPositionId: PositionId | undefined;
  activedPositionId: PositionId | undefined;
  targetedPositionsId: Array<PositionId>;
}

class InteractionStore extends Store<State> {
  constructor() {
    super({
      hoveredPositionId: undefined,
      activedPositionId: undefined,
      targetedPositionsId: [],
    });
  }

  updateHoveredObjectId(positionId: PositionId | undefined) {
    this.state = {
      ...this.state,
      hoveredPositionId: positionId,
    };
    super.emitChange(`interaction: update hoveredPositionId: ${positionId}`);
  }

  updateActivedObjectId(positionId: PositionId | undefined) {
    this.state = {
      ...this.state,
      activedPositionId: positionId,
    };
    super.emitChange(`interaction: update activedPositionId: ${positionId}`);
  }

  updateTargetedObjectsId(updateFn: (state: State) => State) {
    const state = this.state;
    this.state = updateFn(state);
    super.emitChange(`interaction: update targetedPositionsId: ${this.state}`);
  }
}

/**
 * Singleton instance
 */
export const interactionStore = new InteractionStore();

/**
 * Hook-compatible selector
 */
export function getInteractionState() {
  return interactionStore.getState();
}

/**
 * Hook-compatible subscribe function
 */
export function subscribeToInteractionStore(listener: Listener) {
  return interactionStore.subscribe(listener);
}
