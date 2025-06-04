import { GameService } from "@/shared-logic/service";
import { renderPieces } from "@/ui/renderer/initializer/game";
import { Piece } from "@/ui/renderer/piece";
import { World } from "@/ui/renderer/world";
import { Terrain } from "../domain/terrain";
import { EventBus } from "../event/event-bus";
import { BusEventData } from "../event/type";
import { gameStore } from "../store/game";
import { playerStore } from "../store/player";
import { threeAppStore } from "../store/three-app";
import { worldStore } from "../store/world";
import { generateStarPositions } from "../domain/setup";
import { PositionId } from "../domain/position";
import {
  IndigoStar,
  MagentaStar,
  SilverStar,
  TealStar,
} from "@/ui/renderer/star";
import { getRandomArrEl } from "@/shared-logic/random";

export type Meshes = {
  world: World;
  pieces: Array<Piece>;
};

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
    const world = new World(Terrain.width, Terrain.height);
    threeApp.scene.add(world);
    const pieces = renderPieces();
    pieces.map((pi) => world.add(pi));

    const { pieces: piecesMap } = worldStore.getState();
    const piecesPos = new Set(Object.keys(piecesMap) as Array<PositionId>);

    const starsPosition = generateStarPositions(piecesPos);
    for (const sp of starsPosition) {
      const StarKind = getRandomArrEl([
        IndigoStar,
        TealStar,
        MagentaStar,
        SilverStar,
      ]);
      const star = new StarKind(sp);
      world.add(star);
      worldStore.addStar(star, sp);
    }

    const meshes: Meshes = {
      world,
      pieces,
    };

    threeAppStore.setThreeApp(threeApp);
    threeAppStore.setMeshes(meshes);
  }
}
