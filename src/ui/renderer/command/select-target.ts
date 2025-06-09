import { Position } from "@/logic/domain/position";
import { EventBus } from "@/logic/event/event-bus";
import { Meshes, meshesStore } from "@/logic/store/meshes";
import { threeAppStore } from "@/logic/store/three-app";
import { worldStore } from "@/logic/store/world";
import { resolve } from "@/shared-logic/decorator/dependency-injection";
import { logger } from "@/shared-logic/logger";
import { RaycasterHandler } from "../raycaster-handler";
import { Tile } from "../tile";
import { Command } from "./interface";

export class SelectTargetCommand implements Command {
  private eventBus: EventBus;

  constructor(private raycasterHandler: RaycasterHandler) {
    const eventBus = resolve(EventBus);
    this.eventBus = eventBus;
  }

  execute(mesh: Tile): void {
    const isValid =
      this.raycasterHandler.targetsObj.filter(
        (to) =>
          to.position.x === mesh.position.x &&
          to.position.z === mesh.position.z,
      ).length > 0;

    if (!isValid) return;

    const activeObj = this.raycasterHandler.activeObj!;
    const startPos = Position.fromArray([
      activeObj.position.x,
      activeObj.position.z,
    ]);
    const playerId = worldStore.getState().pieces[startPos.toId()].ownerId;

    const endPos = Position.fromArray([mesh.position.x, mesh.position.z]);
    // move piece
    this.raycasterHandler.activeObj?.position.set(
      endPos.x,
      activeObj.position.y,
      endPos.z,
    );

    this.raycasterHandler.activeObj?.active(false);
    this.raycasterHandler.activeObj = null;
    this.raycasterHandler.targetsObj.forEach((to) => {
      to.targeted(false);
    });
    this.raycasterHandler.targetsObj = [];

    // Add star to player if any
    const { meshes } = meshesStore.getState();
    const { stars } = meshes!;
    const star = stars[endPos.toId()];
    if (star) {
      this.eventBus.emit("turn:add-star-to-player", {
        playerId,
        color: star.color,
      });

      // remove star from the UI
      const { threeApp } = threeAppStore.getState();
      logger.warn("STAR TO REMOVE:" + star.id);
      const starToRemove = threeApp!.scene.getObjectById(star.id)!;
      threeApp!.scene.remove(starToRemove);

      const { [endPos.toId()]: _, ...nextStars } = { ...meshes?.stars };
      const nextMeshes: Meshes = { ...meshes!, stars: { ...nextStars } };
      meshesStore.setMeshes(nextMeshes);
    }

    // Finish turn
    this.eventBus.emit("turn:end-turn", {
      startPos,
      endPos,
    });
  }
}
