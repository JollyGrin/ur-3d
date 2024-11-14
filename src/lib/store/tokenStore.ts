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

const ProgressionTrack = {
  left: [
    ...BoardPositions.left.slice(0, 4),
    ...BoardPositions.mid,
    ...BoardPositions.left.slice(4, 6).reverse(),
  ],
  right: [
    ...BoardPositions.right.slice(0, 4),
    ...BoardPositions.mid,
    ...BoardPositions.right.slice(4, 6).reverse(),
  ],
};

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
