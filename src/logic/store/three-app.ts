import { Store } from "@/shared-logic/store";
import { ThreeApp } from "@/ui/renderer/three-app";
import { Meshes } from "../service/setup";

interface State {
  threeApp: ThreeApp | undefined;
  meshes: Meshes | undefined;
}

class ThreeAppStore extends Store<State> {
  constructor() {
    super({
      threeApp: undefined,
      meshes: undefined,
    });
  }

  setThreeApp(threeApp: ThreeApp) {
    const state = { ...this.state };
    this.setState({ ...state, threeApp }, `three app: add threeApp instance`);
  }

  setMeshes(meshes: Meshes) {
    const state = { ...this.state };
    this.setState({ ...state, meshes }, `world: add worldMeshes record`);
  }
}

/**
 * Singleton instance
 */
export const threeAppStore = new ThreeAppStore();
