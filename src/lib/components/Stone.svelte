<script lang="ts">
  import { T } from "@threlte/core";
  import { CylinderGeometry } from "three";
  import { interactivity, useCursor } from "@threlte/extras";
  import { moveForward } from "$lib/store/tokenStore";
  import {
    playerStore,
    getDiceRoll,
    type Players,
    updateActivePlayer,
    updateRollDice,
    sumArray,
  } from "$lib/store/PlayerStore/store";
  import { onDestroy } from "svelte";

  interactivity();
  const { onPointerEnter, onPointerLeave } = useCursor();

  export let player: "p1" | "p2" = "p1";
  export let tokenIndex = 0;
  export let color = 0xff0000; // Default stone color
  let initialColor = color;
  export let outlineColor = 0x000000; // Default outline color

  const topRadius = 0.35;
  const bottomRadius = 0.3;
  const height = 0.15; // Very thin to give a disc-like appearance
  const rotation = [Math.PI, 0, 0];

  const cylinderGeo = new CylinderGeometry(topRadius, bottomRadius, height, 32);

  export let position: [number, number, number] = [0, 0.21, 0]; // Initial position of the stone

  let players: Players;
  const unsubscribe = playerStore.subscribe((value) => (players = value));
  onDestroy(() => unsubscribe());
  $: roll = players.players[player].roll; // rolls 4 dice
  $: sum = roll !== null ? roll.reduce(sumArray, 0) : null; // sums the values

  function move() {
    if (players.activePlayer === player && sum !== null) {
      const { goAgain, illegalMove } = moveForward(tokenIndex, sum);

      if (illegalMove) return;

      updateRollDice(player, null);

      if (!goAgain) {
        updateActivePlayer();
      }
    }
  }
</script>

<!-- Stone as a beveled cylinder -->
<T.Mesh
  {position}
  {rotation}
  on:click={move}
  on:pointerenter={onPointerEnter}
  on:pointerleave={onPointerLeave}
  on:pointerenter={() => {
    color = 0x00f8ff;
  }}
  on:pointerleave={() => {
    color = initialColor;
  }}
>
  <T.CylinderGeometry args={[topRadius, bottomRadius, height, 32]} />
  <T.MeshStandardMaterial {color} />
</T.Mesh>

<!-- Outline for the beveled cylinder -->
<T.LineSegments {position} {rotation}>
  <T.EdgesGeometry args={[cylinderGeo]} />
  <T.LineBasicMaterial color={outlineColor} />
</T.LineSegments>
