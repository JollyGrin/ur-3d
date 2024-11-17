<script lang="ts">
  import { T } from "@threlte/core";
  import { MeshBasicMaterial } from "three";
  import { FontLoader } from "three/examples/jsm/Addons.js";
  import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
  import { rotations } from "$lib/helpers/rotation_constants";

  export let position = [0, 1, 0];
  export let color = 0x8e44ad; // Default color
  export let text = "";

  // Load the font and create the text geometry
  const fontLoader = new FontLoader();
  let textGeometry: TextGeometry;

  fontLoader.load("/font.json", (font) => {
    textGeometry = new TextGeometry(text, {
      font,
      size: 0.2,
      height: 0.05,
      curveSegments: 12,
    });
    textGeometry.center(); // Optional, centers the text
  });

  const textMaterial = new MeshBasicMaterial({ color: color ?? 0xffffff });
</script>

{#if textGeometry}
  <T.Mesh
    rotation={[-rotations[90], rotations[0], rotations[90]]}
    geometry={textGeometry}
    material={textMaterial}
    {position}
  />
{/if}
