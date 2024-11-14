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

const randomBinary = () => Math.round(Math.random());

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

export function getDiceRoll(player: Players["activePlayer"]) {
  return get(playerStore).players[player].roll?.reduce(
    (acc, value) => acc + value,
    0,
  );
}
