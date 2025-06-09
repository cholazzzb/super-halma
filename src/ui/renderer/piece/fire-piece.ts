import { Group, Mesh } from "three";

import { Position } from "@/logic/domain/position";
import { logger } from "@/shared-logic/logger";
import { AssetManager } from "../asset-manager";
import { Interactionable } from "../interactionable";

export class FirePiece extends Group implements Interactionable {
  public name = "fire-piece" as const;

  constructor(position: Position, assetManager: AssetManager) {
    super();
    const model = assetManager.getModel("fire-piece");
    if (model) {
      this.add(model);
    } else {
      logger.error("fire-piece model is undefined");
    }
    this.setPosition(position);
    this.scale.set(0.5, 0.5, 0.5);
    this.traverse((child) => {
      if (child.type === "Mesh") {
        const mesh = child as Mesh;
        if (mesh.material && (mesh.material as any).emissive) {
          mesh.material = (mesh.material as any).clone();
        }
      }
    });
  }

  public setPosition(pos: Position) {
    this.position.set(pos.x, 0.5, pos.z);
  }

  public highlight(on: boolean): void {
    if (on) {
      this.scale.set(0.6, 0.6, 0.6);
      this.traverse((child) => {
        if (child instanceof Mesh && (child.material as any)?.emissive) {
          (child.material as any).emissive.setHex(0xffa500);
        }
      });
    } else {
      this.scale.set(0.5, 0.5, 0.5);
      this.traverse((child) => {
        if (child.type === "Mesh") {
          const mesh = child as Mesh;
          if (mesh.material && (mesh.material as any).emissive) {
            if (
              (child as Mesh).material &&
              ((child as Mesh).material as any).emissive
            ) {
              ((child as Mesh).material as any).emissive.setHex(0x000000);
            }
          }
        }
      });
    }
  }

  public active(on: boolean): void {
    if (on) {
      this.scale.set(0.7, 0.7, 0.7);
      this.traverse((child) => {
        if (child instanceof Mesh && (child.material as any)?.emissive) {
          (child.material as any).emissive.setHex(0xff0000);
        }
      });
    } else {
      this.scale.set(0.5, 0.5, 0.5);
      this.traverse((child) => {
        if (child.type === "Mesh") {
          const mesh = child as Mesh;
          if (mesh.material && (mesh.material as any).emissive) {
            ((child as Mesh).material as any).emissive.setHex(0x000000);
          }
        }
      });
    }
  }

  public targeted(_on: boolean): void {
    // Optionally, you can implement a different visual for "targeted"
    // For now, do nothing
  }
}
