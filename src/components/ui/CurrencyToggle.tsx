import type React from 'react'
import { useCurrency } from '@/store/currency'

export interface CurrencyToggleProps {
  ariaLabel?: string
  className?: string
  size?: 'xs' | 'sm' | 'md'
}

export function CurrencyToggle({
  ariaLabel = 'Currency selection',
  className = '',
  size = 'md',
}: CurrencyToggleProps) {
  const currency = useCurrency((s) => s.currency)
  const setCurrency = useCurrency((s) => s.setCurrency)


  const handleUSDClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currency === 'USD') {
      setCurrency('BDT')
    } else {
      setCurrency('USD')
    }
  }

  const handleBDTClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currency === 'BDT') {
      setCurrency('USD')
    } else {
      setCurrency('BDT')
    }
  }

  const buttonSizeClasses =
    size === 'xs'
      ? 'min-w-[28px] h-[21px] px-2 py-0 text-[10px] leading-none tracking-wide'
      : size === 'sm'
        ? 'min-w-[36px] min-h-[30px] px-2 py-0.5 text-[11px]'
        : 'min-w-[42px] min-h-[34px] px-2.5 py-1 text-xs'

  return (
    <fieldset
      aria-label={ariaLabel}
      title={`Current currency: ${currency}. Click to switch to ${currency === 'USD' ? 'BDT' : 'USD'}`}
      className={`relative inline-flex items-center rounded-full bg-oat-100/90 ${
        size === 'xs' ? 'p-[2px]' : 'p-0.5'
      } border border-sand-300/80 m-0 shadow-2xs select-none touch-manipulation hover:border-sand-400 transition-colors ${className}`}
    >
      <legend className="sr-only">{ariaLabel}</legend>
      <button
        type="button"
        onClick={handleUSDClick}
        aria-pressed={currency === 'USD'}
        className={`${buttonSizeClasses} font-semibold rounded-full transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 ${
          currency === 'USD'
            ? 'bg-cream-50 text-espresso-950 shadow-xs'
            : 'text-espresso-700 hover:text-espresso-950'
        }`}
      >
        USD
      </button>
      <button
        type="button"
        onClick={handleBDTClick}
        aria-pressed={currency === 'BDT'}
        className={`${buttonSizeClasses} font-semibold rounded-full transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 ${
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
