import { get, writable } from "svelte/store";

type Roll = [number, number, number, number];
type FinishedStoneAmount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Player = {
  roll: Roll | null;
  finished: FinishedStoneAmount;
};
export type Players = {
  activePlayer: "p1" | "p2";
  players: { p1: Player; p2: Player };
};

const initPlayers: Players = {
  activePlayer: "p1",
  players: {
    p1: {
      roll: null,
      finished: 0,
    },
    p2: {
      roll: null,
      finished: 0,
    },
  },
};

export const playerStore = writable(initPlayers);

/**
 * Score a stone
 * */
export function incrementPlayerScore(player: Players["activePlayer"]) {
  playerStore.update((store) => {
    store.players[player].finished = (store.players[player].finished +
      1) as FinishedStoneAmount; // increment player score
    return store;
  });
}

/**
 * changes the active player
 * if no parameter, toggles
 * */
export function updateActivePlayer(newActivePlayer?: Players["activePlayer"]) {
  playerStore.update((store) => {
    const isP1 = store.activePlayer === "p1";
    store.activePlayer = newActivePlayer ?? (isP1 ? "p2" : "p1");

    return store;
  });
}

const randomBinary = () => Math.round(Math.random()) as 0 | 1;

/**
 * Rolls dice for selected player
 * */
export function updateRollDice(
  player: Players["activePlayer"],
  roll?: Roll | null,
) {
  const r = randomBinary;
  playerStore.update((store) => {
    if (roll === null) store.players[player].roll = null;
    if (roll === undefined) store.players[player].roll = [r(), r(), r(), r()];
    if (roll) store.players[player].roll = roll;
    return store;
  });
}

export const sumArray = (acc: number, value: number) => acc + value;

export function getDiceRoll(player: Players["activePlayer"]) {
  let roll: [number, number, number, number] | null = null;
  playerStore.subscribe(
    (e) => (roll = e.players[player].roll as [number, number, number, number]),
  );
  if (roll !== null) {
    const result = (roll as [number, number, number, number])?.reduce(
      (acc, value) => acc + value,
      0,
    );
    return result;
  }
}
