# NEKO DELICE — Plan & status

Update the checkbox and "Notes" when a prompt finishes. Do not reorder phases.

## Decisions (these override the PRD where they differ)
| Topic | Decision |
| --- | --- |
| Wet-food format | **Stick sachets**, matching the approved packs. 1 carton = **24 sachets × 40 g**. Kitten Mousse **45 kcal/sachet** (≈1.12 kcal/g), Salmon & Quail Paté **38 kcal/sachet** (≈0.94 kcal/g). Same energy density as the PRD's 85 g pouches, so results stay realistic. Kept as placeholders in `src/config/nutrition.ts`. |
| Planner wet maths | sachets/day = wet kcal ÷ kcal per sachet; boxes = ceil(30 days × sachets/day ÷ 24); duration = boxes × 24 ÷ sachets/day. |
| Product 05 pack | Paper-based pack with the food inside (not aluminium). Verify in photos. Alt text must say "paper pouch". |
| Palette | Handover palette (`docs/DESIGN.md`). Primary button/terracotta text uses **#A94F33** (5.07:1 on cream), not the PRD's #B5573A (4.45:1, fails AA). |
| Logo | Built in code: SVG cat-head glyph + live-text wordmark (NEKO over DELICE). Photos are inspiration only. |
| Illustration | Monoline cat SVGs only. |
| Images | 48 JPGs in `Photo collection/` (4–5 per product, **not** six). Gallery uses what exists, ordered by role (see `docs/IMAGE-MAP.md`). No new generation. No site-wide images exist: hero, bento tiles and About imagery reuse product photos. |
| Currency | Fixed `USD_TO_BDT = 123`, shown as "approximate", BDT rounded to nearest ৳10. As-of label: "Oct 2026". Never fetch live rates. |
| Case study | A "Behind the build" section on `/about`. **No extra route.** |
| Framework | Vite + React + TS + `vite-react-ssg` (react-router-dom v6). |
| Dark mode, accounts, search, reviews, checkout, multi-cat | Out of scope. |

## Phases (one prompt each, in order)
- [x] P01 Bootstrap & project structure
- [x] P02 Photo audit → `docs/IMAGE-MAP.md` (**stop for owner approval**)
- [x] P03 Image optimisation pipeline
- [x] P04 Design tokens, fonts, base UI
- [x] P05 Logo & wordmark (**stop for owner pick**)
- [x] P06 Monoline cat illustration set (**stop for owner approval**)
- [x] P07 Layout shell, routing, prerender, SEO
- [x] P08 Product data, content, currency formatting
- [x] P09 Planner engine + tests (pure logic)
- [x] P10 Shop: filters, URL sync, cards, bag/currency stores
- [x] P11 Product detail page
- [x] P12 Planner UI (wizard + results)
- [x] P13 Smart Bag modal + currency toggle UI
- [ ] P14 Home, About (+ Behind the build), micro-interactions
- [ ] P15 Audit, optimisation, README, launch prep

