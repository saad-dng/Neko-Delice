# Site Cat Photography Map

Audited and catalogued for Homepage v2 ("Playful Premium") intake under Stage V2-03.
In compliance with project non-negotiables:
- Zero extra toes, strange eyes, deformed paws, or AI glitches (all visually verified).
- Zero text or logo watermarks.
- Backdrop tones harmonize with `#FBF6EE` / `#EDE5D8` warm cream/beige palette.
- High-resolution, uncompromised image quality without aggressive compression.

---

## Catalog & Roles

### 1. Primary Hero (`hero`)
- **Source File:** `Photo collection/cats/cat-hero-01_20261026210942.jpg`
- **Native Dimensions:** 1200 × 896 (Landscape)
- **Role:** Main Hero Banner (`#hero`)
- **Backdrop Tone:** Seamless warm cream studio `#FBF6EE`, matches product packaging and storefront background.
- **Cat Subject:** Fluffy cream/apricot adult cat seated peacefully beside a low cream ceramic bowl filled with kibble.
- **Negative Space:** Open left 50% and upper quadrant, leaving ample room for the Cormorant headline ("Real food your cat would choose"), trust marks, and CTAs.
- **Alt Text:** "Fluffy cream cat seated calmly beside a low ceramic bowl filled with kibble on a warm neutral studio backdrop."
- **Why Chosen:** Radiates calm, premium contentment and clean nutrition; natural dish integration pairs effortlessly with Neko Delice product packs.

---

### 2. Hero Alternate (`hero-alt`)
- **Source File:** `Photo collection/cats/cat-hero-02_20261026210942.jpg`
- **Native Dimensions:** 1200 × 896 (Landscape)
- **Role:** Alternate hero / Secondary showcase
- **Backdrop Tone:** Warm sand/beige with subtle palm leaf in upper right.
- **Cat Subject:** Golden British Shorthair eating from an elevated ceramic bowl set in a wooden cross-stand.
- **Negative Space:** Open left 55%.
- **Alt Text:** "Golden British Shorthair cat eating from a ceramic bowl on an elevated wooden stand against a warm neutral backdrop."
- **Why Chosen:** Direct demonstration of cat hardware (elevated wooden stand bowl) during feeding.

---

### 3. Nutrition & Appetite Band (`eating`)
- **Source File:** `Photo collection/cats/cat-eating-01_20261026210942.jpg`
- **Native Dimensions:** 896 × 1200 (Portrait)
- **Role:** "Better food. Better days." nutrition & palatability band
- **Backdrop Tone:** Warm caramel-beige studio backdrop.
- **Cat Subject:** Fluffy silver-grey tabby cat eagerly eating kibble from a sage green ceramic bowl with visible pink tongue.
- **Negative Space:** Upper 35% above the cat's arched back.
- **Alt Text:** "Silver-tabby cat leaning over a sage green ceramic bowl to enjoy dry kibble on a warm studio backdrop."
- **Why Chosen:** Palatability in action; shows realistic appetite and food appreciation in an organic, appetizing way.

---

### 4. Delivery & Unboxing CTA (`peek`)
- **Source File:** `Photo collection/cats/cat-peek-01_20261026210942.jpg`
- **Native Dimensions:** 1376 × 768 (Wide 16:9 Landscape)
- **Role:** Closing CTA / Fresh Box Delivery divider
- **Backdrop Tone:** Uniform neutral sand/beige.
- **Cat Subject:** Curious golden cat peeking out of a plain unprinted kraft cardboard box with paws hooked over the rim.
- **Negative Space:** Wide horizontal clearance over the entire top 50%.
- **Alt Text:** "Curious golden cat peeking over the edge of a plain kraft cardboard delivery box with paws resting on the rim."
- **Why Chosen:** Playful, charming unboxing moment; wide aspect ratio naturally anchors a full-bleed or wide card section.

---

### 5. Cat Personality & Quality Spotlight (`portrait`)
- **Source File:** `Photo collection/cats/cat-portrait-01_20261026210942.jpg`
- **Native Dimensions:** 1024 × 1024 (1:1 Square)
- **Role:** Quality / Nutrition philosophy card
- **Backdrop Tone:** Warm neutral beige.
- **Cat Subject:** Golden British Shorthair sitting upright with an inquisitive head tilt and vibrant green eyes.
- **Negative Space:** Upper corners surrounding the cat's head.
- **Alt Text:** "Golden British Shorthair cat sitting attentively with a curious head tilt against a warm neutral backdrop."
- **Why Chosen:** Showcases kitten nutrition and bonding treats with pristine clarity.

---

## Carton Over Cat Blend Test (`mix-blend-mode: multiply`)

- **Artifact:** `docs/screens/blend-test.png`
- **Setup:** Product 03 carton hero (`duck-sweet-potato-kibble-hero-1024.webp`) layered directly over `cat-hero-01` (`hero-1024.webp`) using `mix-blend-mode: multiply`.

### Visual Findings
1. **Background Halo Box:** Because the product carton photo is on a warm tinted studio backdrop (~`#EDE5D8`) rather than pure transparent `#FFFFFF`, `mix-blend-mode: multiply` multiplies the product's warm tint against the hero's warm cream backdrop, creating a visible darker square boundary around the carton.
2. **Body Transparency Artifact:** Any overlapping of the pack directly over the cat reveals the cat's fur through the pouch body, because multiply treats lighter tones as translucent.

### Recommended Architectural Fix for Homepage
1. **Zero Raw Blend Overlays:** Do not use `mix-blend-mode: multiply` on full-frame unclipped product photos over cat photography.
2. **Dedicated Card Surfaces:** Display product cards on dedicated surface cards with subtle shadows (e.g. `bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#2B211A]/5`).
3. **Zoned Composition:** Keep cat photography in its natural right-aligned anchor zone (where the cat peacefully rests beside its ceramic bowl) and anchor product showcase cards / floating badges in the left-hand negative space where no unwanted edge collision occurs.

