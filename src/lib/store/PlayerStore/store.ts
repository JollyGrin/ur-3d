import { get, writable } from "svelte/store";

type Roll = [number, number, number, number];
export type Player = {
  roll: Roll | null;
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
    },
    p2: {
      roll: null,
    },
  },
};

export const playerStore = writable(initPlayers);

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
    console.log(roll);
    const result = (roll as [number, number, number, number])?.reduce(
      (acc, value) => acc + value,
      0,
    );
    return result;
  }
}
