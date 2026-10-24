# NEKO DELICE: Product Requirements Document v2.0

Date: 2026-10-24

## 1. Overview

NEKO DELICE is a responsive direct-to-consumer storefront for veterinary-formulated cat food, hygiene consumables and well-designed cat hardware, built around a calorie planner that turns a cat's profile into a ready-to-buy monthly bundle.

| Item | Detail |
| --- | --- |
| Document version | 2.0 (supersedes 1.0) |
| Type | Front-end portfolio project; no real checkout or backend |
| Platform | Responsive web app, desktop-first layout with mobile touch optimization |
| Role shown | Product design, UX architecture, front-end engineering |

**The problem.** Online pet stores are cluttered, hide how much a cat should actually eat, and sell mismatched, unattractive gear. Owners guess portions and buy by packaging rather than by need.

**The solution.** A calm, editorial shopping experience with three pillars:

- **Guided nutrition:** the Calorie & Meal Planner estimates daily energy needs and builds a monthly bundle from the catalog.
- **Frictionless discovery:** ten curated products, instant filters, and URL-synced state so every filtered view is shareable.
- **Transparent supply:** the Smart Bag shows how many days each item will last for the cat that was profiled.

**Portfolio objective.** Demonstrate advanced client-side state management, URL-synced filtering, a custom algorithm, and visual execution that holds up to a 95+ Lighthouse score. The finished site should read as a real, believable brand, not a template.

**Brand promise (for copy and design decisions).** Honest food, quiet design, no guesswork.

## 2. Goals, Metrics & Scope

Success means a visitor can finish the planner and add a bundle in under 60 seconds, on a site that scores 95+ in Lighthouse and has no broken route or dead control.

| Goal | Metric | Target | How to verify |
| --- | --- | --- | --- |
| Fast guided conversion | Time from opening /meal-plan to bundle in bag | 60 s or less, using default selections | Timed run with 5 testers |
| Performance | Lighthouse Performance, mobile profile | 95+ on Home, Shop, PDP, Meal Plan | Lighthouse CI on production build |
| Accessibility | Lighthouse Accessibility, plus manual keyboard and screen-reader pass | 95+ and zero blocking issues | Lighthouse, axe, keyboard-only run |
| Best practices and SEO | Lighthouse Best Practices and SEO | 95+ each | Lighthouse CI |
| Core Web Vitals | LCP, CLS, INP | 2.5 s or less, 0.1 or less, 200 ms or less | Lighthouse, WebPageTest |
| Completeness | Dead routes, dead buttons, console errors | Zero | Manual route crawl, Playwright smoke test |
| Client appeal | Perceived quality of design and micro-interactions | Reviewer can name 3 distinctive details | Portfolio feedback |

**In scope:** five views, ten products, planner, filters, PDP, Smart Bag modal, currency toggle, cart persistence, 404 page.

**Out of scope for v1:** real checkout and payments, user accounts, backend or CMS, reviews, search, order tracking. These are listed in section 10 as future work.

## 3. Personas & Key Journeys

Two personas drive every decision: one who wants to be told what to buy, and one who already knows.

| | Persona A: The Guided Buyer | Persona B: The Quick Restocker |
| --- | --- | --- |
| Who | New or anxious cat owner, unsure about portions | Experienced owner who knows the brand's category |
| Goal | Know exactly how much to feed and what to buy | Reorder or add one item in a few clicks |
| Entry point | Home hero call to action, then /meal-plan | /shop with filters, or a shared filtered URL |
| Key feature | Calorie & Meal Planner and bundle | Filters and Smart Bag supply-duration metadata |
| Success signal | Bundle in bag in under 60 s | Item in bag in under 15 s from landing on /shop |
| Main fear | Feeding the wrong amount | Wasting time on clutter |

**Journey A, guided.** Home, tap "Plan my cat's meals", four planner steps, results with daily calories and a monthly combo, "Add Bundle to Bag", Smart Bag opens showing supply duration.

**Journey B, restock.** Home or direct link to /shop, apply a category filter, open product or quick-add, Smart Bag opens with the new line and a currency toggle if needed.

