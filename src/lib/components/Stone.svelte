<script lang="ts">
  import { T } from "@threlte/core";
  import { CylinderGeometry } from "three";
  import { interactivity, useCursor } from "@threlte/extras";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  interactivity();

  export let color = 0xff0000; // Default stone color
  export let outlineColor = 0x000000; // Default outline color

  // Radius and height values for a beveled disc-like shape
  const topRadius = 0.35;
  const bottomRadius = 0.3;
  const height = 0.15; // Very thin to give a disc-like appearance
  const rotation = [Math.PI, 0, 0];

  const cylinderGeo = new CylinderGeometry(topRadius, bottomRadius, height, 32);

  const { onPointerEnter, onPointerLeave } = useCursor();

  export let position: [number, number, number] = [0, 0.21, 0]; // Initial position of the stone

  // let position = tweened(initialPosition, {
  //   duration: 600,
  //   easing: cubicOut,
  // });
  // // Watch the target position and animate when it changes
  // $: position.set([1, 4, 0]);
</script>

<!-- Stone as a beveled cylinder -->
<T.Mesh
  {position}
  {rotation}
  on:pointerenter={onPointerEnter}
  on:pointerleave={onPointerLeave}
  on:pointerenter={() => {
    color = 0x00f8ff;
  }}
  on:pointerleave={() => {
    color = 0xff0000;
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
