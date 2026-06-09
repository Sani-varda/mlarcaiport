# SANI VARADA // PORTFOLIO & WORK DOSSIER

An immersive, high-performance interactive web dossier showcasing the design & engineering work of **SANI VARADA**, AI/ML Architect & Quantitative Analyst. 

This website features a high-contrast, professional white and blue visual theme built using Next.js 16 (App Router, Turbopack) and Tailwind CSS v4. The experience integrates dual scroll-jacking cinematic canvas engines, a 1000vh horizontal dossier layout, word-by-word scroll-driven text reveals, and a vertical scrolling sidebar with glassmorphic masking.

---

## 🚀 Key Features

* **Dual Scroll-Driven Canvas Engines:** Implements high-performance HTML5 `<canvas>` rendering to scrub frame-by-frame through 240-frame 1080p animation sequences, optimized via state throttling and frame preloading.
* **1000vh Dossier Layout:** Jacked vertical window scrolling translated into horizontal slide animations across 5 bespoke dossiers:
  1. **Profile & Credentials:** Editorial profile layout featuring a responsive portrait, CSS-first grid systems, and core competencies list.
  2. **Personal Case Studies:** Detailed technical breakdowns of ML pipelines, RAG systems, and volatility forecasting models with an interactive tabbed layout.
  3. **Agency Case Studies (ML Arc):** Live client case studies mapping lead Qualification Voice Agents, CAC/ROAS optimizations, and support automation systems.
  4. **Quantitative Trading:** Deep dive into algorithmic trading, GARCH/LSTM volatility forecasting, index options regime detection, and the **Hermes Autonomous Agent** execution monitor.
  5. **Downloads & Contact:** Integrated offline dossiers download links (PDF Curriculum Vitae & Agency Dossier) and high-contrast contact links.
* **Word-by-Word Reveal Animation:** Leverages passive requestAnimationFrame window scroll calculations to reveal paragraph text sequentially as each slide enters the viewport.
* **Vertical Marquee Sidebar:** A glassmorphic capsule containing scrolling social links moving in an upside-down vertical marquee loop, with hover-to-pause capability.
* **Favicon Integration:** Custom Crisp SVG favicon utilizing Sani's monogram vector logo.
* **SEO & Accessibility (A11y):** Optimized for search engines using rich JSON-LD schema metadata (Person / Organization) and WCAG AA contrast compliance (>4.5:1 ratio).

---

## 🛠️ Tech Stack

* **Core Framework:** Next.js 16.2.7 (App Router, Turbopack enabled)
* **Runtime / Logic:** React 19.2.4 & TypeScript 5
* **Styling & Theme:** Tailwind CSS v4 (CSS-first configuration with custom `@theme` utilities)
* **Animation & Rendering:** GSAP / `@gsap/react`, HTML5 `<canvas>`, and native `requestAnimationFrame` hooks
* **Icons Library:** `react-icons` (Font Awesome 6) & `lucide-react`
* **Text Scrolling:** `react-fast-marquee` (for looping text layouts)
* **Graphics & Layout:** Three.js / `@types/three` (scaffolded for spatial assets)

---

## 📂 Project Architecture

```text
├── public/
│   ├── images/
│   │   ├── sequence1/        # 240-frame sequence PNG assets for scroll scene 2
│   │   ├── sequence2/        # 240-frame sequence PNG assets for scroll scene 1
│   │   └── Cinematic_portrait_with_high-contrast_dual-tone_202606090312.jpeg
│   ├── logo.svg              # Sani Varada Vector Monogram
│   ├── image.png             # Hermes Agent Graphic Banner
│   ├── Sani_V.pdf            # Offline CV publication
│   └── ML_Arc_Case_Studies.pdf
├── src/
│   ├── app/
│   │   ├── globals.css       # Core design system, @theme configurations, custom animations
│   │   ├── icon.svg          # Crisp SVG Favicon configuration
│   │   ├── layout.tsx        # Next.js Metadata, SEO tags, and Inter font mapping
│   │   └── page.tsx          # Main entry, scroll jackers, horizontal carousel, and panel contents
│   ├── components/
│   │   └── ImageSequenceCanvas.tsx  # Optimized canvas preloader & drawing engine
│   └── components/
│       └── CitadelCanvas.tsx        # Three.js web-experience canvas scaffold
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ⚙️ Prerequisites

Before setting up the project locally, ensure you have:
* **Node.js:** v20.x or higher
* **Package Manager:** `npm` (v10+) or `pnpm`/`yarn`

---

## 🔑 Environment Configuration

To enable automated email routing for the Lead Intake Form, create a `.env.local` file in the root directory:

```env
RESEND_API_KEY=re_your_api_key
```

*Note: If `RESEND_API_KEY` is not defined, leads will still be successfully saved locally inside `/leads.json` (git-ignored for security) and logged to the server terminal, so no submissions are lost during development.*

---

## 💻 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Sani-varda/mlarcaiport.git
cd mlarcaiport
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive application.

### 4. Build for Production
To generate an optimized production build:
```bash
npm run build
```

---

## 🧠 Technical Implementation Details

### Optimized Canvas Drawing (`ImageSequenceCanvas.tsx`)
The canvas preloader prevents heavy CPU lag during initial frames preloading:
1. **State Throttling:** Instead of triggering a React re-render for every single preloaded frame, state updates are throttled (e.g., every 15 frames + the final completion frame), reducing mount render passes by **93%**.
2. **Context Caching:** Stored frame images are drawn directly onto a hidden HTML5 canvas context and swapped instantly on scroll updates.

### requestAnimationFrame Scroll Listener
Scroll checking is bound to a passive listener throttled using the browser's `requestAnimationFrame` ticking loop. This decouples scroll position checking from immediate state renders, keeping scrolling at a smooth 60fps/120fps.

### CSS Mask-Image Sidebar
The vertical floating marquee utilizes a CSS `-webkit-mask-image` linear gradient to fade icons out towards the top and bottom borders of the sidebar, achieving a premium glassmorphic lens refraction look:
```css
.mask-gradient-vertical {
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}
```

---

## 🧪 Troubleshooting & Optimization

* **Missing Canvas Images:** If the animation sequences do not load, verify that the directories `public/images/sequence1/` and `public/images/sequence2/` contain frames formatted as `ezgif-frame-001.png` to `ezgif-frame-240.png`.
* **Hydration Mismatches:** The timezone clock uses a client-side `useEffect` hook to resolve initial rendering differences between Server-Side Rendering (SSR) and Client-Side Hydration.
* **Build Errors:** If react-icons throws an import error, verify that the packages match `react-icons: ^5.6.0` or higher, which supports Font Awesome 6 (`react-icons/fa6`).

---

## 📄 License & Attribution
* **Copyright:** &copy; 2026 SANI VARADA / ML Arc. All rights reserved.
