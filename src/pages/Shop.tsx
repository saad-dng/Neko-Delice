import { useEffect, useId, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CatPeeking } from '@/components/cat-art/CatPeeking'
import { ProductCard } from '@/components/product/ProductCard'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { products } from '@/data/products'
import type { HealthGoal, LifeStage, ProductCategory } from '@/data/types'
import {
  DEFAULT_FILTERS,
  filterProducts,
  nearestMatches,
  parseFilterParams,
  serializeFilterParams,
  VALID_CATEGORIES,
  VALID_GOALS,
  VALID_STAGES,
  type ShopFilters,
  type ShopSort,
} from '@/lib/filters'

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'wet-food': 'Wet Food',
  'dry-food': 'Dry Food',
  'treat-topper': 'Treat / Topper',
  litter: 'Litter',
  hardware: 'Hardware',
}

const STAGE_LABELS: Record<LifeStage, string> = {
  kitten: 'Kitten',
  adult: 'Adult',
  senior: 'Senior',
  'all-stages': 'All stages',
}

const GOAL_LABELS: Record<HealthGoal, string> = {
  'urinary-care': 'Urinary Care',
  'hairball-control': 'Hairball Control',
  'sensitive-stomach': 'Sensitive Stomach',
  'coat-shine': 'Coat Shine',
}

interface FilterFacetsProps {
  filters: ShopFilters
  toggleCategory: (cat: ProductCategory) => void
  toggleStage: (stage: LifeStage) => void
  toggleGoal: (goal: HealthGoal) => void
  isMobile?: boolean
}

