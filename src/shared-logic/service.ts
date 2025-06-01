import { EventBus } from '../logic/event/event-bus';

export class GameService {
  constructor(protected eventBus: EventBus) {}

  protected initialize() {
    // Override in subclasses to set up event listeners
  }
}
