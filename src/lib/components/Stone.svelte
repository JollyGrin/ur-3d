<script lang="ts">
  import { forwardEventHandlers, T } from "@threlte/core";
  import { CylinderGeometry } from "three";
  import { interactivity, useCursor } from "@threlte/extras";
  import { spring } from "svelte/motion";

  interactivity();

  export let position = [0, 0, 0]; // Position above the cube, assuming cube height is 1
  export let color = 0xff0000; // Default stone color
  export let outlineColor = 0x000000; // Default outline color

  // Radius and height values for a beveled disc-like shape
  const topRadius = 0.35;
  const bottomRadius = 0.3;
  const height = 0.15; // Very thin to give a disc-like appearance
  const rotation = [Math.PI, 0, 0];

  const cylinderGeo = new CylinderGeometry(topRadius, bottomRadius, height, 32);

  const scale = spring(1);
  const { onPointerEnter, onPointerLeave } = useCursor();
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
