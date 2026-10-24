# P06 — Monoline cat illustration set
**Model:** Gemini 3.8 Flash · **Thinking:** High (needs vision) · **Mode:** Plan first

Read only: `docs/DESIGN.md` (Illustration). View 2–3 hero photos to match the line style of the pack artwork (cream monoline cats on a colour band).

## Goal
A small, consistent set of SVG cat components. **Cats only.**

## Tasks
1. Create React components in `src/components/cat-art/`: `CatSleeping`, `CatSitting`, `CatStretching`, `CatPlayful`, `CatPeeking` (peeking over a leaf or edge), `CatHead` (reuse the chosen logo glyph). Each: `viewBox="0 0 120 120"`, 2 px stroke, round caps/joins, `stroke="currentColor"`, `fill="none"` (tiny filled eye dots allowed), `aria-hidden` by default with optional `title` prop, size via `className`. Each under 1.5 KB.
2. Mapping (document in a comment): Indoor Lounger = sleeping · Playful Explorer = sitting or stretching (pick the best fit) · High-Energy = playful · empty bag = peeking · 404 = sitting looking up.
3. Make `docs/cats-preview.html` showing all six at 48/96/160 px on cream, oat and sage-band backgrounds in both espresso and cream line colours.
4. **STOP and ask me to review the preview** and request tweaks (one revision round).

## Do not
Draw any animal other than cats. Add gradients, shadows or fills.

## Exit check
All six components render with no console errors; total SVG size reported. Tick P06; commit `feat: monoline cat illustrations`.
