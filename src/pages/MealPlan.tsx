import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { CatHead } from '@/components/cat-art/CatHead'

export function MealPlanPage() {
  return (
    <>
      <SeoHead
        title="Calorie & Meal Planner | NEKO DELICE"
        description="Calculate your cat's exact daily calories and build a custom monthly meal bundle tailored to their life stage, activity, and health goals."
        path="/meal-plan"
      />

      <Section>
        <Container className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4 text-terracotta-700">
            <CatHead width={32} height={32} aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Vet-Informed Portions
            </span>
          </div>

          <Heading level={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4">
            Calorie & meal planner
          </Heading>

          <p className="text-base sm:text-lg text-espresso-700 leading-relaxed mb-8">
            Tell us about your cat. We work out their daily calorie target using proven clinical formulas (RER × life stage × activity) and build a month of balanced meals.
          </p>

          {/* Mandatory Veterinary Disclaimer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-oat-100 border border-oat-200/90 text-xs sm:text-sm text-espresso-700 leading-relaxed mb-10">
            <p className="font-semibold text-espresso-900 mb-1">Veterinary notice</p>
            <p>
              An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
            </p>
          </div>

          {/* Wizard Stub Placeholder (P12) */}
          <div className="p-8 sm:p-12 rounded-2xl bg-cream-50 border-2 border-dashed border-oat-300 text-center">
            <p className="font-serif text-xl font-semibold text-espresso-900 mb-2">
              4-Step Planner Wizard Coming in P12
            </p>
            <p className="text-xs sm:text-sm text-espresso-600 max-w-md mx-auto">
              Steps: 1. About your cat · 2. Weight · 3. Activity · 4. Health focus.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default MealPlanPage
