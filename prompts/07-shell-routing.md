# P07 — Layout shell, routing, prerender, SEO
**Model:** Gemini 3.8 Flash · **Thinking:** Medium · **Mode:** Fast

Read only: `docs/PRD.md` sections 4 and 9, `docs/DESIGN.md` (Layout), `docs/CONTENT.md` (Brand copy).

## Goal
Every route exists, prerenders to real HTML, and has the final header/footer. Pages are simple stubs with a proper `h1`.

## Tasks
1. `src/routes.tsx` (vite-react-ssg `RouteRecord[]`): `/` Home, `/shop`, `/product/:slug`, `/meal-plan`, `/about`, `*` NotFound. For `/product/:slug` provide `getStaticPaths` from `src/data/slugs.ts` (the 10 fixed slugs from `docs/CONTENT.md`; P08 will derive this from product data). Lazy-load Shop, Product, MealPlan, About with `lazy`.
2. `Layout`: `SkipLink` first, `<header>` (compact `Logo`, nav Shop · Meal Planner · About, currency toggle placeholder button "USD", bag button with count 0 and accessible name "Open bag, 0 items"), `<main id="main" tabIndex={-1}>`, `<footer>` (stacked logo, brand line, route links, preview note, imagery disclosure, accessibility statement link text only if a page exists; otherwise a short statement paragraph). Mobile nav: simple disclosure menu, no JS library.
3. Route announcer: on navigation move focus to the page `h1`, announce title in a polite live region, restore scroll.
4. SEO: per-route `<title>` and meta description via vite-react-ssg `Head`; canonical; Open Graph tags (image added in P15); favicon links from P05; font preload (Cormorant 600); `public/robots.txt`; post-build script generating `sitemap.xml` for all routes (site URL from an env var `VITE_SITE_URL`, default `https://example.com`).
5. NotFound page with `CatSitting`, message from `docs/CONTENT.md`, links to Shop and Meal Planner. Unknown product slug will render this too (P11).
6. Real `<noscript>` message for interactive features.

## Exit check
`npm run build` outputs HTML for `/`, `/shop`, `/meal-plan`, `/about`, all 10 `/product/<slug>`, and a 404 page. Each route has exactly one `h1`, a unique title, and passes a Playwright smoke test (add `tests/e2e/routes.spec.ts`). Tick P07; commit `feat: layout shell, routing, prerender, seo`.
