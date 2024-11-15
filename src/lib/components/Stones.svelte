<script lang="ts">
  import Stone from "$lib/components/Stone.svelte"; // Stone component for the token
  import { tokensStore } from "$lib/store/tokenStore"; // Stone component for the token
  import type { Token } from "$lib/store/tokenStore"; // Stone component for the token
  import { onDestroy } from "svelte";

  let tokens: Token[];
  const unsubscribe = tokensStore.subscribe((value) => (tokens = value));

  onDestroy(() => unsubscribe());
</script>

{#each tokens as token, index}
  <Stone
    position={token.position}
    color={token.color}
    tokenIndex={index}
    player={token.lane === "left" ? "p1" : "p2"}
  />
{/each}
