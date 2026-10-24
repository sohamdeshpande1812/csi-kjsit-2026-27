# CSI KJSIT 2026 — _More Than Meets The Code._

Official web experience for the **Computer Society of India (CSI), KJSIT** (`2026` Academic Term).  
Engineered with a **70% professional technology society** and **30% cinematic Cybertronian** design identity.

---

## Tech Stack

- **Framework & Build:** React 19 + Vite 8 (JavaScript / ESM)
- **Interactive 3D:** Three.js (`r186`) + `@react-three/fiber` + `@react-three/drei`
- **Scroll & Entrance Choreography:** GSAP 3 + ScrollTrigger + `@gsap/react`
- **UI State Transitions:** Framer Motion (`AnimatePresence` modals & mobile navigation)
- **Styling:** Global CSS Design Tokens (`src/styles/tokens.css`) + scoped CSS Modules (`*.module.css`)

---

## Getting Started

### Prerequisites
- **Node.js** `>= 20.x` and **npm** `>= 10.x`

### Installation & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server with HMR
npm run dev
# → Local: http://localhost:5173/
```

### Production Build & Local Preview

```bash
# 1. Build minified, code-split production bundle into dist/
npm run build

# 2. Preview the production build locally
npm run preview
```

---

## Updating Content (No Component Changes Needed)

All placeholder schedules, partner logos, council rosters, and social links are centralised in `src/data/`:

| File | Purpose | Key Behaviour |
| :--- | :--- | :--- |
| [`src/data/site.js`](src/data/site.js) | Chapter branding, navigation links, Hero CTAs, contact & social links | Social links with `url: null` display `URL TBA`; setting an `https://` URL activates the external link automatically. |
| [`src/data/about.js`](src/data/about.js) | Chapter overview paragraphs, 3 core pillars, and `CybertronCore` 3D parameters | Adjust `coreStage.config.speed` and `intensity` directly. |
| [`src/data/events.js`](src/data/events.js) | Event cards, categories, dates, status badges, highlights & `registrationUrl` | Setting `registrationUrl: 'https://...'` automatically enables the **Register ↗** button on the card and inside the Event Details modal. |
| [`src/data/sponsors.js`](src/data/sponsors.js) | Multi-tier sponsor categories (`Title`, `Technology`, `Associate`) & `sponsorsList` | Supplying `logo: '/images/sponsors/...'` renders the logo with preserved proportions (`object-fit: contain`); supplying `websiteUrl` makes the card an external link. |
| [`src/data/team.js`](src/data/team.js) | Four divisions (`Tech`, `DCC`, `Operations`, `PR`) & member rosters | Each member supports `name`, `designation`, `tier` (`lead` \| `core`), `year`, `photoUrl`, and optional `socialUrl` / `socials`. |

---

## 3D Architecture & Fallbacks

1. **Hero Section (`HeroScene` & `HeroRobot`):**
   - Renders the **Cybertronian Sentinel** using `/models/xbot.glb` (MIT License, `mrdoob/three.js`) augmented with custom bone-portaled Cybertronian visor, crest, Spark Matrix sternum core, shoulder armour, and dorsal flight wings.
2. **About Us Section (`CybertronCoreScene` & `CybertronCore`):**
   - Reusable multi-ring mechanical energy core (`CybertronCore.jsx`) with shared geometry pooling, pulsing internal point-light, drifting particle cloud, mouse parallax, and scroll-linked orientation.
   - Deferred via `IntersectionObserver` so the second WebGL context only mounts when scrolling near `#about`.
3. **Graceful Degradation:**
   - Every 3D stage is wrapped in `WebGLBoundary` + `Suspense` with `StageSchematicFallback`, handles WebGL context loss/restoration, pauses rendering when scrolled off-screen, and switches to a static frame when `prefers-reduced-motion: reduce` is active.

---

## Deployment (Vercel)

This repository includes a preconfigured [`vercel.json`](vercel.json) with:
- Framework preset: `vite` (`npm run build` → `dist`)
- Immutable caching headers (`max-age=31536000, immutable`) for `/assets/*` and `/models/*`
- SPA rewrite fallback to `/index.html`

To deploy:
1. Push the repository to GitHub / GitLab / Bitbucket and import it in the **Vercel Dashboard**, or
2. Run `npx vercel --prod` from the project root.

---

## Documentation

Full architectural records, design system tokens, 3D model licensing, audit notes, and known limitations are documented in [`PROJECT_PLAN.md`](PROJECT_PLAN.md).
