import { Piece } from "@/logic/domain/piece";
import { Player } from "@/logic/domain/player";
import { Position } from "@/logic/domain/position";

export const player1 = new Player(0xff0000, 0xdd3344, "fire-piece");
export const player2 = new Player(0x0000ff, 0x3344dd, "water-piece");

export const positions: Array<[Piece, Position]> = [
  // Player 1
  [new Piece(player1.id), Position.fromArray([9, 9])],
  [new Piece(player1.id), Position.fromArray([8, 9])],
  [new Piece(player1.id), Position.fromArray([7, 9])],
  [new Piece(player1.id), Position.fromArray([6, 9])],
  [new Piece(player1.id), Position.fromArray([5, 9])],

  [new Piece(player1.id), Position.fromArray([9, 8])],
  [new Piece(player1.id), Position.fromArray([8, 8])],
  [new Piece(player1.id), Position.fromArray([7, 8])],
  [new Piece(player1.id), Position.fromArray([6, 8])],

  [new Piece(player1.id), Position.fromArray([9, 7])],
  [new Piece(player1.id), Position.fromArray([8, 7])],
  [new Piece(player1.id), Position.fromArray([7, 7])],

  [new Piece(player1.id), Position.fromArray([9, 6])],
  [new Piece(player1.id), Position.fromArray([8, 6])],

  [new Piece(player1.id), Position.fromArray([9, 5])],

  // Player 2
  [new Piece(player2.id), Position.fromArray([0, 0])],
  [new Piece(player2.id), Position.fromArray([1, 0])],
  [new Piece(player2.id), Position.fromArray([2, 0])],
  [new Piece(player2.id), Position.fromArray([3, 0])],
  [new Piece(player2.id), Position.fromArray([4, 0])],

  [new Piece(player2.id), Position.fromArray([0, 1])],
  [new Piece(player2.id), Position.fromArray([1, 1])],
  [new Piece(player2.id), Position.fromArray([2, 1])],
  [new Piece(player2.id), Position.fromArray([3, 1])],

  [new Piece(player2.id), Position.fromArray([0, 2])],
  [new Piece(player2.id), Position.fromArray([1, 2])],
  [new Piece(player2.id), Position.fromArray([2, 2])],

  [new Piece(player2.id), Position.fromArray([0, 3])],
  [new Piece(player2.id), Position.fromArray([1, 3])],

  [new Piece(player2.id), Position.fromArray([0, 4])],
];
