import { useCurrency } from '@/store/currency'

export interface CurrencyToggleProps {
  ariaLabel?: string
  className?: string
  size?: 'sm' | 'md'
}

export function CurrencyToggle({
  ariaLabel = 'Currency selection',
  className = '',
  size = 'md',
}: CurrencyToggleProps) {
  const currency = useCurrency((s) => s.currency)
  const setCurrency = useCurrency((s) => s.setCurrency)

  const isSmall = size === 'sm'

  return (
    <fieldset
      aria-label={ariaLabel}
      className={`inline-flex items-center rounded-full bg-oat-100/90 p-0.5 border border-sand-300/80 m-0 shadow-2xs ${className}`}
    >
      <legend className="sr-only">{ariaLabel}</legend>
      <button
        type="button"
        onClick={() => setCurrency('USD')}
        aria-pressed={currency === 'USD'}
        className={`${
          isSmall
            ? 'min-w-[36px] min-h-[30px] px-2 py-0.5 text-[11px]'
            : 'min-w-[42px] min-h-[34px] px-2.5 py-1 text-xs'
        } font-semibold rounded-full transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 ${
          currency === 'USD'
            ? 'bg-cream-50 text-espresso-950 shadow-xs'
            : 'text-espresso-700 hover:text-espresso-950'
        }`}
      >
        USD
      </button>
      <button
        type="button"
        onClick={() => setCurrency('BDT')}
        aria-pressed={currency === 'BDT'}
        className={`${
          isSmall
            ? 'min-w-[36px] min-h-[30px] px-2 py-0.5 text-[11px]'
            : 'min-w-[42px] min-h-[34px] px-2.5 py-1 text-xs'
        } font-semibold rounded-full transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 ${
          currency === 'BDT'
            ? 'bg-cream-50 text-espresso-950 shadow-xs'
            : 'text-espresso-700 hover:text-espresso-950'
        }`}
      >
        BDT
      </button>
    </fieldset>
  )
}

export default CurrencyToggle
