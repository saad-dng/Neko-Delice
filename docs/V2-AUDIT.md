# NEKO DELICE — Homepage v2 Audit Report (V2-02)

Comprehensive pre-implementation audit conducted on branch `playful-home` prior to homepage restructure.

---

## 1. Current Homepage Section Map

| # | Section | Rendering Location | Key Components Used | Layout & Role |
|---|---|---|---|---|
| 1 | **Hero** | `src/pages/Home.tsx` (lines 199–255) | `Container`, `Section`, `Button` (paw & head icons) | Centered editorial hero; eyebrow badge; H1 ("Feed your cat exactly what they need."); subcopy; dual CTAs; 3 trust bullets. |
| 2 | **The Shop / Collection** | `src/pages/Home.tsx` (lines 257–479) | `Section` (`#shop`, `#collection`), `Container`, `Heading`, `CurrencyToggle`, `ProductCard`, `PawPrint`, `CatSitting`, `CatHead` | Category tablist (6 pills); count toolbar; sort select; 4-column responsive grid with 10 `ProductCard`s + 2 editorial discovery cards ("Monthly Meal Plan" & "Honest Standards"). |
| 3 | **Planner Teaser** | `src/pages/Home.tsx` (lines 481–560) | `Section`, `Container`, `Heading`, `Button`, `CatSitting` | Large oat card container; circular sage aperture with `CatSitting`; 3-step cards (Essentials, Calculation, Monthly Bundle); CTA to `/meal-plan`; veterinary disclaimer. |
| 4 | **Promise Strip** | `src/pages/Home.tsx` (lines 562–609) | `Section`, `Container` | 3-column sage strip: 1. Vet-informed approach, 2. Short ingredient lists, 3. Pack duration down to the day. |
| 5 | **Closing CTA** | `src/pages/Home.tsx` (lines 611–650) | `Section`, `Container`, `Heading`, `Button`, `CatStretching` | Centered terracotta layout; `CatStretching` artwork; H2 ("Honest food, quiet design, no guesswork."); dual CTAs. |

---

## 2. Component Reuse Inventory

The following core components will be kept as-is and extended (no breaking changes):

- **`ProductCard`** (`src/components/product/ProductCard.tsx`): Preserves hover photo crossfade, DM Sans info bar, quick add with paw animation, and `#product-${slug}` scroll restoration anchoring.
- **`Button`** (`src/components/ui/Button.tsx`): Variants `primary`, `secondary`, `subtle`; cat icon decorators (`paw`, `head`); 44px+ touch targets.
- **`Chip`** (`src/components/ui/Chip.tsx`): Compact, accessible metadata badges.
- **`Logo`** (`src/components/brand/Logo.tsx`): Debossed vector cat-head glyph + live wordmark; variants `compact`, `stacked`, `glyph`.
- **`Cat Artwork`** (`src/components/cat-art/`): `CatSitting`, `CatSleeping`, `CatStretching`, `CatPlayful`, `CatPeeking`, `CatHead`, `PawPrint` (all SVG, <1.5 KB, `currentColor`, `aria-hidden`).
- **`SmartBag` Modal** (`src/components/bag/SmartBag.tsx`): Accessible native `<dialog>`, reactive duration estimates, currency subtotal, scroll lock.
- **`CurrencyToggle`** (`src/components/ui/CurrencyToggle.tsx`): USD/BDT segmented toggle with zero layout shift and touch toggle interaction.
- **`Planner Engine`** (`src/lib/planner.ts` & `src/lib/plan-url.ts`): Pure RER/MER calorie maths, bundle builder, URL serialization.
- **`Shop Session`** (`src/lib/shop-session.ts`): SessionStorage memory preserving category, sort, and last product location on navigation.

---

## 3. Disclosures and Claims Audit

Full search across `src/`, `docs/`, `index.html`, and `public/` for audit keywords:

