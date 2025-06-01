import { Piece } from '../domain/piece';
import { Player } from '../domain/player';
import { Position } from '../domain/position';

export type Setup2PlayersData = {
  player1: Player;
  player2: Player;
  positions: Array<[Piece, Position]>;
};
export type SetupEventsCb = (
  event: 'setup:2-players',
  data: Setup2PlayersData,
) => void;
