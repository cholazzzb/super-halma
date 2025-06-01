import { Position } from '../domain/position';

export type EndTurnData = {
  startPos: Position;
  endPos: Position;
};

export type TurnEventsCB = (event: 'turn:end-turn', data: EndTurnData) => void;
