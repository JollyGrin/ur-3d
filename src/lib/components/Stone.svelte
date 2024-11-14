<script lang="ts">
  import { T } from "@threlte/core";
  import { CylinderGeometry } from "three";
  import { interactivity, useCursor } from "@threlte/extras";
  import { updateTokenPosition, moveForward } from "$lib/store/tokenStore";
  import { BoardPositions } from "$lib/store/constants";

  interactivity();

  export let tokenIndex = 0;
  export let color = 0xff0000; // Default stone color
  let initialColor = color;
  export let outlineColor = 0x000000; // Default outline color

  const topRadius = 0.35;
  const bottomRadius = 0.3;
  const height = 0.15; // Very thin to give a disc-like appearance
  const rotation = [Math.PI, 0, 0];

  const cylinderGeo = new CylinderGeometry(topRadius, bottomRadius, height, 32);

  const { onPointerEnter, onPointerLeave } = useCursor();

  export let position: [number, number, number] = [0, 0.21, 0]; // Initial position of the stone

  function move() {
    moveForward(tokenIndex, 1);
  }
</script>

<!-- Stone as a beveled cylinder -->
<T.Mesh
  {position}
  {rotation}
  on:click={move}
  on:pointerenter={onPointerEnter}
  on:pointerleave={onPointerLeave}
  on:pointerenter={() => {
    color = 0x00f8ff;
  }}
  on:pointerleave={() => {
    color = initialColor;
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
