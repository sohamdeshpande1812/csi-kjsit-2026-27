# `public/` — static assets

Served as-is from the site root (e.g. `public/models/x.glb` → `/models/x.glb`).

| Folder      | Contents                                                      |
| ----------- | ------------------------------------------------------------- |
| `images/`   | Logos, photos, Open Graph images (prefer `.webp` / `.avif`).  |
| `models/`   | Compressed `.glb` 3D models (Draco / Meshopt).                |
| `textures/` | Standalone textures, HDR environment maps (`.hdr`, `.ktx2`).  |

Keep individual files small — every byte here ships to visitors.
