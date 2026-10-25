import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { CatGame } from '@/components/game/CatGame'

export function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page Not Found | NEKO DELICE"
        description="We couldn't find the page you were looking for. Explore the shop or try our cat calorie planner."
        path="/404"
      />

      <Section className="py-12 sm:py-16 text-center">
        <Container className="max-w-2xl mx-auto flex flex-col items-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
            404 Error
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-3 text-balance">
            We couldn't find that page.
          </h1>

          <p className="text-base text-espresso-700 leading-relaxed mb-4 max-w-lg text-balance">
            Looks like this curious cat wandered into uncharted territory. Take a gentle break with Neko along the garden trail, or return to our whole-food collection.
          </p>

          {/* Interactive Monoline Cat Game */}
          <CatGame />

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Button asChild to="/shop" variant="primary">
              Shop the collection
            </Button>
            <Button asChild to="/meal-plan" variant="secondary">
              Try the meal planner
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default NotFoundPage
