# P12 — Planner UI (wizard + results)
**Model:** Gemini 3.8 Flash · **Thinking:** High · **Mode:** Plan first
*(If the step logic or URL sync still fails after two attempts, switch to Claude Sonnet 4.6 for the fix only.)*

Read only: `docs/PRD.md` section 5.1 and 9, `docs/CONTENT.md` (Planner copy), `docs/DESIGN.md` (Motion, Components), `src/lib/planner.ts` + `plan-url.ts` (exports only), `src/components/cat-art/`.

## Goal
`/meal-plan` is the showpiece: four steps, a clear result, one-click bundle. A user tapping Next four times must get a valid result in under 60 seconds.

## Tasks
1. State lives in the URL (`decodeProfile`/`encodeProfile`), mirrored into `usePlannerProfile` for the Smart Bag. Step changes use `navigate(..., { replace: true })`. Back/Next keep answers.
2. Steps: (1) name optional, life stage radios with helper ages, neutered Yes/No (default Yes; disabled with explanation for kitten) · (2) weight slider 1.5–10.0 step 0.1 synced with a numeric input, `sizeBand` label (labelled as a size indicator, not body condition), optional kg/lb display toggle · (3) activity as three radio cards each with a cat pose + one-line description · (4) health focus radios incl. "No specific focus".
3. Progress: "Step 2 of 4" text + progress bar (width transition 250 ms). On step change move focus to the step heading and update a polite live region.
4. Sticky Next button on < 640 px. Real inputs (`input type=radio/range/number`), accessible names, slider announces value + unit.
5. **Result**: headline from content; RER and MER values; per-product daily amount (sachets or grams), bundle lines with qty, price (currency-aware), supply duration; fountain suggestion unchecked add-on (checkbox) for Urinary Care; "Edit answers" (back to step 1 without losing data); "Add bundle to bag" (calls `useBag.addMany` with checked lines, then opens the bag in P13; until then announce "Added"); disclaimer verbatim; "How we calculate this" `<details>` showing the formula with this cat's actual numbers and the constants; extreme-weight note at limits.
6. Count-up animation for kcal (≤ 900 ms); skipped under reduced motion.
7. Result is shareable: copying the URL restores the identical result. Add a "Copy link" button with a polite "Link copied" message.
8. Invalid params never show NaN; fall back to defaults.

## Exit check
Playwright: default run (Next ×4) reaches the result and adds the bundle; the 4.5 kg lounger neutered adult sensitive-stomach case shows 4 wet boxes + 1 dry bag; reload on `?...&step=result` restores; kitten disables neuter. axe has no serious issues on the page. Tick P12; commit `feat: meal planner ui`.
