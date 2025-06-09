import { useCallback } from "react";

import { EventBus } from "@/logic/event/event-bus";
import { BusEventData, BusEventType } from "@/logic/event/type";
import { resolve } from "../decorator/dependency-injection";

const eventBus = resolve(EventBus);

export function useEventEmitter() {
  return useCallback(
    <T extends BusEventType>(eventType: T, payload: BusEventData<T>) => {
      eventBus.emit(eventType, payload);
    },
    [],
  );
}
