# P05 — Logo & wordmark
**Model:** Gemini 3.8 Flash · **Thinking:** High (needs vision) · **Mode:** Plan first

Read only: `docs/DESIGN.md` (Typography, Illustration), `docs/CONTENT.md` (Brand copy). View 3–4 approved `hero` photos (e.g. products 01, 02, 03, 06) for style.

## Goal
Build the logo **in code** (SVG + live text). Do not generate a raster logo and do not copy lettering from the photos.

## Brand facts
Exact name **NEKO DELICE**. Lockup: small cat-head outline glyph centred above the wordmark; wordmark in two lines (NEKO over DELICE), capitals, refined high-contrast serif (Cormorant Garamond 600), wide tracking, espresso `#2B211A`. Monoline, calm, matches the cat artwork on the packs.

## Tasks
1. Create 3 cat-head glyph options as SVG (viewBox 64×64, stroke 2, round caps, `currentColor`, no fills): A) minimal ears + chin curve, B) with tiny whisker ticks, C) sitting-profile head. Put them side by side with the wordmark in `docs/logo-options.html` (static page, light cream background, uses the self-hosted fonts or a system serif fallback). **STOP and ask me to pick one.**
2. After my pick: `src/components/brand/Logo.tsx` with variants `stacked` (footer/About/404), `compact` (header: glyph left, "NEKO DELICE" on two small lines or one line on ≥ 640 px), `glyph` (icon only). Accessible: wrapper link has `aria-label="NEKO DELICE home"`; decorative glyph `aria-hidden`.
3. `public/favicon.svg` (glyph, espresso on cream rounded square), `public/apple-touch-icon.png` (180×180, via sharp from the SVG), and `<link>` tags noted in PLAN.md for P07.
4. Remove `docs/logo-options.html` after the pick or keep it under `docs/archive/`.

## Exit check
Logo renders crisp at 24 px, 48 px and 160 px; spelling checked letter by letter; contrast ≥ 4.5. Tick P05; commit `feat: logo and favicon`.
