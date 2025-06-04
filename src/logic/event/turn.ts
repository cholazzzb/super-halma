import { PlayerId } from "../domain/player";
import { Position } from "../domain/position";
import { StarColor } from "../domain/star";

export type TurnEventsCB =
  | ((
      event: "turn:end-turn",
      data: {
        startPos: Position;
        endPos: Position;
      },
    ) => void)
  | ((
      event: "turn:add-star-to-player",
      data: { playerId: PlayerId; color: StarColor },
    ) => void);