**Journey C, curious.** Home, About / Our Ingredients, then into the shop through a product link on that page.

## 4. Site Architecture & Navigation

The site has five core views plus a 404, all reachable from a persistent header and footer.

| Route | View | Purpose | Key components |
| --- | --- | --- | --- |
| / | Home | Brand story and fastest paths into the planner or shop | Hero, Bento category grid, planner teaser, featured products, ingredient promise strip |
| /shop | Shop Catalog | Browse and filter all 10 products | Filter bar, product grid, active-filter chips, empty state |
| /product/:slug | Product Detail | Convince and inform | Gallery, feeding guide, ingredients, specs, add to bag |
| /meal-plan | Calorie & Meal Planner | Compute calories and build a bundle | 4-step wizard, progress bar, results panel |
| /about | About / Our Ingredients | Build trust | Sourcing, vet formulation, quality commitments, ingredient imagery |
| * | 404 | Recover gracefully | Friendly message, links to Shop and Planner |

**Global header:** logo, Shop, Meal Planner, About, currency toggle (USD / BDT), Bag icon with live item count.

**Global footer:** brand line, route links, preview disclaimer, accessibility statement.

**URL contract for /shop:** filters live in query parameters, for example `/shop?category=wet-food&stage=kitten&goal=sensitive-stomach`. Loading that URL must restore the exact filtered view, and changing a filter must update the URL without a full page reload.

**Slugs:** each product has a stable slug (listed in section 6) used for /product/:slug and for image file names.

## 5. Feature Requirements

Five features carry the product: the planner, catalog filters, product detail, the Smart Bag, and the currency toggle. Each has testable rules below.

### 5.1 Calorie & Meal Planner (/meal-plan)

The planner is a four-step wizard that estimates a cat's daily calories and converts them into a monthly bundle built only from catalog items.

**Steps and inputs**

| Step | Input | Rules |
| --- | --- | --- |
| 1. About your cat | Name (optional), life stage, neuter status | Life stage: Kitten (under 12 months), Adult (1 to 10 years), Senior (11+ years), with the age range shown as helper text. Neutered defaults to Yes. Empty name falls back to "your cat". |
| 2. Weight | Slider 1.5 to 10.0 kg, step 0.1, synced with a numeric field | Show a size band (Petite, Typical, Large) beside the slider. This is a size indicator, not a body-condition score, so label it as such. Optional kg/lb display toggle. |
| 3. Activity | Indoor Lounger, Playful Explorer, High-Energy | Each option has a one-line description to avoid guessing. |
| 4. Health focus | Urinary Care, Hairball Control, Sensitive Stomach, Coat Shine, or No specific focus | Single primary focus. "No specific focus" is required so nobody is forced into a false choice. |

Every step has Back and Next, a visible progress indicator ("Step 2 of 4"), and keeps answers when going back. Defaults let a user tap Next four times and still get a valid result.

**Energy calculation.** Resting energy requirement (RER) is computed from body weight in kilograms, then scaled to maintenance energy requirement (MER).

```
RER = 70 x W^0.75
MER = RER x F_life x F_activity
```

| Life stage and status | F_life |
| --- | --- |
| Kitten | 2.5 |
| Adult, neutered | 1.2 |
| Adult, intact | 1.4 |
| Senior, neutered | 1.1 |
| Senior, intact | 1.3 |

| Activity | F_activity |
| --- | --- |
| Indoor Lounger | 0.9 |
| Playful Explorer | 1.0 |
| High-Energy | 1.15 |

The life-stage factors follow commonly published veterinary ranges; the activity multipliers are a design assumption to keep results sensible. Document both in an in-app "How we calculate this" disclosure, and keep every constant in one config file so they can be tuned.

**Worked example (use as a unit test).** A neutered adult at 4.5 kg, Indoor Lounger: RER = 70 x 4.5^0.75 ≈ 216 kcal; MER = 216 x 1.2 x 0.9 ≈ 234 kcal per day.

**Bundle logic**

