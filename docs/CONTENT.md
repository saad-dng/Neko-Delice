# NEKO DELICE — Content & data source of truth

All products are fictional. All prices, kcal and analysis values are **placeholders**; keep them in data/config so they can be swapped.
Wording rule: "supports", "formulated for". Never "treats", "cures", "prevents".

## Brand copy
- Tagline: **Honest food, quiet design, no guesswork.**
- Hero H1: "Feed your cat exactly what they need." Sub: "Tell us about your cat. We work out the calories and build a month of meals."
- Primary CTA: "Plan my cat's meals" · Secondary: "Shop the collection"
- Promise strip (3): "Formulated with a vet-informed approach" · "Short ingredient lists, no fillers" · "Know how long every bag lasts"
- Footer line: "Honest food, quiet design." · Preview note: "This is a storefront preview. Checkout is not connected yet."
- Imagery disclosure: "Concept imagery generated with AI. Products are fictional."
- Planner disclaimer (verbatim): "An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change."
- Extreme-weight note (≤1.5 kg or ≥10 kg): "Very small or large cats should get feeding advice from a vet."
- Kitten + neutered: control disabled, helper "Neuter status doesn't change a kitten's needs, so we skip it."

## Currency
`USD_TO_BDT = 123` (approximate), BDT rounded to nearest ৳10, label "BDT prices are approximate". Format with `Intl.NumberFormat`.

## Wet food unit (decision)
Stick sachet 40 g · 24 per carton · Kitten Mousse 45 kcal/sachet · Paté 38 kcal/sachet.

## Products
Fields: slug · name · category · life stages · goals · USD · unit/supply basis · accent

### 01 kitten-growth-mousse-broth — Kitten Growth Mousse & Broth
Wet food · Kitten · goal: Sensitive Stomach · $34 · 24 stick sachets × 40 g, 45 kcal each · accent sage
Short: "A silky chicken mousse in its own broth, formulated for growing kittens."
Ingredients: deboned chicken (62%), chicken broth, chicken liver, egg yolk powder, salmon oil, dried chicory root, taurine, vitamins (A, D3, E, B12), minerals (zinc, iron, copper chelates).
Analysis (as fed): protein min 10.5% · fat min 6.5% · fibre max 0.8% · moisture max 80% · ME ≈ 1.12 kcal/g.
Feeding note: "Serve at room temperature. Refrigerate opened sachets and use within 24 hours."

### 02 wild-salmon-quail-pate — Wild Salmon & Quail Paté
Wet food · Adult, Senior · goals: Urinary Care, Sensitive Stomach, Coat Shine · $30 · 24 stick sachets × 40 g, 38 kcal each · accent terracotta
Short: "A smooth paté of wild salmon and quail, formulated for adult and senior cats."
Ingredients: wild salmon (30%), quail (22%), chicken broth, quail liver, pumpkin, dried cranberry, sunflower oil, taurine, vitamins (A, D3, E, B12), minerals (zinc, iron, copper chelates).
Analysis: protein min 10% · fat min 5.5% · fibre max 1% · moisture max 80% · magnesium max 0.03% · ME ≈ 0.94 kcal/g.
Goal wording: Urinary Care → "High moisture and controlled magnesium support urinary health." Coat Shine → "Salmon supports skin and coat."

### 03 duck-sweet-potato-kibble — Oven-Baked Duck & Sweet Potato Kibble
Dry food · All life stages · goals: Sensitive Stomach, Hairball Control · $29 · 2.5 kg bag, 3.9 kcal/g (9,750 kcal) · accent ochre
Short: "Slow oven-baked kibble with duck and sweet potato, formulated for every life stage."
Ingredients: duck (26%), duck meal, sweet potato, chickpeas, duck fat, psyllium husk, flaxseed, dried chicory root, taurine, vitamins (A, D3, E), minerals.
Analysis: protein min 34% · fat min 15% · fibre max 4.5% · moisture max 9% · ME ≈ 3.9 kcal/g.
Goal wording: Hairball Control → "Psyllium and fibre support healthy hair passage."

### 04 norwegian-salmon-oil — Pure Norwegian Salmon Oil
Treat / topper · All stages · goals: Coat Shine, Hairball Control · $24 · 250 ml amber glass bottle with pump, 1 pump ≈ 1 ml ≈ 9 kcal; suggested 1 pump/day (≈250 days) · accent sage
Short: "Cold-filtered salmon oil in an amber glass bottle. One pump over food, once a day."
Ingredients: 100% Norwegian salmon oil, mixed tocopherols (natural preservative).
Analysis: fat min 99% · EPA + DHA min 18%.
Goal wording: "Omega-3s support skin, coat and hairball management."

