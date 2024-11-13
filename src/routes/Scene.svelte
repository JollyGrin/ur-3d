<script lang="ts">
  import Cube from "$lib/components/Cube.svelte";
  import Stone from "$lib/components/Stone.svelte";
  import Stones from "$lib/components/Stones.svelte";
  import Camera from "./Camera.svelte";
  import Lights from "./Lights.svelte";
</script>

<Lights />
<Camera />

<!-- Left Lane -->
{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
  {#if ![4, 5].includes(slotNumber)}
    <Cube position={[-3 + slotNumber, 0, 1]} />
  {/if}
{/each}

<!-- Middle Lane -->
{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
  <Cube position={[-3 + slotNumber, 0, 0]} />
{/each}

<!-- Right Lane -->
{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
  {#if ![4, 5].includes(slotNumber)}
    <Cube position={[-3 + slotNumber, 0, -1]} />
  {/if}
{/each}

<Stones />
