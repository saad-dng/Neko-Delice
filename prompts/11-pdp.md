# P11 — Product detail page
**Model:** Gemini 3.8 Flash · **Thinking:** Medium · **Mode:** Fast

Read only: `docs/PRD.md` section 5.3, `docs/DESIGN.md` (Imagery, Components), `src/data/products.ts`, `src/data/images.manifest.ts`, `src/lib/planner.ts` (exports only), skill `neko-image-pipeline`.

## Goal
`/product/:slug` for all ten products. Unknown slug renders NotFound.

## Tasks
1. Layout: gallery left (desktop) / top (mobile), info right. `--accent` CSS variable from the product accent.
2. **Gallery**: ordered images from the manifest (whatever exists, 4–5 per product), thumbnails (buttons, `aria-current`), arrow-key navigation, swipe-friendly scroll-snap on mobile, large image on beige tile. First image is the LCP: `loading="eager"`, `fetchpriority="high"`, and a preload `<link>` with `imagesrcset` in `Head`. Others lazy.
3. Content: name (h1), short description, price (currency-aware), supply basis line, goal chips with the supportive notes, accordion sections using native `<details>/<summary>`: Ingredients · Guaranteed analysis (table) · Specs (table) · Storage/feeding note.
4. **Daily feeding guide** for food items: table from `feedingTable(productId)` (same function the planner uses). Add a line "Based on a neutered adult lounger" or the kitten equivalent. Hardware/litter show their own spec or "About 30 days for one cat".
5. Purchase: quantity stepper (1–9, accessible), "Add to bag" (opens bag in P13; for now just calls `useBag.add` and announces "Added" in a live region), link "Build a monthly plan" → `/meal-plan`.
6. Related products (2–3 from data) using `ProductCard`.
7. SEO: unique title/description; JSON-LD `Product` (name, image, description, brand, offers with USD price and `availability: InStock`).
8. Image failure → placeholder with the same aspect ratio.

## Exit check
Playwright: all 10 slugs render one `h1`, gallery arrows work, a bad slug shows 404, accordion is keyboard-operable. Build prerenders all 10 pages. Tick P11; commit `feat: product detail page`.
