<script lang="ts">
  import { forwardEventHandlers, T } from "@threlte/core";
  import { interactivity, useCursor } from "@threlte/extras";

  import { spring, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import Stone from "$lib/components/Stone.svelte"; // Stone component for the token

  interactivity();
  let color = 0x000000;
  const scale = spring(1);
  const component = forwardEventHandlers();
  const { onPointerEnter, onPointerLeave } = useCursor();

  export let initialPosition: [number, number, number] = [0, 0.5, 0]; // Initial position of the stone
  export let targetPosition: [number, number, number] = initialPosition; // Target position for animation

  // Define a tweened store for the position with cubicOut easing
  let position = tweened(initialPosition, { duration: 600, easing: cubicOut });

  // Watch the target position and animate when it changes
  $: position.set(targetPosition);

  // Function to handle click event and move the stone
  function handleStoneClick() {
    // Change target position on click. Adjust as needed.
    targetPosition = [Math.random() * 4 - 2, 0.5, Math.random() * 2 - 1]; // Random position for demo
  }
</script>

<!-- Stone Component with Animated Position -->
<T.Mesh
  position={$position}
  on:click={handleStoneClick}
  on:pointerenter={onPointerEnter}
  on:pointerleave={onPointerLeave}
  on:pointerenter={() => {
    color = "#FE3D00";
  }}
  on:pointerleave={() => {
    color = "white";
  }}
>
  <Stone position={[0, 0, 0]} {color} />
  <!-- The Stone component remains inside the mesh -->
</T.Mesh>
