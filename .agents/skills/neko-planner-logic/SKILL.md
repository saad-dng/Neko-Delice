---
name: neko-planner-logic
description: Use when writing or changing the NEKO DELICE calorie planner, bundle builder, supply-duration, feeding table or planner URL state. Contains the formulas, constants, rounding rules, test cases and URL contract.
---

# NEKO DELICE planner logic

Pure TypeScript in `src/lib/planner.ts`. Constants in `src/config/planner.ts` and `src/config/nutrition.ts`. No React imports. Never return NaN/Infinity: validate and clamp.

## Formulas
RER = 70 × W^0.75 (W kg, clamp 1.5–10.0, step 0.1)
MER = RER × F_life × F_activity

| Life stage / status | F_life |
| --- | --- |
| kitten (neuter ignored) | 2.5 |
| adult neutered / intact | 1.2 / 1.4 |
| senior neutered / intact | 1.1 / 1.3 |

| Activity | F_activity |
| --- | --- |
| lounger | 0.9 |
| explorer | 1.0 |
| high-energy | 1.15 |

Life-stage factors follow published veterinary ranges; activity multipliers are a design assumption. Both are shown in the "How we calculate this" disclosure.

## Bundle
1. Treat/topper budget: if focus is `coat-shine` or `hairball-control` add 1 bottle of product 04; its daily kcal (1 pump ≈ 9 kcal) is subtracted from the food budget. Cap treats/toppers at 10% of MER.
2. Food kcal = MER − topper kcal.
3. Wet/dry split of food kcal: adult & senior 50/50 · kitten 60/40 · focus `urinary-care` 70/30 (wins over kitten).
4. Wet product: kitten → 01, adult/senior → 02. Dry product: 03 always.
5. Wet sachets/day = wet kcal ÷ kcal per sachet (01: 45, 02: 38). Dry g/day = dry kcal ÷ 3.9.
6. Wet boxes = ceil(30 × sachets/day ÷ 24). Dry bags = ceil(30 × g/day ÷ 2500) (min 1).
7. `supplyDays(item, qty, profile)` = units × unit-size ÷ daily amount (round to whole days, floor for display "about N days"). Hardware → null ("One-time purchase"). Litter → fixed "about 30 days".
8. Urinary Care also returns the fountain (09) as `suggested: true, checked: false`.
9. Reference cat when no profile: neutered adult, 4.5 kg, lounger, no focus. Label it "Based on a 4.5 kg neutered adult".

## Golden tests (must pass)
- Adult neutered, 4.5 kg, lounger → RER ≈ 216.3, MER ≈ 233.6.
- Same cat, focus sensitive-stomach → 116.8 kcal wet, 116.8 kcal dry → ≈3.1 sachets/day → **4 boxes** → ≈31 days; dry ≈30 g/day → **1 bag** → ≈83 days.
- Kitten ignores neuter flag (neutered true/false gives identical MER).
- Focus urinary-care → 70/30 and fountain suggested, unchecked.
- Focus coat-shine → bottle of product 04 added; topper kcal ≤ 10% of MER.
- Weight 1.5 and 10.0 are valid; 1.4, 10.1, "abc", NaN clamp or fall back to defaults.
- Boxes always cover ≥ 30 days; never 0.

## URL contract for /meal-plan
`/meal-plan?name=Mochi&stage=adult&neutered=1&w=4.5&act=lounger&focus=sensitive-stomach&step=3` and `&step=result`.
Allowed: stage kitten|adult|senior · neutered 0|1 · w number · act lounger|explorer|high-energy · focus urinary-care|hairball-control|sensitive-stomach|coat-shine|none · step 1–4|result. Unknown or invalid values are ignored and replaced by defaults. Name max 24 chars, plain text only (escape on render).
