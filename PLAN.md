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
| Homepage v2 direction | **Real cat photo hero + supporting illustrations**; disclosures removed except checkout notice; work on branch `playful-home`. |
| Image Quality | **Maximum image file size limits removed.** Preserve high-fidelity, high-resolution photography without lowering resolutions or aggressive compression so the storefront looks stunning. |
| Dark mode, accounts, search, reviews, checkout, multi-cat | Out of scope. |

## Phases v1 (Completed)
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
- [x] P14 Home, About (+ Behind the build), micro-interactions
- [x] P15 Audit, optimisation, README, launch prep

## v2 — Playful Homepage Stages (branch: playful-home)
- [x] V2-01 Branch, rules and docs
- [x] V2-02 Audit the current site (docs/V2-AUDIT.md compiled, 0 dead buttons, 90/90 tests)
- [x] V2-03 Cat photo intake (docs/SITE-IMAGE-MAP.md, 6 roles, high-resolution WebPs, approved)
- [x] V2-04 Reusable playful components (Cormorant italic 500, 5 cat poses, 6 doodles, Annotation, Reveal, Band, CatCard, IdleCat, PawStamp)
- [ ] V2-05 Rebuild the homepage sections (**stop for owner browser review**)
- [ ] V2-06 Functional interactions and animation across all pages
- [ ] V2-07 Content, claims and notices cleanup
- [ ] V2-08 Testing, QA and merge

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
- 2026-10-25: P14 completed. Implemented Home page (LCP hero still with fetchpriority="high", bento category grid linking to /shop?category=..., CatSitting planner teaser, 4 ProductCard pantry items, verbatim promise strip, closing CTA) and About page (brand philosophy, vet-informed approach, transparent sourcing, quality commitments, 4 ingredient close-ups, Behind the build case study reading live formulas from config, planner flow diagram, design decisions, performance table with TBD values, AI imagery & vet disclaimers); CSS micro-interactions (spring slider thumb, size-band fade, scroll reveal IntersectionObserver, content-visibility: auto with contain-intrinsic-size); 8 responsive screenshots at 360, 768, 1280, 1920 px in docs/screens/; Lighthouse mobile scores on / (Perf 100 / A11y 100 / BP 96 / SEO 100) and /about (Perf 100 / A11y 100 / BP 96 / SEO 100); 81/81 vitest and 55/55 Playwright tests passing.
- 2026-10-25: P15 completed. Conducted comprehensive quality and performance audit across all criteria:
  - Added full Playwright test suite: `smoke.spec.ts` (all routes, 10 slugs, 404 handlers, dead link crawling, zero console errors), `a11y.spec.ts` (Axe audits on all routes, skip link, modal focus trapping), `flows.spec.ts` (full planner-to-bag user journey, URL filter roundtrips, corrupted localStorage resilience), and `screenshots.spec.ts` (captured 25 responsive QA screenshots at 360, 640, 1024, 1536, 2560 px in `docs/screens/`). Total 85/85 Playwright tests passing.
  - Multi-route Lighthouse CI Mobile audit on 5 routes (`/`, `/shop`, `/product/wild-salmon-quail-pate`, `/meal-plan`, `/about`): 100 Performance, 98-100 Accessibility, 96 Best Practices, 100 SEO. LCP: 0.2-0.3 s, CLS: 0.000-0.004, TBT: 0 ms.
  - Initial JS bundle size verified: 58.44 KB gzip via `scripts/check-size.mjs` (target <= 170 KB gzip, 65.6% under budget).
  - Hero image: 73.80 KB (target <= 150 KB, 50.8% under budget).
  - OpenGraph image generated: `public/og-image.png` (1200x630) with sharp + vector overlay; wired to `SeoHead.tsx`.
  - Hosting-neutral cache config created: `public/_headers` (Netlify/Cloudflare) and `vercel.json` with immutable 1-year asset caching and clean URLs.
  - Updated "Behind the build" table in `src/pages/About.tsx` with verified audit metrics.
  - Created detailed `docs/AUDIT.md` and complete project `README.md`.
