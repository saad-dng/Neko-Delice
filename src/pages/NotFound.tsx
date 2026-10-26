import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { CatSitting } from '@/components/cat-art/CatSitting'

export function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page Not Found | NEKO DELICE"
        description="We couldn't find the page you were looking for. Explore the shop or try our cat calorie planner."
        path="/404"
      />

      <Section className="py-16 sm:py-24 text-center">
        <Container className="max-w-xl mx-auto flex flex-col items-center">
          <div className="mb-6 text-terracotta-700/80">
            <CatSitting width={120} height={120} aria-hidden="true" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-3">
            404 Error
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4 text-balance">
            We couldn't find that page.
          </h1>

          <p className="text-base text-espresso-700 leading-relaxed mb-8 max-w-md text-balance">
            The page or product you were looking for doesn't exist or has moved. Return to our collection or calculate your cat's daily portions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild to="/#shop" variant="primary" catIcon="head">
              Shop the collection
            </Button>
            <Button asChild to="/meal-plan" variant="secondary" catIcon="paw">
              Try the meal planner
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default NotFoundPage
