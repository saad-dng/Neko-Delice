import { Link } from 'react-router-dom'
import type { Product } from '@/data/types'
import { formatPrice } from '@/lib/format'
import { useBag } from '@/store/bag'
import { useBagUi } from '@/store/bag-ui'
import { useCurrency } from '@/store/currency'
import { ProductImage } from '@/components/ui/ProductImage'

export interface ProductCardProps {
  product: Product
  priority?: boolean
  className?: string
}

const CATEGORY_NAMES: Record<string, string> = {
  'wet-food': 'Wet Food',
  'dry-food': 'Dry Food',
  'treat-topper': 'Treat / Topper',
  litter: 'Litter',
  hardware: 'Hardware',
}

export function ProductCard({
  product,
  priority = false,
  className = '',
}: ProductCardProps) {
  const currency = useCurrency((s) => s.currency)
  const add = useBag((s) => s.add)

  const categoryLabel = CATEGORY_NAMES[product.category] ?? product.category

  return (
    <article
      className={`group relative flex flex-col rounded-2xl bg-oat-100/40 overflow-hidden border border-sand-300/40 transition-all duration-200 hover:bg-oat-100/70 hover:border-sand-300/70 hover:shadow-xs ${className}`}
      data-testid="product-card"
      data-product-id={product.id}
    >
      {/* Photo Tile — Full width at top of card so product photos are prominent and large */}
      <div className="relative aspect-square w-full overflow-hidden bg-beige-200">
        {/* Default Hero Image */}
        <ProductImage
          slug={product.slug}
          imageRole="hero"
          priority={priority}
          className="h-full w-full object-cover transition-opacity duration-200"
        />

        {/* Hover Image Crossfade - active only on devices supporting hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:hidden">
          <ProductImage
            slug={product.slug}
            imageRole="contents"
            priority={false}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Compact Product Information Bar */}
      <div className="p-3.5 sm:p-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Price Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-sage-800">
              {categoryLabel}
            </span>
            <span className="font-sans text-sm font-semibold text-espresso-950 tabular-nums">
              {formatPrice(product.priceUSD, currency)}
            </span>
          </div>

          {/* Product Name (Clean DM Sans, compact size, tight leading, line-clamp-2) */}
          <h2 className="mt-1 font-sans text-sm sm:text-[15px] font-semibold text-espresso-950 transition-colors group-hover:text-terracotta-700 leading-snug line-clamp-2 min-h-[2.5rem] flex items-start">
            <Link
              to={`/product/${product.slug}`}
              className="focus:outline-none"
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {product.name}
            </Link>
          </h2>

          {/* Packaging / Spec Line */}
          <p className="mt-0.5 text-[11px] sm:text-xs text-espresso-600 line-clamp-1">
            {product.unit.packSizeLabel}
          </p>
        </div>

        {/* Compact Footer Actions Row */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-sand-300/40">
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-espresso-700 transition-colors group-hover:text-terracotta-700">
            View details <span aria-hidden="true">→</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              add(product.id, 1)
              useBagUi.getState().openBag(e.currentTarget)
            }}
            aria-label={`Add ${product.name} to bag`}
            className="relative z-10 inline-flex items-center justify-center rounded-full bg-terracotta-600 px-3.5 py-1 min-h-[32px] text-xs font-semibold text-cream-50 transition-all hover:bg-terracotta-700 active:scale-95 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 cursor-pointer shadow-2xs"
          >
            <span className="mr-1" aria-hidden="true">
              +
            </span>{' '}
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
