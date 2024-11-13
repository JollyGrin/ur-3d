<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import Stone from "$lib/components/Stone.svelte"; // Stone component for the token

  let color = 0xff0000;
</script>

<Stone initialPosition={[0, 2, 0]} {color} />
