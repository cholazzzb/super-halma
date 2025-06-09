import { assets } from "@/data/asset";
import { getRandomArrEl } from "@/shared-logic/random";
import { GameService } from "@/shared-logic/service";
import { EventHandler } from "@/ui/renderer/event-handler";
import { renderPieces } from "@/ui/renderer/initializer/game";
import {
  IndigoStar,
  MagentaStar,
  SilverStar,
  TealStar,
} from "@/ui/renderer/star";
import { World } from "@/ui/renderer/world";
import { PositionId } from "../domain/position";
import { generateStarPositions } from "../domain/setup";
import { Terrain } from "../domain/terrain";
import { EventBus } from "../event/event-bus";
import { BusEventData } from "../event/type";
import { gameStore } from "../store/game";
import { Meshes, meshesStore } from "../store/meshes";
import { playerStore } from "../store/player";
import { threeAppStore } from "../store/three-app";
import { worldStore } from "../store/world";
import { resolve } from "@/shared-logic/decorator/dependency-injection";

export class SetupService extends GameService {
  constructor() {
    const eventBus = resolve(EventBus);

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

  private async renderWorld({ threeApp }: BusEventData<"setup:render-world">) {
    await threeApp.assetManager.init(assets);
    const world = new World(Terrain.width, Terrain.height);
    threeApp.scene.add(world);

    const pieces = renderPieces(threeApp.assetManager);
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

    threeApp.start();
    new EventHandler(threeApp.renderer, threeApp.camera, meshes);

    threeAppStore.setThreeApp(threeApp);
    meshesStore.setMeshes(meshes);
  }
}
