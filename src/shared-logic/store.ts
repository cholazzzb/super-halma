/**
 * Type for store listener functions
 */
export type Listener = () => void;

export class Store<T> {
  constructor(protected state: T) {}
  private listeners: Set<Listener> = new Set();

  /**
   * Returns the current state of the store.
   * @returns {T} The current state.
   */
  getState(): T {
    return this.state;
  }

  /**
   * Subscribes a listener function to be called whenever the store's state changes.
   * @param {Listener} listener The listener function to subscribe.
   * @returns {() => void} A function to unsubscribe the listener.
   */
  subscribe(listener: Listener, debug?: string): () => void {
    console.debug("subscribed", debug);
    this.listeners.add(listener);
    return () => {
      console.debug("unsubscribed", debug);
      this.listeners.delete(listener);
    };
  }

  /**
   * Emits a change event to all subscribed listeners.
   */
  protected emitChange(debug?: string) {
    console.debug(debug);
    for (const listener of this.listeners) {
      listener();
    }
  }

  protected setState(nextState: T, debug?: string) {
    this.state = nextState;
    this.emitChange(debug);
  }
}
