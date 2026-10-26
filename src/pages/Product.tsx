import { useState, useId } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { imageManifest } from '@/data/images.manifest'
import { getProductBySlug } from '@/data/products'
import type { HealthGoal, Product, ProductAccent, ProductCategory } from '@/data/types'
import { formatPrice } from '@/lib/format'
import { feedingTable } from '@/lib/planner'
import { NotFoundPage } from '@/pages/NotFound'
import { useBag } from '@/store/bag'
import { useBagUi } from '@/store/bag-ui'
import { useCurrency } from '@/store/currency'
import { PawPrint } from '@/components/cat-art/PawPrint'

const ACCENT_COLORS: Record<ProductAccent, string> = {
  sage: '#8FA388',
  terracotta: '#A66445',
  ochre: '#9B6E3A',
  matcha: '#8A9A74',
  oak: '#8B6A45',
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'wet-food': 'Wet Food',
  'dry-food': 'Dry Food',
  'treat-topper': 'Treat / Topper',
  litter: 'Litter',
  hardware: 'Hardware',
}

const GOAL_LABELS: Record<HealthGoal, string> = {
  'urinary-care': 'Urinary Care',
  'hairball-control': 'Hairball Control',
  'sensitive-stomach': 'Sensitive Stomach',
  'coat-shine': 'Coat Shine',
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = getProductBySlug(slug)

  const [activeIndex, setActiveIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
  const [liveAnnouncement, setLiveAnnouncement] = useState('')
  const [isAdded, setIsAdded] = useState(false)

  const currency = useCurrency((s) => s.currency)
  const add = useBag((s) => s.add)
  const quantityInputId = useId()

  if (!product) {
    return <NotFoundPage />
  }

  // Gallery images from manifest
  const manifest = imageManifest[product.slug]
  const gallery = manifest?.gallery || []
  const currentImage = gallery[activeIndex] || gallery[0]
  const heroImage = gallery[0]

  // Image Preload data for LCP
  const imagePreload = heroImage
    ? {
        src: heroImage.src,
        srcset: Object.entries(heroImage.srcset)
          .map(([w, s]) => `${s} ${w}w`)
          .join(', '),
        sizes: '(max-width: 1024px) 100vw, 55vw',
      }
    : undefined

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: heroImage?.src,
    description: product.short,
    brand: {
      '@type': 'Brand',
      name: 'NEKO DELICE',
    },
    offers: {
      '@type': 'Offer',
      price: product.priceUSD,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  // Gallery Navigation Handlers
  const nextImage = () => {
    setActiveIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0))
    setImageError(false)
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1))
    setImageError(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      prevImage()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextImage()
    }
  }

  // Purchase Actions
  const handleAddToBag = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(product.id, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1800)
    setLiveAnnouncement(`Added ${quantity} of ${product.name} to your bag`)
    useBagUi.getState().openBag(e.currentTarget)
  }

  // Feeding guide calculation
  const feedingRows = feedingTable(product.id)
  const isKitten = product.lifeStages.includes('kitten')

  // Related products
  const relatedProducts = product.related
    .map(getProductBySlug)
    .filter((p): p is Product => Boolean(p))
    .slice(0, 3)

  return (
    <>
      <SeoHead
        title={`${product.name} | NEKO DELICE`}
        description={product.short}
        path={`/product/${product.slug}`}
        type="product"
        imagePreload={imagePreload}
        jsonLd={jsonLd}
      />

      {/* Accessible Live Region for Bag Announcements */}
      <div aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      <div
        style={{ ['--accent' as string]: ACCENT_COLORS[product.accent] }}
        className="py-6 sm:py-10"
      >
        <Container>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumbs" className="mb-6 sm:mb-8">
            <Link
              to="/#shop"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso-700 hover:text-terracotta-700 transition-colors py-1"
            >
              <span aria-hidden="true">←</span> Back to collection
            </Link>
          </nav>

          {/* Main PDP Grid: Gallery Left / Product Details Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Gallery Section (Left on Desktop, Top on Mobile) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Large Image Frame with Arrow Navigation */}
              <div className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-beige-200 border border-sand-300/40">

                {currentImage && !imageError ? (
                  <img
                    src={currentImage.src}
                    srcSet={Object.entries(currentImage.srcset)
                      .map(([w, s]) => `${s} ${w}w`)
                      .join(', ')}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    alt={currentImage.alt}
                    width={currentImage.width}
                    height={currentImage.height}
                    decoding="async"
                    loading={activeIndex === 0 ? 'eager' : 'lazy'}
                    fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover transition-opacity duration-200"
                  />
                ) : (
                  /* Fallback Placeholder with Identical Aspect Ratio */
                  <div
                    className="flex h-full w-full items-center justify-center bg-beige-200 text-xs text-espresso-700/60"
                    aria-hidden="true"
                  >
                    <span>Image placeholder</span>
                  </div>
                )}

                {/* Left/Right Arrow Overlays */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/90 p-2 text-espresso-900 shadow-sm backdrop-blur-md border border-sand-300/50 hover:bg-cream-50 hover:text-terracotta-700 active:scale-95 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 transition-all opacity-85 hover:opacity-100 min-w-[44px] min-h-[44px] inline-flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream-50/90 p-2 text-espresso-900 shadow-sm backdrop-blur-md border border-sand-300/50 hover:bg-cream-50 hover:text-terracotta-700 active:scale-95 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 transition-all opacity-85 hover:opacity-100 min-w-[44px] min-h-[44px] inline-flex items-center justify-center cursor-pointer"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails List */}
              {gallery.length > 1 && (
                <div
                  className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x focus:outline-none"
                  role="tablist"
                  aria-label="Product thumbnails"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                >


                  {gallery.map((img, idx) => {
                    const isSelected = idx === activeIndex
                    return (
                      <button
                        key={img.src}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-current={isSelected ? 'true' : undefined}
                        onClick={() => {
                          setActiveIndex(idx)
                          setImageError(false)
                        }}
                        aria-label={`View image ${idx + 1} of ${gallery.length}: ${img.roleName}`}
                        className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-beige-200 border-2 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 ${
                          isSelected
                            ? 'border-terracotta-600 ring-2 ring-terracotta-600/25 shadow-xs opacity-100'
                            : 'border-transparent hover:border-sand-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.srcset['640'] || img.src}
                          alt=""
                          width={72}
                          height={72}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Product Details Section (Right) */}
            <div className="lg:col-span-5 flex flex-col">
              {/* Category & Life Stage Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block rounded-full bg-sage-100/90 border border-sage-200/80 px-3 py-1 text-xs font-medium text-sage-800">
                  {CATEGORY_LABELS[product.category]}
                </span>
                <span className="text-xs font-medium text-espresso-600">
                  {product.unit.packSizeLabel}
                </span>
              </div>

              {/* Product Title */}
              <Heading
                level={1}
                className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-espresso-950 leading-tight tracking-tight text-balance mb-3"
              >
                {product.name}
              </Heading>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950 tabular-nums">
                  {formatPrice(product.priceUSD, currency)}
                </span>
                <span className="text-sm text-espresso-700">
                  {product.category === 'hardware'
                    ? 'One-time purchase'
                    : product.category === 'litter'
                      ? 'About 30 days for one cat'
                      : 'Tax included'}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-base text-espresso-800 leading-relaxed mb-6">
                {product.short}
              </p>

              {/* Supportive Health Goal Chips & Notes */}
              {product.healthGoals.length > 0 && (
                <div className="mb-6 space-y-2.5 p-4.5 rounded-2xl bg-sage-50/70 border border-sage-200/70">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sage-800 block mb-1.5">
                    Formulated For
                  </span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {product.healthGoals.map((goal) => (
                      <span
                        key={goal}
                        className="inline-flex items-center rounded-full bg-cream-50 border border-sage-300/80 px-3 py-1 text-xs font-medium text-sage-900 shadow-2xs"
                      >
                        {GOAL_LABELS[goal]}
                      </span>
                    ))}
                  </div>
                  {product.healthGoals.map((goal) => {
                    const note = product.goalNotes[goal]
                    if (!note) return null
                    return (
                      <p
                        key={goal}
                        className="text-xs text-espresso-800 leading-relaxed"
                      >
                        <strong className="font-semibold text-sage-900">
                          {GOAL_LABELS[goal]}:
                        </strong>{' '}
                        {note}
                      </p>
                    )
                  })}
                </div>
              )}

              {/* Purchase Controls: Quantity Stepper & Add to Bag */}
              <div className="space-y-4 pt-6 border-t border-sand-300/60 mb-8">
                <div className="flex items-center gap-4">
                  {/* Accessible Quantity Stepper */}
                  <div className="flex items-center rounded-full border border-sand-300 bg-cream-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-base font-semibold text-espresso-900 hover:bg-oat-100 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 cursor-pointer transition-all"
                    >
                      −
                    </button>
                    <span
                      id={quantityInputId}
                      aria-label={`Selected quantity: ${quantity}`}
                      className="w-10 text-center font-semibold text-sm text-espresso-950 tabular-nums select-none"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                      disabled={quantity >= 9}
                      aria-label="Increase quantity"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-base font-semibold text-espresso-900 hover:bg-oat-100 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 cursor-pointer transition-all"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    className="group/add flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-600 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-xs hover:bg-terracotta-700 hover:shadow-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 transition-all active:scale-98 cursor-pointer"
                  >
                    <PawPrint
                      size={18}
                      filled
                      className="text-cream-100 transition-transform duration-200 group-hover/add:-rotate-12 group-hover/add:scale-110"
                    />
                    <span>{isAdded ? 'Added to bag ✓' : 'Add to bag'}</span>
                  </button>
                </div>

                {/* Link to Planner */}
                <div className="pt-2 text-center sm:text-left">
                  <Link
                    to="/meal-plan"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 underline underline-offset-4"
                  >
                    Build a personalized monthly plan →
                  </Link>
                </div>
              </div>

              {/* Accordions: Native <details>/<summary> */}
              <div className="border-t border-sand-300/60 divide-y divide-sand-300/40">
                {/* Ingredients Accordion */}
                {product.ingredients.length > 0 && (
                  <details className="group py-1" open>
                    <summary className="flex items-center justify-between cursor-pointer list-none py-3.5 px-2 -mx-2 rounded-xl font-serif text-lg font-semibold text-espresso-950 hover:text-terracotta-700 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 select-none transition-colors">
                      <span>Ingredients</span>
                      <span
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-oat-100/80 text-espresso-700 group-hover:bg-oat-200 group-hover:text-espresso-950 group-open:bg-sage-100 group-open:text-sage-800 transition-all duration-200 text-lg font-light leading-none shrink-0"
                        aria-hidden="true"
                      >
                        <span className="inline-block transition-transform duration-200 group-open:rotate-45 leading-none">+</span>
                      </span>
                    </summary>
                    <div className="pb-4 pt-1 px-1 text-sm text-espresso-800 leading-relaxed">
                      <p>{product.ingredients.join(', ')}.</p>
                    </div>
                  </details>
                )}

                {/* Guaranteed Analysis Accordion */}
                {Object.keys(product.analysis).length > 0 && (
                  <details className="group py-1">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-3.5 px-2 -mx-2 rounded-xl font-serif text-lg font-semibold text-espresso-950 hover:text-terracotta-700 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 select-none transition-colors">
                      <span>Guaranteed analysis</span>
                      <span
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-oat-100/80 text-espresso-700 group-hover:bg-oat-200 group-hover:text-espresso-950 group-open:bg-sage-100 group-open:text-sage-800 transition-all duration-200 text-lg font-light leading-none shrink-0"
                        aria-hidden="true"
                      >
                        <span className="inline-block transition-transform duration-200 group-open:rotate-45 leading-none">+</span>
                      </span>
                    </summary>
                    <div className="pb-4 pt-1 px-1">
                      <table className="w-full text-sm text-left text-espresso-800">
                        <tbody className="divide-y divide-sand-300/40">
                          {Object.entries(product.analysis).map(
                            ([key, val]) => (
                              <tr
                                key={key}
                                className="transition-colors hover:bg-sage-50/30"
                              >
                                <th
                                  scope="row"
                                  className="py-2.5 pr-4 font-normal text-espresso-800"
                                >
                                  {key}
                                </th>
                                <td className="py-2.5 text-right font-semibold text-espresso-950 tabular-nums">
                                  {val}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </details>
                )}

                {/* Specs Accordion */}
                {Object.keys(product.specs).length > 0 && (
                  <details className="group py-1">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-3.5 px-2 -mx-2 rounded-xl font-serif text-lg font-semibold text-espresso-950 hover:text-terracotta-700 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 select-none transition-colors">
                      <span>Specifications</span>
                      <span
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-oat-100/80 text-espresso-700 group-hover:bg-oat-200 group-hover:text-espresso-950 group-open:bg-sage-100 group-open:text-sage-800 transition-all duration-200 text-lg font-light leading-none shrink-0"
                        aria-hidden="true"
                      >
                        <span className="inline-block transition-transform duration-200 group-open:rotate-45 leading-none">+</span>
                      </span>
                    </summary>
                    <div className="pb-4 pt-1 px-1">
                      <table className="w-full text-sm text-left text-espresso-800">
                        <tbody className="divide-y divide-sand-300/40">
                          {Object.entries(product.specs).map(([key, val]) => (
                            <tr
                              key={key}
                              className="transition-colors hover:bg-sage-50/30"
                            >
                              <th
                                scope="row"
                                className="py-2.5 pr-4 font-normal text-espresso-800"
                              >
                                {key}
                              </th>
                              <td className="py-2.5 text-right font-semibold text-espresso-950 tabular-nums">
                                {val}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                )}

                {/* Storage & Feeding Note Accordion */}
                {product.feedingNote && (
                  <details className="group py-1">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-3.5 px-2 -mx-2 rounded-xl font-serif text-lg font-semibold text-espresso-950 hover:text-terracotta-700 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 select-none transition-colors">
                      <span>Storage & feeding advice</span>
                      <span
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-oat-100/80 text-espresso-700 group-hover:bg-oat-200 group-hover:text-espresso-950 group-open:bg-sage-100 group-open:text-sage-800 transition-all duration-200 text-lg font-light leading-none shrink-0"
                        aria-hidden="true"
                      >
                        <span className="inline-block transition-transform duration-200 group-open:rotate-45 leading-none">+</span>
                      </span>
                    </summary>
                    <div className="pb-4 pt-1 px-1 text-sm text-espresso-800 leading-relaxed">
                      <p>{product.feedingNote}</p>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>

          {/* Daily Feeding Guide Table (Food Products) */}
          {feedingRows.length > 0 && (
            <div className="mt-16 pt-12 border-t border-sand-300/60">
              <div className="max-w-2xl mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sage-800 mb-1">
                  <span>Portion Guidance</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-espresso-950 mb-1">
                  Daily feeding guide
                </h2>
                <p className="text-sm text-espresso-700">
                  {isKitten
                    ? 'Based on a kitten lounger.'
                    : 'Based on a neutered adult lounger.'}{' '}
                  Computed using our pure veterinary calorie formulas.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-sand-300/70 bg-cream-50/90 shadow-2xs">
                <table className="w-full text-left text-sm text-espresso-900">
                  <thead className="border-b border-sand-300/60 bg-sage-100/60 text-xs font-semibold uppercase tracking-wider text-espresso-950">
                    <tr>
                      <th scope="col" className="px-5 py-3.5">
                        Cat Weight
                      </th>
                      <th scope="col" className="px-5 py-3.5">
                        Daily Portion
                      </th>
                      <th scope="col" className="px-5 py-3.5">
                        Est. Pack Longevity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-300/30">
                    {feedingRows.map((row) => (
                      <tr key={row.weightKg} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium tabular-nums">
                          {row.weightKg} kg
                        </td>
                        <td className="px-5 py-3.5 tabular-nums">
                          {row.dailyAmount} {row.unit}
                        </td>
                        <td className="px-5 py-3.5 text-espresso-700">
                          About {row.supplyDays} days / pack
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-espresso-600 leading-relaxed">
                <strong className="font-semibold text-espresso-800">Veterinary disclaimer:</strong> An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
              </p>
            </div>
          )}

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <Section className="mt-16 pt-12 border-t border-sand-300/60">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-1">
                  Recommendations
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950">
                  Pairs naturally with
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} priority={false} />
                ))}
              </div>
            </Section>
          )}
        </Container>
      </div>
    </>
  )
}

export default ProductPage
