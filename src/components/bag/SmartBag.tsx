import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { products } from '@/data/products'
import { PLANNER_CONFIG } from '@/config/planner'
import { useBag } from '@/store/bag'
import { useBagUi } from '@/store/bag-ui'
import { useCurrency } from '@/store/currency'
import { usePlannerProfile } from '@/store/planner'
import { formatDays, formatPrice, TABULAR_NUMS } from '@/lib/format'
import { supplyDays } from '@/lib/planner'
import { ProductImage } from '@/components/ui/ProductImage'
import { CatPeeking } from '@/components/cat-art/CatPeeking'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'

export function SmartBag() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = useBagUi((s) => s.isOpen)
  const triggerElement = useBagUi((s) => s.triggerElement)
  const closeBag = useBagUi((s) => s.closeBag)

  const lines = useBag((s) => s.lines)
  const setQty = useBag((s) => s.setQty)
  const remove = useBag((s) => s.remove)

  const currency = useCurrency((s) => s.currency)
  const profile = usePlannerProfile((s) => s.profile)

  // Synchronize native <dialog> with isOpen state
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }
      // Lock body scroll while modal is active
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalOverflow
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
      // Return focus to trigger element
      triggerElement?.focus()
    }
  }, [isOpen, triggerElement])

  // Attach backdrop click listener directly on the dialog DOM element
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handlePointerDown = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect()
      const clickedInside =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right

      if (!clickedInside) {
        closeBag()
      }
    }

    dialog.addEventListener('pointerdown', handlePointerDown)
    return () => dialog.removeEventListener('pointerdown', handlePointerDown)
  }, [closeBag])

  // Handle native cancel event (Escape key)
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault()
    closeBag()
  }

  // Subtotal calculation in USD
  const subtotalUSD = lines.reduce((total, line) => {
    const product = products.find((p) => p.id === line.productId)
    return total + (product ? product.priceUSD * line.qty : 0)
  }, 0)

  const hasItems = lines.length > 0

  return (
    <dialog
      ref={dialogRef}
      id="smart-bag-dialog"
      className="smart-bag-dialog flex flex-col"
      aria-labelledby="smart-bag-title"
      aria-modal="true"
      onCancel={handleCancel}
    >
      {/* Dialog Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-sand-300/80 shrink-0">
        <div className="flex items-center gap-3">
          <h2
            id="smart-bag-title"
            className="font-serif text-2xl font-semibold text-espresso-950"
          >
            Your Bag
          </h2>
          <CurrencyToggle ariaLabel="Bag currency selection" size="sm" />
        </div>

        <button
          type="button"
          onClick={closeBag}
          aria-label="Close bag"
          className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full text-espresso-700 hover:text-espresso-950 hover:bg-oat-200/60 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 cursor-pointer transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Dialog Content Area */}
      {hasItems ? (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {lines.map((line) => {
            const product = products.find((p) => p.id === line.productId)
            if (!product) return null

            const linePriceUSD = product.priceUSD * line.qty

            // Compute supply duration
            let supplyText: string
            if (product.category === 'hardware' || product.unit.type === 'hardware') {
              supplyText = 'One-time purchase'
            } else if (product.category === 'litter' || product.unit.type === 'litter') {
              supplyText = 'About 30 days for one cat'
            } else {
              const days = supplyDays(
                product.id,
                line.qty,
                profile ?? PLANNER_CONFIG.referenceCat,
              )
              if (days) {
                supplyText = profile
                  ? `Lasts ${formatDays(days, { approximate: true })}`
                  : `Lasts ${formatDays(days, { approximate: true })} · Based on a 4.5 kg neutered adult`
              } else {
                supplyText = 'Consumable supply'
              }
            }

            return (
              <div
                key={line.productId}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-cream-50/90 border border-sand-300/80 transition-colors"
              >
                {/* Thumbnail on beige tile */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-beige-200">
                  <ProductImage
                    slug={product.slug}
                    imageRole="hero"
                    sizes="80px"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info & Controls */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-serif text-base sm:text-lg font-semibold text-espresso-950 truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-espresso-700 mt-0.5">
                        {product.unit.packSizeLabel}
                      </div>
                    </div>

                    {/* Line Price */}
                    <div className="text-right shrink-0">
                      <span className={`font-serif text-base sm:text-lg font-semibold text-espresso-950 block ${TABULAR_NUMS}`}>
                        {formatPrice(linePriceUSD, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Supply Duration Note */}
                  <div className="text-xs font-medium text-terracotta-700 mt-1">
                    {supplyText}
                  </div>

                  {/* Quantity Stepper and Remove Action */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-sand-300/50">
                    <div className="flex items-center rounded-full border border-sand-300 bg-cream-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => setQty(product.id, line.qty - 1)}
                        disabled={line.qty <= 1}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-espresso-900 hover:bg-oat-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 cursor-pointer"
                      >
                        −
                      </button>
                      <span
                        aria-label={`Quantity: ${line.qty}`}
                        className={`w-8 text-center text-xs font-semibold text-espresso-950 select-none ${TABULAR_NUMS}`}
                      >
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(product.id, line.qty + 1)}
                        disabled={line.qty >= 9}
                        aria-label={`Increase quantity of ${product.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-espresso-900 hover:bg-oat-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={`Remove ${product.name} from bag`}
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-xs font-medium text-espresso-700 hover:text-terracotta-700 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
          <div className="w-20 h-20 text-espresso-600 mb-3 flex items-center justify-center">
            <CatPeeking className="w-16 h-16" />
          </div>

          <h3 className="font-serif text-xl font-semibold text-espresso-950 mb-2">
            Your bag is empty.
          </h3>
          <p className="text-xs sm:text-sm text-espresso-700 max-w-xs mb-6 leading-relaxed">
            Explore our vet-informed food recipes or build a personalized monthly meal plan.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
            <Link
              to="/shop"
              onClick={closeBag}
              className="w-full inline-flex items-center justify-center rounded-full bg-terracotta-600 text-cream-50 px-5 py-2.5 text-xs font-semibold hover:bg-terracotta-700 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 min-h-[44px]"
            >
              Explore Shop
            </Link>
            <Link
              to="/meal-plan"
              onClick={closeBag}
              className="w-full inline-flex items-center justify-center rounded-full border border-sand-300 text-espresso-950 px-5 py-2.5 text-xs font-semibold hover:bg-oat-100/60 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 min-h-[44px]"
            >
              Build Meal Plan
            </Link>
          </div>
        </div>
      )}

      {/* Dialog Footer (Totals & Checkout) */}
      {hasItems && (
        <div className="px-6 py-4 border-t border-sand-300/80 bg-oat-100/95 shrink-0 space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-espresso-700">
            <span>Subtotal</span>
            <span className={`font-semibold text-espresso-950 ${TABULAR_NUMS}`}>
              {formatPrice(subtotalUSD, currency)}
            </span>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between text-xs text-espresso-600">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          {/* Estimated Total */}
          <div className="flex items-center justify-between pt-2 border-t border-sand-300/60 font-serif text-lg sm:text-xl font-semibold text-espresso-950">
            <span>Estimated total</span>
            <span className={TABULAR_NUMS}>{formatPrice(subtotalUSD, currency)}</span>
          </div>

          {currency === 'BDT' && (
            <p className="text-[11px] text-espresso-500 text-right">
              BDT prices are approximate (USD 1 = ৳123, Oct 2026)
            </p>
          )}

          {/* Checkout Button & Accessible Tooltip */}
          <div className="pt-2">
            <button
              type="button"
              aria-disabled="true"
              aria-describedby="checkout-disabled-reason"
              onClick={(e) => e.preventDefault()}
              className="w-full rounded-full bg-terracotta-600/60 text-cream-50/90 min-h-[48px] px-6 py-3 text-sm font-semibold cursor-not-allowed text-center transition-colors focus:outline-none focus:ring-2 focus:ring-espresso-900 focus:ring-offset-2"
            >
              Checkout
            </button>
            <div
              id="checkout-disabled-reason"
              role="tooltip"
              className="text-[11px] text-center text-espresso-600 mt-2 leading-relaxed"
            >
              This is a storefront preview. Checkout is not connected yet.
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

export default SmartBag
