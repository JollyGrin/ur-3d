import { writable } from "svelte/store";
import { START_Z_POSITION } from "./constants";

type PositionType = [number, number, number];
export type Token = {
  color: number;
  position: PositionType;
  id: string;
  lane: "left" | "right";
};

const BLUE = 0x0f91db;
const RED = 0xdb0f35;

// Sorts the left/right sides to have 0 be the start
function sortSides(a?: PositionType, b?: PositionType): number {
  if (!a || !b) return 0;
  if (a[0] <= 0) return b[0] - a[0]; // if before the gap, reverse sort
  if (a[0] > 3) return a[0] - b[0];
  return 0;
}

export const BoardPositions = {
  left: Array.from({ length: 6 })
    .map((_, index) => {
      let mod = 0;
      if (index > 3) mod = index + 2; // skips blank space
      if (index <= 3) mod = index;
      return [-3 + mod, 0.21, 1] as PositionType;
    })
    .sort(sortSides),
  mid: Array.from({ length: 8 }).map(
    (_, index) => [-3 + index, 0.21, 0] as PositionType,
  ),
  right: Array.from({ length: 6 })
    .map((_, index) => {
      let mod = 0;
      if (index > 3) mod = index + 2; // skips blank space
      if (index <= 3) mod = index;
      return [-3 + mod, 0.21, -1] as PositionType;
    })
    .sort(sortSides),
};

const ProgressionTrackLeft = [
  ...BoardPositions.left.slice(0, 4),
  ...BoardPositions.mid,
  ...BoardPositions.left.slice(4, 6).toReversed(),
];

const ProgressionTrackRight = [
  ...BoardPositions.right.slice(0, 4),
  ...BoardPositions.mid,
  ...BoardPositions.right.slice(4, 6).toReversed(),
];

function findPositionInProgressionTrack(
  position: PositionType,
  progressionTrackKey: "right" | "left",
): number | null {
  console.log({ position, progressionTrackKey });
  let progressionTrack;
  if (progressionTrackKey === "left") progressionTrack = ProgressionTrackLeft;
  if (progressionTrackKey === "right") progressionTrack = ProgressionTrackRight;
  if (!progressionTrack) return null;
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
    console.log(tokens[tokenIndex].position);
    console.log(BoardPositions.left);

    /**
     * x = progression
     * y = height (0.21 is surface)
     * z = lane: 2 = off, 1 = side, 0 = mid
     * */
    const [x, y, z] = token.position;
    const sideKey = token.lane;
    console.log({ x, y, z });

    // if on the off shelf
    if (Math.abs(z) === START_Z_POSITION) {
      tokens[tokenIndex].position = BoardPositions[sideKey][0];
      return tokens;
    }

    // if on the side lane
    const pos = findPositionInProgressionTrack(token.position, sideKey);

    if (pos !== null) {
      tokens[tokenIndex].position =
        sideKey === "left"
          ? ProgressionTrackLeft[pos + amount]
          : ProgressionTrackRight[pos + amount];
    }

    return tokens;
  });
}
