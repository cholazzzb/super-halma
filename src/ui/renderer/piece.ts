import { CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';

import { Position } from '@/logic/domain/position';
import { Interactionable } from './interactionable';

const ACTIVE_COLOR = 0x228be6;
const TARGET_COLOR = 0x368b22;

const geometry = new CylinderGeometry(0.3, 0.3, 0.1);

export class Piece extends Mesh implements Interactionable {
  public name = 'piece' as const;
  public material: MeshStandardMaterial;

  constructor(
    private color: number,
    private highlightColor: number,
    position: Position,
  ) {
    const material = new MeshStandardMaterial({ color });

    super(geometry, material);
    this.setPosition(position);
    this.material = material;
  }

  setPosition(pos: Position) {
    this.position.set(pos.x, 0.05, pos.z);
  }

  public highlight(on = true): void {
    const targetColor = on ? this.highlightColor : this.color;
    this.material.color.set(targetColor);
  }

  public active(on: boolean): void {
    const targetColor = on ? ACTIVE_COLOR : this.color;
    this.material.color.set(targetColor);
  }

  public targeted(on: boolean): void {
    const targetColor = on ? TARGET_COLOR : this.color;
    this.material.color.set(targetColor);
  }
}
