import { Asset } from "@/data/asset";
import { Position, PositionId } from "@/logic/domain/position";
import { playerStore } from "@/logic/store/player";
import { worldStore } from "@/logic/store/world";
import { logger } from "@/shared-logic/logger";
import { AssetManager } from "../asset-manager";
import { FirePiece } from "../piece/fire-piece";
import { WaterPiece } from "../piece/water-piece";

export function renderPieces(assetManager: AssetManager) {
  const { pieces } = worldStore.getState();
  const { players } = playerStore.getState();
  const res: Array<FirePiece | WaterPiece> = [];

  for (const posId of Object.keys(pieces)) {
    const positionId = posId as PositionId;
    const position = Position.fromId(positionId);
    const ownerId = pieces[positionId].ownerId;
    const player = players[ownerId];

    const piece = createPiece(player.pieceModelName, position, assetManager);

    res.push(piece);
  }

  return res;
}

function createPiece(
  modelName: Asset["name"],
  position: Position,
  assetManager: AssetManager,
): FirePiece | WaterPiece {
  switch (modelName) {
    case "fire-piece": {
      return new FirePiece(position, assetManager);
    }
    case "water-piece": {
      return new WaterPiece(position, assetManager);
    }

    default: {
      logger.error("create piece, unknown model name: " + modelName);
      return new FirePiece(position, assetManager);
    }
  }
}
