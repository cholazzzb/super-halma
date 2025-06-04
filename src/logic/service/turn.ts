import { getRandomArrEl } from "@/shared-logic/random";
import { GameService } from "@/shared-logic/service";
import {
  IndigoStar,
  MagentaStar,
  SilverStar,
  TealStar,
} from "@/ui/renderer/star";
import { PositionId } from "../domain/position";
import { generateStarPositions } from "../domain/setup";
import { EventBus } from "../event/event-bus";
import { BusEventData } from "../event/type";
import { gameStore } from "../store/game";
import { starStore } from "../store/star";
import { threeAppStore } from "../store/three-app";
import { worldStore } from "../store/world";

export class TurnService extends GameService {
  constructor(eventBus: EventBus) {
    super(eventBus);
    this.initialize();
  }

  protected initialize(): void {
    this.eventBus.subscribe("turn:end-turn", this.endTurn.bind(this));
    this.eventBus.subscribe(
      "turn:add-star-to-player",
      this.addStarToPlayer.bind(this),
    );
  }

  private endTurn({ startPos, endPos }: BusEventData<"turn:end-turn">): void {
    gameStore.nextTurn();
    worldStore.movePiece(startPos, endPos);

    // add star to UI
    const { stars } = worldStore.getState();
    const starsPos = new Set(Object.keys(stars) as Array<PositionId>);

    const { pieces: piecesMap } = worldStore.getState();
    const piecesPos = new Set(Object.keys(piecesMap) as Array<PositionId>);
    piecesPos.union(starsPos);

    const starPosition = generateStarPositions(piecesPos, 1);
    const StarKind = getRandomArrEl([
      IndigoStar,
      TealStar,
      MagentaStar,
      SilverStar,
    ]);
    const star = new StarKind(starPosition[0]);
    const { threeApp } = threeAppStore.getState();
    if (!threeApp) throw new Error("");
    threeApp.scene.getObjectByName("world")!.add(star);
    worldStore.addStar(star, starPosition[0]);
  }

  private addStarToPlayer({
    playerId,
    color,
  }: BusEventData<"turn:add-star-to-player">): void {
    starStore.addStar(playerId, color);
  }
}
