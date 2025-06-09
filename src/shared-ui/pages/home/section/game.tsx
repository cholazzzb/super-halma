import { Show } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import { isProd } from "@/shared-logic/env";
import { useEventEmitter } from "@/shared-logic/hook/event-emitter";
import { DebugPanel } from "@/ui/panel/debug";
import { Player1Panel } from "@/ui/panel/player-1";
import { Player2Panel } from "@/ui/panel/player-2";
import { TurnPanel } from "@/ui/panel/turn";
import { ThreeApp } from "@/ui/renderer/three-app";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const eventEmitter = useEventEmitter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const threeApp = new ThreeApp(canvas);

    eventEmitter("setup:render-world", { threeApp });
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
