import { Link } from 'react-router-dom'
import type { Product } from '@/data/types'
import { formatPrice } from '@/lib/format'
import { useBag } from '@/store/bag'
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
      className={`group relative flex flex-col rounded-xl bg-oat-100/40 p-4 transition-all duration-200 hover:bg-oat-100/80 ${className}`}
      data-testid="product-card"
      data-product-id={product.id}
    >
      {/* Photo Tile (beige-200 background matching pack photos) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-beige-200">
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

      {/* Product Information */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Price Row */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium uppercase tracking-wider text-espresso-700/80">
              {categoryLabel}
            </span>
            <span className="font-sans font-medium text-espresso-950 tabular-nums">
              {formatPrice(product.priceUSD, currency)}
            </span>
          </div>

          {/* Product Name (Stretched Link to PDP) */}
          <h2 className="mt-1 font-serif text-lg font-semibold text-espresso-950 transition-colors group-hover:text-terracotta-700">
            <Link
              to={`/product/${product.slug}`}
              className="focus:outline-none"
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {product.name}
            </Link>
          </h2>

          {/* Packaging / Spec Line */}
          <p className="mt-1 text-xs text-espresso-700/90 line-clamp-1">
            {product.unit.packSizeLabel}
          </p>
        </div>

        {/* Footer Actions Row (Button elevated above stretched link) */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-sand-300/40">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-espresso-600 transition-colors group-hover:text-terracotta-700">
            View details <span aria-hidden="true">→</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              add(product.id, 1)
            }}
            aria-label={`Add ${product.name} to bag`}
            className="relative z-10 inline-flex items-center justify-center rounded-full bg-terracotta-600 px-3 py-1.5 text-xs font-medium text-cream-50 transition-all hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-espresso-900 focus:ring-offset-2 active:scale-95"
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
