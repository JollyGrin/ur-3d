const STONE_Y = 0.21;
export const START_Z_POSITION = 2;

type PositionType = [number, number, number];

// Sorts the left/right sides to have 0 be the start
function sortSides(a?: PositionType, b?: PositionType): number {
  if (!a || !b) return 0;
  if (a[0] <= 0) return b[0] - a[0]; // if before the gap, reverse sort
  if (a[0] > 3) return a[0] - b[0];
  return 0;
}

export const RosettaBoardPositions = [
  [-3, STONE_Y, 1],
  [3, STONE_Y, 1],
  [-3, STONE_Y, -1],
  [3, STONE_Y, -1],
  [0, STONE_Y, 0],
];
export function isRosetta(position: PositionType) {
  return RosettaBoardPositions.some((pos) => {
    return (
      pos[0] === position[0] && pos[1] === position[1] && pos[2] === position[2]
    );
  });
}
export function isFinalRosetta(position: PositionType, lane: "left" | "right") {
  const match = position[0] === 3 && position[1] === STONE_Y;
  if (!match) return false;
  if (lane === "left") {
    return position[2] === -1;
  } else {
    return position[2] === 1;
  }
}

export const BoardPositions = {
  left: Array.from({ length: 6 })
    .map((_, index) => {
      let mod = 0;
      if (index > 3) mod = index + 2; // skips blank space
      if (index <= 3) mod = index;
      return [-3 + mod, STONE_Y, 1] as PositionType;
    })
    .sort(sortSides),
  mid: Array.from({ length: 8 }).map(
    (_, index) => [-3 + index, STONE_Y, 0] as PositionType,
  ),
  right: Array.from({ length: 6 })
    .map((_, index) => {
      let mod = 0;
      if (index > 3) mod = index + 2; // skips blank space
      if (index <= 3) mod = index;
      return [-3 + mod, STONE_Y, -1] as PositionType;
    })
    .sort(sortSides),
};

export const ProgressionTrack = {
  left: [
    ...BoardPositions.left.slice(0, 4),
    ...BoardPositions.mid,
    ...BoardPositions.left.slice(4, 6).reverse(),
    [5, 0, 1] as PositionType,
  ],
  right: [
    ...BoardPositions.right.slice(0, 4),
    ...BoardPositions.mid,
    ...BoardPositions.right.slice(4, 6).reverse(),

    [5, 0, -1] as PositionType,
  ],
};
