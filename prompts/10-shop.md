# P10 — Shop: filters, URL sync, cards, bag & currency stores
**Model:** Gemini 3.8 Flash · **Thinking:** High · **Mode:** Plan first

Read only: `docs/PRD.md` sections 5.2 and 9, `docs/DESIGN.md` (Components, Layout), `docs/CONTENT.md` (Empty states), `src/data/products.ts`, `src/lib/format.ts`.

## Goal
The `/shop` page works completely, with the stores the rest of the site will use.

## Tasks
1. **Stores** (`src/store/`, Zustand + `persist`, `partialize`, versioned key, safe JSON parse with try/catch and reset on corruption, SSR-safe): `useBag` (`lines[{productId, qty 1–9}]`, `add`, `setQty`, `remove`, `clear`, `addMany` merging quantities, `count`), `useCurrency` (`'USD'|'BDT'`, default USD), `usePlannerProfile` (last profile). Unit-test corrupted storage → empty bag + defaults.
2. **Filter logic** `src/lib/filters.ts` (pure, tested): facets category (OR), stage (products tagged all stages match every stage), goal (products with no goal excluded when a goal is selected); AND across facets; invalid query values ignored; sort `featured|price-asc|price-desc`; `nearestMatches(filters)` (drop one facet at a time, return products matching the most facets, de-duplicated).
3. **URL sync**: `useSearchParams`; `/shop?category=wet-food&stage=kitten&goal=sensitive-stomach&sort=price-asc`. Loading the URL restores the view; changing a filter updates the URL without reload and uses `replace` for rapid changes.
4. **UI**: filter rail on ≥ 1024 px, bottom-sheet filters (native `<dialog>`) under 1024 px; active-filter chips with "Clear all"; live region "N products" (polite); result grid 1/2/3/4 columns per breakpoints; sort select.
5. **ProductCard**: `ProductImage` (hero → hover `contents`/`together` crossfade only under `@media (hover:hover)`), name, `packSizeLabel`, price via `formatPrice` and `useCurrency`, quick-add button (`aria-label="Add {name} to bag"`) calling `useBag.add`. Whole card links to the PDP; the button must not be nested inside the anchor (use a stretched-link pattern).
6. **Empty state** with `CatPeeking`, message from content, nearest matches, "Clear filters".
7. Image loading on `/shop`: all card images lazy; do not preload anything. Report which element is the LCP on mobile (text or first image) in your summary.

## Exit check
Playwright test: apply 3 filters → URL changes → reload restores → remove chip → URL updates; a zero-result combo shows the empty state and nearest matches; bad `?category=zzz` is ignored. Unit tests green. Tick P10; commit `feat: shop, filters, stores`.
