# CSI KJSIT 2026 — Project Plan

> **Tagline:** _MORE THAN MEETS THE CODE._
> Premium, futuristic, Transformers- and Cybertron-inspired website for the Computer Society of India (CSI), KJSIT.
> **Design Balance:** 70% professional technology website · 30% cinematic Cybertronian aesthetic.

_Last updated: 2026-10-21 — Phase 7 (Final Design Polish & Pre-Launch Verification) complete._

---

## 1. Website Architecture

### Stack

| Concern            | Choice                                              | Why                                                    |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------ |
| Build / dev server | **Vite 8**                                          | Fast HMR, native ESM, automatic code splitting         |
| UI                 | **React 19** (JavaScript, JSX)                      | Modular component architecture                         |
| 3D                 | **three** + **@react-three/fiber** + **drei**       | Declarative Three.js in React, lazy-loaded             |
| Scroll animation   | **GSAP 3** + **ScrollTrigger** + `@gsap/react`      | Hero entrance & parallax, section reveals, batch cards |
| UI animation       | **Framer Motion**                                   | Mobile nav drawer, modal dialogs, roster tab switches  |
| Styling            | Plain CSS: global tokens + **CSS Modules**          | Scoped class names, zero runtime overhead              |
| Fonts              | Google Fonts (Chakra Petch, Inter, JetBrains Mono)  | Loaded via `<link>` with preconnect                    |

### Directory Structure

```
csi2026/
├── index.html                  # HTML shell, meta, font loading
├── vite.config.js              # React plugin, `@` → src alias
├── jsconfig.json               # Editor path alias support
├── PROJECT_PLAN.md             # ← Architecture, design system, 3D log & known issues
├── public/                     # Static assets served from site root
│   ├── favicon.svg
│   ├── images/                 # Event banners, sponsor logos, team photos
│   ├── models/
│   │   └── xbot.glb            # Pruned rigged humanoid robot base mesh & idle clip (MIT)
│   └── textures/               # Optional textures
└── src/
    ├── main.jsx                # React root + global CSS import
    ├── App.jsx                 # Complete page composition
    ├── data/
    │   ├── site.js             # Branding, nav links, hero copy, contact/social slots
    │   ├── about.js            # Editable About Us copy, CybertronCore config/specs, 3 pillars
    │   ├── events.js           # Placeholder event cards & categories
    │   ├── sponsors.js         # Tiered sponsor logo placeholder slots
    │   └── team.js             # 4 divisions (Tech, DCC, Operations, PR) & placeholder rosters
    ├── styles/
    │   ├── index.css           # Entry: tokens → base → utilities
    │   ├── tokens.css          # Design tokens (CSS custom properties)
    │   ├── base.css            # Reset + accessible element defaults
    │   └── utilities.css       # .container, .section, .hud-label, .chamfer …
    ├── components/
    │   ├── layout/             # Navbar, Footer, Logo
    │   └── ui/                 # Button, SectionHeading, ThreeStage, Modal
    ├── sections/
    │   ├── Hero/               # Hero section + lazy-mounted 3D Sentinel scene
    │   ├── About/              # About Us + 3 pillars + interactive 3D CybertronCore
    │   ├── Events/             # Filterable event grid + Event Details modal
    │   ├── Sponsors/           # Tiered sponsor logo placeholders + inquiry callout
    │   └── Team/               # 4 division cards + interactive Division Roster modal
    ├── three/
    │   ├── index.js            # Barrel exports for 3D components & scenes
    │   ├── SceneCanvas.jsx     # Shared <Canvas> wrapper (off-screen pause + reduced motion)
    │   ├── WebGLBoundary.jsx   # Error boundary so WebGL/model errors fall back cleanly
    │   ├── palette.js          # 3D colour constants synced with CSS tokens
    │   ├── components/
    │   │   ├── CybertronCore.jsx # Reusable multi-ring Cybertronian energy core
    │   │   └── EnergyCore.jsx    # Initial prototype construct
    │   ├── models/
    │   │   └── HeroRobot.jsx   # Articulated Cybertronian Sentinel (GLB + bone-portaled armour)
    │   └── scenes/
    │       ├── HeroScene.jsx          # Cinematic lighting rig & HeroRobot
    │       └── CybertronCoreScene.jsx # Scene wrapper for CybertronCore
    ├── hooks/
    │   ├── useMediaQuery.js
    │   ├── usePrefersReducedMotion.js
    │   ├── useScrolled.js
    │   └── useScrollReveal.js  # GSAP ScrollTrigger reveal helper
    └── animations/
        ├── gsap.js             # Single GSAP entry (registers ScrollTrigger + useGSAP)
        └── motion.js           # Shared Framer Motion variants & transitions
```

