import { useEffect, useRef } from "react";

import { threeAppStore } from "@/logic/store/three-app";
import { useEventEmitter } from "@/shared-logic/hook/event-emitter";
import { Player1Panel } from "@/ui/panel/player-1";
import { Player2Panel } from "@/ui/panel/player-2";
import { TurnPanel } from "@/ui/panel/turn";
import { EventHandler } from "@/ui/renderer/event-handler";
import { ThreeApp } from "@/ui/renderer/three-app";
import { DebugPanel } from "@/ui/panel/debug";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const eventEmitter = useEventEmitter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const threeApp = new ThreeApp(canvas);
    threeApp.start();

    eventEmitter("setup:render-world", { threeApp });

    const { meshes } = threeAppStore.getState();
    if (!meshes) {
      throw Error("game.tsx: failed to get meshes record for eventHandler");
    }
    new EventHandler(threeApp.renderer, threeApp.camera, meshes);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />

      <TurnPanel />
      <DebugPanel />
      <Player1Panel />
      <Player2Panel />
    </>
  );
}
