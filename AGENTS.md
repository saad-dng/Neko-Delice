# NEKO DELICE — Agent rules (always on, keep short)

Project: front-end portfolio storefront for cat nutrition + cat hardware. No backend, no real checkout.
Owner: Saad. Language: English. Currency toggle: USD / BDT.

## Read order (only what the current prompt names)
1. `PLAN.md` (status + decisions) → 2. `docs/PRD.md` (features; authoritative) → 3. `docs/DESIGN.md` (look + taste) → 4. `docs/CONTENT.md` (copy + data).
Where `PLAN.md` "Decisions" conflict with the PRD, **PLAN.md wins**.

## Fixed stack (do not add dependencies without asking me first)
Vite + React + TypeScript (strict) · Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `@theme`) · react-router-dom v6 + `vite-react-ssg` (prerender every route) · Zustand + persist · Vitest · Playwright (+ `@axe-core/playwright`) · Lighthouse CI · `sharp` (image script only).
No runtime CSS-in-JS. No UI kit. No icon library (inline SVG). No animation library (CSS only).

## Non-negotiables
- Brand name is spelled exactly **NEKO DELICE**. Logo = live text + SVG glyph. Never copy text out of AI-generated photos.
- Cats only in any illustration or artwork. No duck, fish, salmon, quail, chicken drawings.
- All planner/currency/nutrition constants live in `src/config/`. No magic numbers in components.
- Planner maths is **pure functions** in `src/lib/planner.ts`. The PDP feeding table and the Smart Bag durations must call the same functions.
- Filters and planner results live in the **URL**, not in the store. Bag, currency, planner profile live in Zustand (persisted, corrupted storage must not crash).
- Health-goal wording is supportive only ("supports", "formulated for"). Never "treats", "cures", "prevents".
- Every image: real alt text, explicit width/height, `srcset`, lazy below the fold. Only the LCP image is eager + `fetchpriority="high"`.
- Accessibility: semantic landmarks, one `h1` per route, visible focus ring, 44px touch targets, `prefers-reduced-motion` respected, colour never the only signal. Modals use native `<dialog>` + `showModal()`.
- Light theme only. No dark mode.
- Budgets: initial JS ≤ 170 KB gzip · hero image ≤ 150 KB · 2 font families × 2 weights, WOFF2, self-hosted · LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms · Lighthouse mobile ≥ 95 in all four categories.
- Zero dead routes, dead buttons, or console errors.
- Always show the planner disclaimer: "An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change."
- Disclose in the footer + About: product imagery is AI-generated concept art; products are fictional.

## Working method
- Do exactly what the current prompt in `prompts/` asks. Do not start the next phase.
- Prefer small diffs. Do not rewrite files you were not asked to change. Delete code you replace.
- Before finishing: run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and report each result in 1 line.
- Update the checkbox + notes for the phase in `PLAN.md`.
- Commit locally with a clear message (`feat: …`). **Never push, never create remotes, never deploy.** I push myself.
- Never commit `Photo collection/` (originals). Only optimised output in `public/images/`.
- If something is ambiguous or blocked, stop and ask one precise question instead of guessing.
- Keep replies short: what changed, how to verify, what is next.

## Skills available on demand (`.agents/skills/`)
`neko-planner-logic` · `neko-image-pipeline` · `neko-audit`. External design skills may also be installed; **docs/DESIGN.md overrides any skill that pushes a louder, trendier look.**
