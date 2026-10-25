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
- [ ] P08 Product data, content, currency formatting
- [ ] P09 Planner engine + tests (pure logic)
- [ ] P10 Shop: filters, URL sync, cards, bag/currency stores
- [ ] P11 Product detail page
- [ ] P12 Planner UI (wizard + results)
- [ ] P13 Smart Bag modal + currency toggle UI
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