- 2026-10-25: Refinement completed. Replaced header bottom border with seamless multi-stop progressive glass blur. Removed currency switcher from sticky header; integrated contextual CurrencyToggle in Smart Bag modal, Shop catalog toolbar, and global footer beside BDT exchange rate disclosure.
- 2026-10-25: Fix completed. Resolved issue where active category tabs turned blank/white on tap. Root cause was missing @theme color scale tokens (espresso-950/800/700/600/500/400, terracotta-700/800, oat-200/300) in Tailwind v4, resulting in missing background-color rules and invisible cream text on cream background. Defined full tonal scales with WCAG AA compliance across all components.
- 2026-10-25: Polish completed. Switched active category filter pills from harsh dark espresso to warm signature terracotta-600 with cream text and high-contrast count badge. Resolved container outline clipping by adding vertical padding and transitioning to focus-visible. Updated CurrencyToggle active chip to serene cream-on-oat.
- 2026-10-25: Polish completed. Enhanced progressive blur transition with overlapping cubic decay bands (32px down to 1px) and a 6-stop cream-50 scrim tint gradient. Creates a continuous, silky diffusion across the navigation links with a natural, feather-soft edge.
- 2026-10-25: Refinement completed. Restored the authentic 7-band Apple/Vercel progressive blur recipe (`[48, 32, 16, 8, 4, 2, 1]` px) and translucent scrim gradient (`0.65` -> `0.28` -> `0`) from `C:\Projects\Resources\Fixed glasspannel`. Implemented scroll-activated progressive wrapping height (`104px`–`128px` when scrolled, `100%` at top of page) so that elements passing under the header are smoothly diffused and wrapped into the frosted glass without overlapping products or catalog titles when resting at the top.
- 2026-10-25: Refinement completed. Eliminated harsh black focus rectangle outlines on mobile tap and mouse click across product photo gallery thumbnails, PDP accordions (`Ingredients`, `Guaranteed analysis`, `Specifications`, `Storage & feeding advice`), quantity steppers, and shop filter chips by transitioning from generic `:focus` to `:focus-visible` with a warm signature terracotta ring reserved exclusively for keyboard navigation (`Tab`). Added global `-webkit-tap-highlight-color: transparent` and `summary:focus { outline: none; }` in `index.css`. Upgraded accordion disclosure headers with warm hover transitions, 44px+ tap targets, and elegant circular glyph badges (`w-7 h-7 rounded-full bg-oat-100/80` rotating into `bg-terracotta-100/70 text-terracotta-700` on open) for a premium apothecary aesthetic.
- 2026-10-25: Refinement completed. Integrated packaging sage-green brand palette and editorial refinements across entire site:
  - Tokens: Created full 10-stop `sage` color scale in `src/styles/tokens.css` based on packaging horizontal band (#9DAA8B) and sampled foliage (#8FA388), with high-contrast text shades `sage-700` (#617359) and `sage-800` (#4B5A44) passing WCAG AA (5.03:1 and 7.15:1 on cream). Added `sand-100`, `sand-200`, and `border-subtle` (#E5D7C1).
  - Product Detail Page: Refined category badge (`bg-sage-100/90 text-sage-800 border-sage-200/80`), "Formulated For" health goals banner (`bg-sage-50/70 border-sage-200/70`), accordion active state (`group-open:bg-sage-100 group-open:text-sage-800`), and tabular feeding guide table with sage headers (`bg-sage-100/60`).
  - About Page: Added sage trust badges, structured warm sand-100 panels for clinical principles and sourcing commitments, quality guarantee checkmark badges, and visual separation for the "Behind the build" case study.
  - Meal Planner: Integrated sage-selected states and rings across all 4 steps (life-stage cards, neutered status pills, size indicator card, monoline cat activity cards, supportive health focus cards), with sage headline badge and hydration add-on card in PlanResult.
  - Homepage & Shop: Added sage trust badge in hero, sage-700 active category tabs with cream count badges, sage-50 aperture for CatSitting teaser, mobile filter count badges, and focus-visible keyboard styling.
  - Responsive audit verified across 360px, 640px, 768px, 1024px, 1440px+ widths; 90/90 Playwright E2E and 83/83 Vitest tests passing.
- 2026-10-25: Production Polish, Brand Authenticity & Full Interaction Audit completed:
  - Brand Authenticity & Content Cleanup: Removed all developer portfolio, case study, and AI prototype disclosures from customer-facing pages. Rewrote `About.tsx` into an authentic 6-part editorial brand story (Philosophy, Nutrition with Purpose, Ingredients You Can Understand, Designed for Everyday Care, Our Standards, and Clear CTA). Updated `Footer.tsx` with customer-facing Care & Standards and WCAG AA accessibility commitment. Preserved explicit checkout preview disclaimer in `SmartBag.tsx` tooltip.
  - Interactive Audit & Dead Element Remediation: Connected SmartBag product thumbnails and titles as clickable links navigating to PDP and closing drawer; connected PlanResult recommended monthly bundle items and ceramic fountain add-on directly to PDP; added direct "Explore the collection" shopping return path on PlanResult; added 44px+ touch targets and `active:scale-95` tactile feedback to gallery arrows, quantity steppers, bag buttons, and currency switcher.
  - Visual Hierarchy & Grid Polish: Balanced the final incomplete homepage collection grid row with 2 curated editorial discovery cards (Personalized Meal Plan & Our Standards) providing a balanced 12-tile layout across 1, 2, 3, and 4 columns; unified ProductCard title wrapping heights (`min-h-[3.25rem] flex items-start`) so price, specs, and Add buttons align across adjacent cards.
  - Verification: 0 typecheck errors, 0 lint warnings, 83/83 Vitest unit tests passing, 90/90 Playwright E2E tests passing. Prerendered static site build verified on localhost preview.
- 2026-10-26: Restored 404 page to original quiet layout with CatSitting monoline artwork, concise error copy, and primary action buttons (Shop the collection & Try the meal planner). Removed canvas audio game component and associated test suite.
- 2026-10-26: Unified Shop into Homepage: Made homepage collection the primary shop storefront (`#shop` with `#collection` alias); added product sorting dropdown (Featured, Price asc/desc), currency toggle, and category filter URL parameter synchronization (`/?category=...`); updated Header/Footer/PDP/About/Bag navigation links to point to `/#shop` with smooth scrolling and hash restoration in RouteAnnouncer; configured `/shop` to redirect to the unified homepage storefront; 83/83 Vitest and 90/90 Playwright tests passing.
- 2026-10-26: Refinement completed. Harmonized ProductCard info bar sizing and grid shape consistency:
  - Fixed root cause of oversized desktop typography: wrapped global `h1, h2, h3` display heading rules in `@layer base` in `src/index.css` so Tailwind utility classes (`font-sans text-[13px]`) override unlayered defaults correctly.
  - Compacted product bar across desktop and mobile to ~142px with uniform DM Sans typography, fixed 2-line title height (34px), and aligned baselines for category, price, specs, and add button.
  - Re-architected editorial discovery tiles (Meal Plan & Honest Standards) to mirror ProductCard's 2-part anatomy (aspect-square visual header with monoline cat art + compact info bar), creating 100% geometric uniformity across all 12 grid cards.
- 2026-10-26: Footer refinement completed. Replaced bottom-bar BDT rate disclaimer with creator attribution "Made with 🖤 by Saad Bin Kabir" linking to https://www.instagram.com/saaad.dng/ with accessible love description and hover micro-interaction; 83/83 Vitest tests, Playwright smoke tests, and static SSG build passing.
- 2026-10-26: Footer Hover Animation, Placement & Currency Toggle Refinement:
  - Added smooth animated expanding underline hover effect (`.footer-hover-link` with `::after` expanding from 0 to 100% width on hover and focus-visible) on all footer navigation links (`Home`, `Shop`, `Meal Planner`, `About`) and the creator attribution link (`Saad Bin Kabir`).
  - Perfected footer alignment and layout across desktop and mobile:
    - Balanced desktop columns with harmonized typography baselines (`mb-4` on section headings, `md:col-span-5 lg:col-span-5` for Brand, `md:col-span-3 lg:col-span-3` for Navigation, `md:col-span-4 lg:col-span-4` for Care & Standards).
    - Converted bottom bar to a true 3-column desktop grid (`md:grid md:grid-cols-3 md:items-center`): copyright text left-aligned, currency toggle dead center, and creator attribution right-aligned.
    - Compacted mobile footer spacing from `pt-16 pb-12 gap-10` to `pt-12 sm:pt-16 pb-10 sm:pb-12 gap-8` with centered, cleanly spaced bottom utilities.
  - Sized down footer currency toggle to a refined micro-switch (`size="xs"`, 21px height with 10px text and 2px container padding) for an unobtrusive aesthetic.
  - 0 typecheck errors, 0 lint warnings, 83/83 Vitest tests, 89/89 Playwright E2E tests, and static SSG build passing.
- 2026-10-26: Footer Underline Thickness Normalization & Currency Switch Interaction:
  - Fixed subpixel underline thickness variance (where "Shop" rendered thick and "Meal Planner" thin) by replacing fractional `height: 1.5px` with crisp integer `height: 2px` in `.footer-hover-link::after` and setting `leading-6` integer line-height on navigation links. Every link and creator attribution now renders with identical, razor-sharp 2px underline thickness across all monitors and DPI scalings.
  - Upgraded CurrencyToggle component with whole-surface toggle interaction: tapping either button (even the currently active one) toggles between USD and BDT, eliminating the need to pinpoint the exact opposite button.
- 2026-10-26: Shopping Session Memory & Location Restoration:
  - Created `src/lib/shop-session.ts` to persist customer shopping state (selected category, sort order, last viewed product, and in-shop status) in `sessionStorage` with fallback.
  - Updated `ProductCard.tsx` with unique `id={`product-${product.slug}`}`, `scroll-mt-24 sm:scroll-mt-28`, and click tracking so viewing a product records where the customer was.
  - Updated `Product.tsx` breadcrumb ("← Back to collection") to dynamically restore to the exact active category and anchor to the product card (`/?category=...#product-...`).
  - Updated `RouteAnnouncer.tsx` with requestAnimationFrame retry for hash anchors and shop-aware scroll restoration, preventing `window.scrollTo(0, 0)` from resetting the viewport to the hero when returning from shopping.
  - Updated `Home.tsx` to preserve the `#shop` hash on category changes, track shop vs hero presence via IntersectionObserver, restore active category filters, smoothly scroll back to the last viewed product card, and apply a 2.2s subtle highlight ring on return.
  - Updated `Shop.tsx` and `Header.tsx` to restore to the last product anchor when navigating to the shop.
  - 0 typecheck errors, 0 lint warnings, 89/89 Vitest unit tests, 90/90 Playwright E2E tests, and static SSG build passing.
- 2026-10-26: V2-01 completed. Created safe branch `playful-home`; added `docs/DESIGN-V2.md` and `docs/FLOW-CAT-PROMPTS.md`; updated `AGENTS.md` rules (removed AI/fictional disclosure requirement, added v2 non-negotiables, updated font budget to include Cormorant italic 500); updated `docs/CONTENT.md` notices; updated `PLAN.md` with v2 checklist.
- 2026-10-26: V2-02 completed. Comprehensive site audit compiled in `docs/V2-AUDIT.md`. Mapped 5 homepage sections, verified 0 dead buttons across routes, confirmed JS bundle baseline (60.89 KB gzip), verified 0 AI/portfolio disclosures in UI, mapped claims for V2-05/V2-07; 89/89 Vitest unit tests and 90/90 Playwright E2E tests passing.
- 2026-10-26: V2-03 completed. Cat photo intake pipeline established:
  - Audited all 6 cat photos in `Photo collection/cats/`: zero anatomy defects, zero text/logos, backdrop harmonizes with `#FBF6EE`, ample negative space for typography.
  - Documented role mapping in `docs/SITE-IMAGE-MAP.md` and `src/data/site-image-map.source.json`.
  - Extended `scripts/optimize-images.mjs` with `optimizeSiteImages()` to produce high-resolution WebPs ({640, 1024, 1600, 2000}w for hero, {640, 1024, 1600}w for others) without downscaling or aggressive compression per user rule. Generated typed `src/data/site-images.manifest.ts`.
  - Created `src/components/ui/SiteImage.tsx` with responsive srcset, dimensions, lazy loading, and error fallback.
  - Executed carton-over-cat blend test (`docs/screens/blend-test.png`) analyzing `mix-blend-mode: multiply` on tinted backdrops and documented card surface architecture.
  - Added unit test suite in `src/test/images.test.ts` (93/93 Vitest tests passing); static SSG build rendering all 15 routes cleanly.
- 2026-10-26: V2-04 completed. Reusable playful components created:
  - Font: Added Cormorant Garamond Latin 500 italic WOFF2 (`23.92 KB`, within ≤25 KB budget); added `--font-note` token and `.font-note` utility.
  - 5 New Cat Poses in `src/components/cat-art/`: `CatCurious` (1.70 KB), `CatWalking` (1.76 KB), `CatStretch` (1.68 KB), `CatCurled` (1.36 KB), `CatPeekEdge` (1.72 KB); all monoline 2px, currentColor, aria-hidden, strictly ≤1.8 KB each.
  - 6 Doodles in `src/components/doodles/`: `PawTrail`, `Heart`, `SparkleLine`, `Yarn`, `ScribbleArrow` (curve-left/right), `Wave` (soft sinusoidal divider); total new SVG size: 14.09 KB across all 11 SVGs.
  - Interactive Primitives: `Annotation` (italic note + arrow, aria-hidden), `Reveal` + `useReveal` (prerender-safe, reduced-motion aware, 12px rise), `Band` (cream/oat/sage with 12% color-mix and optional top wave), `CatCard` (real `<a>` or button, 4px lift on hover/focus, 44px min target), `IdleCat` (aria-hidden, ~6s twitch keyframes, pauses offscreen), `PawStamp` & `stampPaw` (brief tactile feedback on button add).
  - 103/103 Vitest tests passing; 0 typecheck errors, 0 lint warnings/errors; static SSG build passing.