### 05 freeze-dried-chicken-hearts — Freeze-Dried Chicken Heart Bites
Treat / topper · All stages · goals: none · $14 · 100 g paper-based pouch, ≈4 kcal/g · accent oak
Short: "One ingredient. Freeze-dried chicken heart, crumbled over a meal or given as a treat."
Ingredients: 100% chicken heart, freeze-dried.
Analysis: protein min 70% · fat min 15% · moisture max 5%.
Note: treats and toppers stay within 10% of daily calories.

### 06 matcha-tofu-litter — Matcha Green Tea Tofu Litter
Litter · All stages · goals: none · $18 · 5.4 kg vacuum brick, about 30 days for one cat · accent matcha
Short: "Plant-based tofu pellets scented softly with matcha. Low dust, clumping."
Materials: tofu (soybean fibre) pellets, matcha green tea powder.
Note: shown as "About 30 days for one cat". Do not claim flushable or septic-safe.

### 07 stainless-oak-litter-basin — The Neko Stainless & Oak Litter Basin
Litter + Hardware (primary Litter, secondary Hardware) · All stages · $89 · one-time purchase · accent oak
Short: "A brushed stainless basin in a solid oak frame, with a matching scoop."
Specs: brushed stainless steel basin · solid oak frame · includes scoop · wipe-clean, non-porous · approx. 52 × 40 × 14 cm (placeholder).

### 08 tilted-ceramic-whisker-bowl — Tilted Ceramic Whisker-Relief Bowl
Hardware · All stages · $42 · one-time purchase · accent oak
Short: "A shallow, tilted ceramic bowl in an ash stand, shaped so whiskers stay clear of the rim."
Specs: glazed ceramic · ash wood stand · ~15° tilt · ~180 ml (placeholder) · dishwasher-safe bowl.

### 09 ceramic-water-fountain — Whisper-Quiet Ceramic Water Fountain
Hardware · All stages · goal: Urinary Care (hydration) · $64 · one-time purchase · accent oak
Short: "A glazed ceramic fountain with a quiet pump, to encourage drinking."
Specs: glazed ceramic · ~2 L (placeholder) · quiet pump · replaceable charcoal filter.
Goal wording: "Fresh moving water supports hydration."

### 10 sisal-birch-scratcher — Architectural Sisal & Birch Scratcher
Hardware · All stages · $79 · one-time purchase · accent oak
Short: "A tall sisal-wrapped column on a solid birch base."
Specs: natural sisal rope · solid birch base · ~60 cm tall (placeholder) · stable, weighted base.

## Pairings (related products)
01↔09 · 02↔09 · 03↔04 · 04↔02 · 05↔03 · 06↔07 · 07↔06 · 08↔01 · 09↔02 · 10↔05 (agent may refine; keep 2–3 each).

## Planner copy
Steps: "About your cat" · "Weight" · "Activity" · "Health focus".
Life stage helper: Kitten "under 12 months" · Adult "1 to 10 years" · Senior "11+ years".
Activity: Indoor Lounger "Naps in sunbeams, short play" · Playful Explorer "Daily play and curiosity" · High-Energy "Runs, climbs, never stops".
Size band label (indicator, not body condition): Petite (<3.5 kg) · Typical (3.5–6 kg) · Large (>6 kg).
Focus options: Urinary Care · Hairball Control · Sensitive Stomach · Coat Shine · No specific focus.
Result headline: "{name} needs about {kcal} kcal a day." Disclosure title: "How we calculate this".

## Empty states
Shop (0 results): "Nothing matches all of these filters. Closest matches are below." + Clear filters.
Bag: "Your bag is empty." + links to Meal Planner and Shop.
404: "We couldn't find that page." + links to Shop and Meal Planner.

## Alt text pattern
"{Product name}, {role description}" e.g. "Wild Salmon & Quail Paté carton with a stick sachet on a warm beige backdrop." Describe what is visible; no keyword stuffing; never claim text the image does not show.

## About page outline
Hero line · Our approach (vet-informed, short ingredient lists) · Sourcing (Norwegian salmon, duck, quail — fictional) · Quality commitments (batch-tested, no fillers) · Ingredient close-ups (reuse `contents`/`detail` photos) · Behind the build (algorithm + design decisions + performance numbers, written last in P15) · Disclosure.
