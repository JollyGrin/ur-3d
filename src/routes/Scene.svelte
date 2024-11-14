<script lang="ts">
  import Cube from "$lib/components/Cube.svelte";
  import RollTray from "$lib/components/RollTray.svelte";
  import Stones from "$lib/components/Stones.svelte";
  import Camera from "./Camera.svelte";
  import Lights from "./Lights.svelte";
</script>

<Lights />
<Camera />

<RollTray position={[1, -0.05, -1]} player="p1" />
<RollTray position={[1, -0.05, 1]} player="p2" />

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
