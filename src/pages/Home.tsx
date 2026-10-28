import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { SiteImage } from '@/components/ui/SiteImage'
import { ProductCard } from '@/components/product/ProductCard'
import { Annotation } from '@/components/ui/Annotation'
import { Band } from '@/components/ui/Band'
import { CatCard } from '@/components/ui/CatCard'
import { Reveal } from '@/components/ui/Reveal'
import { Wave } from '@/components/doodles/Wave'
import {
  CatCurious,
  CatSleeping,
  CatWalking,
  CatStretch,
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

  const [selectedSort] = useState<ShopSort>(() => {
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
                sizes: '(max-width: 1024px) 100vw, 58vw',
              }
            : undefined
        }
      />

      {/* 1. HERO SECTION (Real Cat Photography + Editorial Typography + Product Pouch) */}
      <section id="hero" className="relative bg-cream-50 overflow-hidden min-h-[640px] flex flex-col justify-between">
        {/* Handwritten Annotation in empty space pointing at cat with >=60px arrow */}
        <div className="hidden lg:block absolute top-16 left-[41%] xl:left-[40%] z-20 pointer-events-none">
          <Annotation
            text="Mealtime is the best time."
            arrow="curve-right"
            arrowClassName="w-16 h-8"
            rotate={-2}
          />
        </div>
        {/* Real Cat Photography (LCP) + Overlapping Product Pack */}
        <div className="relative w-full h-[340px] sm:h-[440px] lg:h-auto lg:absolute lg:top-0 lg:right-0 lg:w-[58%] lg:bottom-0 pointer-events-none overflow-hidden order-1 lg:order-2">


          <div className="hero-mask w-full h-full">
            <img
              src={heroImage?.src || '/images/site/hero-1024.webp'}
              srcSet={heroImageSrcset}
              sizes="(max-width: 1024px) 100vw, 58vw"
              alt={heroImage?.alt || 'Fluffy cream cat seated calmly beside a low ceramic bowl filled with kibble on a warm neutral studio backdrop.'}
              fetchPriority="high"
              width={1200}
              height={896}
              className="w-full h-full object-cover object-[70%_25%]"
            />
          </div>

          {/* Product pack photo overlapping lower right (tuned with beige token container) */}
          <div className="absolute right-6 bottom-4 sm:right-10 sm:bottom-6 lg:right-12 lg:bottom-10 xl:right-14 xl:bottom-12 w-28 sm:w-36 lg:w-44 pointer-events-auto">
            <a
              href="/product/duck-sweet-potato-kibble"
              className="block group rounded-2xl bg-[#EDE5D8]/95 p-2 sm:p-2.5 border border-sand-300/80 shadow-[0_14px_30px_-6px_rgba(43,33,26,0.14)] hover:border-terracotta-600/40 hover:shadow-[0_18px_36px_-6px_rgba(43,33,26,0.2)] transition-all duration-300"
              title="View Duck & Sweet Potato Kibble"
            >
              <div className="overflow-hidden rounded-xl aspect-[4/5] bg-[#DDD0BA]/50 flex items-center justify-center">
                <img
                  src="/images/products/duck-sweet-potato-kibble/duck-sweet-potato-kibble-hero-640.webp"
                  alt="Neko Delice Duck & Sweet Potato Kibble pack"
                  width={320}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </a>
          </div>
        </div>

        {/* Content Column: Headlines, CTAs & Proof Row */}
        <Container className="relative z-10 order-2 lg:order-1 pt-6 pb-12 sm:pb-16 lg:py-24">
          <div className="max-w-xl lg:max-w-[48%] flex flex-col items-start">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-espresso-700/90 mb-5">
              Quiet cat nutrition, planned
            </p>

            <h1 className="font-serif font-semibold text-espresso-950 tracking-tight leading-[1.02] text-[clamp(2.75rem,6vw,5.25rem)] mb-6">
              <span className="block">Good food for </span>
              <span className="block italic font-normal text-[#56744B]">curious cats.</span>
            </h1>

            <p className="text-lg sm:text-[20px] text-espresso-800 leading-[1.5] max-w-xl mb-8">
              Short ingredient lists, honest portions, and a vet-informed meal plan built around your cat.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 w-full sm:w-auto">
              <Button asChild to="/meal-plan" variant="primary" className="h-14 px-8 text-[16px] font-medium w-full sm:w-auto">
                Plan my cat's meals
              </Button>
              <Button
                asChild
                to="/#shop"
                variant="secondary"
                className="h-14 px-8 text-[16px] font-medium w-full sm:w-auto"
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

            {/* Proof row: three short statements, 15 px, separated by 1 px vertical dividers, no dots or icons */}
            <div className="w-full pt-8 border-t border-sand-300/80">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-sand-300/80">
                <div className="py-2.5 sm:py-0 sm:pr-4 text-[15px] font-medium text-espresso-800 leading-snug">
                  Short ingredient lists
                </div>
                <div className="py-2.5 sm:py-0 sm:px-4 text-[15px] font-medium text-espresso-800 leading-snug">
                  Formulated for every life stage
                </div>
                <div className="py-2.5 sm:py-0 sm:pl-4 text-[15px] font-medium text-espresso-800 leading-snug">
                  Know how long each pack lasts
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Soft Wave Divider leading seamlessly into the Sage Planner Band */}
        <div className="w-full -mb-px z-10">
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
      <section id="shop" className="bg-cream-50 py-18 lg:py-32 border-t border-sand-300/60 scroll-mt-20 sm:scroll-mt-24">
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
                  {/* Handwritten Annotation beside photo */}
                  <div className="absolute -bottom-4 right-0 sm:bottom-2 sm:-right-2 z-10 pointer-events-none">
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
                  <div className="py-3 sm:py-4 border-b border-sand-300/60 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(2)]:border-b-0">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Short, recognisable ingredients
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      The full list is on every product page. Single-source proteins, unrefined oils, no fillers.
                    </p>
                  </div>

                  <div className="py-3 sm:py-4 border-b border-sand-300/60 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(2)]:border-b-0">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Made for their stage
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      Kitten growth mousse, adult formulas, and senior care calibrated by age and nutritional needs.
                    </p>
                  </div>

                  <div className="py-3 sm:py-4 border-b border-sand-300/60 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(2)]:border-b-0">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Formulated to be gentle
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      Recipes that support sensitive stomachs, smooth digestion, and healthy coat condition.
                    </p>
                  </div>

                  <div className="py-3 sm:py-4 border-b border-sand-300/60 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(2)]:border-b-0">
                    <h3 className="text-sm font-semibold text-espresso-950 mb-1">
                      Plans that add up
                    </h3>
                    <p className="text-xs text-espresso-700 leading-relaxed">
                      Portions and pack length calculated for your cat so you know how long every box lasts.
                    </p>
                  </div>
                </div>

                <Button asChild to="/about" variant="secondary" >
                  Our philosophy →
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </Band>

      

      {/* 6. CLOSING CTA (Full-bleed oat band per PREMIUM-SPEC) */}
      <section className="py-20 sm:py-28 lg:py-32 bg-oat-100/60 border-t border-sand-300/70 overflow-hidden relative">
        <Container className="max-w-4xl text-center relative">
          {/* CatPeekEdge centered peeking over top rim */}
          <div className="absolute -top-28 sm:-top-32 left-1/2 -translate-x-1/2 w-44 sm:w-52 text-espresso-900 pointer-events-none">
            <CatPeekEdge className="w-full h-auto" />
          </div>

          <Reveal>
            <Heading level={2} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4 text-balance">
              Feed your cat with confidence.
            </Heading>

            <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-8 max-w-xl mx-auto text-balance">
              Take the guesswork out of mealtime with a personalised plan or explore our honest collection.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild to="/meal-plan" variant="primary">
                Plan my cat's meals
              </Button>
              <Button
                asChild
                to="/#shop"
                variant="secondary"
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
          </Reveal>
        </Container>
      </section>
    </>
  )
}

export default HomePage
