# `src/three/models/`

React components that wrap **GLTF/GLB models** live here (one file per model).

## Workflow

1. Export the model from Blender as `.glb` (Draco or Meshopt compressed, textures ≤ 2K).
2. Place the file in `public/models/` (e.g. `public/models/csi-bot.glb`).
3. Generate a typed-free JSX component with:

   ```bash
   npx gltfjsx public/models/csi-bot.glb --output src/three/models/CsiBot.jsx --transform
   ```

4. Import the component inside a scene in `src/three/scenes/`.
5. Call `useGLTF.preload('/models/csi-bot.glb')` at the bottom of the model file.

> `gltfjsx` is run with `npx` on demand — it is **not** a project dependency.
