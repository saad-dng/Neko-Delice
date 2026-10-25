# NEKO DELICE 🐾

> A quiet-luxury portfolio storefront for vet-informed feline nutrition and precision cat hardware.

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%20%2F%20100%20%2F%2096%20%2F%20100-brightgreen?logo=lighthouse)](docs/AUDIT.md)
[![E2E Tests](https://img.shields.io/badge/Playwright-85%20passed-2EAD33?logo=playwright&logoColor=white)](tests/e2e)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview

**NEKO DELICE** is an editorial front-end portfolio storefront engineered to demonstrate extreme performance, thoughtful typography, and rock-solid client-side resilience. Built without heavy UI libraries or runtime CSS-in-JS, it features:

- **Interactive Meal Planner**: Clinical veterinary calorie calculation (RER &amp; MER), automated life-stage adjustments, body condition scaling, activity multipliers, and a reactive monthly bundle builder.
- **Zero-Hidden-State URL Synchronization**: Every planner choice and shop filter combination reflects in the URL query string for effortless bookmarking and browser history navigation.
- **Smart Bag Modal**: Built on HTML's native `<dialog>` element with `showModal()`, offering native focus trapping, keyboard dismissal, and reactive pet supply duration forecasting.
- **Multi-Currency Support**: Instant switching between USD ($) and BDT (৳) with localized formatting and persisted preference.
- **Static Site Prerendering (SSG)**: 100% prerendered at build time with `vite-react-ssg` across static routes and dynamic product pages.
- **Packaging-Sampled Design System**: Tailored light-mode palette sampled directly from product photography (sand `#D2C5B3`, sage `#8FA388`, terracotta `#A66445`, ochre `#9B6E3A`, matcha `#8A9A74`, oak `#8B6A45`).

---

## 2. Technical Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript (Strict) | Modern component architecture with strict compile-time type safety. |
| **Bundler & SSG** | Vite 8 + `vite-react-ssg` | Ultra-fast local HMR and pre-rendered HTML files for instant first paint and SEO. |
| **Styling** | Tailwind CSS v4 (`@theme`) | Zero runtime overhead; single-layer modern CSS tokens with typography and micro-interactions. |
| **Routing** | React Router DOM v6 | Seamless client-side routing with static prerendering integration. |
| **State Management** | Zustand + `persist` middleware | Lightweight client-side stores with corrupted-storage crash resistance. |
| **Testing** | Vitest + Playwright | Pure function unit tests and 85 full-browser end-to-end tests (+ `@axe-core/playwright`). |
| **Quality & Auditing**| Lighthouse CI (`@lhci/cli`) | Automated Mobile CWV auditing against strict budgets in CI. |
| **Image Pipeline** | Node.js + Sharp | Multi-resolution responsive WebP generation with explicit aspect ratios. |

---

## 3. Measured Performance & Quality Audits

All metrics are measured against strict budgets defined in the project charter. Full details in [`docs/AUDIT.md`](docs/AUDIT.md).

### Mobile Lighthouse Scores (Throttled Mobile Profile)

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Home (`/`)** | **100** | **98** | **96** | **100** | 0.3 s | 0.000 | 0 ms |
| **Shop (`/shop`)** | **100** | **100** | **96** | **100** | 0.2 s | 0.000 | 0 ms |
| **PDP (`/product/wild-salmon-quail-pate`)** | **100** | **100** | **96** | **100** | 0.3 s | 0.000 | 0 ms |
| **Meal Planner (`/meal-plan`)** | **100** | **100** | **96** | **100** | 0.2 s | 0.000 | 0 ms |
| **About (`/about`)** | **100** | **100** | **96** | **100** | 0.2 s | 0.004 | 0 ms |

### Budget vs. Actual

| Metric | Budget Target | Measured | Result |
| :--- | :--- | :--- | :--- |
| **Initial JS Size** | &le; 170 KB gzip | **58.44 KB gzip** | **65.6% under budget** |
| **LCP Hero Image** | &le; 150 KB | **73.80 KB** | **50.8% under budget** |
| **Fonts (WOFF2)** | 2 families &times; 2 weights | **73.54 KB total** | **Self-hosted Cormorant &amp; DM Sans** |
| **Cumulative Layout Shift** | &le; 0.1 | **0.000 – 0.004** | **Zero layout shift** |
| **Total Blocking Time** | &le; 200 ms | **0 ms** | **Zero main-thread blocking** |
| **Accessibility (Axe)** | 0 critical/serious | **0 violations** | **WCAG 2.1 AA Compliant** |

---

## 4. Calorie Planner Mathematics

The meal planner implements pure feline clinical nutrition formulas located in [`src/lib/planner.ts`](src/lib/planner.ts).

### Formulas

1. **Resting Energy Requirement (RER)**:
   $$\text{RER} = 70 \times (W_{\text{kg}})^{0.75}$$
2. **Maintenance Energy Requirement (MER)**:
   $$\text{MER} = \text{RER} \times F_{\text{life}} \times F_{\text{activity}}$$

### Multiplier Factors

- **Life Stage ($F_{\text{life}}$)**:
  - Kitten: $2.5$
  - Adult (Neutered): $1.2$ | Adult (Intact): $1.4$
  - Senior (Neutered): $1.1$ | Senior (Intact): $1.3$
- **Activity Level ($F_{\text{activity}}$)**:
  - Lounger: $0.9$
  - Moderate: $1.0$
  - Active: $1.2$
- **Food Ratio Split**:
  - Kitten: 70% wet / 30% dry
  - Adult: 60% wet / 40% dry
  - Senior: 65% wet / 35% dry

### Worked Example: "Mochi"
- **Profile**: Weight $4.5\text{ kg}$, Adult, Neutered, Lounger activity.
- **RER**: $70 \times (4.5)^{0.75} = 70 \times 3.089 = 216.2\text{ kcal/day} \approx \mathbf{216\text{ kcal/day}}$
- **MER**: $216.2 \times 1.2 \times 0.9 = \mathbf{233.5\text{ kcal/day}} \approx \mathbf{234\text{ kcal/day}}$
- **Daily Portions**:
  - Wet food ($60\%$): $233.5 \times 0.60 = 140.1\text{ kcal} \to \mathbf{2\text{ sachets/day}}$ (at $70\text{ kcal/sachet}$)
  - Dry kibble ($40\%$): $233.5 \times 0.40 = 93.4\text{ kcal} \to \mathbf{24\text{ g/day}}$ (at $3.95\text{ kcal/g}$)
- **Recommended 30-Day Bundle**:
  - Wet food: $2\text{ sachets/day} \times 30 = 60\text{ sachets} \to \mathbf{4\text{ boxes}}$ ($24\text{ sachets/box} = 96\text{ sachets} \approx 48\text{ days}$)
  - Dry kibble: $24\text{ g/day} \times 30 = 720\text{ g} \to \mathbf{1\text{ bag}}$ ($2.5\text{ kg} = 2,500\text{ g} \approx 104\text{ days}$)

---

## 5. Repository Structure

```
neko-delice/
├── docs/                     # Design specs, PRD, content data, and audit reports
│   ├── AUDIT.md              # Official P15 audit numbers and verification table
│   ├── DESIGN.md             # Art direction, typography, and palette specifications
│   ├── PRD.md                # Product requirements document
│   └── screens/              # 25 responsive QA screenshots (360px - 2560px)
├── public/                   # Static assets prerendered into root
│   ├── _headers              # Netlify/Cloudflare long-term caching and security headers
│   ├── fonts/                # Self-hosted WOFF2 files (Cormorant Garamond & DM Sans)
│   ├── images/products/      # Optimized WebP responsive images (hero, contents, pack)
│   ├── icons.svg             # SVG glyph icon sprite
│   ├── og-image.png          # 1200x630 vector OpenGraph card
│   └── robots.txt, sitemap.xml
├── scripts/                  # Build-time optimization and verification scripts
│   ├── check-size.mjs        # Initial JS gzip size analyzer
│   ├── generate-og.mjs       # OpenGraph image generator using Sharp & vector text
│   ├── generate-sitemap.mjs  # Dynamic XML sitemap generator
│   └── optimize-images.mjs   # Responsive WebP image processing pipeline
├── src/
│   ├── components/           # UI components organized by domain
│   │   ├── cat-art/          # Monoline inline SVG vector cat illustrations
│   │   ├── layout/           # Header, Footer, SkipLink, Navigation
│   │   ├── planner/          # 4-step wizard & result presentation components
│   │   ├── product/          # ProductCard, Gallery, PDP Feeding Table
│   │   ├── shop/             # Catalog filters, active chips, and sort controls
│   │   └── ui/               # Button, Modal, Container, Section, Badge, Price
│   ├── config/               # Nutrition constants, planner thresholds, currency rates
│   ├── data/                 # Product database and TypeScript schemas
│   ├── hooks/                # URL sync, prefers-reduced-motion, and useCountUp
│   ├── lib/                  # Pure math functions: planner.ts, format.ts, routes.ts
│   ├── pages/                # Route views: Home, Shop, PDP, Planner, About, 404
│   └── store/                # Persistent Zustand stores: bag, currency, profile
├── tests/                    # Unit and E2E verification suites
│   ├── e2e/                  # Playwright smoke, accessibility, and user journeys
│   └── unit/                 # Vitest math, formatting, and nutrition unit tests
├── lighthouserc.cjs          # Lighthouse CI mobile audit configuration
├── playwright.config.ts      # Multi-browser Playwright test configuration
├── vercel.json               # Hosting-neutral headers and cleanUrls configuration
└── vite.config.ts            # Vite 8 + Tailwind CSS v4 + SSG build setup
```

---

## 6. Scripts & Commands

All development and verification scripts can be executed via `npm`:

```bash
# Development
npm run dev         # Start local dev server with SSG support

# Quality Assurance & Testing
npm run typecheck   # Validate strict TypeScript compilation (tsc -b --noEmit)
npm run lint        # Fast static analysis with Oxlint
npm test            # Run Vitest unit tests (pure planner math, formatting, stores)
npm run e2e         # Execute 85 Playwright end-to-end and accessibility tests

# Production Build & Auditing
npm run build       # Prerender all routes with vite-react-ssg & emit sitemap
npm run preview     # Preview static production build on port 4173
npm run size        # Verify initial JS payload <= 170 KB gzip
npm run lhci        # Run Lighthouse CI mobile audit against 5 key routes

# Assets Pipeline
npm run images      # Run Sharp image pipeline (generates responsive WebP images)
```

---

## 7. Accessibility & Motion Compliance

NEKO DELICE is engineered to comply with **WCAG 2.1 AA** standards:

- **Landmarks & Hierarchy**: Single `<h1>` per route with strict heading levels (`h1` &rarr; `h2` &rarr; `h3`).
- **Skip Navigation**: Accessible Skip Link (`#main-content`) is the first tabbable item.
- **Focus Indicators**: 2px high-contrast focus rings (`focus-visible:ring-espresso-900`) on all interactive controls.
- **Modal Dialog**: The Smart Bag uses `<dialog>` and `showModal()` with automatic keyboard focus trapping, Escape dismissal, backdrop click dismissal, and focus restoration to trigger elements.
- **Touch Targets**: All interactive elements satisfy minimum 44&times;44 px touch bounding boxes.
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` across CSS transitions, smooth scrolling, and animated count-up numbers.

---

## 8. Deployment & Hosting

The project emits static HTML, JavaScript, CSS, and WebP images into the `dist/` folder. It is 100% hosting-neutral and ready to publish on any static host:

- **Netlify / Cloudflare Pages**: Utilizes [`public/_headers`](public/_headers) for 1-year immutable caching on `/assets/*` and `/images/*`, security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), and clean routing.
- **Vercel**: Configured via [`vercel.json`](vercel.json) with `cleanUrls: true` and immutable asset cache headers.
- **GitHub Pages / AWS S3**: Deploy the `dist/` directory directly after running `npm run build`.

---

## 9. Disclosures & Legal

- **Concept Artwork**: Product imagery and packaging photography are AI-generated concept art. Products and formulations are fictional concepts for portfolio demonstration.
- **Veterinary Advice Disclaimer**: Calorie estimates and feeding recommendations are mathematical guidelines for healthy cats. They do not constitute veterinary medical advice. Cat owners should always consult a licensed veterinarian for medical conditions, pregnancy, lactation, or sudden weight fluctuations.

---

## 10. Author & License

Designed and engineered by **Saad**. Released under the [MIT License](LICENSE).
