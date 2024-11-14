export const START_Z_POSITION = 2;

type PositionType = [number, number, number];

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

export const ProgressionTrack = {
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
