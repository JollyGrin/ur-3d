<script>
  import { T } from "@threlte/core";
  import { CylinderGeometry } from "three";

  export let position = [0, 0.75, 0]; // Position above the cube, assuming cube height is 1
  export let color = 0xff0000; // Default stone color
  export let outlineColor = 0x000000; // Default outline color
  // Radius and height values for a beveled disc-like shape
  const topRadius = 0.35;
  const bottomRadius = 0.3;
  const height = 0.15; // Very thin to give a disc-like appearance
  const rotation = [Math.PI, 0, 0];

  const cylinderGeo = new CylinderGeometry(topRadius, bottomRadius, height, 32);
</script>

<!-- Stone as a beveled cylinder -->
<T.Mesh {position} {rotation}>
  <T.CylinderGeometry args={[topRadius, bottomRadius, height, 32]} />
  <T.MeshStandardMaterial {color} />
</T.Mesh>

<!-- Outline for the beveled cylinder -->
<T.LineSegments {position} {rotation}>
  <T.EdgesGeometry args={[cylinderGeo]} />
  <T.LineBasicMaterial color={outlineColor} />
</T.LineSegments>
