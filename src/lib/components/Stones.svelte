<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import Stone from "$lib/components/Stone.svelte"; // Stone component for the token

  let color = 0xff0000;

  export let initialPosition: [number, number, number] = [1, 3, 0]; // Initial position of the stone
  export let targetPosition: [number, number, number] = [1, 2, 0]; // Target position for animation

  // Define a tweened store for the position with cubicOut easing
  let position = tweened(initialPosition, { duration: 600, easing: cubicOut });
  // Watch the target position and animate when it changes
  $: position.set(targetPosition);
</script>

<!-- Stone Component with Animated Position -->

<Stone position={$position} {color} />
<!-- The Stone component remains inside the mesh -->
