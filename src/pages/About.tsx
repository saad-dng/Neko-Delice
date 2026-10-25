import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { ProductImage } from '@/components/ui/ProductImage'
import { CatHead } from '@/components/cat-art/CatHead'
import { PLANNER_CONFIG } from '@/config/planner'
import { NUTRITION_CONFIG } from '@/config/nutrition'

export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Our Approach | NEKO DELICE"
        description="Honest food, quiet design. Learn about our vet-informed approach to feline nutrition, transparent sourcing, and behind the build engineering."
        path="/about"
      />

      {/* 1. HERO SECTION */}
      <Section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <Container className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
            Our Philosophy
          </p>

          <Heading level={1} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-espresso-950 mb-6 text-balance leading-[1.12]">
            Honest food, quiet design
          </Heading>

          <p className="text-lg sm:text-xl text-espresso-800 leading-relaxed max-w-3xl text-balance">
            Most cat food packaging is loud, filled with stock photos and marketing claims that obscure basic feeding facts. NEKO DELICE was created to be the antidote: vet-informed nutrition, quiet design, and absolute transparency in every bowl.
          </p>
        </Container>
      </Section>

      {/* 2. PILLARS & INGREDIENT SOURCING SECTION */}
      <Section reveal defer className="bg-oat-100/40 border-y border-sand-300/70">
        <Container className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {/* Our Approach */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 block mb-1">
                Clinical Principles
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950 mb-4">
                Our approach
              </h2>
              <p className="text-base text-espresso-800 leading-relaxed">
                Cats are obligate carnivores. We formulate every recipe around clean, named animal proteins with optimal moisture levels and controlled ash. We skip all fillers, thickeners, and artificial colorants, keeping ingredient lists short and understandable.
              </p>
            </div>

            {/* Transparent Sourcing */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ochre-800 block mb-1">
                Pure Provenance
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950 mb-4">
                Transparent sourcing
              </h2>
              <p className="text-base text-espresso-800 leading-relaxed">
                From cold-filtered Norwegian salmon oil to slow-baked free-range duck, our ingredients are sourced with care. We disclose exact percentages on principal protein components and test every batch for microbiological purity.
              </p>
            </div>
          </div>

          {/* Quality Commitments */}
          <div className="mt-14 pt-10 border-t border-sand-300/60">
            <h2 className="font-serif text-2xl font-semibold text-espresso-950 mb-6">
              Quality commitments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                <span className="text-terracotta-700 font-bold shrink-0">&check;</span>
                <span className="text-sm text-espresso-800 leading-relaxed">
                  Never any wheat, corn, soy, or byproduct meals.
                </span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                <span className="text-terracotta-700 font-bold shrink-0">&check;</span>
                <span className="text-sm text-espresso-800 leading-relaxed">
                  Single-source proteins for clear allergy elimination.
                </span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                <span className="text-terracotta-700 font-bold shrink-0">&check;</span>
                <span className="text-sm text-espresso-800 leading-relaxed">
                  Accurate caloric densities for exact portion calculation.
                </span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                <span className="text-terracotta-700 font-bold shrink-0">&check;</span>
                <span className="text-sm text-espresso-800 leading-relaxed">
                  Sustainable materials: paper-based pouches, brushed steel, and solid ash wood.
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. INGREDIENT CLOSE-UPS GALLERY SECTION */}
      <Section reveal defer>
        <Container className="max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
              Visual Integrity
            </p>
            <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-3">
              Ingredient close-ups
            </Heading>
            <p className="text-base text-espresso-800 leading-relaxed">
              Every formula is visible, honest, and free from hidden binders or cosmetic dyes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Close-up 1: Chicken Mousse Swirl */}
            <div className="flex flex-col rounded-2xl bg-beige-200 p-4 border border-sand-300/60">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="kitten-growth-mousse-broth"
                  imageRole="contents"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3">
                <span className="text-xs font-bold text-espresso-950 block">
                  Chicken Mousse &amp; Broth
                </span>
                <span className="text-xs text-espresso-800 leading-relaxed">
                  62% deboned chicken in natural broth for gentle hydration.
                </span>
              </div>
            </div>

            {/* Close-up 2: Wild Salmon & Quail Paté */}
            <div className="flex flex-col rounded-2xl bg-beige-200 p-4 border border-sand-300/60">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="wild-salmon-quail-pate"
                  imageRole="contents"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3">
                <span className="text-xs font-bold text-espresso-950 block">
                  Wild Salmon &amp; Quail
                </span>
                <span className="text-xs text-espresso-800 leading-relaxed">
                  Smooth paté with cranberries and controlled magnesium.
                </span>
              </div>
            </div>

            {/* Close-up 3: Oven-Baked Duck Kibble */}
            <div className="flex flex-col rounded-2xl bg-beige-200 p-4 border border-sand-300/60">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="duck-sweet-potato-kibble"
                  imageRole="contents"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3">
                <span className="text-xs font-bold text-espresso-950 block">
                  Oven-Baked Duck Kibble
                </span>
                <span className="text-xs text-espresso-800 leading-relaxed">
                  Small, crunchy morsels with sweet potato and psyllium husk.
                </span>
              </div>
            </div>

            {/* Close-up 4: Norwegian Salmon Oil */}
            <div className="flex flex-col rounded-2xl bg-beige-200 p-4 border border-sand-300/60">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="norwegian-salmon-oil"
                  imageRole="contents"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3">
                <span className="text-xs font-bold text-espresso-950 block">
                  Cold-Filtered Salmon Oil
                </span>
                <span className="text-xs text-espresso-800 leading-relaxed">
                  Golden stream of pure EPA and DHA fatty acids.
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. BEHIND THE BUILD (CASE STUDY) */}
      <Section reveal defer className="bg-oat-100/60 border-t border-sand-300">
        <Container className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-cream-50 border border-sand-300 text-espresso-900">
              <CatHead width={28} height={28} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">
                Architecture &amp; Design Case Study
              </p>
              <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950">
                Behind the build
              </Heading>
            </div>
          </div>

          <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-10">
            NEKO DELICE was engineered as a high-fidelity frontend portfolio storefront. Here is how the veterinary math, UX state architecture, and design tokens work beneath the surface.
          </p>

          <div className="space-y-12">
            {/* 4.1 Vet Formulas & Live Constants */}
            <div className="p-6 sm:p-8 rounded-2xl bg-cream-50 border border-sand-300/80 shadow-xs">
              <h3 className="font-serif text-2xl font-semibold text-espresso-950 mb-3">
                1. Clinical energy formulas &amp; live constants
              </h3>
              <p className="text-sm text-espresso-800 leading-relaxed mb-6">
                Caloric targets are calculated using published clinical veterinary equations. All multipliers and energy densities are imported directly from config so they never drift.
              </p>

              {/* Formula Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-oat-100/70 border border-sand-300 font-mono text-xs text-espresso-900">
                  <span className="text-espresso-500 block mb-1 font-sans font-bold uppercase text-[10px] tracking-wider">
                    Resting Energy Requirement (RER)
                  </span>
                  <code>RER = 70 &times; (Body Weight in kg)<sup>0.75</sup></code>
                </div>
                <div className="p-4 rounded-xl bg-oat-100/70 border border-sand-300 font-mono text-xs text-espresso-900">
                  <span className="text-espresso-500 block mb-1 font-sans font-bold uppercase text-[10px] tracking-wider">
                    Maintenance Energy Requirement (MER)
                  </span>
                  <code>MER = RER &times; F<sub>life</sub> &times; F<sub>activity</sub></code>
                </div>
              </div>

              {/* Dynamic Constant Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-sand-300 text-espresso-900 font-semibold">
                        <th className="py-2 pr-3">Life Stage &amp; Status</th>
                        <th className="py-2 text-right">Factor (F<sub>life</sub>)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-300/60 text-espresso-800 font-mono">
                      <tr>
                        <td className="py-2 pr-3 font-sans">Kitten (under 12 mo)</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.lifeFactors.kitten}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans">Adult, neutered</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.lifeFactors.adult.neutered}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans">Adult, intact</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.lifeFactors.adult.intact}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans">Senior, neutered</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.lifeFactors.senior.neutered}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans">Senior, intact</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.lifeFactors.senior.intact}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-sand-300 text-espresso-900 font-semibold">
                        <th className="py-2 pr-3">Activity Routine</th>
                        <th className="py-2 text-right">Factor (F<sub>activity</sub>)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-300/60 text-espresso-800 font-mono">
                      <tr>
                        <td className="py-2 pr-3 font-sans">Indoor Lounger</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.activityMultipliers.lounger}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans">Playful Explorer</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.activityMultipliers.explorer}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans">High-Energy</td>
                        <td className="py-2 text-right tabular-nums">{PLANNER_CONFIG.activityMultipliers['high-energy']}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-4 pt-3 border-t border-sand-300/60 text-[11px] text-espresso-800">
                    <span className="font-semibold text-espresso-800">Portion split rules: </span>
                    Adult {PLANNER_CONFIG.splits.defaultAdultSenior.wet * 100}% wet / {PLANNER_CONFIG.splits.defaultAdultSenior.dry * 100}% dry; Kitten {PLANNER_CONFIG.splits.kitten.wet * 100}% wet; Urinary {PLANNER_CONFIG.splits.urinaryCare.wet * 100}% wet. Wet unit = {NUTRITION_CONFIG.wetFood.sachetGrams}g sachet ({NUTRITION_CONFIG.wetFood.sachetsPerCarton}/box).
                  </div>
                </div>
              </div>
            </div>

            {/* 4.2 Planner Flowchart Diagram */}
            <div className="p-6 sm:p-8 rounded-2xl bg-cream-50 border border-sand-300/80 shadow-xs">
              <h3 className="font-serif text-2xl font-semibold text-espresso-950 mb-3">
                2. Planner state &amp; bundle calculation flow
              </h3>
              <p className="text-sm text-espresso-800 leading-relaxed mb-6">
                All wizard answers are synced bidirectionally to URL query parameters. The pure engine evaluates the bundle deterministically with zero backend latency.
              </p>

              {/* Styled CSS Workflow Diagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
                <div className="p-4 rounded-xl bg-oat-100 border border-sand-300 flex flex-col justify-between">
                  <div>
                    <span className="w-5 h-5 rounded-full bg-sand-300 text-espresso-900 font-bold text-xs flex items-center justify-center mb-2">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-espresso-950 uppercase tracking-wide">
                      User Profile
                    </h4>
                    <p className="text-xs text-espresso-800 mt-1">
                      Stage, weight (kg/lb), activity routine, and health focus.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-terracotta-700 mt-3 block">
                    URL query sync
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-oat-100 border border-sand-300 flex flex-col justify-between">
                  <div>
                    <span className="w-5 h-5 rounded-full bg-sand-300 text-espresso-900 font-bold text-xs flex items-center justify-center mb-2">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-espresso-950 uppercase tracking-wide">
                      Energy Engine
                    </h4>
                    <p className="text-xs text-espresso-800 mt-1">
                      Calculates RER, applies life &amp; activity factors for MER target.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-terracotta-700 mt-3 block">
                    Pure calcMER()
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-oat-100 border border-sand-300 flex flex-col justify-between">
                  <div>
                    <span className="w-5 h-5 rounded-full bg-sand-300 text-espresso-900 font-bold text-xs flex items-center justify-center mb-2">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-espresso-950 uppercase tracking-wide">
                      Monthly Bundle
                    </h4>
                    <p className="text-xs text-espresso-800 mt-1">
                      Converts kcal to whole 24-sachet boxes &amp; 2.5 kg bags.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-terracotta-700 mt-3 block">
                    buildBundle()
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-oat-100 border border-sand-300 flex flex-col justify-between">
                  <div>
                    <span className="w-5 h-5 rounded-full bg-sand-300 text-espresso-900 font-bold text-xs flex items-center justify-center mb-2">
                      4
                    </span>
                    <h4 className="text-xs font-bold text-espresso-950 uppercase tracking-wide">
                      Smart Bag Sync
                    </h4>
                    <p className="text-xs text-espresso-800 mt-1">
                      Computes reactive line supply durations and currency totals.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-terracotta-700 mt-3 block">
                    supplyDays()
                  </span>
                </div>
              </div>
            </div>

            {/* 4.3 Design Decisions */}
            <div className="p-6 sm:p-8 rounded-2xl bg-cream-50 border border-sand-300/80 shadow-xs">
              <h3 className="font-serif text-2xl font-semibold text-espresso-950 mb-3">
                3. Architectural design decisions
              </h3>
              <p className="text-sm text-espresso-800 leading-relaxed mb-6">
                Four strict architectural principles guide the interface and performance profile:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed text-espresso-800">
                <div className="p-4 rounded-xl bg-oat-100/60 border border-sand-300">
                  <h4 className="font-bold text-espresso-950 text-sm mb-1">
                    Packaging-Sampled Palette
                  </h4>
                  <p>
                    Color tokens were sampled directly from the physical packaging photos (sand backdrop #D2C5B3, sage #8FA388, terracotta #A66445, ochre #9B6E3A, matcha #8A9A74, oak #8B6A45) to ensure photography blends seamlessly with zero harsh edges.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-oat-100/60 border border-sand-300">
                  <h4 className="font-bold text-espresso-950 text-sm mb-1">
                    Monoline Cat Vector System
                  </h4>
                  <p>
                    All artwork is rendered via lightweight inline SVG components with a 2px stroke and rounded caps. Cats only; no extraneous illustrative animals or marketing illustrations are used.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-oat-100/60 border border-sand-300">
                  <h4 className="font-bold text-espresso-950 text-sm mb-1">
                    Accessible Native &lt;dialog&gt;
                  </h4>
                  <p>
                    The Smart Bag and mobile filter rail utilize the browser's native <code>&lt;dialog&gt;</code> element via <code>showModal()</code>, providing native focus trapping, backdrop light dismiss, and automatic focus restoration.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-oat-100/60 border border-sand-300">
                  <h4 className="font-bold text-espresso-950 text-sm mb-1">
                    Zero-Hidden-State URL Sync
                  </h4>
                  <p>
                    All catalog filters, sorting selections, and planner parameters reside entirely within the URL. This guarantees full restoration upon reload, seamless browser back/forward navigation, and shareable link generation.
                  </p>
                </div>
              </div>
            </div>

            {/* 4.4 Performance Budget & Measurement Table */}
            <div className="p-6 sm:p-8 rounded-2xl bg-cream-50 border border-sand-300/80 shadow-xs">
              <h3 className="font-serif text-2xl font-semibold text-espresso-950 mb-3">
                4. Performance budgets &amp; measurement targets
              </h3>
              <p className="text-sm text-espresso-700 leading-relaxed mb-6">
                Strict budgets were established in the project charter. Final verified figures will be measured and documented during Phase 15 launch preparation.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-sand-300 text-espresso-900 font-semibold">
                      <th className="py-2.5 pr-4">Quality Metric</th>
                      <th className="py-2.5 pr-4">Budget Target</th>
                      <th className="py-2.5 pr-4">Measured Value</th>
                      <th className="py-2.5 text-right">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-300/60 text-espresso-700">
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-espresso-950">Initial JS payload (gzip)</td>
                      <td className="py-2.5 pr-4 font-mono">&le; 170 KB</td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-espresso-600">TBD</td>
                      <td className="py-2.5 text-right text-espresso-600">Pending P15 audit</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-espresso-950">Hero image weight</td>
                      <td className="py-2.5 pr-4 font-mono">&le; 150 KB</td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-espresso-600">TBD</td>
                      <td className="py-2.5 text-right text-espresso-600">Pending P15 audit</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-espresso-950">Self-hosted WOFF2 fonts</td>
                      <td className="py-2.5 pr-4 font-mono">2 families &times; 2 weights</td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-espresso-600">TBD</td>
                      <td className="py-2.5 text-right text-espresso-600">Pending P15 audit</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-espresso-950">Largest Contentful Paint (LCP)</td>
                      <td className="py-2.5 pr-4 font-mono">&le; 2.5 s</td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-espresso-600">TBD</td>
                      <td className="py-2.5 text-right text-espresso-600">Pending P15 audit</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-espresso-950">Cumulative Layout Shift (CLS)</td>
                      <td className="py-2.5 pr-4 font-mono">&le; 0.1</td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-espresso-600">TBD</td>
                      <td className="py-2.5 text-right text-espresso-600">Pending P15 audit</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-espresso-950">Interaction to Next Paint (INP)</td>
                      <td className="py-2.5 pr-4 font-mono">&le; 200 ms</td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-espresso-600">TBD</td>
                      <td className="py-2.5 text-right text-espresso-600">Pending P15 audit</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-espresso-950">Lighthouse Mobile Scores</td>
                      <td className="py-2.5 pr-4 font-mono">&ge; 95 (all 4)</td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-espresso-600">TBD</td>
                      <td className="py-2.5 text-right text-espresso-600">Pending P15 audit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mandatory Disclosures */}
            <div className="p-6 rounded-2xl bg-oat-100 border border-sand-300 text-xs text-espresso-700 leading-relaxed">
              <p className="mb-2">
                <span className="font-semibold text-espresso-950">Fictional Concept Disclosure: </span>
                Concept imagery generated with AI. Products are fictional.
              </p>
              <p>
                <span className="font-semibold text-espresso-950">Veterinary Notice: </span>
                An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default AboutPage
