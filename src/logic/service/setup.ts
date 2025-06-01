import { GameService } from '@/shared-logic/service';
import { EventBus } from '../event/event-bus';
import { BusEventData } from '../event/type';
import { gameStore } from '../store/game';
import { playerStore } from '../store/player';
import { worldStore } from '../store/world';

export class SetupService extends GameService {
  constructor(eventBus: EventBus) {
    super(eventBus);
    this.initialize();
  }

  protected initialize() {
    this.eventBus.subscribe('setup:2-players', this.setupTwoPlayers.bind(this));
  }

  private setupTwoPlayers({
    player1,
    player2,
    positions,
  }: BusEventData<'setup:2-players'>) {
    playerStore.addPlayer(player1);
    gameStore.addPlayer(player1);

    playerStore.addPlayer(player2);
    gameStore.addPlayer(player2);

    positions.forEach(([piece, position]) => {
      worldStore.addPiece(piece, position);
    });
  }
}
