# Princess Mae Sanchez - Portfolio Technical Documentation

**Version:** 1.0 (As of June 2, 2026)

This document provides a comprehensive technical overview and reference of the portfolio codebase. It describes the project structure, configuration, styling, components, WebGL systems, and inter-file relationships.

---

## Project Overview

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & PostCSS
- **Animation & Visuals:**
  - GSAP (GreenSock Animation Platform) + ScrollTrigger for scroll-based word triggers.
  - Framer Motion (`motion/react`) for text/UI-based animation.
  - Three.js (`three`) and `@react-three/fiber` for 3D physics rendering (Antigravity particles) and interactive WebGL canvas simulations (LiquidEther).
  - OGL (`ogl`) for ultra-lightweight WebGL context management (Iridescence).
- **Icons:** Devicon CDN integration (in Toolkit).
- **UI & Animations Reference:** [React Bits](https://reactbits.dev/) (inspiration and foundation for interactive elements like custom cursors, text highlights, fluid simulations, and animated loops).

### Overall Architecture
- **Root Layout (`app/layout.tsx`):** Coordinates global assets (CSS, custom fonts), full-viewport background interactions (`SplashCursor`, `Antigravity`), and the global stateful mouse tracker (`Cursor`).
- **Main Entrypoint (`app/page.tsx`):** Groups sections sequentially within a singular, smooth-scrolling wrapper.
- **Visual Ecosystem:** Blends dynamic WebGL backdrops (LiquidEther on Hero, Iridescence on Toolkit, Projects, and Education, and custom shaders via Grainient on Overview, Experience, and Hackathons) with pink/rose gradients and top/bottom gradient mask transitions.
- **Card-level Interactions:** Employs a custom `BorderGlow` component implementing mask-based path drawing on pointer proximity, wrapping interactive cards.


---

## Configuration Files

### `package.json`
- **Purpose:** Declares metadata, CLI scripts, and project dependencies.
- **Dependencies:** React 19, Next.js 16, Three.js, React Three Fiber, GSAP, Framer Motion, OGL.
- **How it connects:** Dictates package node structures and resolution versions during `npm install` or compilation.

### `tsconfig.json`
- **Purpose:** Configuration file for the TypeScript compiler (`tsc`).
- **Key Settings:** Enables ES2017 target, strict type checking, Next.js plugin integration, and sets path alias `@/*` resolving to the project root.
- **How it connects:** Dictates compiler rules and type safety scopes across all `.ts` and `.tsx` source files.

### `next.config.ts`
- **Purpose:** Customizes Next.js framework build settings.
- **Key Settings:** Standard blank wrapper, exporting `NextConfig` to hook standard Next compiler processes.
- **How it connects:** Loaded automatically by the Next.js runtime CLI (`next dev`, `next build`).

### `tailwind.config.ts`
- **Purpose:** Specifies Tailwind configuration patterns for styling files.
- **Key Settings:** Defines file scopes under `./app` and `./components` to match content sources for utility compilation.
- **How it connects:** Injected as part of the styling compilation pipeline.

### `postcss.config.mjs`
- **Purpose:** Configures PostCSS plugins for CSS processing.
- **Dependencies:** `@tailwindcss/postcss` for compiling Tailwind CSS directives.
- **How it connects:** Configures PostCSS compilation which is automatically invoked by Next.js during styles compilation.

### `eslint.config.mjs`
- **Purpose:** ESLint configuration declaring rules and overrides for JavaScript/TypeScript static analysis.
- **Dependencies:** `eslint-config-next` configurations (core-web-vitals and typescript settings).
- **How it connects:** Invoked during local verification (`npm run lint` or `npx eslint`) or build environments.

---

## App Routes (`app/`)

### `app/layout.tsx`
- **Purpose:** Serves as the main layout wrapper enclosing all views with global layouts, fonts, meta tags, and full-viewport atmospheric setups.
- **Dependencies:** `next/font/google`, `@/components/SplashCursor`, `@/components/Antigravity`, `@/components/Cursor`.
- **Key Logic:** Sets Inter font variable, outputs SEO metadata, and wraps the tree inside background atmospheric components (`Cursor` custom tracker, absolute fixed `Antigravity` capsules, and fixed `SplashCursor` fluid canvas).
- **Props/Interface:** React standard `{ children: React.ReactNode }`.
- **How it connects:** Automatically wraps page modules loaded in `app/page.tsx`.

### `app/page.tsx`
- **Purpose:** The home page routing entrypoint that renders the portfolio sections sequentially.
- **Dependencies:** Section components (`Navbar`, `Hero`, `Overview`, `Toolkit`, `Experience`, `Projects`, `Hackathons`, `Education`, `Contact`).
- **Key Logic:** Organizes sections sequentially within a `<main>` container with horizontal overflow safety.
- **How it connects:** Loaded as the index route `/` and populated by layout wrappers.

### `app/globals.css`
- **Purpose:** Houses global stylesheets, animation keyframes, scrollbar formats, custom cursor variables, and Tailwind imports.
- **Key CSS rules:** Implements custom `* { cursor: none !important; }` to support the custom cursor dot/ring tracker. Declares fade-in keys, float controls, webkit scrollbars, and reveal wrappers.
- **How it connects:** Imported by `app/layout.tsx` to apply styles globally.

---

## Components (`components/`)

### `components/Navbar.tsx`
- **Purpose:** Provides a responsive floating navigation header with sticky blur effects and smooth scroll targets.
- **Key Logic:** Detects screen scroll via a `window` event listener to toggle compact/colored backgrounds (`scrolled` state). Houses a toggleable mobile hamburger menu.
- **How it connects:** Rendered at the top of the viewport in `app/page.tsx`.

### `components/Hero.tsx`
- **Purpose:** Renders the opening landing view featuring an interactive LiquidEther simulation, custom text highlighting, and a floating canvas with reactive line elements.
- **Dependencies:** `@/components/ShinyText`, `@/components/LiquidEther`.
- **Key Logic:** Evaluates mouse movements and resizes to draw 80 springy canvas-based line particles. Coordinates with LiquidEther to display a pink fluid backdrop.
- **How it connects:** Instantiated in `app/page.tsx` as the first section.

### `components/Overview.tsx`
- **Purpose:** Displays biographical details and stats wrapped in a moving WebGL background.
- **Dependencies:** `@/components/ScrollReveal`, `@/components/ScrollFloat`, `@/components/Grainient`.
- **Key Logic:** Draws structural statistics in grids using interactive reveal parameters. Wrapped in a full-width `Grainient` layer.
- **How it connects:** Rendered in `app/page.tsx` below `Hero`.

### `components/Toolkit.tsx`
- **Purpose:** Renders categorized professional tech skills in smooth, infinite looping horizontal tickers.
- **Dependencies:** `@/components/ScrollReveal`, `@/components/ScrollFloat`, `@/components/Iridescence`, `@/components/LogoLoop`.
- **Key Logic:** Groups technical assets and builds nodes utilizing Devicon fonts. Alternates speed settings per row to generate distinct directional motions.
- **How it connects:** Rendered in `app/page.tsx` below `Overview`.

### `components/Experience.tsx`
- **Purpose:** Presents formal work history and community leadership roles in a structured list.
- **Dependencies:** `@/components/ScrollReveal`, `@/components/ScrollFloat`, `@/components/Grainient`.
- **Key Logic:** Renders timeline blocks over a pink `Grainient` background with scroll reveals and staggered entries.
- **How it connects:** Rendered in `app/page.tsx` below `Toolkit`.

### `components/Projects.tsx`
- **Purpose:** Displays featured coding projects in interactive cards equipped with expandability, border highlights, and particle effects.
- **Dependencies:** `@/components/ScrollReveal`, `@/components/ScrollFloat`, `@/components/Iridescence`, `@/components/MagicBento`, `@/components/BorderGlow`.
- **Key Logic:** Maps projects into `ProjectCard` wrappers. Monitors hover-states dynamically to control reveal buttons and toggles expansion blocks.
- **How it connects:** Rendered in `app/page.tsx` below `Experience`.

### `components/Hackathons.tsx`
- **Purpose:** Showcases competition history, achievements, and project highlights.
- **Dependencies:** `@/components/ScrollReveal`, `@/components/ScrollFloat`, `@/components/MagicBento` (ParticleCard), `@/components/BorderGlow`, `@/components/Grainient`.
- **Key Logic:** Maps hackathon profiles to a 2-column list wrapped in `BorderGlow` and `ParticleCard` units over a dynamic Grainient canvas.
- **How it connects:** Rendered in `app/page.tsx` below `Projects`.

### `components/Education.tsx`
- **Purpose:** Presents degrees, scholarships, certifications, and courses in card panels.
- **Dependencies:** `@/components/ScrollReveal`, `@/components/ScrollFloat`, `@/components/Iridescence`.
- **Key Logic:** Displays school info, credentials, and achievements over a shared `Iridescence` background.
- **How it connects:** Rendered in `app/page.tsx` below `Hackathons`.

### `components/Contact.tsx`
- **Purpose:** Displays social links, mail triggers, and an availability status badge.
- **Dependencies:** `@/components/ScrollReveal`, `@/components/ScrollFloat`, `@/components/BorderGlow`, `@/components/Grainient`.
- **Key Logic:** Uses custom SVG icons in contact cards with interactive hover effects (sliding arrow animations, scale transformations).
- **How it connects:** Rendered at the bottom of `app/page.tsx`.

---

## Interactive & Visual Components

### `components/LiquidEther.tsx`
- **Purpose:** A high-performance WebGL fluid simulation canvas built with Three.js that responds to mouse movement and auto-animation paths.
- **Props Interface:**
  ```typescript
  interface LiquidEtherProps {
    mouseForce?: number;
    cursorSize?: number;
    isViscous?: boolean;
    viscous?: number;
    iterationsViscous?: number;
    iterationsPoisson?: number;
    dt?: number;
    BFECC?: boolean;
    resolution?: number;
    isBounce?: boolean;
    colors?: string[];
    style?: React.CSSProperties;
    className?: string;
    autoDemo?: boolean;
    autoSpeed?: number;
    autoIntensity?: number;
    takeoverDuration?: number;
    autoResumeDelay?: number;
    autoRampDuration?: number;
  }
  ```
- **Key Logic:** Implements Navier-Stokes fluid math across multiple passes:
  1. **Advection Pass:** Moves velocity/color attributes along the velocity vector field (with optional BFECC stabilization).
  2. **External Force Pass:** Adds directional energy based on mouse coordinates and mouse speed.
  3. **Viscous Diffusion Pass:** Diffuses velocity properties across adjacent coordinates (Poisson-based relaxation).
  4. **Divergence Calculation:** Calculates pressure inconsistencies.
  5. **Poisson Pressure Solver:** Iterates pressure correction buffers (divergence containment).
  6. **Gradient Subtraction Pass:** Subtracts pressure gradient fields to enforce incompressibility.
  7. **Output Pass:** Samples velocity vectors to index color palettes from a generated dynamic `THREE.DataTexture`.
- **How it connects:** Rendered as the background in `components/Hero.tsx`.

### `components/Grainient.tsx`
- **Purpose:** Renders a moving WebGL grain background using custom noise formulas and GLSL shaders.
- **Props Interface:**
  ```typescript
  interface GrainientProps {
    timeSpeed?: number;
    colorBalance?: number;
    warpStrength?: number;
    warpFrequency?: number;
    warpSpeed?: number;
    warpAmplitude?: number;
    blendAngle?: number;
    blendSoftness?: number;
    rotationAmount?: number;
    noiseScale?: number;
    grainAmount?: number;
    grainScale?: number;
    grainAnimated?: boolean;
    contrast?: number;
    gamma?: number;
    saturation?: number;
    centerX?: number;
    centerY?: number;
    zoom?: number;
    color1?: string;
    color2?: string;
    color3?: string;
    className?: string;
  }
  ```
- **Key Logic:** Processes color variables (`#hex` translated to normalized float arrays) in raw WebGL fragment shaders. Integrates simplex noise arrays to warp colors dynamically and overlays a realistic film grain noise mask.
- **How it connects:** Background container for `Overview`, `Experience`, `Hackathons`, and `Contact`.

### `components/Iridescence.tsx`
- **Purpose:** A lightweight animated WebGL canvas utilizing the `ogl` library to create iridescence patterns.
- **Props Interface:**
  ```typescript
  interface IridescenceProps {
    color?: [number, number, number];
    speed?: number;
    amplitude?: number;
    mouseReact?: boolean;
    [key: string]: unknown;
  }
  ```
- **Key Logic:** Configures `Renderer`, `Program`, `Mesh`, and `Triangle` from `ogl`. The fragment shader uses sine loops to warp UV coordinates in response to mouse inputs, rendering gradient patterns.
- **How it connects:** Injected in `Toolkit`, `Projects`, and `Education`.

### `components/LogoLoop.tsx`
- **Purpose:** Animates horizontal arrays of child items using customizable speeds, directions, and hover behaviors.
- **Props Interface:**
  ```typescript
  interface LogoLoopProps {
    logos: LogoItem[];
    speed?: number;
    direction?: 'left' | 'right' | 'up' | 'down';
    width?: number | string;
    logoHeight?: number;
    gap?: number;
    pauseOnHover?: boolean;
    hoverSpeed?: number;
    fadeOut?: boolean;
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
    ariaLabel?: string;
    className?: string;
    style?: React.CSSProperties;
  }
  ```
- **Key Logic:** Measures list widths using a `ResizeObserver` to duplicate child elements (ensuring continuous loops). Uses a `requestAnimationFrame` render loop with velocity-based easing to scroll the lists smoothly.
- **How it connects:** Imported in `components/Toolkit.tsx` to handle the skills ticker rows.

### `components/Cursor.tsx`
- **Purpose:** Renders a custom lagging cursor consisting of a center dot and a trailing outer ring, replacing the default OS cursor.
- **Key Logic:** Tracks coordinates using mouse events. Uses a `requestAnimationFrame` loop with linear interpolation (lerp) to animate the outer ring smoothly. Monitors dynamic page updates with a `MutationObserver` to attach hover animations to buttons and links.
- **How it connects:** Initialized globally in `app/layout.tsx`.

### `components/Antigravity.tsx`
- **Purpose:** Renders a 3D particle field using Three.js instanced meshes that react to mouse proximity by forming a ring structure.
- **Props Interface:**
  ```typescript
  interface AntigravityProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    color?: string;
    autoAnimate?: boolean;
    particleVariance?: number;
    rotationSpeed?: number;
    depthFactor?: number;
    pulseSpeed?: number;
    particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
    fieldStrength?: number;
  }
  ```
- **Key Logic:** Renders 200 particle instances (capsules) using `@react-three/fiber`'s `useFrame` hook. Calculates distance between each particle and the mouse coordinate. When the mouse is close, the particles are pulled into a rotating ring structure. When the mouse is stationary, the target position moves along a Lissajous curve.
- **How it connects:** Injected in `app/layout.tsx` to act as a reactive backdrop for the cursor.

### `components/BorderGlow.tsx`
- **Purpose:** A wrapper component that draws a glowing, mouse-tracking gradient border and inner shadow on card layouts.
- **Props Interface:**
  ```typescript
  interface BorderGlowProps {
    children?: ReactNode;
    className?: string;
    edgeSensitivity?: number;
    glowColor?: string;
    backgroundColor?: string;
    borderRadius?: number;
    glowRadius?: number;
    glowIntensity?: number;
    coneSpread?: number;
    animated?: boolean;
    colors?: string[];
    fillOpacity?: number;
  }
  ```
- **Key Logic:** Computes the cursor's angle relative to the card's center. Calculates edge proximity to modulate border and drop-shadow opacity. Renders multi-layered CSS mesh gradients masked with CSS `conic-gradient` to focus the glow under the cursor.
- **How it connects:** Wraps cards in `Projects`, `Hackathons`, and `Contact`.

### `components/MagicBento.tsx`
- **Purpose:** Adds reactive physics, tilting, magnetic draw, and click ripple effects to layout cards.
- **Props Interface:**
  ```typescript
  interface ParticleCardProps {
    children: React.ReactNode;
    className?: string;
    disableAnimations?: boolean;
    style?: React.CSSProperties;
    particleCount?: number;
    glowColor?: string;
    enableTilt?: boolean;
    clickEffect?: boolean;
    enableMagnetism?: boolean;
  }
  ```
- **Key Logic:**
  - **Click Ripple:** Creates and scale-animates radial gradient overlays from click points using GSAP.
  - **Tilt/Magnetism:** Tilts the card along the X/Y axes or offsets its position dynamically relative to the mouse.
  - **Hover Particles:** Spawns floating particles that drift and fade in response to mouse movement.
- **How it connects:** Used to wrap project cards in `Projects` and `Hackathons`.

### `components/ScrollFloat.tsx`
- **Purpose:** A scroll-triggered text animation component that splits text into individual characters and reveals them when scrolled into view.
- **Props Interface:**
  ```typescript
  interface ScrollFloatProps {
    children: ReactNode;
    scrollContainerRef?: RefObject<HTMLElement>;
    containerClassName?: string;
    textClassName?: string;
    animationDuration?: number;
    ease?: string;
    scrollStart?: string;
    scrollEnd?: string;
    stagger?: number;
  }
  ```
- **Key Logic:** Splits input text into individual `span` elements. Triggers a GSAP text reveal (transitioning opacity, scale, and translation) using `ScrollTrigger` when the element enters the viewport. The animation is configured to run only once per page load.
- **How it connects:** Animates headers in `Overview`, `Toolkit`, `Experience`, `Projects`, `Hackathons`, `Education`, and `Contact`.

### `components/ScrollReveal.tsx`
- **Purpose:** A scroll-reveal container that fades and slides up child components when scrolled into view.
- **Key Logic:** Uses an `IntersectionObserver` to detect when children enter the viewport, adding the `.visible` CSS class to trigger hardware-accelerated CSS transitions.
- **How it connects:** Wraps text and cards across all content sections.

### `components/ShinyText.tsx`
- **Purpose:** Adds an animated, metallic shine overlay to text strings.
- **Props Interface:**
  ```typescript
  interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
    color?: string;
    shineColor?: string;
    spread?: number;
    yoyo?: boolean;
    pauseOnHover?: boolean;
    direction?: 'left' | 'right';
    delay?: number;
  }
  ```
- **Key Logic:** Renders a text container with a clipping mask style. Uses Framer Motion's `useAnimationFrame` and `useTransform` hooks to slide a linear gradient background across the text loop.
- **How it connects:** Used for the "Princess Mae" highlight text in `components/Hero.tsx`.

### `components/SplashCursor.tsx`
- **Purpose:** A WebGL-based fluid simulation canvas that renders paint splats in response to mouse drags and touch events.
- **Props Interface:**
  ```typescript
  interface SplashCursorProps {
    TRANSPARENT?: boolean;
    RAINBOW_MODE?: boolean;
    COLOR?: string;
  }
  ```
- **Key Logic:** Compiled in vanilla WebGL. Calculates fluid dynamics using multiple shader programs (vorticity, curl, divergence, pressure, advection, and splatting).
- **How it connects:** Rendered globally inside `app/layout.tsx`.

### `components/SplashCursorWrapper.tsx`
- **Purpose:** A client wrapper component for `SplashCursor`.
- **How it connects:** (Optional client wrapper, layout imports direct `SplashCursor` module instead).

---

## Static Assets (`public/`)

- **`/favicon.ico`** — Site favicon.
- **`/CV.pdf`** — Resume file for the Hero download action.
- **`/profile.jpg`** — Main profile photo rendered in the Hero section.
- **`/ScholarLinkTeam.JPG`** — Feature image for the ScholarLink project card.
- **`/ScholarLinkLogo.png`** — Logomark for the ScholarLink project.
- **`/DLSUHackecup.jpg`** — Photo asset for the LakwatSafe hackathon card.
- **`/WaisWalletLogo.png`** — Logomark for the Wais Wallet project card.
- **`/file.svg`, `/globe.svg`, `/window.svg`** — Next.js template vector icons.
