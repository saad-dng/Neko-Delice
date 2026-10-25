import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/product/ProductCard'
import { CatSitting } from '@/components/cat-art/CatSitting'
import { CatStretching } from '@/components/cat-art/CatStretching'
import { products } from '@/data/products'
import type { ProductCategory } from '@/data/types'

type HomeCategoryFilter = 'all' | ProductCategory

interface CategoryTab {
  id: HomeCategoryFilter
  label: string
}

const CATEGORY_TABS: readonly CategoryTab[] = [
  { id: 'all', label: 'All Items' },
  { id: 'wet-food', label: 'Wet Food' },
  { id: 'dry-food', label: 'Dry Food' },
  { id: 'treat-topper', label: 'Treats & Toppers' },
  { id: 'litter', label: 'Litter' },
  { id: 'hardware', label: 'Hardware' },
]

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<HomeCategoryFilter>('all')

  const displayedProducts = useMemo(() => {
    if (selectedCategory === 'all') return products
    return products.filter(
      (p) =>
        p.category === selectedCategory ||
        p.secondaryCategories.includes(selectedCategory)
    )
  }, [selectedCategory])

  return (
    <>
      <SeoHead
        title="NEKO DELICE — Honest Food, Quiet Design, No Guesswork"
        description="Tell us about your cat. We work out the calories and build a month of meals with vet-informed cat nutrition."
        path="/"
      />

      {/* 1. HERO SECTION (Editorial, Centered, Calm — No isolated product card) */}
      <Section className="pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-50/90 border border-sage-200/80 text-sage-900 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-sage-600" aria-hidden="true" />
              Vet-informed feline nutrition &amp; quiet hardware
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-espresso-950 text-balance leading-[1.14] mb-6">
              Feed your cat exactly what they need.
            </h1>

            <p className="text-lg sm:text-xl text-espresso-800 leading-relaxed max-w-2xl text-balance mb-8 sm:mb-10">
              Tell us about your cat. We work out the calories and build a month of meals. Honest food, quiet design, no guesswork.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <Button asChild to="/meal-plan" variant="primary">
                Plan my cat's meals
              </Button>
              <Button asChild to="/shop" variant="secondary">
                Shop the collection
              </Button>
            </div>

            {/* Quiet trust credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-sand-300/60 w-full max-w-2xl text-xs text-espresso-700">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-600" aria-hidden="true" />
                <span>100% human-grade proteins</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ochre-600" aria-hidden="true" />
                <span>Calorie engine by life stage</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600" aria-hidden="true" />
                <span>Zero fillers or synthetic binders</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. THE COLLECTION (The single, definitive product showcase with category filter tabs) */}
      <Section id="collection" className="bg-cream-50 border-t border-sand-300/60">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
                The Collection
              </p>
              <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950">
                Everything your cat needs, nothing they don't.
              </Heading>
              <p className="text-sm sm:text-base text-espresso-700 mt-2 max-w-xl">
                Formulated for clinical nutrition, optimal hydration, and quiet everyday living. Short ingredient lists, pure proteins, and quiet hardware.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-sm font-medium text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 group shrink-0"
            >
              <span>Full catalog with detailed filters</span>
              <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 -my-1 mb-8 scrollbar-none"
            role="tablist"
            aria-label="Filter products by category"
          >
            {CATEGORY_TABS.map((cat) => {
              const isSelected = selectedCategory === cat.id
              const count =
                cat.id === 'all'
                  ? products.length
                  : products.filter(
                      (p) =>
                        p.category === cat.id ||
                        p.secondaryCategories.includes(cat.id as ProductCategory)
                    ).length

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  id={`tab-${cat.id}`}
                  aria-selected={isSelected}
                  aria-controls="home-products-panel"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 ${
                    isSelected
                      ? 'bg-sage-700 text-cream-50 border border-sage-700 shadow-sm'
                      : 'bg-oat-100/75 border border-sand-300/80 text-espresso-800 hover:bg-sage-50 hover:border-sage-300 hover:text-espresso-950'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                      isSelected
                        ? 'bg-cream-50 text-sage-900'
                        : 'bg-sand-300/80 text-espresso-900'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Accessible live region announcing count when tab changes */}
          <div aria-live="polite" className="sr-only">
            Showing {displayedProducts.length} of {products.length} products
          </div>

          {/* Product Grid (All 10 items or filtered category) */}
          <div
            id="home-products-panel"
            role="tabpanel"
            aria-labelledby={`tab-${selectedCategory}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx === 0}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. PLANNER TEASER SECTION */}
      <Section className="overflow-hidden">
        <Container>
          <div className="rounded-3xl bg-oat-100/60 border border-sand-300/80 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
              {/* Illustration in warm circular aperture */}
              <div className="lg:col-span-4 flex justify-center text-espresso-900">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-sage-50/90 border border-sage-200/80 shadow-xs flex items-center justify-center p-8 text-sage-800">
                  <CatSitting width={140} height={140} aria-hidden="true" className="w-full h-full text-sage-800" />
                </div>
              </div>

              {/* Copy & Steps */}
              <div className="lg:col-span-8 flex flex-col items-start">
                <p className="text-xs font-semibold uppercase tracking-wider text-sage-800 mb-2">
                  Calorie &amp; Meal Planner
                </p>

                <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-3">
                  No guesswork. A meal plan tailored to your cat.
                </Heading>

                <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-8">
                  Every cat is unique. Our vet-informed calorie engine turns age, weight, and activity into an exact monthly bundle.
                </p>

                {/* 3-Step Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full mb-8">
                  <div className="p-4 rounded-xl bg-cream-50/80 border border-sand-300/60 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-terracotta-100 text-terracotta-800 flex items-center justify-center font-serif text-xs font-bold mb-2">
                      1
                    </span>
                    <h4 className="text-sm font-semibold text-espresso-950 mb-1">
                      Tell us the essentials
                    </h4>
                    <p className="text-xs text-espresso-800 leading-relaxed">
                      Life stage, weight, activity routine, and health focus.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream-50/80 border border-sand-300/60 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-ochre-100 text-ochre-800 flex items-center justify-center font-serif text-xs font-bold mb-2">
                      2
                    </span>
                    <h4 className="text-sm font-semibold text-espresso-950 mb-1">
                      Clinical calculation
                    </h4>
                    <p className="text-xs text-espresso-800 leading-relaxed">
                      Pure formulas calculate resting (RER) and maintenance (MER) calories.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream-50/80 border border-sage-200/80 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-serif text-xs font-bold mb-2">
                      3
                    </span>
                    <h4 className="text-sm font-semibold text-espresso-950 mb-1">
                      A month that lasts
                    </h4>
                    <p className="text-xs text-espresso-800 leading-relaxed">
                      Exact wet sachets and dry portions with duration down to the day.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <Button asChild to="/meal-plan" variant="primary">
                    Plan my cat's meals
                  </Button>
                </div>

                <p className="text-xs text-espresso-700 leading-relaxed">
                  <span className="font-semibold text-espresso-800">Veterinary disclaimer: </span>
                  An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. INGREDIENT PROMISE STRIP SECTION */}
      <Section className="bg-sage-50/40 border-y border-sand-300/70">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-serif text-base font-semibold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-base font-semibold text-espresso-900 mb-1">
                  Formulated with a vet-informed approach
                </h3>
                <p className="text-sm text-espresso-800 leading-relaxed">
                  Precise energy densities, life-stage balance, and controlled minerals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-ochre-100 text-ochre-800 flex items-center justify-center font-serif text-base font-semibold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-base font-semibold text-espresso-900 mb-1">
                  Short ingredient lists, no fillers
                </h3>
                <p className="text-sm text-espresso-800 leading-relaxed">
                  Single-source proteins, unrefined oils, and zero wheat, soy, or corn.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-terracotta-100 text-terracotta-800 flex items-center justify-center font-serif text-base font-semibold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-base font-semibold text-espresso-900 mb-1">
                  Know how long every bag lasts
                </h3>
                <p className="text-sm text-espresso-800 leading-relaxed">
                  Transparent calorie counts compute supply durations down to the day.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. CLOSING CTA SECTION */}
      <Section className="py-20 sm:py-28 text-center overflow-hidden">
        <Container className="max-w-3xl">
          <div className="inline-flex justify-center mb-6 text-terracotta-700/80">
            <CatStretching width={100} height={100} aria-hidden="true" />
          </div>

          <Heading level={2} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-6 text-balance">
            Honest food, quiet design, no guesswork.
          </Heading>

          <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-8 max-w-xl mx-auto text-balance">
            Feed your cat with confidence. Build a custom monthly meal plan or explore our full pantry shelf.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild to="/meal-plan" variant="primary">
              Plan my cat's meals
            </Button>
            <Button asChild to="/shop" variant="secondary">
              Shop the collection
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default HomePage
