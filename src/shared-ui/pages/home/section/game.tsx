import { useEffect, useRef } from 'react';

import { Terrain } from '@/logic/domain/terrain';
import { DebugPanel } from '@/ui/panel/debug';
import { TurnPanel } from '@/ui/panel/turn';
import { EventHandler } from '@/ui/renderer/event-handler';
import { Initializer } from '@/ui/renderer/initializer';
import { renderPieces } from '@/ui/renderer/initializer/game';
import { World } from '@/ui/renderer/world';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initializer = new Initializer(canvas);
    initializer.start();

    const world = new World(Terrain.width, Terrain.height);
    initializer.scene.add(world);
    const pieces = renderPieces();
    pieces.map((pi) => world.add(pi));

    const meshes = {
      world,
      pieces,
    };

    new EventHandler(initializer.renderer, initializer.camera, meshes);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />

      <TurnPanel />
      <DebugPanel />
    </>
  );
}
