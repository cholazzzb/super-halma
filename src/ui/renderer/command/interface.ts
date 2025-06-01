import { Piece } from '../piece';
import { Tile } from '../tile';

export interface Command {
  execute(mesh: Tile | Piece | undefined): void;
}