function FilterFacets({
  filters,
  toggleCategory,
  toggleStage,
  toggleGoal,
  isMobile = false,
}: FilterFacetsProps) {
  return (
    <div className="space-y-8">
      {/* Category Facet */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-espresso-950 mb-3">
          Category
        </legend>
        <div className="space-y-2">
          {VALID_CATEGORIES.map((cat) => {
            const isChecked = filters.categories.includes(cat)
            const inputId = `${isMobile ? 'm-' : ''}cat-${cat}`
            return (
              <label
                key={cat}
                htmlFor={inputId}
                className="flex items-center gap-2.5 text-sm text-espresso-800 cursor-pointer select-none hover:text-espresso-950"
              >
                <input
                  type="checkbox"
                  id={inputId}
                  checked={isChecked}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 rounded border-sand-300 text-terracotta-600 focus:ring-espresso-900 cursor-pointer accent-terracotta-600"
                />
                <span>{CATEGORY_LABELS[cat]}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Life Stage Facet */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-espresso-950 mb-3">
          Life Stage
        </legend>
        <div className="space-y-2">
          {VALID_STAGES.map((stage) => {
            const isChecked = filters.stages.includes(stage)
            const inputId = `${isMobile ? 'm-' : ''}stage-${stage}`
            return (
              <label
                key={stage}
                htmlFor={inputId}
                className="flex items-center gap-2.5 text-sm text-espresso-800 cursor-pointer select-none hover:text-espresso-950"
              >
                <input
                  type="checkbox"
                  id={inputId}
                  checked={isChecked}
                  onChange={() => toggleStage(stage)}
                  className="h-4 w-4 rounded border-sand-300 text-terracotta-600 focus:ring-espresso-900 cursor-pointer accent-terracotta-600"
                />
                <span>{STAGE_LABELS[stage]}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Health Goal Facet */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-espresso-950 mb-3">
          Supportive Goal
        </legend>
        <div className="space-y-2">
          {VALID_GOALS.map((goal) => {
            const isChecked = filters.goals.includes(goal)
            const inputId = `${isMobile ? 'm-' : ''}goal-${goal}`
            return (
              <label
                key={goal}
                htmlFor={inputId}
                className="flex items-center gap-2.5 text-sm text-espresso-800 cursor-pointer select-none hover:text-espresso-950"
              >
                <input
                  type="checkbox"
                  id={inputId}
                  checked={isChecked}
                  onChange={() => toggleGoal(goal)}
                  className="h-4 w-4 rounded border-sand-300 text-terracotta-600 focus:ring-espresso-900 cursor-pointer accent-terracotta-600"
                />
                <span>{GOAL_LABELS[goal]}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filterDialogRef = useRef<HTMLDialogElement>(null)
  const sortSelectId = useId()

  // Parse filters from URL
  const filters: ShopFilters = useMemo(() => {
    return parseFilterParams(searchParams)
  }, [searchParams])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters)
  }, [filters])

  // Nearest matches when 0 products match
  const nearest = useMemo(() => {
    if (filteredProducts.length > 0) return []
    return nearestMatches(filters, products)
  }, [filteredProducts.length, filters])

  // Active filter count (excluding sort)
  const activeFilterCount =
    filters.categories.length + filters.stages.length + filters.goals.length

  // Update URL helper with replace option to avoid noisy history entries
  const updateFilters = (newFilters: ShopFilters) => {
    const params = serializeFilterParams(newFilters)
    setSearchParams(params, { replace: true })
  }

  // Toggle filter items
  const toggleCategory = (cat: ProductCategory) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat]
    updateFilters({ ...filters, categories: next })
  }

  const toggleStage = (st: LifeStage) => {
    const next = filters.stages.includes(st)
      ? filters.stages.filter((s) => s !== st)
      : [...filters.stages, st]
    updateFilters({ ...filters, stages: next })
  }

  const toggleGoal = (gl: HealthGoal) => {
    const next = filters.goals.includes(gl)
      ? filters.goals.filter((g) => g !== gl)
      : [...filters.goals, gl]
    updateFilters({ ...filters, goals: next })
  }

  const setSort = (sort: ShopSort) => {
    updateFilters({ ...filters, sort })
  }

  const clearAllFilters = () => {
    updateFilters({
      ...DEFAULT_FILTERS,
      sort: filters.sort,
    })
  }

  // Native Dialog Modal controls
  const openFilterModal = () => {
    filterDialogRef.current?.showModal()
  }

  const closeFilterModal = () => {
    filterDialogRef.current?.close()
  }

  // Handle native dialog backdrop clicks imperatively
  useEffect(() => {
    const dialog = filterDialogRef.current
    if (!dialog) return

    const handleNativeClick = (e: MouseEvent) => {
      const dim = dialog.getBoundingClientRect()
      if (
        e.clientX < dim.left ||
        e.clientX > dim.right ||
        e.clientY < dim.top ||
        e.clientY > dim.bottom
      ) {
        dialog.close()
      }
    }

    dialog.addEventListener('click', handleNativeClick)
    return () => {
      dialog.removeEventListener('click', handleNativeClick)
    }
  }, [])

  return (
    <>
      <SeoHead
        title="Shop Collection | NEKO DELICE"
        description="Browse vet-informed cat nutrition, treats, and quiet hardware formulated without fillers or guesswork."
        path="/shop"
      />

      {/* Accessible live region announcing product counts */}
      <div aria-live="polite" className="sr-only">
        {filteredProducts.length === 1
          ? '1 product available'
          : `${filteredProducts.length} products available`}
      </div>

      <Section className="pt-8 sm:pt-12 pb-16">
        <Container>
          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-700 mb-2">
              Catalog
            </p>
            <Heading
              level={1}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-3"
            >
              Shop the collection
            </Heading>
            <p className="text-base sm:text-lg text-espresso-700 max-w-2xl leading-relaxed">
              Honest cat nutrition and quiet hardware for every stage of cat
              life. Ten intentional items, crafted without fillers or guesswork.
            </p>
          </div>


          {/* Controls Bar: Mobile Filter Button + Sort Select */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-sand-300/60">
            {/* Mobile Filter Trigger (< 1024 px) */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={openFilterModal}
                className="inline-flex items-center gap-2 rounded-full border border-sand-300/80 bg-oat-100/75 backdrop-blur-md px-4 py-2 text-sm font-medium text-espresso-900 hover:bg-oat-100/95 focus:outline-none focus:ring-2 focus:ring-espresso-900 transition-colors shadow-2xs"
                aria-haspopup="dialog"
              >
                <svg
                  className="w-4 h-4 text-espresso-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-terracotta-600 px-2 py-0.5 text-xs font-semibold text-cream-50">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop Count Indicator */}
            <div className="hidden lg:block text-sm text-espresso-700">
              Showing{' '}
              <span className="font-semibold text-espresso-950">
                {filteredProducts.length}
              </span>{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2.5 ml-auto">
              <label
                htmlFor={sortSelectId}
                className="text-xs font-medium uppercase tracking-wider text-espresso-700"
              >
                Sort by
              </label>
              <select
                id={sortSelectId}
                value={filters.sort}
                onChange={(e) => setSort(e.target.value as ShopSort)}
                className="rounded-lg border border-sand-300 bg-cream-50 px-3 py-1.5 text-sm text-espresso-900 focus:border-espresso-900 focus:outline-none focus:ring-1 focus:ring-espresso-900 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-medium text-espresso-600 mr-1">
                Active filters:
              </span>

              {filters.categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  aria-label={`Remove filter ${CATEGORY_LABELS[cat]}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-oat-100 border border-sand-300 px-3 py-1 text-xs font-medium text-espresso-900 hover:bg-sand-300/40 focus:outline-none focus:ring-2 focus:ring-espresso-900 transition-colors"
                >
                  <span>{CATEGORY_LABELS[cat]}</span>
                  <span
                    className="text-espresso-500 hover:text-espresso-900"
                    aria-hidden="true"
                  >
                    ×
                  </span>
                </button>
              ))}

              {filters.stages.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleStage(st)}
                  aria-label={`Remove filter ${STAGE_LABELS[st]}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-oat-100 border border-sand-300 px-3 py-1 text-xs font-medium text-espresso-900 hover:bg-sand-300/40 focus:outline-none focus:ring-2 focus:ring-espresso-900 transition-colors"
                >
                  <span>{STAGE_LABELS[st]}</span>
                  <span
                    className="text-espresso-500 hover:text-espresso-900"
                    aria-hidden="true"
                  >
                    ×
                  </span>
                </button>
              ))}

              {filters.goals.map((gl) => (
                <button
                  key={gl}
                  type="button"
                  onClick={() => toggleGoal(gl)}
                  aria-label={`Remove filter ${GOAL_LABELS[gl]}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-oat-100 border border-sand-300 px-3 py-1 text-xs font-medium text-espresso-900 hover:bg-sand-300/40 focus:outline-none focus:ring-2 focus:ring-espresso-900 transition-colors"
                >
                  <span>{GOAL_LABELS[gl]}</span>
                  <span
                    className="text-espresso-500 hover:text-espresso-900"
                    aria-hidden="true"
                  >
                    ×
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-2 text-xs font-medium text-terracotta-700 underline underline-offset-4 hover:text-terracotta-800 focus:outline-none focus:ring-2 focus:ring-espresso-900 rounded"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Main Layout: Desktop Rail Left + Product Grid Right */}
          <div className="flex items-start gap-12">
            {/* Desktop Filter Sidebar (≥ 1024 px) */}
            <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-sand-300/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-lg font-semibold text-espresso-950">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-terracotta-700 underline underline-offset-4 hover:text-terracotta-800"
                  >
                    Reset
                  </button>
                )}
              </div>
              <FilterFacets
                filters={filters}
                toggleCategory={toggleCategory}
                toggleStage={toggleStage}
                toggleGoal={toggleGoal}
                isMobile={false}
              />
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1 w-full min-w-0">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={false}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div
                  className="rounded-2xl border border-sand-300/60 bg-oat-100/30 p-8 sm:p-12 text-center"
                  data-testid="shop-empty-state"
                >
                  <div className="mx-auto w-24 h-24 mb-6 text-espresso-800">
                    <CatPeeking className="w-full h-full" />
                  </div>
                  <Heading
                    level={2}
                    className="font-serif text-2xl font-semibold text-espresso-950 mb-2"
                  >
                    No exact matches
                  </Heading>
                  <p className="text-sm sm:text-base text-espresso-700 max-w-md mx-auto mb-6 leading-relaxed">
                    Nothing matches all of these filters. Closest matches are
                    below.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center justify-center rounded-full bg-espresso-900 px-6 py-2.5 text-sm font-medium text-cream-50 hover:bg-espresso-800 focus:outline-none focus:ring-2 focus:ring-espresso-900 focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    Clear filters
                  </button>

                  {/* Nearest Matches Grid */}
                  {nearest.length > 0 && (
                    <div className="mt-12 text-left pt-8 border-t border-sand-300/60">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-espresso-600 mb-6">
                        Closest suggested matches
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {nearest.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            priority={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Mobile Bottom-Sheet Filter Dialog (< 1024 px) */}
      <dialog
        ref={filterDialogRef}
        aria-labelledby="mobile-filter-title"
        className="fixed inset-0 m-auto max-h-[85vh] w-[92vw] max-w-lg rounded-2xl bg-cream-50/95 backdrop-blur-xl border border-sand-300/80 p-6 text-espresso-950 shadow-2xl backdrop:bg-espresso-900/40 backdrop:backdrop-blur-md lg:hidden overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-sand-300/60 mb-6">
          <h2
            id="mobile-filter-title"
            className="font-serif text-xl font-semibold text-espresso-950"
          >
            Filter collection
          </h2>
          <button
            type="button"
            onClick={closeFilterModal}
            aria-label="Close filters dialog"
            className="rounded-full p-2 text-espresso-600 hover:bg-oat-100 hover:text-espresso-900 focus:outline-none focus:ring-2 focus:ring-espresso-900 cursor-pointer"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <FilterFacets
          filters={filters}
          toggleCategory={toggleCategory}
          toggleStage={toggleStage}
          toggleGoal={toggleGoal}
          isMobile={true}
        />

        <div className="mt-8 pt-4 border-t border-sand-300/60 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              clearAllFilters()
            }}
            className="text-sm font-medium text-espresso-700 hover:text-espresso-950 underline underline-offset-4 cursor-pointer"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={closeFilterModal}
            className="rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-medium text-cream-50 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-espresso-900 cursor-pointer"
          >
            Apply filters
          </button>
        </div>
      </dialog>
    </>
  )
}

export default ShopPage
