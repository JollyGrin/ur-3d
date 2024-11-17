import { writable } from "svelte/store";
import {
  BoardPositions,
  isFinalRosetta,
  isRosetta,
  ProgressionTrack,
  START_Z_POSITION,
} from "./constants";
import { incrementPlayerScore } from "./PlayerStore/store";

type PositionType = [number, number, number];
export type Token = {
  color: number;
  /**
   * x = progression
   * y = height (0.21 is surface)
   * z = lane: 2 = off, 1 = side, 0 = mid
   * */
  position: PositionType;
  id: string;
  lane: "left" | "right";
};

const BLUE = 0x0f91db;
const RED = 0xdb0f35;

// returns index of position in ProgressionTrack
function findPositionInProgressionTrack(
  position: PositionType,
  progressionTrackKey: "right" | "left",
): number | null {
  let progressionTrack = ProgressionTrack[progressionTrackKey];
  const index = progressionTrack.findIndex(
    (pos) =>
      pos[0] === position[0] &&
      pos[1] === position[1] &&
      pos[2] === position[2],
  );
  return index !== -1 ? index : null;
}

// Initialize tokens: 7 blue and 7 red, each with default position [0, 0, 0]
const initialTokens: Token[] = [
  ...Array.from({ length: 7 }).map((_, index) => ({
    color: BLUE,
    position: [-3 + index, -0.05, 2] as PositionType,
    id: `B${index}`,
    lane: "left" as const,
  })),
  ...Array.from({ length: 7 }).map((_, index) => ({
    color: RED,
    position: [-3 + index, -0.05, -2] as PositionType,
    id: `R${index}`,
    lane: "right" as const,
  })),
];
const initPositions = initialTokens.map((token) => token.position);

// Create a writable store to hold the tokens' data
export const tokensStore = writable(initialTokens);

export function updateTokenPosition(index: number, newPosition: PositionType) {
  tokensStore.update((tokens) => {
    tokens[index].position = newPosition;
    return tokens;
  });
}

/**
 * Checks a new position against existing tokens to find a collision
 * if collision exists, will return the token & index in tokens array
 * @return undefined | Token & {index: number}
 * */
function findCollision(tokens: Token[], newPosition: PositionType) {
  const collisions = tokens.filter((token) => {
    const [x, y, z] = token.position;
    return x === newPosition[0] && y === newPosition[1] && z === newPosition[2];
  });

  if (collisions.length > 0) {
    const [token] = collisions;
    const index = tokens.findIndex((e) => e.id === token.id);
    return { ...token, index }; // the stone to kick back to shelf
  }
}

export function moveForward(tokenIndex: number, amount = 0) {
  let goAgain = false;
  let illegalMove = false;
  let scored: Token | null = null;

  tokensStore.update((tokens) => {
    if (amount === 0) return tokens;
    const token = tokens[tokenIndex];

    // returns current index in the ProgressionTrack
    // with index, can increment forward without worrying about manual positions
    const progressionIndex = findPositionInProgressionTrack(
      token.position,
      token.lane,
    );
    // if (progressionIndex === null) return tokens;
    if (progressionIndex === null) {
      const newPosition = ProgressionTrack[token.lane][amount - 1];
      const hasCollision = findCollision(tokens, newPosition);
      if (hasCollision) {
        illegalMove = true; // if collision on home row, don't allow move
        return tokens;
      } // if collision on home territory,
      tokens[tokenIndex].position = newPosition;
      return tokens;
    }

    // if amount goes over last step, ignore movement
    if (progressionIndex + amount > 14) {
      illegalMove = true; // cannot move more than 1 step past last square
      return tokens;
    }

    // if exactly 14, score
    if (progressionIndex + amount === 14) {
      tokens[tokenIndex].position = [100, 0, 0];
      incrementPlayerScore(token.lane === "left" ? "p1" : "p2");
      return tokens;
    }

    // increment moves forward along the ProgressionTrack
    const newPosition = ProgressionTrack[token.lane][progressionIndex + amount];

    // check for collision at new position
    const collisionStone = findCollision(tokens, newPosition);

    if (collisionStone?.lane === token.lane) {
      illegalMove = true; // if collision with your own stones, illegal move
      return tokens;
    }

    // if collision stone is on Rosetta, do not move either stone
    // if collision and NOT on Rosseta, move collision_stone to shelf and move forward
    if (collisionStone && !isRosetta(collisionStone.position)) {
      if (tokens[collisionStone.index].lane === tokens[tokenIndex].lane)
        return tokens;

      // if collision stone is finished, don't reset collision
      // TODO: wont let me add 2 stones to finished
      // if overflow, make move illegal
      if (tokens[collisionStone.index].position[0] === 5) {
        tokens[tokenIndex].position = newPosition;
      } else {
        tokens[collisionStone.index].position =
          initPositions[collisionStone.index];
        tokens[tokenIndex].position = newPosition;
      }
    }

    // if no collision, move stone forward
    if (!collisionStone) {
      if (isRosetta(newPosition)) goAgain = true;
      tokens[tokenIndex].position = newPosition;
    }

    return tokens;
  });
  return { goAgain, illegalMove };
}
