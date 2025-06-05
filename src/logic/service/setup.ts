import { getRandomArrEl } from "@/shared-logic/random";
import { GameService } from "@/shared-logic/service";
import { renderPieces } from "@/ui/renderer/initializer/game";
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
import { Meshes, meshesStore } from "../store/meshes";
import { playerStore } from "../store/player";
import { threeAppStore } from "../store/three-app";
import { worldStore } from "../store/world";

export class SetupService extends GameService {
  constructor(eventBus: EventBus) {
    super(eventBus);
    this.initialize();
  }

  protected initialize() {
    this.eventBus.subscribe("setup:2-players", this.setupTwoPlayers.bind(this));
    this.eventBus.subscribe("setup:render-world", this.renderWorld.bind(this));
  }

  private setupTwoPlayers({
    player1,
    player2,
    positions,
  }: BusEventData<"setup:2-players">) {
    playerStore.addPlayer(player1);
    gameStore.addPlayer(player1);

    playerStore.addPlayer(player2);
    gameStore.addPlayer(player2);

    positions.forEach(([piece, position]) => {
      worldStore.addPiece(piece, position);
    });
  }

  private renderWorld({ threeApp }: BusEventData<"setup:render-world">) {
    const {
      meshes: { world },
    } = meshesStore.getState();
    threeApp.scene.add(world);
    const pieces = renderPieces();
    pieces.map((pi) => world.add(pi));

    const { pieces: piecesMap } = worldStore.getState();
    const piecesPos = new Set(Object.keys(piecesMap) as Array<PositionId>);
    const stars: Meshes["stars"] = {};

    const starsPosition = generateStarPositions(piecesPos);
    for (const sp of starsPosition) {
      const StarKind = getRandomArrEl([
        IndigoStar,
        TealStar,
        MagentaStar,
        SilverStar,
      ]);
      const star = new StarKind(sp);
      threeApp.scene.add(star);
      stars[sp.toId()] = star;
    }

    const meshes: Meshes = {
      world,
      pieces,
      stars,
    };

    threeAppStore.setThreeApp(threeApp);
    meshesStore.setMeshes(meshes);
  }
}
