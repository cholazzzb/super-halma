import { BusEventData, BusEventType } from "@/logic/event/type";
import { logger } from "@/shared-logic/logger";

/**
 * EventBus class for implementing the publish-subscribe pattern
 * Allows components to communicate without direct references to each other
 */
export class EventBus {
  // Map of event types to arrays of callback functions
  private listeners: Map<
    BusEventType,
    Array<(data: BusEventData<BusEventType>) => void>
  >;

  // Optional: Store recent events for debugging or late subscribers
  private eventHistory: Array<{
    type: BusEventType;
    data: BusEventData<BusEventType>;
    timestamp: number;
  }>;
  private maxHistoryLength: number;

  /**
   * Creates a new EventBus instance
   * @param options Configuration options
   */
  constructor(
    options: { enableHistory?: boolean; maxHistoryLength?: number } = {},
  ) {
    this.listeners = new Map<
      BusEventType,
      Array<(data: BusEventData<BusEventType>) => void>
    >();

    // Optional event history for debugging
    this.eventHistory = [];
    this.maxHistoryLength = options.maxHistoryLength || 100;
  }

  /**
   * Subscribe to an event
   * @param eventType The type of event to subscribe to
   * @param callback Function to be called when the event is emitted
   * @returns A function that can be called to unsubscribe
   */
  public subscribe<T extends BusEventType>(
    eventType: T,
    callback: (data: BusEventData<T>) => void,
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    const eventCallbacks = this.listeners.get(eventType)!;
    // Type assertion needed here because we're storing callbacks with different data types
    // This is type-safe because we only call these callbacks with matching event types
    eventCallbacks.push(callback as (data: BusEventData<BusEventType>) => void);

    // Return unsubscribe function for convenience
    return () => this.unsubscribe(eventType, callback);
  }

  /**
   * Subscribe to an event and automatically unsubscribe after it fires once
   * @param eventType The type of event to subscribe to
   * @param callback Function to be called when the event is emitted
   * @returns A function that can be called to unsubscribe
   */
  public subscribeOnce<T extends BusEventType>(
    eventType: T,
    callback: (data: BusEventData<T>) => void,
  ): () => void {
    const unsubscribe = this.subscribe(eventType, (data: BusEventData<T>) => {
      unsubscribe();
      callback(data);
    });

    return unsubscribe;
  }

  /**
   * Unsubscribe from an event
   * @param eventType The type of event to unsubscribe from
   * @param callback The callback function to remove
   */
  public unsubscribe<T extends BusEventType>(
    eventType: T,
    callback: (data: BusEventData<T>) => void,
  ): void {
    if (!this.listeners.has(eventType)) {
      return;
    }

    const eventCallbacks = this.listeners.get(eventType)!;
    const index = eventCallbacks.indexOf(
      callback as (data: BusEventData<BusEventType>) => void,
    );

    if (index !== -1) {
      eventCallbacks.splice(index, 1);

      // Clean up empty arrays
      if (eventCallbacks.length === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * @param eventType The type of event to emit
   * @param data Data to pass to subscribers
   */
  public emit<T extends BusEventType>(
    eventType: T,
    data: BusEventData<T>,
  ): void {
    // Store in history if enabled
    this.eventHistory.push({
      type: eventType,
      // Type assertion needed because we're storing different event types in the same array
      data: data as BusEventData<BusEventType>,
      timestamp: Date.now(),
    });

    // Trim history if needed
    if (this.eventHistory.length > this.maxHistoryLength) {
      this.eventHistory.shift();
    }

    // If no subscribers, just return
    if (!this.listeners.has(eventType)) {
      return;
    }

    // Create a copy of the array to avoid issues if callbacks modify the array
    const callbacks = [...this.listeners.get(eventType)!];

    // Call all subscribers
    for (const callback of callbacks) {
      try {
        // This cast is safe because we only register callbacks with matching event types
        (callback as (data: BusEventData<T>) => void)(data);
      } catch (error) {
        logger.error(`Error in event listener for ${eventType}:`, error);
      }
    }
  }

  /**
   * Clears all listeners for a specific event type
   * @param eventType The event type to clear listeners for
   */
  public clear(eventType: BusEventType): void {
    this.listeners.delete(eventType);
  }

  /**
   * Clears all event listeners
   */
  public clearAll(): void {
    this.listeners.clear();
  }

  /**
   * Returns the number of subscribers for a specific event type
   * @param eventType The event type to check
   */
  public listenerCount(eventType: BusEventType): number {
    return this.listeners.has(eventType)
      ? this.listeners.get(eventType)!.length
      : 0;
  }

  /**
   * Returns all event types that have subscribers
   */
  public eventTypes(): Array<BusEventType> {
    return Array.from(this.listeners.keys());
  }

  /**
   * Get recent event history (if enabled)
   * @param limit Maximum number of events to return
   */
  public getHistory(limit?: number): Array<{
    type: BusEventType;
    data: BusEventData<BusEventType>;
    timestamp: number;
  }> {
    const historyLimit = limit || this.maxHistoryLength;
    return this.eventHistory.slice(-historyLimit);
  }
}
