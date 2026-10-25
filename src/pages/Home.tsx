import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { CatStretching } from '@/components/cat-art/CatStretching'

export function HomePage() {
  return (
    <>
      <SeoHead
        title="NEKO DELICE — Honest Food, Quiet Design, No Guesswork"
        description="Tell us about your cat. We work out the calories and build a month of meals with vet-informed cat nutrition."
        path="/"
      />

      {/* Hero Section */}
      <Section className="pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <Container className="relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-oat-200/70 text-espresso-800 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-pulse" />
              Vet-informed feline nutrition & quiet hardware
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-espresso-950 text-balance leading-[1.12] mb-6">
              Feed your cat exactly what they need.
            </h1>

            <p className="text-lg sm:text-xl text-espresso-700 leading-relaxed max-w-2xl text-balance mb-8 sm:mb-10">
              Tell us about your cat. We work out the calories and build a month of meals. Honest food, quiet design, no guesswork.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild to="/meal-plan" variant="primary">
                Plan my cat's meals
              </Button>
              <Button asChild to="/shop" variant="secondary">
                Shop the collection
              </Button>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 flex justify-end text-sage-700/80">
            <CatStretching width={140} height={140} className="text-terracotta-700/60" aria-hidden="true" />
          </div>
        </Container>
      </Section>

      {/* Ingredient Promise Strip */}
      <Section className="bg-oat-100/60 border-y border-oat-200/80">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 py-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-serif font-semibold shrink-0">
                1
              </div>
              <div>
                <h2 className="text-base font-semibold text-espresso-900 mb-1">
                  Formulated with a vet-informed approach
                </h2>
                <p className="text-sm text-espresso-600 leading-relaxed">
                  Precise energy densities, life-stage balance, and controlled minerals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-ochre-100 text-ochre-800 flex items-center justify-center font-serif font-semibold shrink-0">
                2
              </div>
              <div>
                <h2 className="text-base font-semibold text-espresso-900 mb-1">
                  Short ingredient lists, no fillers
                </h2>
                <p className="text-sm text-espresso-600 leading-relaxed">
                  Single-source proteins, unrefined oils, and zero wheat, soy, or corn.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-800 flex items-center justify-center font-serif font-semibold shrink-0">
                3
              </div>
              <div>
                <h2 className="text-base font-semibold text-espresso-900 mb-1">
                  Know how long every bag lasts
                </h2>
                <p className="text-sm text-espresso-600 leading-relaxed">
                  Transparent calorie counts compute supply durations down to the day.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default HomePage
