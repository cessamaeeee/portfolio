<div align="center">

# 🌸 Princess Mae Sanchez 🌸
### Full-Stack Developer & UI/UX Enthusiast

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-ff9ffc?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-ff9ffc?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-ff9ffc?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Three.js-r184-ff9ffc?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP-v3-ff9ffc?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
</p>

✦ ───────────────── 🎀 ───────────────── ✦

<p align="center">
  Welcome to my developer portfolio! This is an interactive web application showcasing my skills, project achievements, leadership roles, and academic background.
</p>

</div>

---

## 🎀 Core Highlights & Interactive Features

- **🌸 Liquid Fluid Atmosphere:** An interactive WebGL Navier-Stokes fluid simulation canvas (`LiquidEther`) responding dynamically to mouse drag vectors and touch gestures on the Hero section.
- **🌸 Atmospheric Grains:** Procedural shader backdrops (`Grainient`) rendering dynamic simplex noise patterns and custom film grain overlays across sections.
- **🌸 Custom Cursor Interaction:** A custom hardware-accelerated pointer trail (lagging outer ring and active center dot) that expands when hovering over buttons, cards, and anchors.
- **🌸 Looping Skill Tickers:** Smooth horizontal scrolling loops (`LogoLoop`) with custom friction parameters, support for logo hover scaling, and seamless duplication.
- **🌸 Dynamic Borders & Physics:** Custom conic-gradient tracking borders (`BorderGlow`) and physics-enabled layout elements (`MagicBento`/`ParticleCard`) that tilt, drift particles, and create radial ripple waves on click coordinates.
- **🌸 Interactive Ring Constraints:** Full-viewport floating particle meshes (`Antigravity`) that cluster and orbit around the cursor utilizing Three.js instanced rendering.

---

## 🛠️ Tech Stack & Libraries

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4 with PostCSS configuration
- **WebGL Rendering:** Three.js & @react-three/fiber for 3D/fluid simulations; OGL for lightweight shader programs
- **Animations:** GSAP & ScrollTrigger for text scrolls; Framer Motion for element shifts
- **Icons:** Devicon CDN integration for toolkit logos
- **Design Inspiration & References:** [React Bits](https://reactbits.dev/) (inspiration and foundation for interactive elements like custom cursors, text highlights, fluid simulations, and animated loops).

---

## 📂 Project Structure

```bash
├── app/
│   ├── favicon.ico     # Web favicon
│   ├── globals.css     # Global styles, variables, custom cursor overrides
│   ├── layout.tsx      # Main layout, custom cursor integration, global WebGL context
│   └── page.tsx        # Home index page coordinating site sections
├── components/
│   ├── Antigravity.tsx # Three.js instanced particle grid
│   ├── BorderGlow.tsx  # Conic-gradient tracking border wrappers
│   ├── Cursor.tsx      # Interactive dot + trailing ring cursor
│   ├── Grainient.tsx   # Simplex noise background canvas
│   ├── LiquidEther.tsx # WebGL fluid simulation code
│   ├── LogoLoop.tsx    # Infinite horizontal skill loops
│   ├── MagicBento.tsx  # Card physics, ripple effects, magnetic draw
│   └── ...             # Sections (Navbar, Hero, Overview, Projects, Contact, etc.)
├── public/             # Project images, logos, and downloadable assets (CV.pdf)
└── config files        # package.json, tsconfig.json, tailwind.config.ts, etc.
```

For a comprehensive, class-by-class technical breakdown of all components and logic in the repository, please check out the **[DOCUMENTATION.md](./DOCUMENTATION.md)**.