---

## 2. Design System

Defined in [`src/styles/tokens.css`](src/styles/tokens.css) and mirrored for 3D in [`src/three/palette.js`](src/three/palette.js).

- **Surfaces:** Near-black navy (`#05080f`), elevated navy (`#0a1020`), panel surface (`#0e1628`), hover surface (`#141e34`), neutral charcoal (`#111317`).
- **Metallic Silver Scale:** `#eef2f7` (headings/primary text) through `#5f6b80` (subtle HUD metadata).
- **Accents:** Electric blue (`#2f7bff`) for primary CTAs and rim lighting; restrained cyan (`#5ce1ff`) for HUD indices, optic visor, and spark core; rare orange (`#ff7a1a`) for status indicator dots.
- **Typography:** `Chakra Petch` (headings/buttons), `Inter` (body copy), `JetBrains Mono` (HUD labels/telemetry).
- **Geometry:** Chamfered corners (`.chamfer`) on cards, buttons, modals, and 3D stage frames.

---

## 3. Installed Dependencies

### Runtime
- `react`, `react-dom` (`^19.3.1`)
- `three` (`^0.186.1`), `@react-three/fiber` (`^9.8.2`), `@react-three/drei` (`^10.7.9`)
- `gsap` (`^3.15.0`), `@gsap/react` (`^2.1.2`)
- `framer-motion` (`^14.5.0`)

### Development
- `vite` (`^8.3.5`), `@vitejs/plugin-react` (`^6.1.2`)

---

## 4. 3D Features & Architecture

### A. Hero Scene — Cybertronian Sentinel (`HeroScene.jsx` / `HeroRobot.jsx`)
- **Model Source & Licence:** [`public/models/xbot.glb`](public/models/xbot.glb) (2.24 MB, pruned from 2.93 MB) from the official `mrdoob/three.js` repository (`examples/models/gltf/Xbot.glb`), distributed under the **MIT License**.
- **Design & Augmentation:** Base humanoid robot mesh finished in brushed silver (`metalness: 0.92`) and dark gunmetal (`#141d2e`) with bone-portaled Cybertronian hardware (illuminated cyan optic visor, forehead command crest, hexagonal sternum Spark Matrix core, shoulder fins, and dorsal flight wing-blades).
- **Motion:** Smooth entrance settle, skeletal `idle` animation clip, and cursor-reactive head/torso tracking.

### B. About Us Scene — Reusable `CybertronCore` (`CybertronCore.jsx` / `CybertronCoreScene.jsx`)
- **Visual Design:**
  - Glowing electric-blue central energy sphere (`#2f7bff`) with an inner high-intensity cyan core and geodesic wireframe containment shell.
  - Eight angular dark-metallic shutter segments with silver bevels and cyan emitter strips arranged around the sphere.
  - Three concentric gimbal rings (inner gunmetal ring with 6 silver clamps + blue energy conduit, inclined brushed-silver gyro ring with 8 notched gear teeth, and outer dark-metallic containment ring with stabilizer blocks and a single orange telemetry node).
  - Six small floating octahedral/prism relay components orbiting and spinning on independent axes.
  - Restrained blue/cyan drifting particle field (`THREE.Points`) with zero heavy post-processing.
- **Animations & Interactivity:**
  1. Outer rings rotate on distinct axes at different speeds.
  2. Central energy sphere pulses gently in scale and emissive brightness.
  3. Internal `pointLight` modulates intensity in sync with the pulsing sphere so the surrounding metallic rings respond dynamically.
  4. Damped mouse parallax tilts the core assembly smoothly.
  5. Page scroll gradually shifts the core's orientation (`scrollSensitivity`).