## Notes
- 2026-10-24: P01 completed. Vite + React + TS scaffold configured with vite-react-ssg, Tailwind v4, paths alias, directory structure, and vitest baseline.
- 2026-10-24: P02 completed. Audited all 48 photos; verified roles, pack forms, and alt texts in docs/IMAGE-MAP.md and src/data/image-map.source.json; owner approved.
- 2026-10-24: P03 completed. Sharp image optimization pipeline with caching, budgets (all <85 KB), typed image manifest, ProductImage component, and vitest tests.
- 2026-10-24: P04 completed. Sampled pack-band and backdrop colors from hero photos; configured Tailwind v4 @theme tokens; self-hosted WOFF2 fonts (@fontsource/cormorant-garamond@5.3.0 and @fontsource/dm-sans@5.3.0, 73.45 KiB total); base UI primitives (Button, Chip, Container, Section, Heading, SkipLink, VisuallyHidden, Icon); WCAG AA contrast tests passing.
- 2026-10-24: P05 completed. User selected custom debossed cat glyph from packaging photo; built vector Logo component with stacked, compact, and glyph variants; generated public/favicon.svg and public/apple-touch-icon.png (180x180); verified crispness at 24/48/160px; test suite passing.
- 2026-10-25: P06 completed. Created 6 monoline cat SVG components (`CatSleeping`, `CatSitting`, `CatStretching`, `CatPlayful`, `CatPeeking`, `CatHead`) in `src/components/cat-art/` calibrated to packaging artwork; all under 1.5 KB (890 B to 1,444 B, ~7.47 KB total); created `docs/cats-preview.html` matrix at 48/96/160px across sage, cream, and oat; vitest suite passing; approved by owner.
- 2026-10-25: P07 completed. Configured routes with vite-react-ssg RouteRecord and getStaticPaths for all 10 product slugs; built Layout shell (SkipLink, Header with compact Logo, nav, currency toggle placeholder, bag button, mobile disclosure menu; Main landmark; Footer with disclosures and accessibility statement); RouteAnnouncer live region with focus management and scroll restoration; SeoHead with canonical, OG, Twitter, favicons, and Cormorant 600 WOFF2 font preload; 404 NotFound page with CatSitting; generate-sitemap.mjs post-build script; 18/18 Playwright e2e tests passing and 25/25 vitest tests passing.
- 2026-10-25: P08 completed. Created typed Product model and single source of truth for all 10 products in src/data/products.ts; configured nutrition and portion constants in src/config/nutrition.ts; configured site exchange rate and disclaimers in src/config/site.ts; implemented formatPrice (USD and BDT with nearest ৳10 rounding), formatDays, formatKcal in src/lib/format.ts; derived slugs from products; vitest suite (34 tests) and Playwright smoke tests (18 tests) passing.
- 2026-10-25: P09 completed. Implemented pure TypeScript planner engine in src/lib/planner.ts (calcRER, calcMER, splitRatio, buildBundle, supplyDays, feedingTable, sizeBand, normalizeProfile) and URL query serialization/deserialization in src/lib/plan-url.ts with clamping and fallback defaults; configured all factors and thresholds in src/config/planner.ts; verified all golden tests (4.5 kg adult lounger: 216.3 RER, 233.6 MER, sensitive stomach: 4 boxes of wet lasting 31 days, 1 bag of dry lasting 83 days; kitten neuter ignore; urinary 70/30 & water fountain suggested; coat-shine topper oil budget; 50 random URL round-trips; garbage inputs safe); 58/58 vitest tests passing.
- 2026-10-25: P10 completed. Built Zustand persisted stores (useBag with 1-9 qty clamping and merge, useCurrency with USD/BDT, usePlannerProfile) backed by corruption-resilient safeLocalStorage; implemented pure filter and nearestMatches logic in src/lib/filters.ts; created ProductCard with stretched-link pattern, hover image swap, and quick-add; built /shop with desktop rail, mobile native <dialog> bottom sheet, active filter chips, sort select, and CatPeeking empty state; 74/74 unit tests and 23/23 Playwright E2E tests passing.
- 2026-10-25: P11 completed. Built Product detail page (/product/:slug) with gallery thumbnails, keyboard arrow navigation, LCP image preload and fetchpriority, native <details>/<summary> accordions, pure feeding guide table from src/lib/planner.ts, quantity stepper (1-9), polite live region add-to-bag, JSON-LD Product schema, and 404 fallback; all 10 product pages prerendered; 29/29 Playwright E2E and 74/74 Vitest tests passing.
- 2026-10-25: P12 completed. Implemented 4-step Meal Planner UI (/meal-plan) with full URL synchronization (name, stage, neutered, w, act, focus, step), mirrored into usePlannerProfile; Step 1 with kitten neuter lock; Step 2 with synced range slider, numeric input, kg/lb toggle, size indicator, and extreme-weight notice; Step 3 with monoline cat radio cards; Step 4 with supportive health focus options; progress bar with 250ms transition and polite screen reader announcements; mobile sticky next button; PlanResult with reduced-motion aware calorie count-up (<=900ms), RER/MER metrics, portion breakdown, monthly bundle cards, fountain add-on checkbox, copy shareable link, "How we calculate this" formula disclosure, and veterinary notice; 74/74 vitest tests and 37/37 Playwright E2E tests (including Axe accessibility audit) passing.
- 2026-10-25: P13 completed. Implemented native <dialog> SmartBag modal with responsive bottom-sheet on mobile (<640px) and centered card on desktop, backdrop blur with solid scrim fallback, Escape/backdrop click dismiss, focus restoration to opener, and scroll lock; reactive supply duration estimates per line (reference cat fallback for foods, one-time for hardware, ~30 days for litter); quantity steppers (1-9), remove, line totals, active currency subtotal, and accessible disabled preview checkout; header bag button with bounce animation and live count; USD/BDT segmented toggle in header, footer disclaimer, and zero-layout-shift tabular numbers; 81/81 vitest unit tests and 43/43 Playwright E2E tests (including Axe accessibility audit) passing.





