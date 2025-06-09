import { assets } from "@/data/asset";
import { Listener, Store } from "@/shared-logic/store";
import { FirePiece } from "@/ui/renderer/piece/fire-piece";
import { WaterPiece } from "@/ui/renderer/piece/water-piece";
import { Star } from "@/ui/renderer/star";
import { World } from "@/ui/renderer/world";
import { PositionId } from "../domain/position";

export type Meshes = {
  world: World | null;
  pieces: Array<FirePiece | WaterPiece>;
  stars: Record<PositionId, Star>;
};

interface State {
  meshes: Meshes;
  loaded: number;
  unloaded: number;
}

class MeshesStore extends Store<State> {
  constructor() {
    super({
      meshes: {
        world: null,
        pieces: [],
        stars: {},
      },
      loaded: 0,
      unloaded: assets.length,
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