- **Configurable Props:** `speed` (default `1`), `intensity` (default `1`), `particleCount` (default `48`), `scrollSensitivity` (default `1`), `scale` (default `1`), and `animate` (default `true`).

### C. WebGL Context & Performance Management (`SceneCanvas.jsx`)
- Uses `IntersectionObserver` to automatically set `frameloop="never"` when a 3D canvas scrolls out of view, ensuring only visible scenes consume GPU cycles.
- Switches to `frameloop="demand"` (static frame) when `prefers-reduced-motion: reduce` is enabled.
- Wrapped in `WebGLBoundary` + `Suspense` with `StageSchematicFallback`.

---

## 5. Cohesive Animation System (GSAP + ScrollTrigger & Framer Motion)

### Library Separation Rule
- **GSAP + ScrollTrigger (`@gsap/react`):** Exclusively handles entrance choreography, scroll-linked parallax, batch card reveals, and `CybertronCore` scroll progress. All GSAP animations run inside `useGSAP(..., { scope })` so `ScrollTrigger` instances are automatically killed and cleaned up on unmount, and use `clearProps: 'transform,opacity'` on completion so CSS hover states never conflict.
- **Framer Motion:** Exclusively handles interactive UI state transitions (`Navbar` mobile drawer, `Modal` open/close overlay & dialog, and `Team` division roster tab transitions via `<AnimatePresence mode="wait">`).
- **Zero Overlap:** No DOM element is animated simultaneously by both GSAP and Framer Motion.

### Section-by-Section Choreography
1. **Hero (`Hero.jsx` / `Hero.module.css`):**
   - Masked line-by-line staggered reveal for `"MORE THAN MEETS"` and `"THE CODE."` (`[data-hero-line]`).
   - Supporting text fade/slide (`[data-hero-lead]`), delayed CTA button stagger (`[data-hero-cta]`), metadata bar stagger (`[data-hero-meta]`), and smooth 3D robot stage reveal (`[data-hero-stage]`).
   - Restrained `ScrollTrigger` scrub parallax on `[data-hero-grid]` and `[data-hero-glow]`.
2. **About Us (`About.jsx` / `CybertronCore.jsx`):**
   - Section boundary line draw (`[data-section-line]`) and heading reveal via `useScrollReveal`.
   - `ScrollTrigger` scrub across `#about` updating `scrollProgressRef` to drive `CybertronCore` orientation and subtle stage parallax.
   - Staggered entrance for the three core pillar cards (`Innovation`, `Collaboration`, `Excellence`).
3. **Events (`Events.jsx` / `Events.module.css`):**
   - Small-group card reveals (`batchMax: 2`) via `ScrollTrigger.batch('[data-event-card]')`, re-running cleanly when category filters change.
   - Restrained pointer-reactive 3D perspective tilt (`--rx`, `--ry` on fine pointers) + hover elevation, top accent bar draw, and `.mediaInner` banner zoom (`scale(1.045)`).
4. **Sponsors (`Sponsors.jsx` / `Sponsors.module.css`):**
   - Tiered staggered slot reveal with a restrained diagonal light-sweep sheen (`[data-sponsor-sweep]`) on entrance and hover while preserving original logo proportions (`object-fit: contain`).
5. **Team (`Team.jsx` / `Team.module.css`):**
   - Staggered reveal for the four division cards (`Tech`, `DCC`, `Operations`, `PR`).
   - Subtle SVG emblem animations (orbital ring rotation, core node pulse, and hover frame expansion).
   - Smooth `<AnimatePresence mode="wait">` transitions and staggered member card reveals when opening or switching divisions inside the roster modal.
6. **Accessibility & Resilience:**
   - Full `prefers-reduced-motion: reduce` support across GSAP, Framer Motion, CSS keyframes, and Three.js scenes.
   - `ScrollTrigger.config({ ignoreMobileResize: true })` for smooth touchscreen scrolling.
   - `try / catch` guards around GSAP setup so the website remains 100% functional and readable if animations fail to initialize.

---

## 6. Centralised Data & Functional Section Architecture

All content for Events, Sponsors, and Team is decoupled from React components and stored in self-documented modules inside `src/data/`:

