import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'
import { Reveal } from '@/components/ui/Reveal'
import { CatSitting } from '@/components/cat-art/CatSitting'
import { CatHead } from '@/components/cat-art/CatHead'

export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Our Approach | NEKO DELICE"
        description="Honest food, quiet design. Learn about our vet-informed approach to feline nutrition, transparent ingredients, and purposeful everyday pet care."
        path="/about"
      />

      {/* 1. HERO SECTION: Our Philosophy */}
      <Section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <Container className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-50/90 border border-sage-200/80 text-sage-900 text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-sage-600" aria-hidden="true" />
            Our Philosophy
          </div>

          <Heading
            level={1}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-espresso-950 mb-6 text-balance leading-[1.12]"
          >
            Honest food, quiet design
          </Heading>

          <p className="text-lg sm:text-xl text-espresso-800 leading-relaxed max-w-3xl text-balance">
            Most cat food packaging is loud, filled with aggressive graphics and marketing claims that obscure basic feeding facts. NEKO DELICE was created to be the antidote: vet-informed nutrition, quiet design, and absolute transparency in every bowl. We believe feeding your cat should be a moment of calm, thoughtful care — free from guesswork and unpronounceable fillers.
          </p>
        </Container>
      </Section>

      {/* 2. NUTRITION WITH PURPOSE */}
      <Section reveal defer className="bg-sand-100/35 border-y border-sand-300/70">
        <Container className="max-w-4xl">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-800 block mb-1">
              Feline Biology First
            </span>
            <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-3">
              Nutrition with purpose
            </Heading>
            <p className="text-base sm:text-lg text-espresso-800 leading-relaxed max-w-2xl">
              Cats are obligate carnivores with specific metabolic requirements. We formulate every meal to support their natural physiology without relying on unverified claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-cream-50/90 border border-sand-300/60 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-serif text-sm font-semibold mb-3">
                  01
                </div>
                <h3 className="font-serif text-lg font-semibold text-espresso-950 mb-2">
                  Life-stage awareness
                </h3>
                <p className="text-sm text-espresso-700 leading-relaxed">
                  Energy and nutrient requirements shift dramatically from energetic kittenhood to calm senior years. Our recipes are tailored for specific life stages and metabolic rhythms.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50/90 border border-sand-300/60 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-ochre-100 text-ochre-800 flex items-center justify-center font-serif text-sm font-semibold mb-3">
                  02
                </div>
                <h3 className="font-serif text-lg font-semibold text-espresso-950 mb-2">
                  Hydration-focused meals
                </h3>
                <p className="text-sm text-espresso-700 leading-relaxed">
                  Domestic cats retain the low thirst drive of desert ancestors. Our stick sachets deliver high moisture through natural meat broths to support urinary tract wellness.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50/90 border border-sand-300/60 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-800 flex items-center justify-center font-serif text-sm font-semibold mb-3">
                  03
                </div>
                <h3 className="font-serif text-lg font-semibold text-espresso-950 mb-2">
                  Exact calorie calculations
                </h3>
                <p className="text-sm text-espresso-700 leading-relaxed">
                  We disclose exact caloric densities for every product and calculate daily portions based on your cat&apos;s weight, neutered status, and activity profile.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. INGREDIENTS YOU CAN UNDERSTAND */}
      <Section reveal defer>
        <Container className="max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-800 mb-2 block">
              Ingredient Provenance
            </span>
            <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-3">
              Ingredients you can understand
            </Heading>
            <p className="text-base text-espresso-800 leading-relaxed">
              Every formula is visible, honest, and formulated without hidden thickeners, meal byproducts, or cosmetic colorants.
            </p>
          </div>

          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Close-up 1: Chicken Mousse Swirl */}
              <div className="flex flex-col rounded-2xl bg-oat-100/50 p-4.5 border border-sand-300/70 shadow-2xs hover:bg-oat-100/75 transition-colors">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                  <ProductImage
                    slug="kitten-growth-mousse-broth"
                    imageRole="contents"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3.5">
                  <span className="text-sm font-semibold text-espresso-950 block">
                    Deboned Chicken &amp; Broth
                  </span>
                  <span className="text-xs text-espresso-700 leading-relaxed mt-1 block">
                    62% fresh deboned chicken gently pureed in broth for smooth hydration and growth.
                  </span>
                </div>
              </div>

              {/* Close-up 2: Wild Salmon & Quail Paté */}
              <div className="flex flex-col rounded-2xl bg-oat-100/50 p-4.5 border border-sand-300/70 shadow-2xs hover:bg-oat-100/75 transition-colors">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                  <ProductImage
                    slug="wild-salmon-quail-pate"
                    imageRole="contents"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3.5">
                  <span className="text-sm font-semibold text-espresso-950 block">
                    Wild Salmon &amp; Lean Quail
                  </span>
                  <span className="text-xs text-espresso-700 leading-relaxed mt-1 block">
                    Finely ground whole wild salmon and quail with cranberries and controlled minerals.
                  </span>
                </div>
              </div>

              {/* Close-up 3: Oven-Baked Duck Kibble */}
              <div className="flex flex-col rounded-2xl bg-oat-100/50 p-4.5 border border-sand-300/70 shadow-2xs hover:bg-oat-100/75 transition-colors">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                  <ProductImage
                    slug="duck-sweet-potato-kibble"
                    imageRole="contents"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3.5">
                  <span className="text-sm font-semibold text-espresso-950 block">
                    Slow-Baked Duck Kibble
                  </span>
                  <span className="text-xs text-espresso-700 leading-relaxed mt-1 block">
                    Single-source duck gently baked at low temperatures with sweet potato and dietary fiber.
                  </span>
                </div>
              </div>

              {/* Close-up 4: Norwegian Salmon Oil */}
              <div className="flex flex-col rounded-2xl bg-oat-100/50 p-4.5 border border-sand-300/70 shadow-2xs hover:bg-oat-100/75 transition-colors">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                  <ProductImage
                    slug="norwegian-salmon-oil"
                    imageRole="contents"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3.5">
                  <span className="text-sm font-semibold text-espresso-950 block">
                    Cold-Filtered Salmon Oil
                  </span>
                  <span className="text-xs text-espresso-700 leading-relaxed mt-1 block">
                    Unrefined Norwegian salmon oil packed with active EPA and DHA omega fatty acids.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 4. DESIGNED FOR EVERYDAY CARE */}
      <Section reveal defer className="bg-sand-100/35 border-y border-sand-300/70">
        <Container className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 block mb-1">
                Considered Details
              </span>
              <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-4">
                Designed for everyday care
              </Heading>
              <p className="text-base text-espresso-800 leading-relaxed mb-6">
                Cat care happens multiple times a day. We design our packaging and hardware to make routines effortless, quiet, and satisfying for both cat and companion.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-espresso-950">
                      Easy-dispense stick sachets
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed mt-0.5">
                      Single-portion sachets open cleanly without scissors or spoons, ensuring no half-empty cans dry out in the refrigerator.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-espresso-950">
                      Whisker-friendly ergonomic hardware
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed mt-0.5">
                      Shallow, heavy ceramic bowls prevent whisker fatigue and mealtime tipping, while whisper-quiet fountains encourage natural drinking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-espresso-950">
                      Earth-conscious paper pouches &amp; natural materials
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed mt-0.5">
                      Paper-based dry food pouches, brushed stainless steel, and solid birch wood replace cheap single-use plastics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-sage-50/90 border border-sage-200/80 shadow-xs flex items-center justify-center p-8 text-sage-800">
                <CatSitting width={140} height={140} aria-hidden="true" className="w-full h-full text-sage-800" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. OUR STANDARDS */}
      <Section reveal defer>
        <Container className="max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-sage-800 mb-2 block">
              Integrity in Every Detail
            </span>
            <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-3">
              Our standards
            </Heading>
            <p className="text-base text-espresso-800 leading-relaxed">
              We hold ourselves to rigorous formulation benchmarks and complete transparency across all products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-cream-50/90 border border-sand-300/60 shadow-2xs flex items-start gap-3.5">
              <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong className="text-sm font-semibold text-espresso-950 block">
                  Single-source animal proteins
                </strong>
                <p className="text-xs text-espresso-700 leading-relaxed mt-1">
                  Single-source deboned chicken, wild salmon, and lean duck. Never any byproduct meals, feather meal, or animal digests.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cream-50/90 border border-sand-300/60 shadow-2xs flex items-start gap-3.5">
              <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong className="text-sm font-semibold text-espresso-950 block">
                  No grain fillers or artificial gums
                </strong>
                <p className="text-xs text-espresso-700 leading-relaxed mt-1">
                  Formulated without corn, wheat, soy, carrageenan, guar gum, or artificial colours that trigger digestive sensitivities.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cream-50/90 border border-sand-300/60 shadow-2xs flex items-start gap-3.5">
              <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong className="text-sm font-semibold text-espresso-950 block">
                  Controlled minerals &amp; ash
                </strong>
                <p className="text-xs text-espresso-700 leading-relaxed mt-1">
                  Carefully balanced phosphorus and magnesium levels to support bladder and urinary tract wellness throughout adult and senior years.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cream-50/90 border border-sand-300/60 shadow-2xs flex items-start gap-3.5">
              <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong className="text-sm font-semibold text-espresso-950 block">
                  Know how long every pack lasts
                </strong>
                <p className="text-xs text-espresso-700 leading-relaxed mt-1">
                  Accurate caloric densities compute supply longevity down to the day, so you always know when your pantry needs replenishment.
                </p>
              </div>
            </div>
          </div>

          {/* Supportive Veterinary Disclaimer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sage-50/70 border border-sage-200/80 text-xs text-espresso-800 leading-relaxed">
            <span className="font-semibold text-espresso-950">
              Veterinary guidance notice:{' '}
            </span>
            Our nutritional guidelines and portion calculations are supportive estimates for healthy cats, not veterinary advice. Always check with your veterinarian for diagnosed medical conditions, pregnancy, or rapid weight fluctuations.
          </div>
        </Container>
      </Section>

      {/* 6. CALL TO ACTION */}
      <Section className="py-16 sm:py-24 text-center border-t border-sand-300/70 bg-sand-100/25">
        <Container className="max-w-3xl">
          <div className="inline-flex justify-center mb-5 text-sage-800">
            <CatHead width={56} height={56} aria-hidden="true" />
          </div>

          <Heading level={2} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4 text-balance">
            Feed your cat with confidence.
          </Heading>

          <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-8 max-w-xl mx-auto text-balance">
            Build a personalized monthly meal plan tailored to your cat&apos;s exact weight and activity, or explore our full pantry collection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild to="/meal-plan" variant="primary" catIcon="paw">
              Plan your cat&apos;s meals
            </Button>
            <Button asChild to="/#shop" variant="secondary" catIcon="head">
              Explore the collection
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default AboutPage
