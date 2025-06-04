/*
5.  **File Naming (Suggestion for Colleague)**:
    *   The current file name `victory.ts` is quite generic. If the primary purpose of this module/file is to generate these star conditions for determining victory, a more descriptive name like `victoryConditionGenerator.ts`, `starDistribution.ts`, or `gameSetup.ts` (depending on broader context) might be more appropriate. This change is outside the scope of the selection but is a good practice.

6.  **Class and Method Structure (Consideration for Colleague)**:
    *   The `Victory` class currently contains only a single static method (`genRandomCondition`).
    *   If this class is not intended to be instantiated or to hold state related to "victory," this method could potentially be a standalone utility function exported from the module (e.g., `export function generateRandomStarConditions(...)`).
    *   Alternatively, if `Victory` is meant to encapsulate more complex logic or state concerning victory conditions, then the current static method is a reasonable part of that class.

7.  **Configuration of Star Types (Consideration for Colleague)**:
    *   The list `[IndigoStar, TealStar, MagentaStar, SilverStar]` is hardcoded within the method.
    *   For greater flexibility (e.g., different game modes, levels, or easier updates), consider defining this list as a constant at a higher scope or passing it as an argument to `genRandomCondition`.
*/
import { IndigoStar, MagentaStar, SilverStar, Star, TealStar } from "./star";
import { Position, PositionId } from "./position"; // Assuming Position type is defined in './position'
import { Terrain } from "./terrain";
import { shuffleArr } from "@/shared-logic/random";

export class Victory {
  static genRandomCondition(totalStarsToDistribute = 10): Array<Star> {
    let remainingStars = totalStarsToDistribute;
    const StarConstructorsList = [
      IndigoStar,
      TealStar,
      MagentaStar,
      SilverStar,
    ];
    const starDistribution: Array<Star> = [];

    if (totalStarsToDistribute < 0) {
      throw new Error("");
    }

    // If totalStarsToDistribute is 0, the loop will correctly assign 0 stars to each type.
    // Each StarConstructor will be instantiated, 0 stars added, and pushed to starDistribution.

    for (let i = 0; i < StarConstructorsList.length; i++) {
      const StarConstructor = StarConstructorsList[i];
      const starInstance = new StarConstructor();
      let starsToAssign: number;

      if (i === StarConstructorsList.length - 1) {
        // Last star type gets all remaining stars
        starsToAssign = remainingStars;
      } else {
        // Assign a random number of stars, ensuring it's not all remaining stars
        // (unless remainingStars is 0 or 1, where Math.random() * remainingStars will be < 1, so floor is 0)
        starsToAssign = Math.floor(Math.random() * remainingStars);
        // The following line, present in the original selection, ensures starsToAssign is within [0, remainingStars].
        // Given the Math.floor(Math.random() * remainingStars) already produces a value in [0, remainingStars-1] (for remainingStars > 0),
        // Math.min(starsToAssign, remainingStars) would be starsToAssign.
        // However, to preserve the exact logic from the selection:
        starsToAssign = Math.max(0, Math.min(starsToAssign, remainingStars));
      }

      starInstance.addStar(starsToAssign);
      remainingStars -= starsToAssign;
      starDistribution.push(starInstance);
    }

    return starDistribution;
  }
}

/**
 * Generates a list of stars with their random positions on a board.
 */
export function generateStarPositions(
  piecesPos: Set<PositionId>,
  totalStarsToCreate = 3,
  boardWidth = Terrain.width,
  boardHeight = Terrain.height,
): Array<Position> {
  const allPossiblePositions: Array<Position> = [];
  for (let z = 0; z < boardHeight; z++) {
    for (let x = 0; x < boardWidth; x++) {
      const pos = Position.fromArray([x, z]);
      if (!piecesPos.has(pos.toId())) {
        allPossiblePositions.push(pos);
      }
    }
  }

  const shuffled = shuffleArr(allPossiblePositions);

  const starPositions: Array<Position> = [];
  for (let cnt = totalStarsToCreate; cnt > 0; cnt--) {
    const randomIdx = Math.floor(Math.random() * shuffled.length);
    starPositions.push(shuffled.splice(randomIdx, 1)[0]);
  }
  return starPositions;
}