### A. Events (`src/data/events.js` & `src/sections/Events/Events.jsx`)
- **Schema:** Each entry in `eventsList` supports `id`, `code`, `name` (aliased as `title`), `category`, `date`, `status`, `venue`, `mode`, `image`, `description`, `highlights`, `prerequisites`, `registrationUrl`, and `registrationNote`.
- **Conditional Registration Action:** `hasValidRegistrationUrl(url)` ensures the **"Register ↗"** / **"Register Now ↗"** button is rendered on cards and inside the modal **only** when a valid `http(s)://` URL is supplied. Unconfirmed events display a `Registration Link TBA` status pill instead of dead buttons.
- **Interactive Details Modal:** Clicking a card's banner, title, or **"Event Details"** button opens an accessible modal featuring category emblems, 4-column metadata telemetry, highlights, prerequisites, and `← Prev Event` / `Next Event →` stepping.

### B. Sponsors (`src/data/sponsors.js` & `src/sections/Sponsors/Sponsors.jsx`)
- **Schema:** `sponsorCategoryDefinitions` (`Title & Principal`, `Technology & Platform`, `Associate & Community`) and `sponsorsList` (`id`, `name`, `category`, `sublabel`, `logo`, `websiteUrl`).
- **Proportion-Safe Logo Rendering:** `<SponsorSlotCard>` renders logos with `object-fit: contain` (`width: auto; height: auto; max-height: 64px`), image-loading states, and error fallback.
- **Honest Placeholders & External Links:** Confirmed sponsors with a valid `websiteUrl` render as interactive `<a target="_blank" rel="noopener noreferrer">` cards; unconfirmed slots remain non-clickable placeholders labelled `Official Partner Slot — TBA`. Includes category filter tabs (`All Tiers` + individual categories).

### C. Team (`src/data/team.js` & `src/sections/Team/Team.jsx`)
- **Schema:** Four core divisions (`Tech`, `DCC`, `Operations`, `PR`), each with `id`, `code`, `title`, `fullName`, `emblemType`, `description`, `focusAreas`, and `members` (`id`, `name`, `designation`, `tier`, `year`, `photoUrl`, `socialUrl`, `socials`).
- **Interactive Division Cards & Directory Modal:** Clicking any division card (or pressing `Enter`/`Space` or clicking **"Open Roster"**) opens the Division Roster modal.
- **Filtering, Loading & Empty States:** Inside the modal, users can switch divisions (`Tech`, `DCC`, `Operations`, `PR`), filter by role (`All Members`, `Division Heads`, `Core Team`), or search by name/designation. Includes a directory loading skeleton when switching divisions, `<MemberAvatar>` image loading/fallback states, conditional social profile links (`hasValidSocialUrl`), and a resettable empty state when no members match.

### D. Accessible Modal System (`src/components/ui/Modal/Modal.jsx`)
- Supports `Escape` key dismissal, `Tab` / `Shift+Tab` focus trapping inside the dialog, automatic focus transfer on open, focus restoration to the trigger element on close, body scroll lock, and responsive mobile layout.

---

## 7. Performance, Responsiveness, Accessibility & Reliability Audit

### 1. Three.js Performance Optimisations
- **Shared Geometry Reuse:**
  - In [`CybertronCore.jsx`](src/three/components/CybertronCore.jsx), all repeated mechanical segments (8 shutters, 6 clamps, 8 gear teeth, 4 stabilizers, and 6 satellites) now share 16 memoized `THREE.BufferGeometry` instances instead of creating ~75 inline JSX geometries, and dispose all geometries and materials on unmount.
  - In [`HeroRobot.jsx`](src/three/models/HeroRobot.jsx), all symmetrical Cybertronian hardware attachments (optic nodes, audio fins, Spark Matrix rings/cylinders, pectoral seams, dorsal wing strips, shoulder plates, and forearm conduits) share memoized geometries inside `useCybertronGeometries()` and call `mixer.uncacheRoot(clonedScene)` on unmount.
