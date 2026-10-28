import { Link } from 'react-router-dom'
import type { Product } from '@/data/types'
import { formatPrice } from '@/lib/format'
import { saveLastViewedProduct } from '@/lib/shop-session'
import { useBag } from '@/store/bag'
import { useCurrency } from '@/store/currency'
import { useToast } from '@/store/toast'
import { ProductImage } from '@/components/ui/ProductImage'
import { stampPaw } from '@/components/ui/stampPaw'

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

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    stampPaw(e.currentTarget)
    const prevQty = useBag.getState().lines.find((l) => l.productId === product.id)?.qty ?? 0
    add(product.id, 1)
    useToast.getState().showToast({
      message: `Added ${product.name} to your bag.`,
      undoAction: () => {
        if (prevQty === 0) {
          useBag.getState().remove(product.id)
        } else {
          useBag.getState().setQty(product.id, prevQty)
        }
      },
    })
  }

  const categoryLabel = CATEGORY_NAMES[product.category] ?? product.category

  return (
    <article
      id={`product-${product.slug}`}
      className={`group relative flex flex-col rounded-2xl bg-oat-100/40 overflow-hidden border border-sand-300/60 transition-all duration-200 hover:bg-oat-100/70 hover:border-sand-300/80 hover:shadow-xs scroll-mt-24 sm:scroll-mt-28 ${className}`}
      data-testid="product-card"
      data-product-id={product.id}
    >
      {/* Photo Tile — 4:5 aspect ratio on consistent background token */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#DDD0BA]">
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
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Category & Price Row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-sage-900/80 leading-none">
              {categoryLabel}
            </span>
            <span className="font-sans text-[15px] sm:text-[18px] font-medium text-espresso-950 tabular-nums leading-none">
              {formatPrice(product.priceUSD, currency)}
            </span>
          </div>

          {/* Product Name (18px desktop / 15px mobile, font-serif font-semibold) */}
          <h2 className="font-serif text-[15px] sm:text-[18px] font-semibold text-espresso-950 transition-colors group-hover:text-terracotta-700 leading-snug line-clamp-1 mb-1">
            <Link
              to={`/product/${product.slug}`}
              className="focus:outline-none"
              onClick={() => saveLastViewedProduct(product.slug)}
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {product.name}
            </Link>
          </h2>

          {/* Packaging / Spec Line (14px desktop / 12px mobile) */}
          <p className="text-[12px] sm:text-[14px] text-espresso-700/80 line-clamp-1 leading-snug">
            {product.unit.packSizeLabel}
          </p>
        </div>

        {/* Footer Actions: "View details" link + "Add" text-pill without icon */}
        <div className="mt-3.5 pt-2.5 border-t border-sand-300/50 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[12px] sm:text-[14px] font-medium text-espresso-700 transition-colors group-hover:text-terracotta-700 leading-none">
            View details <span aria-hidden="true">→</span>
          </span>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to bag`}
            className="group/btn relative z-10 inline-flex items-center justify-center rounded-full bg-terracotta-600 px-4 py-1.5 min-h-[32px] sm:min-h-[36px] text-[12px] sm:text-[14px] font-medium text-cream-50 transition-all hover:bg-terracotta-700 active:scale-95 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 cursor-pointer shadow-2xs leading-none"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
