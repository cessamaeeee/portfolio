# ✨ Princess Mae Sanchez — Interactive Developer Portfolio

Welcome to my personal developer portfolio! This is a high-fidelity, interactive web application showcasing my skills, project achievements, leadership roles, and academic background.

The site is designed with a premium, motion-rich "Liquid Pink" theme, featuring hardware-accelerated WebGL backgrounds, interactive shaders, and smooth animation states.

---

## 🚀 Key Highlights & Interactive Features

- **Liquid Fluid Atmosphere:** An interactive WebGL Navier-Stokes fluid simulation canvas (`LiquidEther`) responding dynamically to mouse drag vectors and touch gestures on the Hero section.
- **Atmospheric Grains:** Procedural shader backdrops (`Grainient`) rendering dynamic simplex noise patterns and custom film grain overlays across sections.
- **Custom Cursor Interaction:** A custom hardware-accelerated pointer trail (lagging outer ring and active center dot) that expands when hovering over buttons, cards, and anchors.
- **Looping Skill Tickers:** Smooth horizontal scrolling loops (`LogoLoop`) with custom friction parameters, support for logo hover scaling, and seamless duplication.
- **Dynamic Borders & Physics:** Custom conic-gradient tracking borders (`BorderGlow`) and physics-enabled layout elements (`MagicBento`/`ParticleCard`) that tilt, drift particles, and create radial ripple waves on click coordinates.
- **Interactive Ring Constraints:** Full-viewport floating particle meshes (`Antigravity`) that cluster and orbit around the cursor utilizing Three.js instanced rendering.

---

## 🛠️ Tech Stack & Libraries

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS configuration
- **WebGL Rendering:** [Three.js](https://threejs.org/) & [@react-three/fiber](https://r3f.docs.pmnd.rs/) for 3D/fluid simulations; [OGL](https://github.com/oogl/ogl) for lightweight shader programs
- **Animations:** [GSAP](https://gsap.com/) & ScrollTrigger for text scrolls; [Framer Motion](https://www.framer.com/motion/) for element shifts
- **Icons:** Devicon CDN integration for toolkit logos
- **Design Inspiration & References:** [React Bits](https://reactbits.dev/) for foundational UI templates and animation mechanisms

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

---

## 💻 Getting Started & Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/cessamaeeee/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production
To build and optimize the bundle for production:
```bash
npm run build
npm run start
```

### 5. Linting
Run static analysis and check for styling/logic rules:
```bash
npm run lint
```
