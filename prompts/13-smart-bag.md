# P13 — Smart Bag modal + currency toggle UI
**Model:** **Claude Sonnet 4.6** · **Thinking:** default · **Mode:** Plan first
*(Accessibility-critical. Keep the diff small: use the native `<dialog>` to avoid custom focus-trap code.)*

Read only: `docs/PRD.md` sections 5.4 and 5.5, `docs/DESIGN.md` (Modal), `src/store/*`, `src/lib/planner.ts` (exports), `src/lib/format.ts`, `src/components/layout/Header.tsx`.

## Goal
A polished, accessible bag and a working currency switch.

## Tasks
1. **SmartBag** with native `<dialog>` + `showModal()`: centred modal ≥ 640 px, bottom sheet < 640 px (CSS only), `::backdrop` espresso 40 % + `backdrop-filter: blur(6px)` (single element; fall back to solid scrim via `@supports not`), 300 ms transition (opacity-only under reduced motion). Esc and backdrop click close; focus returns to the trigger; body scroll locked; heading is the dialog's accessible name.
2. Open from the header bag button and automatically after any add-to-bag (PDP, quick-add, planner bundle). Expose a tiny `useBagUi` store (`open`, `trigger`).
3. Lines: `ProductImage` (hero), name, pack-size label, quantity stepper 1–9, remove, line price. **Supply duration** per food line: "Lasts ~N days" via `supplyDays` using the planner profile; with no profile use the reference cat and show "Based on a 4.5 kg neutered adult"; hardware shows "One-time purchase"; litter "About 30 days for one cat". Changing quantity recomputes immediately.
4. Totals: subtotal and estimated total in the active currency; shipping "calculated at checkout". Footer message verbatim "This is a storefront preview. Checkout is not connected yet." and a Checkout button with `aria-disabled="true"` plus an accessible tooltip explaining why (focusable, not `disabled`).
5. Empty state with `CatPeeking` and links to Meal Planner and Shop (links close the dialog).
6. **Currency toggle** in the header: segmented control USD | BDT (`role="group"`, pressed states), persisted, label "BDT prices are approximate" shown in the bag and footer. No layout shift when switching (tabular figures, reserved width).
7. Bag icon bounce + count tick on add (CSS keyframes, reduced-motion safe); header button accessible name always includes the count.
8. Tests: bag quantity merge on `addMany`; corrupt localStorage; Playwright: add item → dialog opens → Tab cycles inside → Esc closes → focus back on trigger; currency switch changes prices on shop and bag.

## Exit check
axe zero serious issues with the dialog open; keyboard-only pass; build passes. Tick P13; commit `feat: smart bag and currency toggle`.
