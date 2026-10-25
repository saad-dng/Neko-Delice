# NEKO DELICE — Quality & Performance Audit Report (P15)

Audited against strict targets defined in `AGENTS.md`, `docs/PRD.md`, and skill `neko-audit`.

---

## 1. Executive Summary

| Category | Target / Budget | Measured Result | Status |
| :--- | :--- | :--- | :--- |
| **Initial JS Size** | &le; 170 KB gzip | **58.44 KB gzip** | PASS (65.6% under budget) |
| **LCP Hero Image** | &le; 150 KB | **73.80 KB** (`hero-1280.webp`) | PASS (50.8% under budget) |
| **Font Assets** | 2 families &times; 2 weights WOFF2 | **73.54 KB total** (4 self-hosted WOFF2 files) | PASS |
| **Mobile LCP** | &le; 2.5 s | **0.2 s – 0.3 s** | PASS |
| **Mobile CLS** | &le; 0.1 | **0.000 – 0.004** | PASS |
| **Mobile TBT (INP proxy)**| &le; 200 ms | **0 ms** | PASS |
| **Lighthouse Mobile** | &ge; 95 across all 4 categories | **100 / 98–100 / 96 / 100** | PASS |
| **Playwright E2E** | All routes, flows, resilience | **85 / 85 passing** | PASS |
| **Axe Accessibility** | Zero serious / critical issues | **0 violations** | PASS |

---

## 2. Lighthouse CI Mobile Audit Scores

Mobile emulation: 390&times;844 @ 2x DPR (iPhone 12/13/14 profile), throttled network and CPU. Server: `vite preview` on port 4173.

| Route | URL | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Home** | `/` | **100** | **98** | **96** | **100** | 0.3 s | 0.000 | 0 ms |
| **Shop** | `/shop` | **100** | **100** | **96** | **100** | 0.2 s | 0.000 | 0 ms |
| **PDP** | `/product/wild-salmon-quail-pate` | **100** | **100** | **96** | **100** | 0.3 s | 0.000 | 0 ms |
| **Planner** | `/meal-plan` | **100** | **100** | **96** | **100** | 0.2 s | 0.000 | 0 ms |
| **About** | `/about` | **100** | **100** | **96** | **100** | 0.2 s | 0.004 | 0 ms |

*Note: Best Practices score of 96 reflects browser-level logging in headless Chrome without external origin-trial tokens; zero application security or protocol issues.*

---

## 3. JavaScript Bundle Size Breakdown (`npm run size`)

Budget: **&le; 170 KB gzip**. Measured initial entry bundle: **58.44 KB gzip** (188.75 KB uncompressed).

```
Entry file: dist\index.html
Total Initial JS (gzip): 58.44 KB (Target: <= 170 KB)

Initial JS Chunks (sorted by gzip size):
  - assets/format-D269u-J0.js: 26.18 KB gzip (91.13 KB raw)
  - assets/app-qH8zP_85.js: 13.12 KB gzip (38.86 KB raw)
  - assets/Heading-DF1d573v.js: 11.78 KB gzip (40.96 KB raw)
  - assets/react-CH7r40_x.js: 3.15 KB gzip (7.37 KB raw)
  - assets/index-Bq7PZc2d.js: 2.92 KB gzip (6.54 KB raw)
  - assets/vendor-react-B3o1Z22U.js: 1.28 KB gzip (3.88 KB raw)
```

Route-level code splitting ensures that heavy components (Shop grid, PDP gallery/feeding tables, Planner multi-step wizard, and About page diagrams) load on-demand without penalizing the initial paint.

---

## 4. Image Pipeline & Asset Optimization

- **LCP Hero Image:** `public/images/products/hero-1280.webp` is **73.8 KB** (budget: 150 KB). Configured with `fetchpriority="high"` and `loading="eager"`.
- **Below-the-fold Images:** All product cards, lifestyle bento tiles, and ingredient close-ups use `loading="lazy"` and `decoding="async"`.
- **Dimensions & Ratios:** Every `<img>` tag specifies explicit `width` and `height` attributes alongside responsive `srcset` (`360w`, `640w`, `1024w`, `1280w`) and CSS aspect-ratio placeholders, guaranteeing zero layout shift (`CLS <= 0.004`).
- **OpenGraph Asset:** `public/og-image.png` (1200&times;630) generated via Sharp with SVG vector typography overlay for crisp social link previews.

---

## 5. Accessibility & Inclusivity Audit (WCAG 2.1 AA)

- **Automated Axe-Core Audits:** Ran `@axe-core/playwright` across all routes and interactive modal states. **0 critical, 0 serious, 0 moderate violations**.
- **Keyboard Navigation:**
  - Skip to main content link (`#main-content`) is the first focusable element.
  - Interactive controls have high-contrast visible focus rings (`focus-visible:ring-2 focus-visible:ring-espresso-900`).
  - Native `<dialog>` for Smart Bag implements native focus trapping, `Escape` key dismissal, backdrop click dismissal, and focus restoration to trigger elements.
- **Color Contrast:** All body text meets minimum 4.5:1 contrast against `#FAF7F2` (`espresso-950`, `espresso-900`, `espresso-800`). Terracotta interactive states meet 3:1 for graphical UI elements and 4.5:1 for text.
- **Motion & Reduced Motion:** All CSS animations and count-up numbers respect `@media (prefers-reduced-motion: reduce)`, instantly rendering final computed values.

---

## 6. End-to-End Test Suite Summary

Total: **85 passing Playwright tests**:
1. `tests/e2e/smoke.spec.ts`: Validates route integrity across all 5 core routes, all 10 product slugs, unknown dynamic slugs (404), unknown nested routes (404), crawls all internal links with zero broken paths, and asserts zero console errors.
2. `tests/e2e/a11y.spec.ts`: Full Axe accessibility audit on every page; tests keyboard skip link and Smart Bag modal focus trap/restoration.
3. `tests/e2e/flows.spec.ts`: Complete user journey from meal planner wizard to monthly bundle recommendation, Smart Bag drawer opening, currency toggle (USD &harr; BDT), shop filter round-tripping via URL parameters, and corrupted `localStorage` resilience.
4. `tests/e2e/routes.spec.ts`, `tests/e2e/shop.spec.ts`, `tests/e2e/planner.spec.ts`, `tests/e2e/smart-bag.spec.ts`: Thorough component-level regressions.
5. `tests/e2e/screenshots.spec.ts`: Automated multi-viewport QA visual capture at 360px, 640px, 1024px, 1536px, and 2560px saved in `docs/screens/`.

---

## 7. Optimizations & Fixes Applied During Build

1. **Hydration Mismatch Prevention:** On 404 client-side SPA fallback for un-prerendered routes, ensured graceful client mount without React #418 errors.
2. **Form Interaction Reliability:** Adjusted Playwright wizard locators to target semantic accessible label tags rather than hidden radio inputs.
3. **Modal Dialog Isolation:** Accommodated browser top-layer modality for native `<dialog>`, ensuring proper closing before header controls are triggered.
4. **Static Prerendering:** Configured `vite-react-ssg` with dynamic product routes to prerender clean HTML for all 10 products, eliminating client-side render lag.
