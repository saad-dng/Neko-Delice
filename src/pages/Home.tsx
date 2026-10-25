import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/ui/ProductImage'
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

      {/* 1. HERO SECTION (LCP Section - eager, priority, no reveal delay) */}
      <Section className="pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-oat-100 border border-sand-300 text-espresso-800 text-xs font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-terracotta-600" aria-hidden="true" />
                Vet-informed feline nutrition & quiet hardware
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-espresso-950 text-balance leading-[1.12] mb-6">
                Feed your cat exactly what they need.
              </h1>

              <p className="text-lg sm:text-xl text-espresso-800 leading-relaxed max-w-xl text-balance mb-8 sm:mb-10">
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

            {/* Right Composed Product Still (LCP Hero Image, <= 150 KB) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-beige-200 p-4 sm:p-6 border border-sand-300/60 shadow-xs">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                  <ProductImage
                    slug="wild-salmon-quail-pate"
                    imageRole="hero"
                    priority={true}
                    sizes="(min-width: 1024px) 460px, (min-width: 640px) 500px, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 pt-2 border-t border-sand-300/40 text-xs">
                  <div>
                    <span className="font-semibold text-espresso-900 block">
                      Wild Salmon &amp; Quail Paté
                    </span>
                    <span className="text-espresso-800">
                      24 stick sachets &middot; 38 kcal each
                    </span>
                  </div>
                  <Link
                    to="/product/wild-salmon-quail-pate"
                    className="font-medium text-terracotta-700 hover:text-terracotta-800 transition-colors"
                  >
                    View recipe &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. BENTO CATEGORY GRID SECTION */}
      <Section reveal defer className="bg-oat-100/40 border-y border-sand-300/70">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
              The Collection
            </p>
            <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-4">
              Everything your cat needs, nothing they don't.
            </Heading>
            <p className="text-base sm:text-lg text-espresso-800 leading-relaxed">
              Formulated for nutrition, optimal hydration, and quiet living.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Tile 1: Wet Food (Large, 7 cols) */}
            <div className="md:col-span-12 lg:col-span-7 group relative flex flex-col justify-between rounded-2xl bg-beige-200 p-6 sm:p-8 transition-all duration-200 hover:shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700">
                  Daily Nutrition
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950 mt-1 mb-2">
                  <Link to="/shop?category=wet-food" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Wet Food
                  </Link>
                </h3>
                <p className="text-sm text-espresso-800 max-w-md leading-relaxed">
                  High-moisture stick sachets formulated for obligate carnivores. Silky mousse and smooth paté.
                </p>
              </div>

              <div className="relative mt-6 aspect-[16/10] sm:aspect-[2/1] w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="wild-salmon-quail-pate"
                  imageRole="hero"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-espresso-900">
                <span>Browse Wet Food</span>
                <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
              </div>
            </div>

            {/* Tile 2: Dry Food (Medium, 5 cols) */}
            <div className="md:col-span-6 lg:col-span-5 group relative flex flex-col justify-between rounded-2xl bg-beige-200 p-6 sm:p-8 transition-all duration-200 hover:shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ochre-800">
                  Oven-Baked
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950 mt-1 mb-2">
                  <Link to="/shop?category=dry-food" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Dry Food
                  </Link>
                </h3>
                <p className="text-sm text-espresso-800 leading-relaxed">
                  Slow oven-baked whole duck and sweet potato with gentle prebiotic fibre.
                </p>
              </div>

              <div className="relative mt-6 aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="duck-sweet-potato-kibble"
                  imageRole="hero"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-espresso-900">
                <span>Browse Dry Food</span>
                <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
              </div>
            </div>

            {/* Tile 3: Treats & Toppers (4 cols) */}
            <div className="md:col-span-6 lg:col-span-4 group relative flex flex-col justify-between rounded-2xl bg-beige-200 p-6 sm:p-7 transition-all duration-200 hover:shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sage-800">
                  Pure Boosts
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-espresso-950 mt-1 mb-2">
                  <Link to="/shop?category=treat-topper" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Treats &amp; Toppers
                  </Link>
                </h3>
                <p className="text-sm text-espresso-800 leading-relaxed">
                  Cold-filtered Norwegian salmon oil and pure freeze-dried chicken heart bites.
                </p>
              </div>

              <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="norwegian-salmon-oil"
                  imageRole="hero"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-espresso-900">
                <span>Browse Treats</span>
                <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
              </div>
            </div>

            {/* Tile 4: Litter (4 cols) */}
            <div className="md:col-span-6 lg:col-span-4 group relative flex flex-col justify-between rounded-2xl bg-beige-200 p-6 sm:p-7 transition-all duration-200 hover:shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-matcha-text">
                  Plant-Based
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-espresso-950 mt-1 mb-2">
                  <Link to="/shop?category=litter" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Litter
                  </Link>
                </h3>
                <p className="text-sm text-espresso-800 leading-relaxed">
                  Plant-based tofu pellets scented softly with organic matcha powder. Low dust.
                </p>
              </div>

              <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="matcha-tofu-litter"
                  imageRole="hero"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-espresso-900">
                <span>Browse Litter</span>
                <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
              </div>
            </div>

            {/* Tile 5: Hardware (4 cols) */}
            <div className="md:col-span-6 lg:col-span-4 group relative flex flex-col justify-between rounded-2xl bg-beige-200 p-6 sm:p-7 transition-all duration-200 hover:shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-oak-700">
                  Solid Living
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-espresso-950 mt-1 mb-2">
                  <Link to="/shop?category=hardware" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Hardware
                  </Link>
                </h3>
                <p className="text-sm text-espresso-800 leading-relaxed">
                  Whisper-quiet ceramic fountains, whisker bowls, and solid oak litter basins.
                </p>
              </div>

              <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-xl bg-beige-200">
                <ProductImage
                  slug="ceramic-water-fountain"
                  imageRole="hero"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-espresso-900">
                <span>Browse Hardware</span>
                <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. PLANNER TEASER SECTION */}
      <Section reveal defer className="overflow-hidden">
        <Container>
          <div className="rounded-3xl bg-oat-100/70 border border-sand-300 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
              {/* Illustration */}
              <div className="lg:col-span-4 flex justify-center text-espresso-900">
                <div className="relative p-6 rounded-2xl bg-cream-50/80 border border-sand-300/80 shadow-xs flex items-center justify-center">
                  <CatSitting width={160} height={160} aria-hidden="true" />
                </div>
              </div>

              {/* Copy & Steps */}
              <div className="lg:col-span-8 flex flex-col items-start">
                <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
                  Calorie &amp; Meal Planner
                </p>

                <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-4">
                  No guesswork. A meal plan tailored to your cat.
                </Heading>

                <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-8">
                  Every cat is unique. Our vet-informed calorie engine turns age, weight, and activity into an exact monthly bundle.
                </p>

                {/* 3-Step Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-8">
                  <div className="p-4 rounded-xl bg-cream-50/60 border border-sand-300/60">
                    <span className="w-6 h-6 rounded-full bg-sand-300/80 text-espresso-900 flex items-center justify-center font-serif text-xs font-bold mb-2">
                      1
                    </span>
                    <h4 className="text-sm font-semibold text-espresso-950 mb-1">
                      Tell us the essentials
                    </h4>
                    <p className="text-xs text-espresso-800 leading-relaxed">
                      Life stage, weight, activity routine, and health focus.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream-50/60 border border-sand-300/60">
                    <span className="w-6 h-6 rounded-full bg-sand-300/80 text-espresso-900 flex items-center justify-center font-serif text-xs font-bold mb-2">
                      2
                    </span>
                    <h4 className="text-sm font-semibold text-espresso-950 mb-1">
                      Clinical calculation
                    </h4>
                    <p className="text-xs text-espresso-800 leading-relaxed">
                      Pure formulas calculate resting (RER) and maintenance (MER) calories.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream-50/60 border border-sand-300/60">
                    <span className="w-6 h-6 rounded-full bg-sand-300/80 text-espresso-900 flex items-center justify-center font-serif text-xs font-bold mb-2">
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

                <p className="text-xs text-espresso-800 leading-relaxed">
                  <span className="font-semibold text-espresso-800">Veterinary disclaimer: </span>
                  An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. FULL COLLECTION SECTION (All 10 products with category tabs) */}
      <Section reveal defer className="bg-cream-50">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
                The Complete Shelf
              </p>
              <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950">
                Crafted for health and longevity
              </Heading>
              <p className="text-sm sm:text-base text-espresso-700 mt-2 max-w-xl">
                Every recipe and quiet essential in our range. Formulated without fillers, guesswork, or synthetic binders.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-sm font-medium text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 group shrink-0"
            >
              <span>Full catalog with filters</span>
              <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none"
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
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-espresso-900 focus:ring-offset-2 ${
                    isSelected
                      ? 'bg-espresso-950 text-cream-50 shadow-xs'
                      : 'bg-oat-100/70 border border-sand-300/80 text-espresso-800 hover:bg-oat-100 hover:text-espresso-950'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                      isSelected
                        ? 'bg-cream-50/20 text-cream-50'
                        : 'bg-sand-300/70 text-espresso-800'
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

          {/* Product Grid (All 10 items) */}
          <div
            id="home-products-panel"
            role="tabpanel"
            aria-labelledby={`tab-${selectedCategory}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. INGREDIENT PROMISE STRIP SECTION */}
      <Section reveal defer className="bg-oat-100/60 border-y border-sand-300">
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
      <Section reveal defer className="py-20 sm:py-28 text-center overflow-hidden">
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
