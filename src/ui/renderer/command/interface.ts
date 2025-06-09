import { FirePiece } from "../piece/fire-piece";
import { WaterPiece } from "../piece/water-piece";
import { Tile } from "../tile";

export type CommandMesh = Tile | FirePiece | WaterPiece | null;
export interface Command {
  execute(mesh: CommandMesh): void;
}
