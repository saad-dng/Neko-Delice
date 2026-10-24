# P09 — Planner engine + tests (pure logic)
**Model:** **Claude Sonnet 4.6** · **Thinking:** default · **Mode:** Plan first
*(Maths and edge cases are where Flash makes silent mistakes. Keep this task narrow to save tokens.)*

Read only: skill `neko-planner-logic` (follow it exactly), `src/config/nutrition.ts`, `src/data/types.ts`, `src/data/products.ts` (ids, unit data only).

## Goal
Pure, fully tested planner logic. No React, no UI.

## Tasks
1. `src/config/planner.ts`: all factors, split ratios, treat cap 10 %, weight limits 1.5–10.0 step 0.1, days target 30, reference cat, defaults.
2. `src/lib/planner.ts` exports: `calcRER(kg)`, `calcMER(profile)`, `splitRatio(profile)`, `buildBundle(profile)` returning lines `{ productId, qty, dailyAmount, unit, supplyDays, price, suggested?, checked? }` plus totals and the numbers needed for display (RER, MER, per-product daily amount), `supplyDays(productId, qty, profile)`, `feedingTable(productId)` (rows for 2, 3, 4, 5, 6, 8, 10 kg using the same maths for a neutered adult lounger reference; for kitten products use the kitten factor), `sizeBand(kg)`, `normalizeProfile(raw)` (validate + clamp + defaults).
3. `src/lib/plan-url.ts`: `encodeProfile(profile, step)` / `decodeProfile(searchParams)` per the skill's URL contract. Invalid input falls back to defaults. Name: trim, max 24 chars.
4. Tests in `src/lib/planner.test.ts` covering every "Golden test" in the skill, plus: weight 1.4 and 10.1 clamp; NaN/"abc" → defaults; kitten + urinary-care gives 70/30; boxes ≥ 30 days and ≥ 1; oil kcal subtracted from food; fountain suggested and unchecked only for urinary-care; URL round-trip equals original for 50 random valid profiles; garbage query string never throws.

## Do not
Touch UI files. Add dependencies. Hard-code numbers outside `src/config/`.

## Exit check
`npm test` all green; paste the output of the worked example (RER, MER, wet boxes, days, dry bags, days). Tick P09; commit `feat: planner engine with tests`.