1. Split daily calories between wet and dry food. Default split: Adult and Senior 50% wet / 50% dry; Kitten 60% wet / 40% dry; Urinary Care shifts to 70% wet / 30% dry because added moisture is the point.
2. Choose products by life stage and focus using the tags in section 6. Kitten uses the Kitten Growth Mousse; Adult and Senior use the Salmon & Quail Pâté.
3. Convert calories to physical quantity: wet pouches per day = wet kcal / kcal per pouch; dry grams per day = dry kcal / kcal per gram.
4. Round wet food up to whole 12-pouch boxes covering at least 30 days; round dry food up to whole bags.
5. Add focus extras: Coat Shine and Hairball Control add one bottle of Pure Norwegian Salmon Oil; Urinary Care adds the Ceramic Water Fountain as a suggested (unchecked) add-on.
6. Treats and toppers must stay within 10% of daily calories and are subtracted from the food budget.

**Worked bundle (same cat, focus Sensitive Stomach).** 117 kcal per day each from wet and dry. At 80 kcal per pouch that is 1.46 pouches per day, so 4 boxes (48 pouches) last about 33 days. At 3.9 kcal per gram the dry share is 30 g per day, so one 2.5 kg bag lasts about 83 days.

**Output screen.** Shows the cat's name, daily kcal with the RER and MER values, daily grams or pouches per product, the bundle lines with quantity, price and supply duration, an "Edit answers" control that jumps back without losing data, a one-click **Add Bundle to Bag** button, and the estimate disclaimer: "An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change." The result must be encoded in the URL so it can be shared and survives refresh.

### 5.2 Shop Catalog & Filters (/shop)

Filters update the grid instantly and stay in sync with the URL, so any filtered view can be bookmarked or shared.

| Facet | Options | Logic |
| --- | --- | --- |
| Category | Wet Food, Dry Food, Treat / Topper, Litter, Hardware | OR within a facet |
| Life Stage | Kitten, Adult, Senior | Products tagged "All stages" match every stage |
| Health Goal | Urinary Care, Hairball Control, Sensitive Stomach, Coat Shine | Products with no tagged goal are excluded when a goal is selected |

- Facets combine with AND. Invalid or unknown query values are ignored, never crash.
- Active filters appear as removable chips above the grid, with a "Clear all" action and a live result count announced to screen readers.
- With only ten products, some combinations return zero. The empty state must explain why and offer the nearest matches plus "Clear filters", so it never looks broken.
- Sort options: Featured (default), Price low to high, Price high to low.
- Each card shows packaging image, name, form spec, price in the active currency, and a quick-add button.

### 5.3 Product Detail Page (/product/:slug)

- **Gallery:** several images per product with thumbnails and arrow-key navigation; the first image is the priority-loaded LCP element.
- **Content blocks:** short description, ingredient breakdown (accordion), guaranteed analysis, specs table, and a supply-duration note.
- **Daily feeding guide (food items):** a table of daily amounts by cat weight, generated by the same planner function so the PDP and the planner never disagree.
- **Purchase:** quantity stepper, add to bag, and a link back to the planner.
- **Related:** two or three products that pair naturally, for example the Ceramic Water Fountain beside wet food.
- Unknown slug renders the 404 view.

### 5.4 Smart Bag (modal)

| Requirement | Detail |
| --- | --- |
| Trigger | Bag icon in the header, or automatically after any add-to-bag action |
| Presentation | Centered modal over a blurred backdrop on desktop (solid dim scrim fallback when backdrop blur is unsupported); bottom sheet on screens under 640 px |
| Lines | Image, name, form spec, quantity stepper (1 to 9), remove, line price |
| Supply duration | Per food line, "Lasts ~N days" computed from the cat profiled in the planner; if no profile exists, use a labeled reference cat (4.5 kg neutered adult) and say so. Hardware shows "One-time purchase" |
| Totals | Subtotal and estimated total in the active currency; shipping shown as "calculated at checkout" |
| Footer | "This is a storefront preview. Checkout is not connected yet." and a disabled-looking but accessible Checkout button with an explanatory tooltip |
| Empty state | Friendly message with links to the Planner and Shop |
| Persistence | Bag contents saved to localStorage and restored on load, with safe handling of corrupted data |
| Accessibility | role=dialog, aria-modal, focus trapped inside, Esc and backdrop click close, focus returns to the trigger, background scroll locked |

