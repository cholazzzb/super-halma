import { Raycaster } from "three";

import { Meshes } from "@/logic/service/setup";
import { SelectPieceCommand } from "./command/select-piece";
import { SelectTargetCommand } from "./command/select-target";
import type { Interactionable } from "./interactionable";
import type { Piece } from "./piece";
import type { Tile } from "./tile";

export class RaycasterHandler {
  public raycaster = new Raycaster();

  public highlightObj: Interactionable | null = null;
  public activeObj: Interactionable | null = null;
  public targetsObj: Array<Interactionable> = [];

  constructor(public meshes: Meshes) {}

  public shouldUnhover() {
    if (this.activeObj === null) return true;
    if (this.highlightObj === null) return false;
    return this.highlightObj.id !== this.activeObj.id;
  }

  public handleHover(mesh: Tile | Piece | null) {
    const skip = this.isMeshEqualTarget(mesh);
    if (this.shouldUnhover() && !skip) this.handleUnhover();
    if (mesh) {
      if (this.activeObj?.id === mesh?.id || skip) {
        return;
      }

      this.highlightObj = mesh;
      mesh.highlight(true);
    }
  }

  public handleUnhover() {
    const obj = this.highlightObj;
    obj?.highlight(false);
    this.highlightObj = null;
  }

  public onClick(mesh: Tile | Piece | null) {
    if (mesh === null) return;
    if (mesh.name === "tile" && this.targetsObj.length > 0) {
      new SelectTargetCommand(this).execute(mesh);
      return;
    }

    if (mesh.name === "piece") {
      new SelectPieceCommand(this).execute(mesh);
      return;
    }

    return;
  }

  private isMeshEqualTarget(mesh: Tile | Piece | null): boolean {
    return (
      this.targetsObj.filter(
        (to) =>
          to.position.x === mesh?.position.x &&
          to.position.z === mesh.position.z,
      ).length > 0
    );
  }
}
