<script lang="ts">
  import Cube from "$lib/components/Cube.svelte";
  import RollTray from "$lib/components/RollTray.svelte";
  import Stones from "$lib/components/Stones.svelte";
  import Text from "$lib/components/Text.svelte";
  import { get } from "svelte/store";
  import Camera from "./Camera.svelte";
  import Lights from "./Lights.svelte";
  import { playerStore } from "$lib/store/PlayerStore/store";

  let players;
  $: players = $playerStore;
  console.log({ players });
</script>

<Lights />
<Camera />

<Text position={[2.35, 0.1, 1]} text={`${players.players.p1.finished}/7`} />
<Text position={[2.35, 0.1, -1]} text={`${players.players.p2.finished}/7`} />

<RollTray position={[1, -0.05, -1]} player="p2" />
<RollTray position={[1, -0.05, 1]} player="p1" />

<!-- Left Lane -->
{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
  {#if [0, 6].includes(slotNumber)}
    <Cube position={[-3 + slotNumber, 0, 1]} topFaceColor={0xdb0f35} />
  {/if}

  {#if ![0, 4, 5, 6].includes(slotNumber)}
    <Cube position={[-3 + slotNumber, 0, 1]} />
  {/if}
{/each}

<!-- Middle Lane -->
{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
  {#if ![3].includes(slotNumber)}
    <Cube position={[-3 + slotNumber, 0, 0]} />
  {:else}
    <Cube position={[-3 + slotNumber, 0, 0]} topFaceColor={0xdb0f35} />
  {/if}
{/each}

<!-- Right Lane -->
{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
  {#if [0, 6].includes(slotNumber)}
    <Cube position={[-3 + slotNumber, 0, -1]} topFaceColor={0xdb0f35} />
  {/if}

  {#if ![0, 4, 5, 6].includes(slotNumber)}
    <Cube position={[-3 + slotNumber, 0, -1]} />
  {/if}
{/each}

<Stones />