| Keyword | Location | Line | Matched Text | Action Required |
|---|---|---|---|---|
| `preview` | `src/config/site.ts` | 5 | `'This is a storefront preview. Checkout is not connected yet.'` | **KEEP** (Allowed checkout notice) |
| `preview` | `src/components/bag/SmartBag.tsx` | 334 | `'This is a storefront preview. Checkout is not connected yet.'` | **KEEP** (Allowed checkout notice) |
| `human-grade` | `src/pages/Home.tsx` | 242 | `<span>100% human-grade proteins</span>` | **REMOVE/REPLACE** with truthful phrasing |
| `human-grade` | `src/pages/Home.tsx` | 456 | `Human-grade single-source proteins and unrefined oils.` | **REMOVE/REPLACE** with truthful phrasing |
| `human-grade` | `src/pages/About.tsx` | 287 | `Human-grade animal proteins` | **REMOVE/REPLACE** in V2-07 |
| `human-grade` | `src/config/site.ts` | 6 | `brandPromise: 'Formulated with human-grade proteins...'` | **REMOVE/REPLACE** in V2-07 |
| `human-grade` | `src/components/layout/Footer.tsx` | 54 | `Formulated with human-grade, single-source animal proteins...` | **REMOVE/REPLACE** in V2-07 |
| `clinical` | `src/pages/Home.tsx` | 526 | `Clinical calculation` | **REPLACE** with "Calorie calculation" |
| `clinical` | `src/pages/MealPlan.tsx` | 120 | `Clinical Feline Nutrition` | **REPLACE** in V2-07 |
| `clinical` | `src/components/planner/PlanResult.tsx` | 413 | `peer-reviewed feline clinical formulas` | **REPLACE** with "peer-reviewed feline formulas" in V2-07 |
| `zero` | `src/pages/Home.tsx` | 250 | `<span>Zero fillers or synthetic binders</span>` | **REPLACE** with "No fillers or artificial gums" |
| `zero` | `src/pages/Home.tsx` | 450 | `Zero Fillers` | **REPLACE** with "Honest Ingredients" |
| `zero` | `src/pages/Home.tsx` | 589 | `zero wheat, soy, or corn` | **REPLACE** with "no wheat, soy, or corn" |
| `zero` | `src/pages/About.tsx` | 301 | `Zero grain fillers or artificial gums` | **REPLACE** in V2-07 |
| `veterinary` | `src/pages/Home.tsx` | 553 | `Veterinary disclaimer:` | **KEEP** (Required planner disclaimer) |
| `veterinary` | `src/pages/Product.tsx` | 563 | `Computed using our pure veterinary calorie formulas.` | **REPLACE** with "vet-informed" in V2-07 |
| `veterinary` | `src/pages/Product.tsx` | 600 | `Veterinary disclaimer:` | **KEEP** (Required planner disclaimer) |
| `AI`, `generated`, `fictional`, `concept`, `portfolio`, `demo`, `testing`, `grain-free`, `10,000` | Entire codebase | N/A | **0 hits** (Already completely clean from customer UI) | Verified |

---

## 4. Dead or Decorative UI Scan

Thorough crawl across all routes (`/`, `/shop`, `/product/:slug`, `/meal-plan`, `/about`, `/404`):
- **Header**: All links point to active routes; Logo navigates to `/`; Bag button opens dialog; Mobile toggle expands panel.
- **Home**: CTAs navigate to real routes; filter tabs update products and URL; currency switch toggles store; sort dropdown reorders products; product cards navigate to PDP; quick-add updates bag.
- **PDP**: Gallery arrows & tabs are active; accordions toggle native `<details>`; quantity steppers clamp 1–9; add button updates bag.
- **Meal Planner**: Wizard options update state and URL; slider/input sync; kg/lb toggles; copy button triggers clipboard API; add bundle updates bag.
- **SmartBag**: Quantity steppers and line removal work; links navigate to PDP; checkout button is explicitly marked preview with explanatory tooltip.
- **Footer**: Internal navigation links resolve; currency micro-toggle functions; creator link opens Instagram.
- **Result**: **0 dead or purely decorative elements found.**

---

## 5. Baseline Performance & Asset Metrics

Measurements captured via `npm run build` and `npm run size`:

