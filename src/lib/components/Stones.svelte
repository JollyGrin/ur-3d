<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import Stone from "$lib/components/Stone.svelte"; // Stone component for the token

  const BLUE = 0x0f91db;
  const RED = 0xdb0f35;
  let color = 0xff0000;
</script>

{#each Array.from({ length: 7 }).map((_, i) => i) as slotNumber}
  <Stone position={[-3 + slotNumber, -0.05, 2]} color={RED} />
{/each}

{#each Array.from({ length: 7 }).map((_, i) => i) as slotNumber}
  <Stone position={[-3 + slotNumber, -0.05, -2]} color={BLUE} />
{/each}
