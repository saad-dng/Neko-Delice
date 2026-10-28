import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'
import { SiteImage } from '@/components/ui/SiteImage'
import { ProductImage } from '@/components/ui/ProductImage'
import { ProductCard } from '@/components/product/ProductCard'
import { Annotation } from '@/components/ui/Annotation'
import { Band } from '@/components/ui/Band'
import { CatCard } from '@/components/ui/CatCard'
import { IdleCat } from '@/components/ui/IdleCat'
import { Reveal } from '@/components/ui/Reveal'
import { Wave } from '@/components/doodles/Wave'
import { SparkleLine } from '@/components/doodles/SparkleLine'
import { Heart } from '@/components/doodles/Heart'
import { PawTrail } from '@/components/doodles/PawTrail'
import {
  CatCurious,
  CatSleeping,
  CatWalking,
  CatStretch,
  CatCurled,
  CatPeekEdge,
  PawPrint,
} from '@/components/cat-art'
import { products } from '@/data/products'
import { siteImages } from '@/data/site-images.manifest'
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

  const [shopAnnouncement, setShopAnnouncement] = useState('')

  const handleCategoryChange = (catId: HomeCategoryFilter) => {
    const count =
      catId === 'all'
        ? products.length
        : products.filter(
            (p) =>
              p.category === catId ||
              p.secondaryCategories.includes(catId as ProductCategory),
          ).length
    const label = CATEGORY_TABS.find((t) => t.id === catId)?.label || catId
    setShopAnnouncement(`Showing ${count} ${count === 1 ? 'product' : 'products'} for ${label}`)

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
    const heroEl = document.getElementById('hero')
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

  const heroImage = siteImages.hero
  const heroImageSrcset = heroImage
    ? Object.entries(heroImage.srcset)
        .map(([w, s]) => `${s} ${w}w`)
        .join(', ')
    : ''

  return (
    <>
      <SeoHead
        title="NEKO DELICE: cat food planned around your cat"
        description="Short ingredient lists, honest portions, and a vet-informed meal plan built around your cat."
        path="/"
        imagePreload={
          heroImage
            ? {
                src: heroImage.src,
                srcset: heroImageSrcset,
                sizes: '(max-width: 768px) 100vw, 50vw',
              }
            : undefined
        }
      />

      {/* 1. HERO SECTION (Real Cat Photography + Editorial Typography + Product Pouch) */}
      <section id="hero" className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden bg-cream-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
            {/* Left Column: Headlines, CTAs & Pillars (No Reveal wrapping to avoid LCP delay) */}
            <div className="lg:col-span-7 flex flex-col items-start order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oat-100/70 border border-sand-300/80 text-espresso-800 text-xs font-medium tracking-wide mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600" aria-hidden="true" />
                <span>Quiet cat nutrition, planned</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-espresso-950 text-balance leading-[1.1] mb-5">
                Good food for{' '}
                <span className="italic font-normal">curious cats.</span>
              </h1>

              <p className="text-base sm:text-lg text-espresso-800 leading-relaxed max-w-xl mb-8">
                Short ingredient lists, honest portions, and a vet-informed meal plan built around your cat.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
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

              {/* 3 Truthful Brand Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 sm:pt-8 border-t border-sand-300/70 w-full">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-600" aria-hidden="true" />
                    <span className="font-serif text-sm font-semibold text-espresso-950">Short ingredients</span>
                  </div>
                  <span className="text-xs text-espresso-700/80 leading-snug">Full list on every pack, zero fillers</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ochre-600" aria-hidden="true" />
                    <span className="font-serif text-sm font-semibold text-espresso-950">Every life stage</span>
                  </div>
                  <span className="text-xs text-espresso-700/80 leading-snug">Kitten growth to gentle adult care</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600" aria-hidden="true" />
                    <span className="font-serif text-sm font-semibold text-espresso-950">Honest durations</span>
                  </div>
                  <span className="text-xs text-espresso-700/80 leading-snug">Know exactly how long each pack lasts</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Cat Photo + Editorial Recipe Plaque + Annotation */}
            <div className="lg:col-span-5 relative flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-[520px]">
                {/* Handwritten Annotation in the margin */}
                <div className="absolute -top-7 sm:-top-9 right-4 sm:right-10 z-20 pointer-events-none">
                  <Annotation
                    text="Mealtime is the best time."
                    arrow="down"
                    rotate={-2}
                  />
                </div>

                {/* Gallery Mat Canvas */}
                <div className="relative rounded-3xl bg-[#F0E8DC] p-2.5 sm:p-3 border border-sand-300/80 shadow-[0_16px_40px_-16px_rgba(43,33,26,0.12)]">
                  {/* Inner Image Container with natural studio lighting */}
                  <div className="relative rounded-2xl overflow-hidden bg-oat-100/50 aspect-[4/3]">
                    <SiteImage
                      name="hero"
                      priority={true}
                      sizes="(max-width: 768px) 100vw, 520px"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Editorial Recipe Plaque */}
                  <div className="absolute -bottom-5 left-3 sm:-bottom-5 sm:-left-4 z-20">
                    <a
                      href="/product/duck-sweet-potato-kibble"
                      className="group flex items-center gap-3.5 bg-cream-50/98 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sand-300 shadow-[0_12px_28px_-6px_rgba(43,33,26,0.14)] hover:border-terracotta-600/40 hover:shadow-[0_16px_34px_-6px_rgba(43,33,26,0.18)] transition-all duration-200"
                      
                    >
                      <div className="w-12 h-12 rounded-xl bg-oat-100/80 p-1 flex-shrink-0 border border-sand-300/50 flex items-center justify-center overflow-hidden">
                        <ProductImage
                          slug="duck-sweet-potato-kibble"
                          imageRole="hero"
                          sizes="48px"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="flex flex-col pr-1 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-ochre-700">
                            Recipe 03
                          </span>
                          <span className="w-1 h-1 rounded-full bg-sand-400" aria-hidden="true" />
                          <span className="text-[10px] text-espresso-600 font-medium">Dry food</span>
                        </div>
                        <span className="font-serif text-sm font-semibold text-espresso-950 group-hover:text-terracotta-700 transition-colors">
                          Duck & Sweet Potato
                        </span>
                        <span className="text-[11px] text-espresso-600/80">
                          Slow-baked kibble · Transparent recipe
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Soft Wave Divider leading into the Sage Planner Band */}
        <div className="mt-12 sm:mt-16 w-full -mb-1">
          <Wave fill="color-mix(in srgb, #9DAA8B 12%, #FBF6EE)" />
        </div>
      </section>

      {/* 2. PLANNER BAND (Sage tint with 3 Clickable Cat Cards) */}
      <Band variant="sage" padding="none" className="pb-16 sm:pb-20">
        <Container>
          <Reveal>
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center mb-10 sm:mb-12">
              <div className="w-14 h-14 rounded-full bg-cream-50 text-sage-800 flex items-center justify-center shadow-2xs mb-3">
                <CatCurious className="w-9 h-9" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-sage-800 mb-2">
                Cat Nutrition Planner
              </p>

              <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-3 text-balance">
                No guesswork. Just the right plan for your cat.
              </Heading>

              <p className="text-sm sm:text-base text-espresso-800 leading-relaxed max-w-xl text-balance">
                Every cat is different. Tell us their routine and we work out the calories, portions, and a balanced monthly bundle.
              </p>
            </div>
          </Reveal>

          {/* Three Clickable Cat Cards linking to /meal-plan with preselected activity */}
          <Reveal delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto mb-10">
              <CatCard
                href="/meal-plan?act=lounger&step=1"
                title="Indoor lounger"
                description="Gentle daily strolls, sunlit naps, and quiet afternoon stretches."
                pose={<CatSleeping className="w-16 h-16 text-espresso-800" />}
              />
              <CatCard
                href="/meal-plan?act=explorer&step=1"
                title="Playful explorer"
                description="Daily chasing, window birdwatching, and steady room-to-room patrols."
                pose={<CatWalking className="w-16 h-16 text-espresso-800" />}
                badge="Popular"
              />
              <CatCard
                href="/meal-plan?act=high-energy&step=1"
                title="High-energy"
                description="Climbing, sprint bursts, high vertical jumps, and energetic playtime."
                pose={<CatStretch className="w-16 h-16 text-espresso-800" />}
              />
            </div>
          </Reveal>

          {/* Three Steps Overview */}
          <Reveal delay={200}>
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center py-4 px-6 rounded-2xl bg-cream-50/70 border border-sand-300/60 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sage-200 text-sage-900 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-xs font-medium text-espresso-900">Tell us about your cat</span>
              </div>
              <span className="hidden sm:inline text-sand-300 text-sm">→</span>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sage-200 text-sage-900 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-xs font-medium text-espresso-900">See daily calories</span>
              </div>
              <span className="hidden sm:inline text-sand-300 text-sm">→</span>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sage-200 text-sage-900 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-xs font-medium text-espresso-900">Get a monthly bundle</span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-center text-espresso-700/80 max-w-xl mx-auto leading-relaxed">
              An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
            </p>
          </Reveal>
        </Container>
      </Band>

      {/* 3. THE SHOP (Interactive Storefront) */}
      <section id="shop" className="bg-cream-50 py-14 sm:py-20 border-t border-sand-300/60 scroll-mt-20 sm:scroll-mt-24">
        <div id="collection" className="sr-only" aria-hidden="true" />
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
                  The Shop
                </p>
                <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950">
                  Everything your cat needs, nothing they don&apos;t.
                </Heading>
                <p className="text-sm sm:text-base text-espresso-700 mt-2 max-w-xl">
                  Ten intentional recipes and essentials crafted without fillers or guesswork.
                </p>
              </div>

              <Button
                asChild
                to={selectedCategory === 'all' ? '/shop' : `/shop?category=${selectedCategory}`}
                variant="secondary"
                className="self-start md:self-auto text-xs"
              >
                View full collection →
              </Button>
            </div>
          </Reveal>

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

          {/* Shop Toolbar: Product Count & Currency Switcher + Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-sand-300/60">
            <p className="text-xs sm:text-sm font-medium text-espresso-700">
              Showing <span className="font-semibold text-espresso-950">{displayedProducts.length}</span> {displayedProducts.length === 1 ? 'product' : 'products'}
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

          {/* Screen Reader Live Region for Shop Count Announcements */}
          <output aria-live="polite" className="sr-only">
            {shopAnnouncement}
          </output>

          {/* Product Grid */}
          <div
            id="home-products-panel"
            role="tabpanel"
            aria-labelledby={`tab-${selectedCategory}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={false}
                />
              ))
            ) : (
              /* Empty state with peeking cat */
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="w-24 h-16 text-espresso-700 mb-4 overflow-hidden flex items-end justify-center">
                  <CatPeekEdge className="w-20 h-16 animate-step-transition" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-espresso-950 mb-2">
                  No products found in this category
                </h3>
                <p className="text-sm text-espresso-700 max-w-sm mb-6">
                  Try selecting a different category above or explore our complete cat nutrition collection.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  className="rounded-full bg-sage-700 text-cream-50 px-5 py-2.5 text-xs font-semibold hover:bg-sage-800 transition-all cursor-pointer"
                >
                  View all products
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 4. WHY BAND (Oat tint with Eating Cat Photo + 4 Truthful Values) */}
      <Band variant="oat" padding="md" className="border-t border-sand-300/60">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
            {/* Left: Eating Cat Photo with Curled Cat Idle Badge */}
            <div className="lg:col-span-5 relative flex justify-center">
              <Reveal>
                <div className="relative w-full max-w-[420px]">
                  <SiteImage
                    name="eating"
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="rounded-3xl shadow-sm aspect-[3/4] object-cover"
                  />
                  {/* Floating Curled Cat Badge with Annotation */}
                  <div className="absolute -bottom-4 -right-2 sm:bottom-4 sm:-right-4 inline-flex items-center gap-2.5 bg-cream-50/95 py-2 px-3 rounded-2xl shadow-sm border border-[#2B211A]/8">
                    <IdleCat>
                      <CatCurled className="w-10 h-10 text-espresso-800" />
                    </IdleCat>
                    <Annotation text="Planned portions" arrow={false} rotate={2} hideOnMobile={false} />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Truthful Value Points & Philosophy Link */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
                  Why Neko Delice
                </p>

                <Heading level={2} className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 mb-6 text-balance">
                  Better food. Better days.
                </Heading>

                {/* 4 Truthful Value Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <div className="p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Short, recognisable ingredients
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      The full list is on every product page. Single-source proteins, unrefined oils, no fillers.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Made for their stage
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      Kitten growth mousse, adult formulas, and senior care calibrated by age and nutritional needs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Formulated to be gentle
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      Recipes that support sensitive stomachs, smooth digestion, and healthy coat condition.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cream-50/70 border border-sand-300/60">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Plans that add up
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      Portions and pack length calculated for your cat so you know how long every box lasts.
                    </p>
                  </div>
                </div>

                <Button asChild to="/about" variant="secondary" catIcon="head">
                  Our philosophy →
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </Band>

      {/* 5. CALM STRIP (Truthful Standards without Inflated Claims) */}
      <section className="bg-cream-50 py-8 border-y border-sand-300/70">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center shrink-0">
                <SparkleLine className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-espresso-900">
                Plan in about a minute
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-800 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-espresso-900">
                Ingredients listed in full
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-oat-200 text-espresso-800 flex items-center justify-center shrink-0">
                <PawTrail count={2} className="w-8 h-5" />
              </div>
              <span className="text-sm font-medium text-espresso-900">
                Supply length shown on every pack
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. CLOSING CTA (CatPeekEdge Peeking Over the Card) */}
      <section className="py-20 sm:py-28 bg-cream-50 overflow-hidden">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="relative pt-10 sm:pt-12 pb-10 sm:pb-14 px-6 sm:px-12 rounded-3xl bg-oat-100/50 border border-sand-300/70 text-center">
              {/* CatPeekEdge centered peeking over top rim */}
              <div className="absolute -top-10 sm:-top-11 left-1/2 -translate-x-1/2 w-28 sm:w-32 text-espresso-900 pointer-events-none">
                <CatPeekEdge className="w-full h-auto" />
              </div>

              <Heading level={2} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4 text-balance">
                Feed your cat with confidence.
              </Heading>

              <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-8 max-w-xl mx-auto text-balance">
                Take the guesswork out of mealtime with a personalised plan or explore our honest collection.
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
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

export default HomePage
