import {
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3DEventMap,
  Vector3,
} from "three";

import { Position } from "@/logic/domain/position";
import { Interactionable } from "./interactionable";

const ACTIVE_COLOR = 0x228be6;
const TARGET_COLOR = 0x368b22;

const geometry = new CylinderGeometry(0.3, 0.3, 0.1);

interface MaterialState {
  material: MeshStandardMaterial;
  originalColor: Color;
  originalEmissive: Color;
  originalMetalness: number;
  originalRoughness: number;
}

export class Piece extends Group implements Interactionable {
  public name = "piece" as const;
  private materialStates: Array<MaterialState> = [];
  private model: Group<Object3DEventMap> | null = null;
  private originalScale: Vector3 = new Vector3(0.5, 0.5, 0.5);

  constructor(
    private color: number,
    private highlightColor: number,
    position: Position,
    model?: Group<Object3DEventMap> | null,
    transform?: (obj: Group<Object3DEventMap> | null) => void,
  ) {
    super();
    if (model) {
      model.scale.copy(this.originalScale);
      this.add(model);
      this.setupMaterials();
      this.setPosition(position);
      transform?.(this);
    } else {
      this.createFallbackGeometry();
    }
  }

  private createFallbackGeometry() {
    const material = new MeshStandardMaterial({ color: this.color });
    const mesh = new Mesh(geometry, material);
    this.add(mesh);

    // Store material state for fallback geometry
    this.materialStates = [
      {
        material,
        originalColor: material.color.clone(),
        originalEmissive: material.emissive.clone(),
        originalMetalness: material.metalness,
        originalRoughness: material.roughness,
      },
    ];
  }

  private setupMaterials() {
    this.materialStates = [];

    this.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat instanceof MeshStandardMaterial) {
              this.storeMaterialState(mat);
              mat.color.set(this.color);
            }
          });
        } else if (child.material instanceof MeshStandardMaterial) {
          this.storeMaterialState(child.material);
          child.material.color.set(this.color);
        }
      }
    });
  }

  private storeMaterialState(material: MeshStandardMaterial) {
    this.materialStates.push({
      material,
      originalColor: material.color.clone(),
      originalEmissive: material.emissive.clone(),
      originalMetalness: material.metalness,
      originalRoughness: material.roughness,
    });
  }

  setPosition(pos: Position) {
    if (this.model) {
      this.position.set(pos.x, 0.5, pos.z);
    } else {
      this.position.set(pos.x, 0.05, pos.z);
    }
  }

  // Method 1: Color-based highlighting (current approach)
  public highlight(on = true): void {
    if (this.model) {
      this.highlightCombined(on);
    } else {
      const targetColor = on ? this.highlightColor : this.color;
      this.materialStates.forEach(({ material }) => {
        material.color.set(targetColor);
      });
    }
  }

  // Method 2: Emissive highlighting (glowing effect)
  public highlightEmissive(on = true): void {
    this.materialStates.forEach(({ material, originalEmissive }) => {
      if (on) {
        material.emissive.set(this.highlightColor);
        material.emissiveIntensity = 0.3;
      } else {
        material.emissive.copy(originalEmissive);
        material.emissiveIntensity = 0;
      }
    });
  }

  // Method 3: Scale-based highlighting
  public highlightScale(on = true): void {
    const targetScale = on ? 1.1 : 1.0;
    this.scale.setScalar(targetScale);
  }

  // Method 4: Material property highlighting (metallic/roughness)
  public highlightMaterial(on = true): void {
    this.materialStates.forEach(
      ({ material, originalMetalness, originalRoughness }) => {
        if (on) {
          material.metalness = 0.8;
          material.roughness = 0.2;
          material.emissive.set(this.highlightColor);
          material.emissiveIntensity = 0.1;
        } else {
          material.metalness = originalMetalness;
          material.roughness = originalRoughness;
          material.emissive.set(0x000000);
          material.emissiveIntensity = 0;
        }
      },
    );
  }

  // Method 5: Combined highlighting (recommended)
  public highlightCombined(on = true): void {
    if (on) {
      // Slight scale increase
      this.scale.setScalar(1.2);

      // Emissive glow
      this.materialStates.forEach(({ material }) => {
        material.color.set(this.highlightColor);
        material.emissive.set(this.highlightColor);
        material.emissiveIntensity = 0.2;
        material.metalness = Math.min(material.metalness + 0.2, 1.0);
        material.roughness = Math.max(material.roughness - 0.1, 0.0);
      });
    } else {
      // Reset scale
      this.scale.setScalar(1.0);

      // Reset materials
      this.materialStates.forEach(
        ({
          material,
          originalColor: _,
          originalEmissive,
          originalMetalness,
          originalRoughness,
        }) => {
          material.color.set(this.color);
          material.emissive.copy(originalEmissive);
          material.emissiveIntensity = 0;
          material.metalness = originalMetalness;
          material.roughness = originalRoughness;
        },
      );
    }
  }

  public active(on: boolean): void {
    const targetColor = on ? ACTIVE_COLOR : this.color;
    this.materialStates.forEach(({ material }) => {
      material.color.set(targetColor);
      if (on) {
        material.emissive.set(ACTIVE_COLOR);
        material.emissiveIntensity = 0.3;
      } else {
        material.emissive.set(0x000000);
        material.emissiveIntensity = 0;
      }
    });
  }

  public targeted(on: boolean): void {
    const targetColor = on ? TARGET_COLOR : this.color;
    this.materialStates.forEach(({ material }) => {
      material.color.set(targetColor);
      if (on) {
        // Pulsing effect could be added here with animation
        material.emissive.set(TARGET_COLOR);
        material.emissiveIntensity = 0.4;
      } else {
        material.emissive.set(0x000000);
        material.emissiveIntensity = 0;
      }
    });
  }

  // Utility method to switch between highlight modes
  public setHighlightMode(
    mode: "color" | "emissive" | "scale" | "material" | "combined" = "combined",
  ) {
    // Store the current highlight mode for the highlight method
    this.highlightMode = mode;
  }

  private highlightMode:
    | "color"
    | "emissive"
    | "scale"
    | "material"
    | "combined" = "combined";

  // Updated highlight method that uses the selected mode
  public highlightWithMode(on = true): void {
    switch (this.highlightMode) {
      case "color":
        this.highlight(on);
        break;
      case "emissive":
        this.highlightEmissive(on);
        break;
      case "scale":
        this.highlightScale(on);
        break;
      case "material":
        this.highlightMaterial(on);
        break;
      case "combined":
      default:
        this.highlightCombined(on);
        break;
    }
  }

  public dispose() {
    this.materialStates.forEach(({ material }) => {
      material.dispose();
    });
    this.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
      }
    });
  }
}
