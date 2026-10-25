import { SITE_CONFIG } from '@/config/site'
import type { Currency } from '@/data/types'

/**
 * Formats a USD base price into the target currency with proper locale symbol.
 * - USD: '$' prefix, integer format ($30, $34)
 * - BDT: '৳' prefix, converted at fixed USD_TO_BDT rate and rounded to nearest ৳10 (৳3,690, ৳4,180)
 */
export function formatPrice(usd: number, currency: Currency = 'USD'): string {
  if (currency === 'BDT') {
    const rawBdt = usd * SITE_CONFIG.currency.USD_TO_BDT
    const roundTo = SITE_CONFIG.currency.BDT_ROUND_TO
    const roundedBdt = Math.round(rawBdt / roundTo) * roundTo
    const formattedNumber = new Intl.NumberFormat('en-US').format(roundedBdt)
    return `৳${formattedNumber}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd)
}

/**
 * Formats supply duration in days with proper pluralization and optional approximation prefix.
 */
export function formatDays(days: number, options?: { approximate?: boolean }): string {
  const rounded = Math.round(days)
  const prefix = options?.approximate ? '~' : ''
  const unit = rounded === 1 ? 'day' : 'days'
  return `${prefix}${rounded} ${unit}`
}

/**
 * Formats caloric values with thousands separators and kcal unit suffix.
 */
export function formatKcal(kcal: number): string {
  const rounded = Math.round(kcal)
  return `${new Intl.NumberFormat('en-US').format(rounded)} kcal`
}

/**
 * Standard CSS class for preventing layout shifts in numerical UI counters.
 */
export const TABULAR_NUMS = 'tabular-nums'