### 5.5 Currency Toggle

- Global control in the header switching between $ USD and ৳ BDT, remembered across visits.
- Base prices are stored in USD. BDT uses a single fixed rate defined in config and labeled "approximate", with prices rounded to the nearest ৳10 for a clean look. Do not fetch live rates.
- Formatting uses Intl.NumberFormat so symbols and separators are correct; no layout shift when the currency changes.

## 6. Product Catalog & Data Model

Ten products drive the filters, planner and Smart Bag, and every health goal is covered by at least two of them. Prices and calorie values below are placeholders for the build and should be replaced if you source real figures.

| ID | Slug | Product | Category | Life stage | Health goals | Price (USD, placeholder) | Supply basis |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | kitten-growth-mousse-broth | Kitten Growth Mousse & Broth | Wet Food | Kitten | Sensitive Stomach | 34 | 12 pouches, 95 kcal each |
| 02 | wild-salmon-quail-pate | Wild Salmon & Quail Pâté | Wet Food | Adult, Senior | Urinary Care, Sensitive Stomach, Coat Shine | 30 | 12 pouches, 80 kcal each |
| 03 | duck-sweet-potato-kibble | Oven-Baked Duck & Sweet Potato Kibble | Dry Food | All stages | Sensitive Stomach, Hairball Control | 29 | 2.5 kg at 3.9 kcal/g |
| 04 | norwegian-salmon-oil | Pure Norwegian Salmon Oil | Treat / Topper | All stages | Coat Shine, Hairball Control | 24 | 250 ml, fixed daily pump count |
| 05 | freeze-dried-chicken-hearts | Freeze-Dried Chicken Heart Bites | Treat / Topper | All stages | None | 14 | 100 g at about 4 kcal/g |
| 06 | matcha-tofu-litter | Matcha Green Tea Tofu Litter | Litter | All stages | None | 18 | 5.4 kg, about 30 days for one cat |
| 07 | stainless-oak-litter-basin | The Neko Stainless & Oak Litter Basin | Litter / Hardware | All stages | None | 89 | One-time purchase |
| 08 | tilted-ceramic-whisker-bowl | Tilted Ceramic Whisker-Relief Bowl | Hardware | All stages | None | 42 | One-time purchase |
| 09 | ceramic-water-fountain | Whisper-Quiet Ceramic Water Fountain | Hardware | All stages | Urinary Care (hydration) | 64 | One-time purchase |
| 10 | sisal-birch-scratcher | Architectural Sisal & Birch Scratcher | Hardware | All stages | None | 79 | One-time purchase |

The kibble is positioned as an all-life-stages formula so it can pair with the kitten mousse in the planner. Product 07 sits in both Litter and Hardware; for the filter, give it a single primary category (Litter) and list it under Hardware as a secondary tag so it appears in either view.

**Product record (example).** Each product is one typed object in a local data module:

```json
{
  "id": "02",
  "slug": "wild-salmon-quail-pate",
  "name": "Wild Salmon & Quail Pâté",
  "category": "wet-food",
  "secondaryCategories": [],
  "lifeStages": ["adult", "senior"],
  "healthGoals": ["urinary-care", "sensitive-stomach", "coat-shine"],
  "priceUSD": 30,
  "unit": { "type": "pouch", "count": 12, "grams": 85, "kcalPerUnit": 80 },
  "images": ["..."],
  "ingredients": ["..."],
  "specs": { "...": "..." }
}
```

**Content integrity rules.**

- Health goal tags must be backed by the ingredient list and use supportive wording ("supports", "formulated for"), never medical claims like "treats" or "prevents".
- Because these are fictional products, write one consistent ingredient list and guaranteed analysis per food item and reuse it in the PDP and the About page so everything agrees.
- Image file names follow `<slug>-<shot>.webp`, for example `wild-salmon-quail-pate-01.webp`.

## 7. Design System

The look is warm and editorial: soft cream surfaces, earthy accents, generous whitespace, and photography that does most of the talking.

**Color tokens (starting palette; adjust against real photos).**

