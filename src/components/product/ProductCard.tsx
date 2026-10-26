import { Link } from 'react-router-dom'
import type { Product } from '@/data/types'
import { formatPrice } from '@/lib/format'
import { saveLastViewedProduct } from '@/lib/shop-session'
import { useBag } from '@/store/bag'
import { useCurrency } from '@/store/currency'
import { useToast } from '@/store/toast'
import { ProductImage } from '@/components/ui/ProductImage'
import { PawPrint } from '@/components/cat-art/PawPrint'
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
      className={`group relative flex flex-col rounded-2xl bg-oat-100/40 overflow-hidden border border-sand-300/40 transition-all duration-200 hover:bg-oat-100/70 hover:border-sand-300/70 hover:shadow-xs scroll-mt-24 sm:scroll-mt-28 ${className}`}
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

      {/* Compact Consistent Product Information Bar */}
      <div className="p-3 sm:px-3 sm:py-2.5 flex flex-col justify-between">
        <div>
          {/* Category & Price Row */}
          <div className="flex items-center justify-between gap-2 h-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-800 leading-none">
              {categoryLabel}
            </span>
            <span className="font-sans text-xs sm:text-[13px] font-semibold text-espresso-950 tabular-nums leading-none">
              {formatPrice(product.priceUSD, currency)}
            </span>
          </div>

          {/* Product Name (Consistent DM Sans, compact 13px, fixed 2-line height 34px) */}
          <h2 className="mt-1 font-sans text-[13px] font-semibold text-espresso-950 transition-colors group-hover:text-terracotta-700 leading-snug line-clamp-2 h-[34px] flex items-start">
            <Link
              to={`/product/${product.slug}`}
              className="focus:outline-none"
              onClick={() => saveLastViewedProduct(product.slug)}
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {product.name}
            </Link>
          </h2>

          {/* Packaging / Spec Line */}
          <p className="mt-0.5 text-[10.5px] sm:text-[11px] text-espresso-600 line-clamp-1 h-3.5 leading-none">
            {product.unit.packSizeLabel}
          </p>
        </div>

        {/* Compact Footer Actions Row */}
        <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-sand-300/40">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-espresso-700 transition-colors group-hover:text-terracotta-700 leading-none">
            View details <span aria-hidden="true">→</span>
          </span>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to bag`}
            className="group/btn relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-terracotta-600 px-3 py-1 min-h-[28px] text-[11px] font-semibold text-cream-50 transition-all hover:bg-terracotta-700 hover:shadow-xs active:scale-95 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 cursor-pointer shadow-2xs leading-none"
          >
            <PawPrint
              size={12}
              filled
              className="text-cream-100 transition-transform duration-200 group-hover/btn:-rotate-12 group-hover/btn:scale-110"
            />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
