import { Position } from "@/logic/domain/position";
import { logic } from "@/logic/main";
import { RaycasterHandler } from "../raycaster-handler";
import { Tile } from "../tile";
import { Command } from "./interface";
import { worldStore } from "@/logic/store/world";
import { threeAppStore } from "@/logic/store/three-app";

const eventBus = logic.eventBus;

export class SelectTargetCommand implements Command {
  constructor(private raycasterHandler: RaycasterHandler) {}

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
      mesh.position.y,
      endPos.z,
    );

    this.raycasterHandler.activeObj?.active(false);
    this.raycasterHandler.activeObj = null;
    this.raycasterHandler.targetsObj.forEach((to) => {
      to.targeted(false);
    });
    this.raycasterHandler.targetsObj = [];

    // Add star to player if any
    const { stars } = worldStore.getState();
    const star = stars[endPos.toId()];
    if (star) {
      eventBus.emit("turn:add-star-to-player", {
        playerId,
        color: star.color,
      });

      // remove star from the UI
      const { threeApp } = threeAppStore.getState();
      console.log("star", { star });
      threeApp!.scene.getObjectByName("world")!.remove(star);

      worldStore.removeStar(endPos);
    }

    // Finish turn
    eventBus.emit("turn:end-turn", {
      startPos,
      endPos,
    });
  }
}
