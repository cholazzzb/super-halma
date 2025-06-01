import { useCallback } from 'react';

import { BusEventData, BusEventType } from '@/logic/event/type';
import { logic } from '@/logic/main';

const eventBus = logic.eventBus;

export function useEventEmitter() {
  return useCallback(
    <T extends BusEventType>(eventType: T, payload: BusEventData<T>) => {
      eventBus.emit(eventType, payload);
    },
    [],
  );
}
