import { resolve } from "@/shared-logic/decorator/dependency-injection";
import { logger } from "@/shared-logic/logger";
import { getRandomArrEl } from "@/shared-logic/random";
import { GameService } from "@/shared-logic/service";
import {
  IndigoStar,
  MagentaStar,
  SilverStar,
  TealStar,
} from "@/ui/renderer/star";
import { Position, PositionId } from "../domain/position";
import { generateStarPositions } from "../domain/setup";
import { EventBus } from "../event/event-bus";
import { BusEventData } from "../event/type";
import { gameStore } from "../store/game";
import { Meshes, meshesStore } from "../store/meshes";
import { starStore } from "../store/star";
import { threeAppStore } from "../store/three-app";
import { worldStore } from "../store/world";

export class TurnService extends GameService {
  constructor() {
    const eventBus = resolve(EventBus);

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

    const shouldGenerateStar = Math.random() < 0.75;
    const { threeApp } = threeAppStore.getState();
    if (!threeApp) throw new Error("");

    if (shouldGenerateStar) {
      // add star to UI
      const { stars } = meshesStore.getState().meshes!;
      const starsPos = new Set(Object.keys(stars) as Array<PositionId>);

      const { pieces: piecesMap } = worldStore.getState();
      const piecesPos = new Set(Object.keys(piecesMap) as Array<PositionId>);
      const occupiedPos = piecesPos.union(starsPos);

      const starPosition = generateStarPositions(occupiedPos, 1);
      if (Position.equals(starPosition[0], endPos)) {
        logger.log("OOPS", { starPosition, endPos });
      }
      const StarKind = getRandomArrEl([
        IndigoStar,
        TealStar,
        MagentaStar,
        SilverStar,
      ]);
      const star = new StarKind(starPosition[0]);
      threeApp.scene.add(star);

      const { meshes } = meshesStore.getState();
      const nextMeshes: Meshes = {
        ...meshes!,
        stars: { ...meshes!.stars, [starPosition[0].toId()]: star },
      };
      meshesStore.setMeshes(nextMeshes);
    }

    logger.info("SCENE OBJECTS.........");
    threeApp!.scene.traverse((obj) => {
      if (obj.name.includes("star")) {
        logger.warn(
          `${obj.id}: ${obj.type} — ${obj.name}: ${obj.position.x},${obj.position.z}`,
        );
      }
    });
  }

  private addStarToPlayer({
    playerId,
    color,
  }: BusEventData<"turn:add-star-to-player">): void {
    starStore.addStar(playerId, color);
  }
}
