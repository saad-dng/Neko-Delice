import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'
import { ProductCard } from '@/components/product/ProductCard'
import { CatSitting } from '@/components/cat-art/CatSitting'
import { CatStretching } from '@/components/cat-art/CatStretching'
import { CatHead } from '@/components/cat-art/CatHead'
import { PawPrint } from '@/components/cat-art/PawPrint'
import { products } from '@/data/products'
import type { ProductCategory } from '@/data/types'
import type { ShopSort } from '@/lib/filters'
import { getShopSession, markInShop, saveShopSession } from '@/lib/shop-session'

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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') as ProductCategory | null
  const selectedCategory: HomeCategoryFilter =
    categoryParam && ['wet-food', 'dry-food', 'treat-topper', 'litter', 'hardware'].includes(categoryParam)
      ? categoryParam
      : 'all'

  const [selectedSort, setSelectedSort] = useState<ShopSort>(() => {
    const session = getShopSession()
    if (session.sort && ['featured', 'price-asc', 'price-desc'].includes(session.sort)) {
      return session.sort
    }
    return 'featured'
  })

  const handleCategoryChange = (catId: HomeCategoryFilter) => {
    const nextParams = new URLSearchParams(searchParams)
    if (catId === 'all') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', catId)
    }
    saveShopSession({
      category: catId === 'all' ? undefined : catId,
      inShop: true,
    })
    const searchStr = nextParams.toString()
    const dest = searchStr ? `/?${searchStr}#shop` : '/#shop'
    navigate(dest, { replace: true })
  }

  const handleSortChange = (newSort: ShopSort) => {
    setSelectedSort(newSort)
    saveShopSession({ sort: newSort, inShop: true })
  }

  // Restore user to where they left off in the shop segment if returning
  useEffect(() => {
    const session = getShopSession()
    const returningFromPdp = session.returningFromPdp
    const inShop = session.inShop
    const lastProduct = session.lastProductSlug

    if (returningFromPdp || (inShop && lastProduct)) {
      saveShopSession({ returningFromPdp: false })

      // Restore category if missing from query params
      if (
        !categoryParam &&
        session.category &&
        ['wet-food', 'dry-food', 'treat-topper', 'litter', 'hardware'].includes(session.category)
      ) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('category', session.category)
        const targetAnchor = lastProduct ? `product-${lastProduct}` : 'shop'
        navigate(`/?${nextParams.toString()}#${targetAnchor}`, { replace: true })
      }

      // Smooth scroll to the last viewed product or shop section
      const targetId = lastProduct ? `product-${lastProduct}` : 'shop'
      let attempts = 0
      const scrollToTarget = () => {
        const el = document.getElementById(targetId) || document.getElementById('shop')
        if (el) {
          const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches
          el.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'center',
          })
          if (lastProduct && el.id === `product-${lastProduct}`) {
            el.classList.add(
              'ring-2',
              'ring-terracotta-500/80',
              'ring-offset-2',
              'ring-offset-cream-50'
            )
            setTimeout(() => {
              el.classList.remove(
                'ring-2',
                'ring-terracotta-500/80',
                'ring-offset-2',
                'ring-offset-cream-50'
              )
            }, 2200)
          }
        } else if (attempts < 12) {
          attempts++
          requestAnimationFrame(scrollToTarget)
        }
      }
      requestAnimationFrame(scrollToTarget)
    }
  }, [categoryParam, navigate, searchParams])

  // Track when customer is actively in the shop section
  useEffect(() => {
    const shopEl = document.getElementById('shop')
    if (!shopEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            markInShop(true)
          }
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(shopEl)
    return () => observer.disconnect()
  }, [])

  // Detect when customer scrolls all the way back up to hero at top of page
  useEffect(() => {
    const heroEl = document.querySelector('section')
    if (!heroEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && window.scrollY < 200) {
            saveShopSession({ inShop: false, lastProductSlug: undefined })
          }
        }
      },
      { threshold: 0.6 }
    )

    observer.observe(heroEl)
    return () => observer.disconnect()
  }, [])

  const displayedProducts = useMemo(() => {
    let list = products
    if (selectedCategory !== 'all') {
      list = products.filter(
        (p) =>
          p.category === selectedCategory ||
          p.secondaryCategories.includes(selectedCategory)
      )
    }
    if (selectedSort === 'price-asc') {
      return [...list].sort((a, b) => a.priceUSD - b.priceUSD)
    }
    if (selectedSort === 'price-desc') {
      return [...list].sort((a, b) => b.priceUSD - a.priceUSD)
    }
    return list
  }, [selectedCategory, selectedSort])

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
              <Button asChild to="/meal-plan" variant="primary" catIcon="paw">
                Plan my cat's meals
              </Button>
              <Button
                asChild
                to="/#shop"
                variant="secondary"
                catIcon="head"
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById('shop') || document.getElementById('collection')
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                    window.history.pushState(null, '', '/#shop')
                  }
                }}
              >
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

      {/* 2. THE SHOP (Unified storefront on home with category pills and sort controls) */}
      <Section id="shop" className="bg-cream-50 border-t border-sand-300/60 scroll-mt-20 sm:scroll-mt-24">
        {/* Invisible anchor target for backwards compatibility */}
        <div id="collection" className="sr-only" aria-hidden="true" />
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
                The Shop
              </p>
              <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950">
                Shop the collection
              </Heading>
              <p className="text-sm sm:text-base text-espresso-700 mt-2 max-w-xl">
                Honest cat nutrition and quiet hardware for every stage of cat life. Ten intentional items, crafted without fillers or guesswork.
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 -my-1 mb-6 scrollbar-none"
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
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 ${
                    isSelected
                      ? 'bg-sage-700 text-cream-50 border border-sage-700 shadow-sm'
                      : 'bg-oat-100/75 border border-sand-300/80 text-espresso-800 hover:bg-sage-50 hover:border-sage-300 hover:text-espresso-950'
                  }`}
                >
                  {isSelected && (
                    <PawPrint size={12} filled className="text-cream-100" />
                  )}
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

          {/* Shop Toolbar: Product Count & Controls (Currency Toggle + Sort) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-sand-300/60">
            <p className="text-xs sm:text-sm font-medium text-espresso-700">
              Showing <span className="font-semibold text-espresso-900">{displayedProducts.length}</span> {displayedProducts.length === 1 ? 'product' : 'products'}
            </p>

            <div className="flex items-center gap-3">
              <CurrencyToggle ariaLabel="Shop currency" size="sm" />

              <div className="flex items-center gap-2">
                <label
                  htmlFor="shop-sort"
                  className="text-xs font-semibold uppercase tracking-wider text-espresso-800 shrink-0"
                >
                  Sort by
                </label>
                <select
                  id="shop-sort"
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value as ShopSort)}
                  className="rounded-full border border-sand-300 bg-cream-50/90 py-1.5 pl-3.5 pr-8 text-xs font-medium text-espresso-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 cursor-pointer transition-colors hover:border-sand-400"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accessible live region announcing count when tab or sort changes */}
          <div aria-live="polite" className="sr-only">
            Showing {displayedProducts.length} of {products.length} products
          </div>

          {/* Product Grid */}
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

            {selectedCategory === 'all' && selectedSort === 'featured' && (
              <>
                {/* Intentional Editorial Tile 1: Meal Planner */}
                <article className="group relative flex flex-col rounded-2xl bg-oat-100/40 overflow-hidden border border-sand-300/40 transition-all duration-200 hover:bg-oat-100/70 hover:border-sand-300/70 hover:shadow-xs">
                  {/* Aspect-square visual header matching product photo tiles */}
                  <div className="relative aspect-square w-full overflow-hidden bg-sage-100/60 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-cream-50 text-sage-800 flex items-center justify-center shadow-2xs mb-2.5 transition-transform duration-200 group-hover:scale-105">
                      <CatSitting className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-800 leading-none">
                      Interactive Tool
                    </span>
                    <h3 className="mt-1.5 font-serif text-lg font-semibold text-espresso-950 leading-snug">
                      Monthly Meal Plan
                    </h3>
                  </div>

                  {/* Info bar matching product card height & spacing */}
                  <div className="p-3 sm:px-3 sm:py-2.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-2 h-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-800 leading-none">
                          Custom Nutrition
                        </span>
                        <span className="font-sans text-xs sm:text-[13px] font-semibold text-sage-800 tabular-nums leading-none">
                          Free Guide
                        </span>
                      </div>
                      <p className="mt-1 font-sans text-xs text-espresso-700 leading-snug line-clamp-2 h-[34px] flex items-start">
                        <Link to="/meal-plan" className="focus:outline-none">
                          <span className="absolute inset-0 z-0" aria-hidden="true" />
                          Calculate your cat&apos;s daily calorie target and monthly bundle.
                        </Link>
                      </p>
                      <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-espresso-600 line-clamp-1 h-3.5 leading-none">
                        Pure scientific nutrition formulas
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-sand-300/40">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-espresso-700 transition-colors group-hover:text-terracotta-700 leading-none">
                        Plan meals <span aria-hidden="true">→</span>
                      </span>
                      <span className="relative z-10 inline-flex items-center justify-center gap-1 rounded-full bg-sage-700 px-2.5 py-1 min-h-[28px] text-[11px] font-semibold text-cream-50 shadow-2xs leading-none">
                        <PawPrint size={11} filled className="text-cream-100" />
                        <span>Start</span>
                      </span>
                    </div>
                  </div>
                </article>

                {/* Intentional Editorial Tile 2: Our Standards */}
                <article className="group relative flex flex-col rounded-2xl bg-oat-100/40 overflow-hidden border border-sand-300/40 transition-all duration-200 hover:bg-oat-100/70 hover:border-sand-300/70 hover:shadow-xs">
                  {/* Aspect-square visual header matching product photo tiles */}
                  <div className="relative aspect-square w-full overflow-hidden bg-sand-200/50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-cream-50 text-espresso-800 flex items-center justify-center shadow-2xs mb-2.5 transition-transform duration-200 group-hover:scale-105">
                      <CatHead className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-espresso-700 leading-none">
                      Our Philosophy
                    </span>
                    <h3 className="mt-1.5 font-serif text-lg font-semibold text-espresso-950 leading-snug">
                      Honest Standards
                    </h3>
                  </div>

                  {/* Info bar matching product card height & spacing */}
                  <div className="p-3 sm:px-3 sm:py-2.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-2 h-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-espresso-700 leading-none">
                          Quality Pledge
                        </span>
                        <span className="font-sans text-xs sm:text-[13px] font-semibold text-espresso-800 tabular-nums leading-none">
                          Zero Fillers
                        </span>
                      </div>
                      <p className="mt-1 font-sans text-xs text-espresso-700 leading-snug line-clamp-2 h-[34px] flex items-start">
                        <Link to="/about" className="focus:outline-none">
                          <span className="absolute inset-0 z-0" aria-hidden="true" />
                          Human-grade single-source proteins and unrefined oils.
                        </Link>
                      </p>
                      <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-espresso-600 line-clamp-1 h-3.5 leading-none">
                        Formulated for obligate carnivores
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-sand-300/40">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-espresso-700 transition-colors group-hover:text-terracotta-700 leading-none">
                        Read story <span aria-hidden="true">→</span>
                      </span>
                      <span className="relative z-10 inline-flex items-center justify-center gap-1 rounded-full bg-sand-300 px-2.5 py-1 min-h-[28px] text-[11px] font-semibold text-espresso-900 shadow-2xs leading-none">
                        <CatHead className="w-3 h-3 text-espresso-800" />
                        <span>About</span>
                      </span>
                    </div>
                  </div>
                </article>
              </>
            )}
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
                  <Button asChild to="/meal-plan" variant="primary" catIcon="paw">
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
            <Button asChild to="/meal-plan" variant="primary" catIcon="paw">
              Plan my cat's meals
            </Button>
            <Button
              asChild
              to="/#shop"
              variant="secondary"
              catIcon="head"
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById('shop') || document.getElementById('collection')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' })
                  window.history.pushState(null, '', '/#shop')
                }
              }}
            >
              Shop the collection
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default HomePage
