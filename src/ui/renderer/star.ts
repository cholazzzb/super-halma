import { ExtrudeGeometry, Mesh, MeshPhongMaterial, Shape } from "three";

import { Position } from "@/logic/domain/position";
import { StarColor } from "@/logic/domain/star";

function createStarShape(radius: number, spikes: number): Shape {
  const shape = new Shape();
  const outerRadius = radius;
  const innerRadius = radius / 2;
  const angleStep = Math.PI / spikes;

  shape.moveTo(outerRadius, 0);

  let x = 0;
  let y = 0;
  for (let i = 0; i < spikes; i++) {
    x = Math.cos(i * 2 * angleStep) * outerRadius;
    y = Math.sin(i * 2 * angleStep) * outerRadius;
    shape.lineTo(x, y);

    x = Math.cos((i * 2 + 1) * angleStep) * innerRadius;
    y = Math.sin((i * 2 + 1) * angleStep) * innerRadius;
    shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

const starShape = createStarShape(0.25, 5);

const extrudeSettings = {
  depth: 0.05,
  bevelEnabled: true,
  bevelSegments: 50,
  steps: 1,
  bevelSize: 0.05,
  bevelThickness: 0.05,
};

const geometry = new ExtrudeGeometry(starShape, extrudeSettings);


export class Star extends Mesh {
  static y = 0.3;

  public material: MeshPhongMaterial;
  private baseY: number;
  private elapsed: number = 0;
  private animationId: number | null = null;
  private oscillationAmplitude: number = 0.05;
  private oscillationSpeed: number = 2; // radians per second

  constructor(
    public color: StarColor,
    position: Position,
  ) {
    const material = new MeshPhongMaterial({ color });

    super(geometry, material);
    this.setPosition(position);
    this.material = material;
    this.rotation.x = 0;
    this.rotation.z = Math.PI / 2;
    this.position.y = Star.y;
    this.baseY = Star.y;
    this.rotation.y = Math.PI / 4;
    this.castShadow = true;
    this.receiveShadow = true;

    this.animate = this.animate.bind(this);
    this.startOscillation();
  }

  setPosition(pos: Position) {
    this.position.set(pos.x, Star.y, pos.z);
    this.baseY = Star.y;
  }

  private animate(time: number) {
    // time is in ms
    this.elapsed = time * 0.001; // convert to seconds
    this.position.y = this.baseY + Math.sin(this.elapsed * this.oscillationSpeed) * this.oscillationAmplitude;
    this.animationId = requestAnimationFrame(this.animate);
  }

  private startOscillation() {
    if (this.animationId === null) {
      this.animationId = requestAnimationFrame(this.animate);
    }
  }

  public stopOscillation() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public dispose() {
    this.stopOscillation();
  }
}

export class IndigoStar extends Star {
  public name = "indigo-star" as const;

  constructor(position: Position) {
    super(StarColor.Indigo, position);
  }
}

export class TealStar extends Star {
  public name = "teal-star" as const;

  constructor(position: Position) {
    super(StarColor.Teal, position);
  }
}

export class MagentaStar extends Star {
  public name = "magenta-star" as const;

  constructor(position: Position) {
    super(StarColor.Magenta, position);
  }
}

export class SilverStar extends Star {
  public name = "silver-star" as const;

  constructor(position: Position) {
    super(StarColor.Silver, position);
  }
}
