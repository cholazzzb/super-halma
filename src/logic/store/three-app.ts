import { Store } from "@/shared-logic/store";
import { ThreeApp } from "@/ui/renderer/three-app";

interface State {
  threeApp: ThreeApp | undefined;
}

class ThreeAppStore extends Store<State> {
  constructor() {
    super({
      threeApp: undefined,
    });
  }

  setThreeApp(threeApp: ThreeApp) {
    const state = { ...this.state };
    this.setState({ ...state, threeApp }, `three app: add threeApp instance`);
  }
}

/**
 * Singleton instance
 */
export const threeAppStore = new ThreeAppStore();
