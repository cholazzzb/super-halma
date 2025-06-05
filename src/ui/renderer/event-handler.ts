import { PerspectiveCamera, Vector2, WebGLRenderer } from "three";

import { Piece } from "./piece";
import { RaycasterHandler } from "./raycaster-handler";
import { Tile } from "./tile";
import { Meshes } from "@/logic/store/meshes";

export class EventHandler {
  private raycasterHandler: RaycasterHandler;

  private boundOnResize: () => void;
  private boundOnPointerMove: (event: PointerEvent) => void;
  private boundOnClick: (event: MouseEvent) => void;

  constructor(
    private renderer: WebGLRenderer,
    private camera: PerspectiveCamera,
    private meshes: Meshes,
  ) {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnClick = this.onClick.bind(this);

    this.raycasterHandler = new RaycasterHandler(meshes);

    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("pointermove", this.boundOnPointerMove);
    window.addEventListener("click", this.boundOnClick);
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onPointerMove(event: PointerEvent) {
    const mesh = this.raycast(event.clientX, event.clientY);
    this.raycasterHandler.handleHover(mesh);
  }

  private onClick(event: MouseEvent) {
    const mesh = this.raycast(event.clientX, event.clientY);
    this.raycasterHandler.onClick(mesh);
  }

  private raycast(clientX: number, clientY: number) {
    const coords = new Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
    );

    this.raycasterHandler.raycaster.setFromCamera(coords, this.camera);
    const intersections = this.raycasterHandler.raycaster.intersectObjects([
      ...this.meshes.world.terrain.flat(),
      ...this.meshes.pieces,
    ]);

    const intersect = intersections?.[0] ?? { object: null };
    return intersect.object as Tile | Piece | null;
  }

  dispose() {
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("pointermove", this.boundOnPointerMove);
    window.removeEventListener("click", this.boundOnClick);
  }
}