- **Adaptive Device Quality & Context Recovery ([`SceneCanvas.jsx`](src/three/SceneCanvas.jsx)):**
  - Caps device pixel ratio to `[1, 1.35]` on compact viewports (`<= 768px`) or low-concurrency devices (`hardwareConcurrency <= 4`) and `[1, 1.75]` on desktop.
  - Reduces procedural `<Environment>` cubemap resolution from `256` to `128` and `CybertronCore` particle count from `48` to `28` on mobile devices (`<= 640px`).
  - Listens for `webglcontextlost` and `webglcontextrestored` events on the WebGL canvas to pause and recover cleanly without crashing the page.
  - Uses zero real-time shadow maps and zero heavy post-processing passes.

### 2. Loading & Zero-CLS Strategy
- **Below-the-Fold 3D Lazy Mounting ([`About.jsx`](src/sections/About/About.jsx)):**
  - `CybertronCoreScene` is deferred via `IntersectionObserver` (`rootMargin: '320px 0px'`) so initial page load mounts only **one** WebGL context (`HeroScene`). Until the user scrolls toward About Us, `#about-cybertron-core` renders `<StageSchematicFallback label="Standby · 3D Core Ready" />`.
- **Zero Layout Shift (CLS = 0):**
  - `ThreeStage` reserves identical fixed heights for `<StageSchematicFallback>` and live `<Canvas>` hosts (`400px` desktop / `310px` mobile for Hero; `330px` for Core).

### 3. Responsiveness & Mobile Camera Framing
- Verified zero horizontal overflow (`scrollWidth <= innerWidth`) across `360×780`, `390×844`, `768×1024`, `1280×800`, and `1920×1080`.
- Added `ResponsiveHeroCamera` in [`HeroScene.jsx`](src/three/scenes/HeroScene.jsx) (`z = 2.26, fov = 33` on mobile vs `z = 2.08, fov = 31` on desktop) and `ResponsiveCoreCamera` in [`CybertronCoreScene.jsx`](src/three/scenes/CybertronCoreScene.jsx) (`z = 5.95, fov = 40` on mobile vs `z = 5.45, fov = 38` on desktop) so both 3D constructs remain framed with generous margins on narrow viewports.
- Upgraded mobile navigation toggle tap target to `44×44px`.

### 4. Accessibility (WCAG 2.1 AA)
- **Contrast Enhancement ([`tokens.css`](src/styles/tokens.css)):** Lightened `--color-silver-400` (`#9aa7bc`, `>= 6.6:1` contrast) and `--color-silver-500` (`#8593aa`, `>= 4.7:1` contrast on `#0e1628`) so all HUD labels, metadata captions, and subtle notes pass WCAG 2.1 AA contrast requirements.
- **Keyboard & Screen Reader Support:** Skip-to-content link (`.skip-link`), 5 labelled landmark sections (`aria-labelledby`), zero unlabelled buttons, focus-trapped modals with `Escape` dismissal and focus restoration, and full `prefers-reduced-motion: reduce` support across CSS, GSAP, Framer Motion, and Three.js.

### 5. Production Build & Vercel Deployment Readiness
- **Vendor Code-Splitting ([`vite.config.js`](vite.config.js)):** Configured `manualChunks` separating `index` (`69.90 kB` / `19.12 kB` gzip), `vendor-react` (`64.50 kB` gzip), `vendor-gsap` (`47.48 kB` gzip), `vendor-motion` (`45.40 kB` gzip), and lazy-loaded 3D chunks (`HeroScene`, `CybertronCoreScene`, `vendor-r3f`).
- **Vercel Configuration ([`vercel.json`](vercel.json)):** Added immutable cache headers (`max-age=31536000, immutable`) for `/assets/*` and `/models/*` and SPA rewrite rules for clean deployment on Vercel.

---

## 8. Completed Phases

