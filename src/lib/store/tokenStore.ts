import { writable } from "svelte/store";

type PositionType = [number, number, number];
export type Token = {
  color: number;
  position: PositionType;
  id: string;
};

const BLUE = 0x0f91db;
const RED = 0xdb0f35;

export const BoardPositions = {
  left: Array.from({ length: 6 })
    .map((_, index) => {
      let mod = 0;
      if (index > 3) mod = index + 2;
      if (index <= 3) mod = index;
      return [-3 + mod, 0.21, 1] as PositionType;
    })
    .sort((a, b) => {
      if (a[0] <= 0) return b[0] - a[0];
      if (a[0] > 3) return a[0] - b[0];
    }),
  mid: Array.from({ length: 8 }).map(
    (_, index) => [-3 + index, 0.21, 0] as PositionType,
  ),
  right: Array.from({ length: 6 }).map((_, index) => {
    let mod = 0;
    if (index > 3) mod = index + 2;
    if (index <= 3) mod = index;
    return [-3 + mod, 0.21, -1] as PositionType;
  }),
};

// Initialize tokens: 7 blue and 7 red, each with default position [0, 0, 0]
const initialTokens: Token[] = [
  ...Array.from({ length: 7 }).map((_, index) => ({
    color: BLUE,
    position: [-3 + index, -0.05, 2] as PositionType,
    id: `B${index}`,
  })),
  ...Array.from({ length: 7 }).map((_, index) => ({
    color: RED,
    position: [-3 + index, -0.05, -2] as PositionType,
    id: `R${index}`,
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
    const [x, y, z] = token.position;
    console.log({ x, y, z });

    if (Math.abs(z) === 2) {
      tokens[tokenIndex].position = BoardPositions.left[0];
    }

    return tokens;
  });
}
