import { writable } from "svelte/store";
import {
  BoardPositions,
  ProgressionTrack,
  START_Z_POSITION,
} from "./constants";

type PositionType = [number, number, number];
export type Token = {
  color: number;
  position: PositionType;
  id: string;
  lane: "left" | "right";
};

const BLUE = 0x0f91db;
const RED = 0xdb0f35;

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

// Create a writable store to hold the tokens' data
export const tokensStore = writable(initialTokens);

export function updateTokenPosition(index: number, newPosition: PositionType) {
  tokensStore.update((tokens) => {
    tokens[index].position = newPosition;
    return tokens;
  });
}

export function moveForward(tokenIndex: number, amount = 1) {
  tokensStore.update((tokens) => {
    const token = tokens[tokenIndex];

    /**
     * x = progression
     * y = height (0.21 is surface)
     * z = lane: 2 = off, 1 = side, 0 = mid
     * */
    const [x, y, z] = token.position;
    const sideKey = token.lane;
    console.log({ x, y, z });

    // if from starting shelf (off board -> onto board)
    if (Math.abs(z) === START_Z_POSITION) {
      tokens[tokenIndex].position = BoardPositions[sideKey][0];
      return tokens;
    }

    // TODO: if collision, knock off other stone
    // except if [3,y,0] (above single lane)

    // TODO: add star points which give you double turn

    // if on the side lane
    const pos = findPositionInProgressionTrack(token.position, sideKey);
    if (pos !== null) {
      tokens[tokenIndex].position = ProgressionTrack[sideKey][pos + amount];
    }

    return tokens;
  });
}
