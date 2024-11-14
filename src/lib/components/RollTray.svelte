<script lang="ts">
  import { T } from "@threlte/core";
  import { BoxGeometry, Euler, Group, MeshBasicMaterial } from "three";
  import { rotations } from "$lib/helpers/rotation_constants";
  import { playerStore, type Players } from "$lib/store/PlayerStore/store";
  import { onDestroy } from "svelte";
  export let position = [0, 0, 0];
  export let bgColor = 0x0d1320; // Outline color
  export let player: "p1" | "p2" = "p1";

  let successColor = 0xffffff; // Top overlay color
  let failColor = 0x4f4f4f; // Top overlay color

  let players: Players;
  let rolls: Players["players"]["p1"]["roll"] = [0, 0, 0, 0];
  const unsubscribe = playerStore.subscribe((value) => (players = value));
  onDestroy(() => unsubscribe());

  $: isActive = players.activePlayer === player;
  $: rolls = players.players[player].roll ?? [0, 0, 0, 0];
  const spin = (value: 0 | 1) => (value === 1 ? 45 : 225);
  $: spins = rolls.map((roll) => spin(roll as 0 | 1));

  // Reactive statement to adjust opacity based on isActive

  // Materials for each face of the tray
  const materials = Array.from({ length: 6 }).map(
    () =>
      new MeshBasicMaterial({
        color: bgColor,
        opacity: 1,
        transparent: true,
      }),
  );

  $: materials.forEach((material) => (material.opacity = isActive ? 1 : 0.25));
  $: position = [position[0], isActive ? 0 : -0.25, position[2]];

  materials[0].color.set(bgColor); // 2 = top face
  materials[1].color.set(bgColor); // 2 = top face
  materials[2].color.set(successColor); // 2 = top face
  materials[3].color.set(failColor); // 2 = top face
  materials[4].color.set(failColor); // 2 = top face
  materials[5].color.set(successColor); // 2 = top face

  const size = 0.25;
  const [x, y, z] = [size, size, size];
</script>

<T.Group {position}>
  {#each spins as spin, index}
    <T.Mesh
      position={[-0.25 + (index + 1) * (size + 0.05), 0, 0]}
      material={materials}
      rotation={[rotations[spin], 0, 0]}
      transparent
    >
      <T.BoxGeometry args={[x, y, z]} />
    </T.Mesh>
  {/each}
</T.Group>
