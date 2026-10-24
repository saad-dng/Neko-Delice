# P14 — Home, About (+ Behind the build), micro-interactions
**Model:** Gemini 3.8 Flash · **Thinking:** High · **Mode:** Plan first

Read only: `docs/DESIGN.md`, `docs/CONTENT.md` (Brand copy, About outline), `docs/PRD.md` section 4 (Home/About rows), `src/data/images.manifest.ts`. Apply `frontend-design` / `taste-skill` if installed; `docs/DESIGN.md` wins.

## Goal
The two storytelling pages, built from existing photos and cat art. **No new images are generated.**

## Tasks
1. **Home**: (a) hero: H1 + sub + two CTAs on the left, a composed product still on the right built from existing hero photos (choose the strongest 1–2; this is the LCP image: ≤ 150 KB, preloaded, correct `sizes`); (b) bento category grid (Wet, Dry, Treats & Toppers, Litter, Hardware) using product photos on beige tiles with category links to `/shop?category=…`; (c) planner teaser with `CatSitting` and a mini 3-step description; (d) featured products (4) using `ProductCard`; (e) promise strip (3 items); (f) closing CTA. One idea per section, generous spacing.
2. **About**: follow the outline in `docs/CONTENT.md`; ingredient close-ups from `contents`/`detail` photos; sourcing + quality commitments; disclosure; **"Behind the build"** section with: the formula and constants (read from config so they never drift), a diagram of the planner flow (inline SVG or simple CSS), design decisions (palette from the packs, monoline cats, native dialog, URL-synced state), and a performance table with placeholders `TBD` that P15 fills with measured numbers.
3. **Micro-interactions** (CSS only): card hover swap polish, bag bounce (done in P13, verify), planner progress bar, slider thumb spring (only here), size-band label cross-fade, section reveal on scroll using `IntersectionObserver` limited to opacity (disabled for reduced motion and for the LCP section).
4. Keep layout shift at zero (reserved image ratios). Use `content-visibility: auto` for below-fold sections with `contain-intrinsic-size`.
5. All copy from `docs/CONTENT.md`; no filler text.

## Exit check
Lighthouse mobile on `/` and `/about` ≥ 95 each (report all four scores); no console errors; responsive check at 360, 768, 1280, 1920 px with screenshots saved to `docs/screens/`. Tick P14; commit `feat: home, about, micro-interactions`.
