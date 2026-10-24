# NEKO DELICE — Design & taste guide

Mood: **quiet apothecary**. A calm, editorial pantry shelf. Warm, matte, generous whitespace, photography does the talking.
Brand promise: *Honest food, quiet design, no guesswork.*
**This file overrides any installed design skill.** If a skill says bold / maximalist / gradient / glassmorphism / neon / oversized motion, ignore it.

## Colour tokens (Tailwind v4 `@theme`)
| Token | Hex | Use |
| --- | --- | --- |
| cream-50 | #FBF6EE | Page background |
| oat-100 | #E5D8BC | Cards, sections, pack colour |
| beige-200 | #DDD0BA | Photo tiles (matches photo backdrop #D2C5B3 so images blend in) |
| sand-300 | #D9C3A5 | Borders, dividers |
| espresso-900 | #2B211A | Text, headings, wordmark |
| terracotta-600 | #A94F33 | Primary buttons, accent text (5.07:1 on cream) |
| oak-600 | #8B6A45 | Wood-tone details, hardware accent (4.6:1 on cream) |
| band-sage | #8FA388 | Product 01, 04 accent (**fill only**, sampled #8FA388) |
| band-terracotta | #A66445 | Product 02 accent (**fill only**, sampled #A66445) |
| band-ochre | #9B6E3A | Product 03 accent (**fill only**, sampled #9B6E3A) |
| band-matcha | #8A9A74 | Product 06 accent (**fill only**, sampled #8A9A74; text variant #56744B = 4.89:1) |
| line-cream | #F1E9D6 | Monoline art on dark/band fills |

Sampled from hero packaging photos in P04 (backdrop #D2C5B3, sage #8FA388, terracotta #A66445, ochre #9B6E3A, matcha #8A9A74).
Rules: body text is always espresso on cream/oat/beige (≥10:1). Band colours are **never** body text. Small text in accent colour must be terracotta-600, oak-600 or matcha text variant. Cream text on terracotta-600 passes (5.07:1).
Per-product accent: set CSS variable `--accent` on the product page/card from its band colour (01,04 sage · 02 terracotta · 03 ochre · 06 matcha · 05 and hardware 07–10 oak).


## Typography
- Display: **Cormorant Garamond** 500 + 600. Use for h1–h3 and the wordmark. Never below 24 px (hairlines vanish).
- UI/body: **DM Sans** 400 + 500.
- Self-host WOFF2 (latin subset), `font-display: swap`, preload only the display 600 file.
- Scale (px): 14, 16, 18, 24, 32, 48, 64. Headings use `clamp()`. Body 16–18, line-height 1.6, max-width 65ch.
- Wordmark: uppercase serif, wide tracking (~0.18em), two lines: NEKO / DELICE, centered, with the cat-head glyph above. Exact spelling N-E-K-O D-E-L-I-C-E.

## Layout
8 px base unit · 12-col grid · content max 1280 px (full-bleed imagery allowed) · gutters 16 px mobile / 24+ desktop.
Radii: cards 12 px · modal/sheet 20 px · chips/buttons pill.
Breakpoints: <640 single column, filters + bag as bottom sheets · 640–1023 two columns · 1024–1535 three columns + filter rail · ≥1536 four columns capped at 1280.
Whitespace is a feature: section padding 80–120 px desktop, 48–64 px mobile. One idea per section.

## Imagery
- Product photos sit on `beige-200` tiles so the photo backdrop and card are the same colour; no borders, no drop shadows on tiles.
- Cards: default = role `hero`; hover swap (only `@media (hover:hover)`) = role `contents`. Smart Bag thumbnail = `hero`.
- Always reserve space with explicit `width/height` or `aspect-ratio` from the manifest. Failed image → neutral beige placeholder of the same ratio.
- Disclosure: "Concept imagery generated with AI. Products are fictional." in footer and About.

## Illustration
Monoline cat set only (P06): 2 px stroke, round caps/joins, `currentColor`, cream lines on band fills, espresso lines on cream. Poses: sleeping, sitting, stretching, playful, peeking, head. Used for planner activity options, empty states, 404, loaders. No other animals. No filled shapes except tiny eye dots.

## Components — feel
- Buttons: pill, 48 px min height, terracotta-600 fill with cream text (primary) · espresso outline (secondary) · text link with underline offset (tertiary). No gradients.
- Chips: pill, oat fill, espresso text, × icon button with 44 px hit area.
- Cards: oat/beige tile on top, text below on cream, no border. Price in DM Sans 500. Form spec in 14 px muted espresso (≥4.5:1).
- Inputs/sliders: 2 px espresso track, terracotta thumb, visible focus ring (2 px espresso + 2 px cream offset, ≥3:1).
- Modal/sheet: oat surface, radius 20 px, `::backdrop` espresso at 40 % + `backdrop-filter: blur(6px)` on that single element only.
- Icons: inline SVG, 1.5 px stroke, 24 px grid.

## Motion
150–250 ms ease-out for hover/state, 300 ms for modal/sheet, gentle spring only on the planner slider thumb. Allowed signature moments: bag icon bounce + count tick, planner progress bar fill, size-band label change, calorie count-up on results (≤ 900 ms), hover image swap (150 ms crossfade). Under `prefers-reduced-motion`: opacity-only, no count-up animation (show final number).

## Voice
Plain, warm, specific. Short sentences. No exclamation marks, no puns, no "pawsome". Numbers are shown with units. Supportive health wording only.

## Anti-slop checklist (reject your own output if any is true)
Purple/blue gradients · glass cards everywhere · emoji as icons · centered-everything hero with generic "Welcome to…" · lorem ipsum · stock-looking illustrations of other animals · drop-shadow stacks · more than two type families · all-caps body text · animated backgrounds · unused sections added "for completeness".
