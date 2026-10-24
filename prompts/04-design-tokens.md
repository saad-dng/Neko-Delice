# P04 — Design tokens, fonts, base UI
**Model:** Gemini 3.8 Flash · **Thinking:** Medium · **Mode:** Fast

Read only: `docs/DESIGN.md`. If installed, apply the `frontend-design` skill, but `docs/DESIGN.md` wins.

## Goal
The visual foundation: tokens, self-hosted fonts, global CSS, and a few accessible primitives. No pages yet.

## Tasks
1. **Sample real colours:** with a small Node script using `sharp`, sample the pack-band colours from the approved hero photos of products 01, 02, 03, 06 (median of a small patch on the band) and the beige backdrop. Print them next to the estimated hexes in `docs/DESIGN.md`. Use the sampled values if they differ by a visible amount; update `docs/DESIGN.md` table accordingly.
2. `src/styles/tokens.css` with Tailwind v4 `@theme`: colours, radii (12 / 20 / pill), spacing base 8 px, font families, type scale with `clamp()` for headings, shadows (none by default), easing + durations. Import in `src/index.css`.
3. Fonts: install `@fontsource/cormorant-garamond` and `@fontsource/dm-sans` (**this is the only dependency you may add**; tell me the exact versions). Import only weights 500/600 and 400/500, latin subset. Make sure the build outputs WOFF2 only, `font-display: swap`, and add a preload for the Cormorant 600 file via the layout `<Head>` in P07 (note it in PLAN.md).
4. Global CSS: reset, body (cream background, espresso text, 16–18 px, line-height 1.6), `:focus-visible` ring (2 px espresso + 2 px cream offset), `prefers-reduced-motion` block, `.sr-only`, `scroll-padding-top`.
5. Primitives in `src/components/ui/`: `Button` (primary/secondary/tertiary, `asChild` via `Link`), `Chip` (removable), `Container`, `Section`, `Heading`, `SkipLink`, `VisuallyHidden`, `Icon` (inline SVG set: bag, close, plus, minus, chevron, filter, check, arrow, globe). Min target 44 px.
6. A contrast test (Vitest) that asserts: espresso on cream/oat/beige ≥ 4.5; cream on terracotta-600 ≥ 4.5; oak-600 on cream ≥ 4.5.

## Do not
Add icon libraries, UI kits or animation libs. Build any page.

## Exit check
Tests pass; build passes; list font file sizes (total ≤ 120 KB). Tick P04; commit `feat: design tokens, fonts, base ui`.
