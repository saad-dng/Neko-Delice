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
} from '@/components/cat-art'
import { products } from '@/data/products'
import { siteImages } from '@/data/site-images.manifest'
import type { ProductCategory } from '@/data/types'
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

const PREVIEW_CURATED_SLUGS = [
  'kitten-growth-mousse-broth',
  'wild-salmon-quail-pate',
  'duck-sweet-potato-kibble',
  'norwegian-salmon-oil',
] as const

export function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') as ProductCategory | null
  const selectedCategory: HomeCategoryFilter =
    categoryParam && ['wet-food', 'dry-food', 'treat-topper', 'litter', 'hardware'].includes(categoryParam)
      ? categoryParam
      : 'all'

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
    if (selectedCategory === 'all') {
      return PREVIEW_CURATED_SLUGS.map((slug) => products.find((p) => p.slug === slug)!).filter(Boolean)
    }
    return products.filter(
      (p) =>
        p.category === selectedCategory ||
        p.secondaryCategories.includes(selectedCategory)
    )
  }, [selectedCategory])

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
      <Band variant="sage" padding="none" className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: CatCurious >= 260px on soft oat circle with idle twitch */}
            <div className="lg:col-span-4 flex items-center justify-center order-1 lg:order-1">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-[#EDE5D8]/90 border border-sand-300/80 shadow-xs flex items-center justify-center">
                <CatCurious className="w-[260px] h-[260px] text-espresso-800 animate-idle-cat vector-stroke-2-5" />
              </div>
            </div>

            {/* Right Column: Eyebrow, H2, Copy, 3 Cat Cards on single oat surface, Steps, Disclaimer */}
            <div className="lg:col-span-8 flex flex-col items-start text-left order-2 lg:order-2">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-sage-900/90 mb-3">
                Cat Nutrition Planner
              </p>

              <h2 className="font-serif font-semibold text-espresso-950 tracking-tight leading-[1.08] text-[clamp(2rem,3.6vw,3.5rem)] mb-4 text-balance">
                No guesswork. Just the right plan for your cat.
              </h2>

              <p className="text-[18px] text-espresso-800 leading-[1.5] max-w-2xl mb-8">
                Every cat is different. Tell us their routine and we work out the calories, portions, and a balanced monthly bundle.
              </p>

              {/* Three cat cards in one row on a single oat surface */}
              <div className="w-full bg-[#EDE5D8]/80 rounded-3xl p-2 sm:p-3 border border-sand-300/80 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-sand-300/80">
                  <CatCard
                    variant="flat"
                    href="/meal-plan?act=lounger&step=1"
                    title="Indoor lounger"
                    description="Gentle daily strolls and sunlit naps."
                    pose={<CatSleeping className="w-28 h-28 vector-stroke-2-5" />}
                  />
                  <CatCard
                    variant="flat"
                    href="/meal-plan?act=explorer&step=1"
                    title="Playful explorer"
                    description="Daily chasing and steady patrols."
                    pose={<CatWalking className="w-28 h-28 vector-stroke-2-5" />}
                  />
                  <CatCard
                    variant="flat"
                    href="/meal-plan?act=high-energy&step=1"
                    title="High-energy"
                    description="Climbing trees and high-speed sprints."
                    pose={<CatStretch className="w-28 h-28 vector-stroke-2-5" />}
                  />
                </div>
              </div>

              {/* Quiet inline steps row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[14px] text-espresso-800/85 mb-6 font-medium">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-sage-800 font-bold">01</span>
                  <span>Tell us about your cat</span>
                </div>
                <span className="text-sand-400" aria-hidden="true">→</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-sage-800 font-bold">02</span>
                  <span>See daily calories</span>
                </div>
                <span className="text-sand-400" aria-hidden="true">→</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-sage-800 font-bold">03</span>
                  <span>Get a monthly bundle</span>
                </div>
              </div>

              {/* Planner disclaimer at 14 px */}
              <p className="text-[14px] text-espresso-700/80 leading-relaxed border-t border-sand-300/70 pt-4 w-full">
                An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
              </p>
            </div>
          </div>
        </Container>
      </Band>

      {/* 3. THE SHOP (Interactive Storefront Preview) */}
      <section id="shop" className="bg-cream-50 py-16 sm:py-24 border-t border-sand-300/60 scroll-mt-20 sm:scroll-mt-24">
        <div id="collection" className="sr-only" aria-hidden="true" />
        <Container>
          {/* Header & Tabs in One Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-terracotta-700 mb-2">
                The Collection
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-950 tracking-tight leading-[1.08]">
                Everything your cat needs, nothing they don&apos;t.
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div
              className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none"
              role="tablist"
              aria-label="Filter products by category"
            >
              {CATEGORY_TABS.map((cat) => {
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    id={`tab-${cat.id}`}
                    aria-selected={isSelected}
                    aria-controls="home-products-panel"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta-600 ${
                      isSelected
                        ? 'bg-sage-700 text-cream-50 shadow-xs'
                        : 'bg-oat-100/80 border border-sand-300/80 text-espresso-800 hover:bg-cream-50 hover:text-espresso-950'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Screen Reader Live Region for Shop Count Announcements */}
          <output aria-live="polite" className="sr-only">
            {shopAnnouncement}
          </output>

          {/* Product Grid: 4 columns desktop, 2 columns at 390px mobile */}
          <div
            id="home-products-panel"
            role="tabpanel"
            aria-labelledby={`tab-${selectedCategory}`}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
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
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-16 text-espresso-700 mb-4 overflow-hidden flex items-end justify-center">
                  <CatPeekEdge className="w-20 h-16 animate-step-transition" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-espresso-950 mb-2">
                  No products found in this category
                </h3>
                <p className="text-sm text-espresso-700 max-w-sm mb-6">
                  Try selecting a different category above or explore our complete cat nutrition collection.
                </p>
              </div>
            )}
          </div>

          {/* Full collection link button */}
          <div className="flex justify-center mt-10">
            <Button
              asChild
              to={selectedCategory === 'all' ? '/shop' : `/shop?category=${selectedCategory}`}
              variant="secondary"
              className="h-12 px-8 text-[15px]"
            >
              View full collection →
            </Button>
          </div>
        </Container>
      </section>

      {/* 4. WHY BAND (50/50 Oat band with large eating cat photo + 4 truthful value points) */}
      <section className="bg-oat-100/70 border-t border-sand-300/80 py-20 sm:py-28 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
            {/* Left: Eating Cat Photo (24px radius, min 520px tall) */}
            <div className="relative flex flex-col justify-center w-full">
              <Reveal className="w-full">
                <div className="relative w-full max-w-[540px] mx-auto">
                  <SiteImage
                    name="eating"
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="rounded-3xl shadow-sm aspect-[3/4] min-h-[520px] w-full object-cover"
                  />
                </div>
                {/* Handwritten Annotation beside/below photo ("Planned portions") */}
                <div className="mt-3 flex justify-end max-w-[540px] mx-auto pr-3 sm:pr-6 pointer-events-none">
                  <Annotation
                    text="Planned portions"
                    arrow={false}
                    rotate={-2}
                    hideOnMobile={false}
                  />
                </div>
              </Reveal>
            </div>

            {/* Right: Eyebrow, H2, 4 Truthful Values (2x2 grid without boxes, 1px dividers, 16px text), Philosophy link */}
            <div className="flex flex-col items-start">
              <Reveal>
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-terracotta-700 mb-3">
                  Why Neko Delice
                </p>

                <Heading
                  level={2}
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-6 text-balance"
                >
                  Better food. Better days.
                </Heading>

                {/* 4 Truthful Value Points: 2x2 grid without boxes, 1px dividers, 16px text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8 my-8 pt-6 pb-6 border-y border-sand-300/80">
                  <div className="pb-6 sm:pb-0 sm:pr-6 sm:border-r border-sand-300/80">
                    <h3 className="text-base font-semibold text-espresso-950 mb-1.5">
                      Short, recognisable ingredients
                    </h3>
                    <p className="text-base text-espresso-800 leading-relaxed">
                      The full list is on every product page. Single-source proteins, unrefined oils, no fillers.
                    </p>
                  </div>

                  <div className="pb-6 sm:pb-0 sm:pl-6 border-t sm:border-t-0 border-sand-300/80 pt-6 sm:pt-0">
                    <h3 className="text-base font-semibold text-espresso-950 mb-1.5">
                      Made for their stage
                    </h3>
                    <p className="text-base text-espresso-800 leading-relaxed">
                      Kitten growth mousse, adult formulas, and senior care calibrated by age and nutritional needs.
                    </p>
                  </div>

                  <div className="pt-6 sm:pr-6 sm:border-r border-t border-sand-300/80">
                    <h3 className="text-base font-semibold text-espresso-950 mb-1.5">
                      Formulated to be gentle
                    </h3>
                    <p className="text-base text-espresso-800 leading-relaxed">
                      Recipes that support sensitive stomachs, smooth digestion, and healthy coat condition.
                    </p>
                  </div>

                  <div className="pt-6 sm:pl-6 border-t border-sand-300/80">
                    <h3 className="text-base font-semibold text-espresso-950 mb-1.5">
                      Plans that add up
                    </h3>
                    <p className="text-base text-espresso-800 leading-relaxed">
                      Portions and pack length calculated for your cat so you know how long every box lasts.
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  to="/about"
                  variant="secondary"
                  className="h-12 sm:h-14 px-8 text-base font-medium rounded-full"
                >
                  Our philosophy →
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. CLOSING CTA (Full-bleed oat band per PREMIUM-SPEC) */}
      <section className="relative bg-oat-100/70 border-t border-sand-300/80 py-24 sm:py-28 lg:py-32 overflow-visible">
        {/* CatPeekEdge peeking over the top border on the right */}
        <div className="absolute top-0 right-6 sm:right-16 lg:right-28 -translate-y-[92%] w-52 sm:w-60 lg:w-64 text-espresso-900 pointer-events-none select-none z-10">
          <CatPeekEdge className="w-full h-auto vector-stroke-2-5" />
        </div>

        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Heading
                level={2}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-4 text-balance"
              >
                Feed your cat with confidence.
              </Heading>

              <p className="text-base sm:text-lg text-espresso-800 leading-relaxed mb-8 max-w-xl text-balance">
                Take the guesswork out of mealtime with a personalised plan or explore our honest collection.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  to="/meal-plan"
                  variant="primary"
                  className="h-12 sm:h-14 px-8 text-base font-medium rounded-full"
                >
                  Plan my cat's meals
                </Button>
                <Button
                  asChild
                  to="/#shop"
                  variant="secondary"
                  className="h-12 sm:h-14 px-8 text-base font-medium rounded-full"
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
          </div>
        </Container>
      </section>
    </>
  )
}

export default HomePage
