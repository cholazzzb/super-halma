import { describe, expect, it } from 'vitest';

import { Move, MoveVariant } from './move';
import { MoveFinder } from './move-finder';
import { Position, PositionId } from './position';

describe('MoveFinder', () => {
  // Helper to create a piece map from an array of [x, y] tuples
  const createPieceMap = (
    positions: Array<[number, number]>,
  ): Set<PositionId> => {
    return new Set(positions.map(([x, y]) => new Position(x, y).toId()));
  };

  // Helper to convert a Move object to a comparable string for set comparisons
  const moveToComparableString = (move: Move): string => {
    const sequenceStr = move.sequence
      .map((p) => (typeof p === 'string' ? p : (p as Position).toId()))
      .join('->');
    return `${move.variant}:${move.startPos.toId()}=>${move.endPos.toId()}|seq:${sequenceStr}`;
  };

  // Helper to compare arrays of moves by converting them to sets of strings
  const expectMovesToMatch = (
    actualMoves: Array<Move>,
    expectedMoves: Array<Move>,
  ) => {
    const actualMoveStrings = new Set(actualMoves.map(moveToComparableString));
    const expectedMoveStrings = new Set(
      expectedMoves.map(moveToComparableString),
    );
    expect(actualMoveStrings).toEqual(expectedMoveStrings);
  };

  describe('findJumpMove', () => {
    // Cardinal Jumps
    it('should return a jump move when a single jump is possible (North)', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(3, 4); // North of start
      const landingPos = new Position(3, 5); // Further North

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    it('should correctly identify a jump to the South', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(3, 2); // South of start
      const landingPos = new Position(3, 1); // Further South

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    it('should correctly identify a jump to the East', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(4, 3); // East of start
      const landingPos = new Position(5, 3); // Further East

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    it('should correctly identify a jump to the West', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(2, 3); // West of start
      const landingPos = new Position(1, 3); // Further West

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    // Diagonal Jumps
    it('should correctly identify a jump to the North-East', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(4, 4); // NE of start
      const landingPos = new Position(5, 5); // Further NE

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    it('should correctly identify a jump to the North-West', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(2, 4); // NW of start
      const landingPos = new Position(1, 5); // Further NW

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    it('should correctly identify a jump to the South-East', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(4, 2); // SE of start
      const landingPos = new Position(5, 1); // Further SE

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    it('should correctly identify a jump to the South-West', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(2, 2); // SW of start
      const landingPos = new Position(1, 1); // Further SW

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedJumpMove = new Move(
        MoveVariant.jump,
        startPos,
        landingPos,
        [startPos, landingPos],
      );
      expectMovesToMatch(moves, [expectedJumpMove]);
    });

    // Edge Cases and Negative Scenarios
    it('should return an empty array if no pieces are on the map', () => {
      const startPos = new Position(3, 3);
      const map = createPieceMap([]); // Empty map
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);
      expectMovesToMatch(moves, []);
    });

    it('should return an empty array if no pieces are in an intermediate jumpable position', () => {
      const startPos = new Position(3, 3);
      // Pieces are present, but not 1 unit away in any of the 8 directions.
      const map = createPieceMap([
        [5, 3], // Piece is 2 units away East, no intermediate piece at (4,3)
        [3, 5], // Piece is 2 units away North, no intermediate piece at (3,4)
        [1, 1], // Piece is 2 units away SW diagonally, no intermediate piece at (2,2)
        [0, 3], // Piece is 3 units away West
        [6, 6], // Piece is 3 units away NE diagonally
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);
      expectMovesToMatch(moves, []);
    });

    it('should return an empty array if a piece can be jumped (cardinal) but the landing spot is occupied', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(3, 4); // North
      const landingPos = new Position(3, 5); // Landing spot

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
        [landingPos.x, landingPos.z], // Landing spot is occupied
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);
      expectMovesToMatch(moves, []);
    });

    it('should return an empty array if a piece can be jumped (diagonal) but the landing spot is occupied', () => {
      const startPos = new Position(3, 3);
      const pieceToJumpOverPos = new Position(4, 4); // NE
      const landingPos = new Position(5, 5); // Landing spot

      const map = createPieceMap([
        [pieceToJumpOverPos.x, pieceToJumpOverPos.z],
        [landingPos.x, landingPos.z], // Landing spot is occupied
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);
      expectMovesToMatch(moves, []);
    });

    it('should find multiple jump moves if available in different cardinal and diagonal directions', () => {
      const startPos = new Position(3, 3);

      // Jump 1 (North) - Available
      const pieceToJumpOverN = new Position(3, 4);
      const landingPosN = new Position(3, 5);

      // Jump 2 (East) - Available
      const pieceToJumpOverE = new Position(4, 3);
      const landingPosE = new Position(5, 3);

      // Jump 3 (South-West) - Available
      const pieceToJumpOverSW = new Position(2, 2);
      const landingPosSW = new Position(1, 1);

      // Jump 4 (North-East - but landing spot blocked)
      const pieceToJumpOverNE = new Position(4, 4);
      const landingPosNEBlocked = new Position(5, 5); // This spot will be occupied

      // Jump 5 (West - no piece to jump over at (2,3))
      // Jump 6 (South - piece to jump over at (3,2), but landing (3,1) is blocked)
      const pieceToJumpOverS = new Position(3, 2);
      const landingPosSBlocked = new Position(3, 1);

      const map = createPieceMap([
        [pieceToJumpOverN.x, pieceToJumpOverN.z],
        [pieceToJumpOverE.x, pieceToJumpOverE.z],
        [pieceToJumpOverSW.x, pieceToJumpOverSW.z],
        [pieceToJumpOverNE.x, pieceToJumpOverNE.z],
        [landingPosNEBlocked.x, landingPosNEBlocked.z], // Block NE jump's landing
        [pieceToJumpOverS.x, pieceToJumpOverS.z],
        [landingPosSBlocked.x, landingPosSBlocked.z], // Block S jump's landing
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);

      const expectedMoves = [
        new Move(MoveVariant.jump, startPos, landingPosN, [
          startPos,
          landingPosN,
        ]),
        new Move(MoveVariant.jump, startPos, landingPosE, [
          startPos,
          landingPosE,
        ]),
        new Move(MoveVariant.jump, startPos, landingPosE, [
          startPos,
          landingPosN,
          landingPosE,
        ]),
        new Move(MoveVariant.jump, startPos, landingPosSW, [
          startPos,
          landingPosSW,
        ]),
      ];
      expectMovesToMatch(moves, expectedMoves);
    });

    it('should return an empty array if the only piece to jump over is adjacent but its landing spot is blocked', () => {
      // This is a specific instance of "landing spot occupied"
      const startPos = new Position(0, 0);
      const adjacentPieceToJump = new Position(0, 1); // North
      const blockedLandingSpot = new Position(0, 2);

      const map = createPieceMap([
        [adjacentPieceToJump.x, adjacentPieceToJump.z],
        [blockedLandingSpot.x, blockedLandingSpot.z],
      ]);
      const moveFinder = new MoveFinder(map);
      const moves = moveFinder['findJumpMove'](startPos);
      expectMovesToMatch(moves, []);
    });

    describe('Multi-Jumps', () => {
      it('should find a two-step jump sequence (North, then North)', () => {
        const startPos = new Position(0, 0);
        const pieceToJump1 = new Position(0, 1);
        const intermediateLanding = new Position(0, 2);
        const pieceToJump2 = new Position(0, 3);
        const finalLanding = new Position(0, 4);

        const map = createPieceMap([
          [pieceToJump1.x, pieceToJump1.z],
          [pieceToJump2.x, pieceToJump2.z],
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        const expectedMove = new Move(
          MoveVariant.jump,
          startPos,
          finalLanding,
          [startPos, intermediateLanding, finalLanding],
        );
        expectMovesToMatch(moves, [
          new Move(MoveVariant.jump, startPos, intermediateLanding, [
            startPos,
            intermediateLanding,
          ]),
          expectedMove,
        ]);
      });

      it('should find a two-step jump sequence (North, then East)', () => {
        const startPos = new Position(0, 0);
        const pieceToJump1 = new Position(0, 1); // Jump North
        const intermediateLanding = new Position(0, 2);
        const pieceToJump2 = new Position(1, 2); // Jump East from (0,2)
        const finalLanding = new Position(2, 2);

        const map = createPieceMap([
          [pieceToJump1.x, pieceToJump1.z],
          [pieceToJump2.x, pieceToJump2.z],
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        const expectedMove = new Move(
          MoveVariant.jump,
          startPos,
          finalLanding,
          [startPos, intermediateLanding, finalLanding],
        );
        expectMovesToMatch(moves, [
          new Move(MoveVariant.jump, startPos, intermediateLanding, [
            startPos,
            intermediateLanding,
          ]),
          expectedMove,
        ]);
      });

      it('should return a single jump move if the second jump in a sequence is blocked', () => {
        const startPos = new Position(0, 0);
        const pieceToJump1 = new Position(0, 1);
        const intermediateLanding = new Position(0, 2);
        const pieceToJump2 = new Position(0, 3);
        const finalLandingBlocked = new Position(0, 4); // This spot is blocked

        const map = createPieceMap([
          [pieceToJump1.x, pieceToJump1.z],
          [pieceToJump2.x, pieceToJump2.z],
          [finalLandingBlocked.x, finalLandingBlocked.z], // Block the final landing
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        const expectedMove = new Move(
          MoveVariant.jump,
          startPos,
          intermediateLanding,
          [startPos, intermediateLanding],
        );
        expectMovesToMatch(moves, [expectedMove]);
      });

      it('should find multiple distinct multi-jump paths', () => {
        const startPos = new Position(0, 0);

        // Path 1: North, then North
        const pN1 = new Position(0, 1);
        const lN1 = new Position(0, 2);
        const pN2 = new Position(0, 3);
        const lN2 = new Position(0, 4);

        // Path 2: East, then East
        const pE1 = new Position(1, 0);
        const lE1 = new Position(2, 0);
        const pE2 = new Position(3, 0);
        const lE2 = new Position(4, 0);

        const map = createPieceMap([
          [pN1.x, pN1.z],
          [pN2.x, pN2.z],
          [pE1.x, pE1.z],
          [pE2.x, pE2.z],
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        const expectedMove1 = new Move(MoveVariant.jump, startPos, lN2, [
          startPos,
          lN1,
          lN2,
        ]);
        const expectedMove2 = new Move(MoveVariant.jump, startPos, lE2, [
          startPos,
          lE1,
          lE2,
        ]);
        expectMovesToMatch(moves, [
          new Move(MoveVariant.jump, startPos, lN1, [startPos, lN1]),
          expectedMove1,
          new Move(MoveVariant.jump, startPos, lE1, [startPos, lE1]),
          expectedMove2,
        ]);
      });

      it('should find a multi-jump path and a separate single jump path', () => {
        const startPos = new Position(0, 0);

        const pN1 = new Position(0, 1);
        const lN1 = new Position(0, 2);
        const pN2 = new Position(0, 3);
        const lN2 = new Position(0, 4);

        const pE1 = new Position(1, 0);
        const lE1 = new Position(2, 0);

        const map = createPieceMap([
          [pN1.x, pN1.z],
          [pN2.x, pN2.z],
          [pE1.x, pE1.z],
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        const expectedMultiJump = new Move(MoveVariant.jump, startPos, lN2, [
          startPos,
          lN1,
          lN2,
        ]);
        const expectedSingleJump = new Move(MoveVariant.jump, startPos, lE1, [
          startPos,
          lE1,
        ]);
        expectMovesToMatch(moves, [
          new Move(MoveVariant.jump, startPos, lN1, [startPos, lN1]),
          expectedMultiJump,
          expectedSingleJump,
        ]);
      });

      it('should handle branching multi-jumps (one intermediate step, two continuations)', () => {
        const startPos = new Position(0, 0);
        const pieceToJump1 = new Position(0, 1);
        const intermediateLanding = new Position(0, 2);

        const pieceToJumpA = new Position(0, 3); // North from intermediate
        const finalLandingA = new Position(0, 4);

        const pieceToJumpB = new Position(1, 2); // East from intermediate
        const finalLandingB = new Position(2, 2);

        const map = createPieceMap([
          [pieceToJump1.x, pieceToJump1.z],
          [pieceToJumpA.x, pieceToJumpA.z],
          [pieceToJumpB.x, pieceToJumpB.z],
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        const expectedMoveA = new Move(
          MoveVariant.jump,
          startPos,
          finalLandingA,
          [startPos, intermediateLanding, finalLandingA],
        );
        const expectedMoveB = new Move(
          MoveVariant.jump,
          startPos,
          finalLandingB,
          [startPos, intermediateLanding, finalLandingB],
        );
        expectMovesToMatch(moves, [
          new Move(MoveVariant.jump, startPos, intermediateLanding, [
            startPos,
            intermediateLanding,
          ]),
          expectedMoveA,
          expectedMoveB,
        ]);
      });

      it('should correctly stop a branch of a multi-jump if blocked, while allowing other branches', () => {
        const startPos = new Position(0, 0);
        const p1 = new Position(0, 1); // Jump to L1
        const l1 = new Position(0, 2);

        // Branch A from L1: North then North again
        const pA1 = new Position(0, 3); // Jump to LA1
        const lA1 = new Position(0, 4);
        const pA2 = new Position(0, 5); // Jump to LA2
        const lA2 = new Position(0, 6);

        // Branch B from L1: East, but its landing is blocked
        const pB1 = new Position(1, 2); // Jump to LB1 (blocked)
        const lB1Blocked = new Position(2, 2);

        const map = createPieceMap([
          [p1.x, p1.z],
          [pA1.x, pA1.z],
          [pA2.x, pA2.z], // Pieces for successful branch A
          [pB1.x, pB1.z], // Piece for branch B
          [lB1Blocked.x, lB1Blocked.z], // Block landing of branch B
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        expectMovesToMatch(moves, [
          new Move(MoveVariant.jump, startPos, l1, [startPos, l1]),
          new Move(MoveVariant.jump, startPos, lA1, [startPos, l1, lA1]),
          new Move(MoveVariant.jump, startPos, lA2, [startPos, l1, lA1, lA2]),
        ]);
      });

      it('should find a three-step jump sequence (e.g. N, NE, E)', () => {
        const startPos = new Position(0, 0);
        const p1 = new Position(0, 1); // N
        const l1 = new Position(0, 2);
        const p2 = new Position(1, 3); // NE from l1
        const l2 = new Position(2, 4);
        const p3 = new Position(3, 4); // E from l2
        const l3 = new Position(4, 4);

        const map = createPieceMap([
          [p1.x, p1.z],
          [p2.x, p2.z],
          [p3.x, p3.z],
        ]);
        const moveFinder = new MoveFinder(map);
        const moves = moveFinder['findJumpMove'](startPos);

        expectMovesToMatch(moves, [
          new Move(MoveVariant.jump, startPos, l1, [startPos, l1]),
          new Move(MoveVariant.jump, startPos, l2, [startPos, l1, l2]),
          new Move(MoveVariant.jump, startPos, l3, [startPos, l1, l2, l3]),
        ]);
      });
    });
  });
});
