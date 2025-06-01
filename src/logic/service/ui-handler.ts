import { GameService } from '@/shared-logic/service';
import { EventBus } from '../event/event-bus';
import { BusEventData } from '../event/type';
import { interactionStore } from '../store/interaction';

export class UIHandlerService extends GameService {
  constructor(eventBus: EventBus) {
    super(eventBus);
    this.initialize();
  }

  protected initialize(): void {
    this.eventBus.subscribe(
      'ui-handler:on-active',
      this.onClickActive.bind(this),
    );
  }

  private onClickActive({
    position,
  }: BusEventData<'ui-handler:on-active'>): void {
    if (position === null) {
      interactionStore.updateActivedObjectId(undefined);
    } else {
      interactionStore.updateActivedObjectId(position.toId());
    }
  }
}
