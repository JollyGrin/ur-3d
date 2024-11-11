<script lang="ts">
  import { T } from "@threlte/core";
  import { BoxGeometry, MeshBasicMaterial } from "three";
  export let position = [0, 0, 0];
  export let color = 0x8e44ad; // Default color
  export let outlineColor = 0x000000; // Default outline color
  export let topFaceColor = 0xff5733; // Color for the top overlay

  const materials = Array.from({ length: 6 }).map(
    () => new MeshBasicMaterial({ color }),
  );
  materials[2].color.set(topFaceColor); // 2 = top face

  const boxGeometry = new BoxGeometry(1, 1, 1);
</script>

<T.Mesh {position} material={materials}>
  <T.BoxGeometry args={[1, 1, 1]} />
  <!-- <T.MeshBasicMaterial {color} /> -->
</T.Mesh>

<T.LineSegments {position}>
  <T.EdgesGeometry attach="geometry" args={[boxGeometry]} />
  <T.LineBasicMaterial color={outlineColor} linewidth={1} />
</T.LineSegments>
