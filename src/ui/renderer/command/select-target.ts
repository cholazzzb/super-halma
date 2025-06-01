import { Position } from '@/logic/domain/position';
import { logic } from '@/logic/main';
import { RaycasterHandler } from '../raycaster-handler';
import { Tile } from '../tile';
import { Command } from './interface';

const eventBus = logic.eventBus;

export class SelectTargetCommand implements Command {
  constructor(private raycasterHandler: RaycasterHandler) {}

  execute(mesh: Tile): void {
    const isValid =
      this.raycasterHandler.targetsObj.filter(
        (to) =>
          to.position.x === mesh.position.x &&
          to.position.z === mesh.position.z,
      ).length > 0;

    if (!isValid) return;

    const activeObj = this.raycasterHandler.activeObj!;
    const startPos = Position.fromArray([
      activeObj.position.x,
      activeObj.position.z,
    ]);

    const endPos = Position.fromArray([mesh.position.x, mesh.position.z]);
    this.raycasterHandler.activeObj?.position.set(
      endPos.x,
      mesh.position.y,
      endPos.z,
    );

    this.raycasterHandler.activeObj?.active(false);
    this.raycasterHandler.activeObj = null;
    this.raycasterHandler.targetsObj.forEach((to) => {
      to.targeted(false);
    });
    this.raycasterHandler.targetsObj = [];
    eventBus.emit('turn:end-turn', {
      startPos,
      endPos,
    });
  }
}
