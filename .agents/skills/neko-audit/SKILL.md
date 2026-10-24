---
name: neko-audit
description: Use when verifying NEKO DELICE quality: Lighthouse, accessibility, bundle size, responsive checks, Playwright smoke tests, dead-link crawl, or before declaring any phase finished.
---

# NEKO DELICE audit checklist

Run after every phase that changes UI; full run in P15. Report numbers, not adjectives.

## Commands (create the scripts if missing)
`npm run typecheck` · `npm run lint` · `npm test` · `npm run build` · `npm run preview` (port 4173) · `npm run e2e` (Playwright) · `npm run lhci` (Lighthouse CI, mobile) · `npm run size` (gzip size of initial JS).

## Gates
- Lighthouse mobile on `/`, `/shop`, one `/product/:slug`, `/meal-plan`, `/about`: Performance, Accessibility, Best Practices, SEO each ≥ 95. LCP ≤ 2.5 s · CLS ≤ 0.1 · TBT low (INP proxy).
- Initial JS ≤ 170 KB gzip. Hero image ≤ 150 KB. First load ≤ 1 MB excluding lazy images.
- Playwright: visit every route (+ all 10 product slugs + a bad slug + a bad route); no console errors; every `<a>` internal href returns the app; every `<button>` has an effect or is `aria-disabled` with explanation.
- axe (`@axe-core/playwright`) zero serious/critical violations per route.
- Keyboard-only: skip link first, visible focus, planner operable, bag dialog traps focus, Esc closes, focus returns to trigger.
- Responsive screenshots at 360, 640, 1024, 1536, 2560: no horizontal scroll, no overlap, tap targets ≥ 44 px.
- Reduced motion: no transform animations, count-up shows final value.
- Storage: corrupt `localStorage` value → app still loads with empty bag and default currency.
- Planner: bad URL params → defaults, never NaN.
- Images: every `<img>` has alt, width, height; only the LCP image is eager.

## Perf fixes to try first
Preload only the display font; font subsetting; route-level `lazy()` for planner and PDP; no heavy libs; one `backdrop-filter` element; `content-visibility: auto` on below-fold sections; avoid layout shift by reserving image ratios; compress hero harder before changing code.