| Token | Hex | Use |
| --- | --- | --- |
| cream-50 | #FBF6EE | Page background |
| oat-100 | #F1E7D8 | Cards, sections |
| sand-300 | #D9C3A5 | Borders, dividers |
| terracotta-500 | #B5573A | Primary accent, key buttons |
| sage-400 | #8FA58A | Secondary accent, success, kitten items |
| oak-600 | #8B6A45 | Wood-tone details |
| espresso-900 | #2B211A | Body text and headings |

Text on cream must meet WCAG AA (4.5:1 for body). Espresso on cream passes comfortably; check terracotta on cream for small text and use it for large text or fills with cream text instead.

**Typography.** A warm serif for display headings (for example Fraunces or a similar soft serif) and a clean humanist sans for UI and body (for example Inter or DM Sans). Self-host two weights per family as WOFF2 with `font-display: swap`, and preload only the primary display font. Type scale: 14, 16, 18, 24, 32, 48, 64 px with fluid clamping on headings.

**Layout and spacing.** 8 px base unit, 12-column grid, content max width 1280 px with full-bleed imagery allowed, 16 px gutters on mobile and 24 px or more on desktop. Corner radii: 12 px for cards, 20 px for the modal, full pill for chips and buttons.

**Motion.** Calm and short: 150 to 250 ms ease-out for hovers and state changes, 300 ms for the modal and drawer, and a gentle spring on the planner slider thumb. All motion respects `prefers-reduced-motion` by switching to opacity-only transitions.

**Imagery rules.**

- One consistent photographic style for all ten products: soft daylight from the left, warm neutral backdrops, shallow depth of field, no harsh shadows.
- Product images are prepared separately from this document. Export 1:1 at 2048 px for source, then derive WebP or AVIF at 640, 1024 and 1600 px with explicit width and height attributes.
- Every image has meaningful alt text describing the product and what is shown.

**Micro-interactions worth building.** Bag icon bounce and count increment on add, a planner progress bar that fills smoothly, the slider's size band changing label as it moves, a result screen that counts calories up from zero, and hover swaps from the hero image to a second product image on product cards (disabled on touch).

## 8. Technical Requirements

The stack should favor a small JavaScript payload and clean, typed state, since both the Lighthouse target and the portfolio goal depend on it.

| Area | Requirement |
| --- | --- |
| Framework | React with TypeScript and a file-based or declarative router. Vite SPA with build-time prerendering, or Next.js with static export. Pick one before starting; either must output real HTML for each route so SEO and first paint are strong. |
| Styling | Tailwind CSS or CSS Modules driven by the design tokens in section 7. No runtime CSS-in-JS. |
| State | Small store (for example Zustand) for bag, currency and planner profile, with persistence middleware to localStorage. Filters and planner results live in the URL, not in the store. |
| Data | Static typed module for the ten products. No network calls at runtime. |
| Planner logic | Pure functions in one module (`calcRER`, `calcMER`, `buildBundle`, `supplyDays`) with unit tests, including the 4.5 kg worked example. |
| Routing | Five views plus 404, scroll restoration, per-route page titles and meta descriptions, focus moved to the page heading on navigation. |
| Images | WebP or AVIF with srcset and sizes, explicit width and height, lazy loading below the fold, LCP image preloaded with high fetch priority. |
| Testing | Vitest for logic, Playwright smoke test that visits every route and exercises planner, filters, currency and bag; Lighthouse CI on every push. |
| Hosting | Static host such as Vercel, Netlify or Cloudflare Pages, with HTTPS and cache headers on hashed assets. |

**Performance budget.**

| Metric | Budget |
| --- | --- |
| Initial JavaScript (gzipped) | 170 KB or less |
| Hero image | 150 KB or less (AVIF or WebP) |
| Total page weight on first load | 1 MB or less excluding below-fold lazy images |
| Web fonts | Two families, two weights each, WOFF2 only |
| Largest Contentful Paint | 2.5 s or less on mobile profile |
| Cumulative Layout Shift | 0.1 or less |
| Interaction to Next Paint | 200 ms or less |

Heavy effects must be justified against this budget. The blurred modal backdrop should use CSS `backdrop-filter` on a single element and be dropped for users with reduced-motion or low-power preferences if it hurts frame rate.

