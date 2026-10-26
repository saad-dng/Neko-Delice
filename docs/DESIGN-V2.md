# NEKO DELICE — Design addendum v2: "playful premium"

Applies to the homepage first, then to small details across every page. `docs/DESIGN.md` still governs tokens, type, spacing and accessibility. This file only adds. If they conflict on palette, type or accessibility, DESIGN.md wins; on homepage layout and playfulness, this file wins.

## Goal
Anyone landing on the homepage must understand in two seconds that this is **cat food**: a real cat, a bowl, a pack, and cat illustrations. Mood stays calm and premium. Playfulness is **balanced**: warm and charming, never loud.

## What stays
Cream / oat / beige / sage / terracotta palette · Cormorant Garamond + DM Sans · rounded pill buttons · 8 px grid · existing components (ProductCard, Button, Chip, bag, planner) · all routes and logic. Extend, do not replace.

## What is new
1. **Real cat photography** in the hero and two supporting sections (see `docs/FLOW-CAT-PROMPTS.md`).
2. **Supporting monoline illustrations**: the existing cat set plus new poses (curious sitting and looking up, walking, stretching, peeking over an edge, curled tail) and doodles: paw trail, small heart, sparkle line, yarn ball, scribble arrow, soft wavy divider.
3. **Handwritten-style annotations**: short notes with a small hand-drawn arrow, set in Cormorant Garamond *italic* 500 (one extra font file, ≤ 25 KB, `font-display: swap`; the font budget becomes 3 files for display + 2 for UI). Max 3 per page. Decorative (`aria-hidden`) and never carry essential information.
4. **Soft section bands**: a sage tint (sage at ~12 % over cream, via `color-mix`) or oat band, with a gentle wavy top edge (inline SVG). Flat colours only.
5. **Real interactions** (see prompt V2-06): everything that looks clickable must work.

## Homepage anatomy (keep existing routes; reuse existing components)
1. **Header** (existing): logo, Shop, Meal Planner, About, currency toggle, bag. No account or wishlist icons.
2. **Hero**: left text, right real cat photo fading softly into the cream (CSS mask), product pack overlapping the photo's lower right, small bowl/pack kept natural. One handwritten note with arrow pointing at the cat. Bottom edge a soft wave. Below the CTAs, 3 truthful chips.
   - Eyebrow (optional): "Cat nutrition, planned"
   - H1: "Good food for" / "curious cats." (second line in matcha text colour `#56744B`, still ≥ 4.5:1)
   - Sub: "Short ingredient lists, honest portions, and a plan built around your cat."
   - CTAs: "Plan my cat's meals" (primary → `/meal-plan`) · "Shop the collection" (secondary → `/shop`)
   - Chips: "Short ingredient lists" · "Formulated for every life stage" · "Know how long each pack lasts"
   - Note: "Mealtime is the best time."
3. **Planner band** (sage tint): a curious seated cat illustration left, headline "No guesswork. Just the right plan for your cat.", one line of copy, and **three clickable cat cards** (Indoor lounger / Playful explorer / High-energy). Clicking one opens `/meal-plan` with `act=` preselected and the first step shown. Beneath: three small steps "Tell us about your cat → See the daily calories → Get a monthly bundle". The planner disclaimer is shown in small text.
4. **Shop preview**: heading "Everything your cat needs, nothing they don't." Category tabs that really filter the preview grid (All, Wet food, Dry food, Treats and toppers, Litter, Hardware). Grid uses `ProductCard` (working Add button, bag bounce). "View full collection" → `/shop` with the active category in the URL.
5. **Why band** (oat): real cat photo eating, headline "Better food. Better days.", four truthful value points (below), link "Our philosophy" → `/about`. A small illustration of a cat curled up with the note "Planned portions".
6. **Calm strip** (replaces the reference's trust strip): "Plan in about a minute" · "Ingredients listed in full" · "Supply length shown on every pack". No customer counts, reviews, avatars, security or delivery claims.
7. **Closing CTA**: cat peeking over the edge of the section, "Feed your cat with confidence." + the two CTAs.
8. **Footer** (existing, refined): logo, tagline, links to real routes only, currency toggle, copyright. No newsletter form, social icons, FAQ/Shipping/Returns/Contact links, or "Made with…" line.

## Truthful value points (use these, from `docs/CONTENT.md`)
- "Short, recognisable ingredients: the full list is on every product page."
- "Made for their stage: kitten, adult and senior formulas."
- "Formulated to be gentle: recipes that support sensitive stomachs."
- "Plans that add up: portions and pack length calculated for your cat."

## Never use (invented or over-claiming)
"10,000+ happy cats", "Loved by cats. Trusted by humans.", customer avatars, reviews, "Secure checkout", "Fast, reliable delivery", "100% human-grade", "grain-free", "clinical", "zero synthetic binders", "vet-approved", "real science". No puns in headlines ("purr-fect"). Light warmth is allowed in handwritten notes only.

## Motion catalogue (CSS only: `transform` and `opacity`)
| Moment | Effect | Time |
| --- | --- | --- |
| Section reveal | fade + 12 px rise, once | 400 ms |
| Hero load | text rises in, photo fades in (never delay the LCP image) | 500 ms |
| Cat illustrations | idle: tail or ear twitch every ~6 s, hover: head tilt | 600 ms |
| Planner cards | lift 4 px + cat looks up on hover/focus; pressed state | 200 ms |
| Add to bag | paw print stamps on the button, bag bounces, small "Added. Undo" toast | 300 ms |
| Peek cat | slides up from the section edge when scrolled into view | 500 ms |
| Planner progress | a small cat marker walks along the progress bar between steps | 250 ms |
| Route change | quick fade between pages | 150 ms |
All off or reduced to a plain opacity change under `prefers-reduced-motion`. No scroll-jacking, no parallax over the LCP image, no infinite loops longer than a gentle idle twitch.

## From the reference mockups: keep vs skip
Keep: large real cat in the hero, handwritten notes, soft wave, sage planner band, cat-peeks-from-edge, paw trail, curious seated cat, category tabs, "Better food. Better days." band, calm footer layout.
Skip (not functional or not truthful): wishlist hearts, account icon, newsletter box, social icons, customer avatars and counts, Secure checkout / delivery claims, extra footer pages, "Grain-free" and "human-grade" chips.

## Notices
Remove every disclosure about AI imagery, fictional products, or testing/portfolio status from the UI and metadata. **Keep exactly one notice:** the bag's "This is a storefront preview. Checkout is not connected yet." Do not add a new one.
