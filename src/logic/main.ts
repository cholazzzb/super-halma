import { EventBus } from './event/event-bus';
import { SetupService } from './service/setup';
import { TurnService } from './service/turn';
import { UIHandlerService } from './service/ui-handler';

function initializeLogic() {
  const eventBus = new EventBus({
    enableHistory: true,
    maxHistoryLength: 25,
  });

  new SetupService(eventBus);
  new UIHandlerService(eventBus);
  new TurnService(eventBus);

  return { eventBus };
}

export const logic = initializeLogic();
