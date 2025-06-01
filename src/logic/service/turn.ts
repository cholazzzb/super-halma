import { GameService } from '@/shared-logic/service';
import { EventBus } from '../event/event-bus';
import { BusEventData } from '../event/type';
import { gameStore } from '../store/game';
import { worldStore } from '../store/world';

export class TurnService extends GameService {
  constructor(eventBus: EventBus) {
    super(eventBus);
    this.initialize();
  }

  protected initialize(): void {
    this.eventBus.subscribe('turn:end-turn', this.endTurn.bind(this));
  }

  private endTurn({ startPos, endPos }: BusEventData<'turn:end-turn'>): void {
    gameStore.nextTurn();
    worldStore.movePiece(startPos, endPos);
  }
}
