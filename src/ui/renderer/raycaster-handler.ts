import { Raycaster } from "three";

import { Meshes } from "@/logic/store/meshes";
import { CommandMesh } from "./command/interface";
import { SelectPieceCommand } from "./command/select-piece";
import { SelectTargetCommand } from "./command/select-target";
import type { Interactionable } from "./interactionable";
import { FirePiece } from "./piece/fire-piece";
import { WaterPiece } from "./piece/water-piece";
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

  public handleHover(mesh: CommandMesh) {
    const skip = this.isMeshEqualTarget(mesh);
    if (mesh) {
      if (this.shouldUnhover() && !skip) this.handleUnhover();
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

  public onClick(mesh: CommandMesh) {
    if (mesh === null) return;
    if (mesh.name === "tile" && this.targetsObj.length > 0) {
      const meshTile = mesh as Tile;
      new SelectTargetCommand(this).execute(meshTile);
      return;
    }

    if (mesh.name.includes("piece")) {
      const meshPiece = mesh as FirePiece | WaterPiece;
      new SelectPieceCommand(this).execute(meshPiece);
      return;
    }

    return;
  }

  private isMeshEqualTarget(mesh: CommandMesh): boolean {
    return (
      this.targetsObj.filter(
        (to) =>
          to.position.x === mesh?.position.x &&
          to.position.z === mesh.position.z,
      ).length > 0
    );
  }
}
