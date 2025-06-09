import { MoveFinder } from "@/logic/domain/move-finder";
import { Position, PositionId } from "@/logic/domain/position";
import { EventBus } from "@/logic/event/event-bus";
import { gameStore } from "@/logic/store/game";
import { worldStore } from "@/logic/store/world";
import { resolve } from "@/shared-logic/decorator/dependency-injection";
import { FirePiece } from "../piece/fire-piece";
import { WaterPiece } from "../piece/water-piece";
import { RaycasterHandler } from "../raycaster-handler";
import { Command } from "./interface";

export class SelectPieceCommand implements Command {
  private eventBus: EventBus;

  constructor(private raycasterHandler: RaycasterHandler) {
    const eventBus = resolve(EventBus);
    this.eventBus = eventBus;
  }

  execute(mesh: FirePiece | WaterPiece): void {
    this.unselect();
    this.select(mesh);
  }

  private select(mesh: FirePiece | WaterPiece) {
    const startPos = Position.fromArray([mesh!.position.x, mesh!.position.z]);

    const ownerId = worldStore.checkOwnerId(startPos.toId());
    const turnId = gameStore.getState().playerTurn?.id;

    if (ownerId !== turnId) return;

    this.eventBus.emit("ui-handler:on-active", {
      position: startPos,
    });

    if (this.raycasterHandler.highlightObj) {
      this.raycasterHandler.activeObj?.active(false);
      this.raycasterHandler.activeObj = this.raycasterHandler.highlightObj;
      this.raycasterHandler.activeObj.active(true);
      this.raycasterHandler.highlightObj = null;
    } else {
      this.raycasterHandler.activeObj?.active(false);
      this.raycasterHandler.activeObj = null;
    }

    const map = new Set(
      this.raycasterHandler.meshes.pieces.map((piece) =>
        Position.fromArray([piece.position.x, piece.position.z]).toId(),
      ),
    );

    const moveFinder = new MoveFinder(map);
    const moves = moveFinder.getAllMoves(startPos);
    const targetsPos: Set<PositionId> = new Set(
      moves.map((mv) => mv.endPos.toId()),
    );

    this.raycasterHandler.meshes.world!.terrain.forEach((tile) => {
      const tilePos = Position.fromArray([tile.position.x, tile.position.z]);
      if (targetsPos.has(tilePos.toId())) {
        tile.targeted(true);
        this.raycasterHandler.targetsObj.push(tile);
      }
    });
  }

  private unselect() {
    this.raycasterHandler.targetsObj.forEach((to) => {
      to.targeted(false);
    });
  }
}