## 9. Accessibility, Responsiveness & Edge Cases

**Accessibility requirements.**

- Semantic landmarks on every page: header, nav, main, footer, with one h1 per view and a logical heading order.
- Every interactive element reachable and operable by keyboard, with a visible focus ring that has at least 3:1 contrast against its surroundings.
- Skip-to-content link as the first focusable element.
- Planner: radio groups use real inputs; the slider has an accessible name and announces value and unit; step changes move focus to the step heading and announce progress.
- Filters and bag counts announce changes through polite live regions.
- Modal behavior as specified in 5.4; the bag button states its item count in its accessible name.
- Color is never the only signal; touch targets are at least 44 px.
- Respect `prefers-reduced-motion` everywhere. Dark mode is not required for v1 (light theme only); this is a deliberate decision.

**Responsive behavior.**

| Breakpoint | Layout notes |
| --- | --- |
| Under 640 px | Single column, filters in a bottom sheet, Smart Bag as bottom sheet, sticky planner Next button |
| 640 to 1023 px | Two-column product grid, filters in a collapsible bar |
| 1024 to 1535 px | Three-column grid, persistent filter rail on /shop, centered modal |
| 1536 px and above | Four-column grid capped at the 1280 px content width, with full-bleed hero imagery scaling up gracefully to ultra-wide displays |

**Edge cases and states to design and test.**

| Situation | Expected behavior |
| --- | --- |
| Filters return zero products | Explanatory empty state with nearest matches and Clear filters |
| Unknown product slug or route | 404 page with links to Shop and Planner |
| Corrupted or missing localStorage | Start with an empty bag and default currency, no crash |
| Planner reached with invalid URL params | Ignore bad values, fall back to defaults, never show NaN |
| Weight at slider limits (1.5 kg, 10.0 kg) | Valid result; show a gentle note that very small or large cats should see a vet for feeding advice |
| Kitten with neutered selected | Neuter status is ignored for kittens and the control is disabled with an explanation |
| Bundle already in the bag | Adding again increases quantities rather than duplicating lines |
| Quantity changed in the bag | Supply-duration lines and totals recompute immediately |
| Image fails to load | Neutral placeholder with the same aspect ratio, no layout shift |
| JavaScript disabled | Prerendered content and a clear message for interactive features |

## 10. Build Phases, Out of Scope & Open Questions

Build in six phases, and do not start a phase until the previous one's exit check passes.

1. **Assets and data.** Prepare all product images (generated separately) and write the product data module and ingredient copy. Exit: all ten products have approved images and consistent data.
2. **Foundation.** Project setup, design tokens, layout shell, routing, header, footer, 404. Exit: every route renders and Lighthouse is already 95+ on empty pages.
3. **Catalog.** Shop grid, URL-synced filters, product cards, PDP. Exit: filtered URLs reload correctly and empty states work.
4. **Planner.** Calculation module with unit tests, four-step wizard, results and bundle builder. Exit: the 4.5 kg worked example passes and a full run takes under 60 seconds.
5. **Bag and currency.** Smart Bag modal, persistence, supply-duration metadata, currency toggle. Exit: keyboard and screen-reader pass on the modal.
6. **Polish and audit.** Micro-interactions, responsive QA from 360 px to 2560 px, accessibility audit, Lighthouse CI, case-study write-up. Exit: all targets in section 2 are met.

**Out of scope for v1 (possible v2 work).** Real checkout and payments, accounts and saved cat profiles, a backend or CMS, product search, reviews, subscriptions with auto-ship, multi-cat households, dark mode, and localization beyond the currency toggle.

**Open questions to settle before building.**

- Framework choice: Vite SPA with prerendering, or Next.js static export?
- Fixed USD to BDT rate: which value and which as-of date to show?
- Real or fictional nutrition data: keep the placeholder calorie and price values, or replace them with figures from real products?
- Should the planner support more than one cat in v1? (Recommendation: no.)
- Will the portfolio page include a short case study explaining the calorie algorithm and design decisions? (Recommendation: yes, it will do more for client trust than the site alone.)
