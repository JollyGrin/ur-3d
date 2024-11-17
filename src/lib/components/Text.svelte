<script lang="ts">
  import { T } from "@threlte/core";
  import { MeshBasicMaterial } from "three";
  import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
  import { rotations } from "$lib/helpers/rotation_constants";
  import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

  // Props for the component
  export let position: [number, number, number] = [0, 1, 0];
  export let color: number = 0x8e44ad; // Default color
  export let text: string = ""; // This is the reactive prop

  // Variables for font and geometry
  let font: any; // Type 'any' since FontLoader doesn't have a strict type definition
  let textGeometry: TextGeometry | null = null;

  // Create a new font loader and load the font (only once)
  const fontLoader = new FontLoader();
  fontLoader.load("/font.json", (loadedFont) => {
    font = loadedFont;
    createTextGeometry(); // Create the geometry when the font is loaded
  });

  // Reactive block to create text geometry whenever `text` prop changes
  $: if (font && text) {
    createTextGeometry(); // Only create geometry when `text` changes
  }

  // Function to create the TextGeometry
  function createTextGeometry(): void {
    if (textGeometry) {
      textGeometry.dispose(); // Dispose of the old geometry to free memory
    }

    if (font && text) {
      textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.2,
        height: 0.05,
        curveSegments: 12,
      });
      textGeometry.center(); // Optional, centers the text
    }
  }

  // Material for the text
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
