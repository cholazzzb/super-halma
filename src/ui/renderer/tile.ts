import {
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  type Texture,
  Vector3,
} from 'three';

import type { Position } from '@/logic/domain/position';
import type { Interactionable } from './interactionable';

const HIGHLIGHT_COLOR = 0x228be6;
const DEFAULT_BASE_COLOR_EVEN = 0xaaff77;
const DEFAULT_BASE_COLOR_ODD = 0x11ff11;

const geometry = new PlaneGeometry();
geometry.rotateX(-Math.PI / 2);

export class Tile extends Mesh implements Interactionable {
  public name = 'tile' as const;
  public material: MeshStandardMaterial;

  /**
   * Creates a new Tile instance.
   * @param position - The logical position of the tile.
   * @param [textureInput] - Optional texture for the tile. If not provided,
   *                       the tile's color can be changed by the `highlight` method.
   *                       If provided, it's assigned to the material's map.
   */
  constructor(position: Position, textureInput?: Texture) {
    const materialParams = textureInput
      ? { map: textureInput }
      : {
          color: Tile.calculateColorWhenUntextured(
            new Vector3(position.x, 0, position.z),
          ),
        };
    const material = new MeshStandardMaterial(materialParams);

    super(geometry, material);
    this.position.set(position.x, 0, position.z);
    this.material = material; // Explicitly assign to ensure MeshStandardMaterial type
  }

  /**
   * Calculates the target color for an untextured tile based on its highlight state
   * and its position (which determines its place in a checkerboard pattern).
   *
   * @param isHighlighted - True if the tile should be highlighted, false otherwise.
   * @param position - The logical position of the tile.
   * @returns The calculated hex color value.
   */
  static calculateColorWhenUntextured(position: Vector3): number {
    // Calculate default checkerboard color based on tile's grid position.
    const gridX = Math.floor(position.x);
    const gridZ = Math.floor(position.z);

    // Determine if the tile is on an "even" or "odd" square for the checkerboard pattern.
    const isEvenSquare = (gridX + gridZ) % 2 === 0;

    return isEvenSquare ? DEFAULT_BASE_COLOR_EVEN : DEFAULT_BASE_COLOR_ODD;
  }

  /**
   * Toggles the highlight state of the tile by changing its diffuse color.
   * This color change is only applied if the tile's material does not have a texture map.
   * If a texture map (`this.material.map`) exists, this method has no effect.
   *
   * @param [on] - If true, applies the highlight color.
   *             If false, reverts to a default base color (part of a checkerboard pattern).
   *             Defaults to true.
   */
  public highlight(on = true): void {
    if (!this.material.map) {
      const baseColor = Tile.calculateColorWhenUntextured(this.position);
      const targetColor = on ? HIGHLIGHT_COLOR : baseColor;

      this.material.color.set(targetColor);
    }
  }

  /**
   * @param on - If true, applies the active color. If false, reverts to the base color.
   */
  public active(_on: boolean): void {
    if (!this.material.map) {
      const baseColor = Tile.calculateColorWhenUntextured(this.position);
      this.material.color.set(baseColor);
    }
  }

  /**
   * @param on - If true, applies the targeted color. If false, reverts to the base color.
   */
  public targeted(on: boolean): void {
    if (!this.material.map) {
      if (on) {
        this.material.transparent = true;
        this.material.opacity = 0.5;
        this.material.depthWrite = false;
      } else {
        this.material.opacity = 1.0;
        this.material.depthWrite = true;
        this.material.transparent = false;
      }

      this.material.needsUpdate = true;
    }
  }
}