- **✅ Phase 0 — Foundation:** Project scaffolding, dependencies, design tokens, folder structure.
- **✅ Phase 1 — Complete Website Interface:** Navbar, Hero, About Us, Events, Sponsors, Team, and Footer.
- **✅ Phase 2 — Interactive 3D Hero Scene:** `HeroRobot` & `HeroScene` integrated into `#hero-robot-stage`.
- **✅ Phase 3 — Reusable `CybertronCore` 3D Component:** Built `CybertronCore.jsx` and `CybertronCoreScene.jsx`, integrated into `#about-cybertron-core` in the About Us section, added off-screen WebGL frameloop pausing, and verified on desktop and mobile.
- **✅ Phase 4 — Cohesive Animation System:** Implemented GSAP + ScrollTrigger entrance/scroll choreography and Framer Motion UI state transitions across Hero, About Us, Events, Sponsors, Team, and section boundaries.
- **✅ Phase 5 — Functional Events, Sponsors & Team Sections:** Upgraded centralised data schemas (`events.js`, `sponsors.js`, `team.js`), conditional registration/website/social link guards, category & role filters, loading/empty states, and focus-trapped keyboard-accessible modals.
- **✅ Phase 6 — Performance, Responsiveness, Accessibility & Deployment Audit:** Shared 3D geometry pooling, below-the-fold lazy WebGL mounting, adaptive mobile camera/DPR scaling, WCAG AA contrast tokens, vendor chunk splitting, and `vercel.json` configuration.
- **✅ Phase 7 — Final Design Polish & Documentation:** Unified metallic card gradients (`--gradient-panel`, `--gradient-panel-hover`), specular inset highlights (`--shadow-md`, `--shadow-hover`), and top energy border sweeps across About, Events, Sponsors, and Team; ensured unique SVG gradient IDs (`useId()`) in `Logo.jsx`; refined pointer tilt subtlety; and updated `README.md` with complete setup, content-editing, and Vercel deployment instructions.
- **✅ Phase 8 — Major Visual Redesign (Cinematic Transformers & Forged-Metal Edition):**
  - Replaced the uniform dark-navy/blue palette with a multi-surface design system combining dark forged gunmetal (`#11141a`, `#171b23`) for cinematic sections (`Hero`, `About Us`, `Team`), brushed platinum and off-white (`#eef1f6`, `#e2e8f2`, `#ffffff`) for readable showcase sections (`Events`, `Sponsors`), brushed chrome/silver (`#f4f6fa`, `#dfe5ef`), warm molten amber/orange (`#ff6214`, `#ff9a2e`, `#ffc145`), and restrained electric-blue optical details (`#3b82f6`, `#68b5ff`).
  - Rebuilt the Hero 3D robot (`HeroRobot.jsx` & `HeroScene.jsx`) into an unboxed, towering Cybertronian Prime Titan with multi-tone metallic armor zones, sculpted bevelled battle mask, electric-blue optic visor, Prime forehead crest, sloped chest blast-shields with molten-amber louvers, spinning golden-amber Matrix reactor core, twin chrome smokestacks, dorsal flight wings, abdominal piston grille, shoulder pauldrons, forearm energon-blades, and an industrial gantry bay with rising molten-amber embers.
  - Updated `CybertronCore` (`CybertronCore.jsx` & `CybertronCoreScene.jsx`) with a blazing molten-amber central energy sphere, forged gunmetal and brushed chrome concentric rings, warm ember particles, and restrained electric-blue optical telemetry nodes inside an integrated architectural chamber.
  - Redesigned `Events` as a high-contrast brushed-platinum showcase with custom multi-layered sci-fi SVG artwork banners per category and a featured dark gunmetal-and-amber Flagship card.
  - Redesigned `Sponsors` on a neutral brushed-metallic surface preserving original logo proportions and brand colours, and upgraded `Team` with four intricate multi-layered mechanical division emblems (`Tech`, `DCC`, `Operations`, `PR`).

---

## 9. Remaining Work (Post-Handoff Content Population)

- **Official Content Population:** Populate confirmed event dates/registration URLs, sponsor logos/websites, and 2026 council member photographs/names in `src/data/*.js` as they are announced by CSI KJSIT.

---

## 10. Known Limitations

- **Augmented Base Rig in Hero:** `HeroRobot.jsx` uses the MIT-licensed `xbot.glb` humanoid robot rig augmented with custom bone-portaled Cybertronian hardware; no vehicle-transformation animation is included.
- **Placeholder Content:** Event dates, sponsor logos, team rosters, and social URLs remain honest placeholders (`TBA`) until supplied by the chapter.
- **Upstream Three.js r186 Deprecation Notice in Dev:** `@react-three/fiber` internally instantiates `THREE.Clock`, which logs a benign dev warning in Three.js `r186` (`Please use THREE.Timer instead`); this has zero runtime impact.
