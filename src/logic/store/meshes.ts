import { Listener, Store } from "@/shared-logic/store";
import { Piece } from "@/ui/renderer/piece";
import { Star } from "@/ui/renderer/star";
import { World } from "@/ui/renderer/world";
import { PositionId } from "../domain/position";
import { Terrain } from "../domain/terrain";

export type Meshes = {
  world: World;
  pieces: Array<Piece>;
  stars: Record<PositionId, Star>;
};

interface State {
  meshes: Meshes;
}

class MeshesStore extends Store<State> {
  constructor() {
    super({
      meshes: {
        world: new World(Terrain.width, Terrain.height),
        pieces: [],
        stars: {},
      },
    });
  }
  setMeshes(meshes: Meshes) {
    const state = { ...this.state };
    this.setState({ ...state, meshes }, `world: set worldMeshes record`);
  }
}

/**
 * Singleton instance
 */
export const meshesStore = new MeshesStore();

/**
 * Hook-compatible selector
 */
export function getMeshesState(): State {
  return meshesStore.getState();
}

/**
 * Hook-compatible subscribe function
 */
export function subscribeToMeshesStore(listener: Listener): () => void {
  return meshesStore.subscribe(listener);
}
