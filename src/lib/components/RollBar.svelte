<script lang="ts">
  import { T } from "@threlte/core";
  import { MeshBasicMaterial } from "three";
  import {
    playerStore,
    updateRollDice,
    type Players,
  } from "$lib/store/PlayerStore/store";
  import { colors } from "$lib/helpers/color_constants";
  import { onDestroy } from "svelte";

  import { interactivity, useCursor } from "@threlte/extras";

  interactivity();
  const { onPointerEnter, onPointerLeave } = useCursor();

  export let player: "p1" | "p2" = "p1";

  const size = 0.25;
  let y = 0;
  let color = 0x8f8f8f; // Top overlay color
  let initialColor = 0xffffff; // Top overlay color

  let players: Players;
  let rolls: Players["players"]["p1"]["roll"] = [0, 0, 0, 0];
  const unsubscribe = playerStore.subscribe((value) => (players = value));
  onDestroy(() => unsubscribe());

  $: isActive = players.activePlayer === player;
  $: isRollReady = players.players[player].roll === null;

  $: rolls = players.players[player].roll ?? [0, 0, 0, 0];
  const spin = (value: 0 | 1) => (value === 1 ? 45 : 225);
  $: spins = rolls.map((roll) => spin(roll as 0 | 1));

  const materials = Array.from({ length: 6 }).map(
    () =>
      new MeshBasicMaterial({
        color: color,
        opacity: 1,
        transparent: true,
      }),
  );

  $: materials.forEach((material) => {
    material.opacity = isActive ? 1 : 0.25;
    if (isActive) material.color.set(colors.green);
    if (players.players[player].roll === null) material.color.set(colors.green);
    if (players.players[player].roll !== null) material.color.set(colors.blue);
  }); // transparent if inactive

  function rollDice() {
    if (isActive && isRollReady) updateRollDice(players.activePlayer);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.code === "Space") rollDice();
  }
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<T.Mesh
  position={[-0.25, y, 0]}
  material={materials}
  on:click={rollDice}
  on:pointerenter={onPointerEnter}
  on:pointerleave={onPointerLeave}
  on:pointerenter={() => {
    y = 0.05;
  }}
  on:pointerleave={() => {
    y = 0;
  }}
>
  <T.BoxGeometry args={[size / 2, size / 2, size * 2]} />
</T.Mesh>
