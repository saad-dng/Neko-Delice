# P08 — Product data, content, currency formatting
**Model:** Gemini 3.8 Flash · **Thinking:** Medium · **Mode:** Fast

Read only: `docs/CONTENT.md`, `docs/PRD.md` section 6, `src/data/images.manifest.ts` (headers only), `PLAN.md` Decisions.

## Goal
One typed, validated source of truth for the 10 products and money formatting.

## Tasks
1. `src/data/types.ts`: `Product` with `id, slug, name, short, category, secondaryCategories, lifeStages, healthGoals, priceUSD, unit {type: 'sachet'|'bag'|'bottle'|'pouch'|'litter'|'hardware', countPerPack?, gramsPerUnit?, kcalPerUnit?, kcalPerGram?, packSizeLabel}, accent, ingredients[], analysis{}, specs{}, goalNotes{}, feedingNote?, related[]`.
2. `src/config/nutrition.ts` (placeholders, documented): sachet 40 g × 24; kcal/sachet 45 (01) and 38 (02); kibble 3.9 kcal/g, 2,500 g bag; oil 9 kcal per pump, 250 pumps; chicken hearts 4 kcal/g, 100 g.
3. `src/data/products.ts`: all ten products exactly from `docs/CONTENT.md` (names, copy, ingredients, analysis, specs, accent, pairings). Product 07: primary category `litter`, secondary `hardware`. Health-goal notes use supportive wording only.
4. `src/data/slugs.ts` now derived from `products` (update P07's route `getStaticPaths`).
5. `src/config/site.ts`: `USD_TO_BDT = 123`, `BDT_ROUND_TO = 10`, `RATE_LABEL = "BDT prices are approximate"`, site name, default meta.
6. `src/lib/format.ts`: `formatPrice(usd, currency)` using `Intl.NumberFormat` (`USD` → `$`, `BDT` → `৳` with `en-BD` or equivalent that renders ৳; round BDT to nearest ৳10), `formatDays`, `formatKcal`. No layout shift: use `tabular-nums`.
7. Vitest: unique slugs; every health goal appears on ≥ 2 products; every product has a `hero` image in the manifest; no copy contains "treats", "cures", "prevents" (case-insensitive) except the category name "Treat / Topper"; formatPrice(30,'BDT') shows ৳3,690 and formatPrice(34,'BDT') shows ৳4,180 (4,182 rounded to the nearest 10).

## Exit check
Tests pass; build passes. Tick P08; commit `feat: product data, content, currency format`.
