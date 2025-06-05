import { useEffect, useRef } from "react";

import { meshesStore } from "@/logic/store/meshes";
import { useEventEmitter } from "@/shared-logic/hook/event-emitter";
import { DebugPanel } from "@/ui/panel/debug";
import { Player1Panel } from "@/ui/panel/player-1";
import { Player2Panel } from "@/ui/panel/player-2";
import { TurnPanel } from "@/ui/panel/turn";
import { EventHandler } from "@/ui/renderer/event-handler";
import { ThreeApp } from "@/ui/renderer/three-app";
import { Show } from "@chakra-ui/react";
import { isProd } from "@/shared-logic/env";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const eventEmitter = useEventEmitter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const threeApp = new ThreeApp(canvas);
    threeApp.start();

    eventEmitter("setup:render-world", { threeApp });

    const { meshes } = meshesStore.getState();
    if (!meshes) {
      throw Error("game.tsx: failed to get meshes record for eventHandler");
    }
    new EventHandler(threeApp.renderer, threeApp.camera, meshes);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />

      <TurnPanel />
      <Player1Panel />
      <Player2Panel />

      <Show when={!isProd}>
        <DebugPanel />
      </Show>
    </>
  );
}