| Metric | Target / Budget | Baseline Measurement | Status |
|---|---|---|---|
| **Initial JS Size** | ≤ 170 KB gzip | **60.89 KB gzip** (238.00 KB raw) | **PASS** (64.2% under budget) |
| **Current LCP Image** | ≤ 150 KB | **14.45 KB** (`kitten-growth-mousse-broth-hero-1024.webp`, 1024×1024) | **PASS** (90.4% under budget) |
| **Lighthouse Mobile Perf** | ≥ 95 | **100** | **PASS** |
| **Lighthouse Mobile A11y** | ≥ 95 | **98–100** | **PASS** |
| **Lighthouse Mobile Best Practices** | ≥ 95 | **96** | **PASS** |
| **Lighthouse Mobile SEO** | ≥ 95 | **100** | **PASS** |
| **Core Web Vitals** | LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms | **LCP: 0.3s, CLS: 0.000, TBT: 0ms** | **PASS** |
| **Unit Test Suite** | 100% passing | **89 / 89 tests passing** | **PASS** |
| **Playwright E2E Suite** | 100% passing | **90 / 90 tests passing** | **PASS** |

---

## 6. Implementation Risks & Mitigation Plan

1. **New Hero Cat Photo as LCP Candidate**:
   - *Risk*: Cat photography at high resolution could degrade LCP score or exceed 150 KB budget.
   - *Mitigation*: Process with Sharp to 640px and 1024px WebP; serve with `fetchpriority="high"`, `loading="eager"`, and `<link rel="preload">` in `SeoHead.tsx`. Keep 1024px WebP ≤ 150 KB.
2. **Anchor Navigation & Scroll Restoration**:
   - *Risk*: Restructuring the homepage might break `#shop` anchor targets or return-to-shop scroll restoration.
   - *Mitigation*: Ensure `id="shop"` and `id="collection"` remain on the shop preview section. Preserve `id="product-${slug}"` on all collection cards.
3. **Activity Preselection in Meal Planner**:
   - *Risk*: `DESIGN-V2.md` requires 3 `CatCard`s linking to `/meal-plan?act=lounger|explorer|high-energy&step=1`.
   - *Mitigation*: Verify `decodeProfile` in `src/lib/plan-url.ts` accepts `act` parameter without requiring prior steps, and test with Vitest.
4. **Prerender Compatibility with Animation**:
   - *Risk*: CSS scroll-reveal or opacity animations might hide text from static HTML prerender.
   - *Mitigation*: Ensure initial HTML contains full opacity and text markup; apply animations only via client-side intersection observers that respect `prefers-reduced-motion`.

---

## 7. Proposed File Plan for V2-04 & V2-05

### V2-04 (Reusable Playful Primitives)
- **Typography**: `@fontsource/cormorant-garamond/500-italic.css` (≤ 25 KB WOFF2), CSS token `--font-note`.
- **Cat Poses** (`src/components/cat-art/`):
  - `CatCurious.tsx` (seated looking up)
  - `CatWalking.tsx` (striding)
  - `CatStretch.tsx` (long stretch)
  - `CatCurled.tsx` (curled nap)
  - `CatPeekEdge.tsx` (paws and head over container border)
- **Doodles** (`src/components/doodles/`):
  - `PawTrail.tsx`, `Heart.tsx`, `SparkleLine.tsx`, `Yarn.tsx`, `ScribbleArrow.tsx`, `Wave.tsx`
- **UI Components** (`src/components/ui/`):
  - `Annotation.tsx` (italic note + arrow)
  - `Reveal.tsx` + `useReveal` hook (fade + 12px rise)
  - `Band.tsx` (`cream`, `oat`, `sage` color-mix section wrapper with wave option)
  - `CatCard.tsx` (interactive 4px lift card with keyboard focus)
  - `IdleCat.tsx` (idle tail/ear twitch every ~6s)
  - `PawStamp.tsx` (brief stamp animation on add)

### V2-05 (Homepage Rebuild)
- **Asset Pipeline**:
  - `src/components/ui/SiteImage.tsx` (responsive WebP component for site photos)
  - `src/data/site-images.manifest.ts` (generated by Sharp script)
- **Homepage Structure** (`src/pages/Home.tsx`):
  - Hero: Left editorial copy, right masked cat photo, carton overlay, handwritten note, wave edge, 3 chips.
  - Planner Band: Sage tint, `CatCurious`, 3 `CatCard`s linking to `/meal-plan?act=...`.
  - Shop Preview: Category tabs, 6 products preview, "View full collection" link.
  - Why Band: Oat tint, eating cat photo, `IdleCat`, 4 truthful nutrition commitments.
  - Calm Strip: 3 factual reassurance items.
  - Closing CTA: `CatPeekEdge` with primary and secondary action buttons.
