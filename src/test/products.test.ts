import { describe, expect, it } from 'vitest'
import { products, productsBySlug, getProductBySlug } from '@/data/products'
import { PRODUCT_SLUGS, isProductSlug } from '@/data/slugs'
import { imageManifest } from '@/data/images.manifest'
import { formatPrice, formatDays, formatKcal } from '@/lib/format'
import type { HealthGoal } from '@/data/types'

describe('Product Catalog & Data Model (P08)', () => {
  it('contains exactly 10 products with unique IDs and slugs', () => {
    expect(products).toHaveLength(10)

    const ids = new Set(products.map((p) => p.id))
    expect(ids.size).toBe(10)

    const slugs = new Set(products.map((p) => p.slug))
    expect(slugs.size).toBe(10)

    for (const slug of slugs) {
      expect(isProductSlug(slug)).toBe(true)
      expect(getProductBySlug(slug)).toBeDefined()
    }

    expect(PRODUCT_SLUGS).toHaveLength(10)
  })

  it('guarantees every health goal appears on at least 2 products', () => {
    const allGoals: HealthGoal[] = [
      'urinary-care',
      'hairball-control',
      'sensitive-stomach',
      'coat-shine',
    ]

    for (const goal of allGoals) {
      const matchingProducts = products.filter((p) => p.healthGoals.includes(goal))
      expect(
        matchingProducts.length,
        `Expected health goal "${goal}" to appear on at least 2 products, found ${matchingProducts.length}`
      ).toBeGreaterThanOrEqual(2)
    }
  })

  it('correctly models Product 07 with primary category litter and secondary hardware', () => {
    const p07 = productsBySlug['stainless-oak-litter-basin']
    expect(p07).toBeDefined()
    expect(p07?.category).toBe('litter')
    expect(p07?.secondaryCategories).toContain('hardware')
  })

  it('ensures every product has a corresponding hero image in the image manifest', () => {
    for (const product of products) {
      const manifestEntry = imageManifest[product.slug]
      expect(manifestEntry, `Missing image manifest for slug ${product.slug}`).toBeDefined()
      expect(manifestEntry?.gallery.length).toBeGreaterThan(0)

      const hasHero = manifestEntry?.gallery.some((img) => img.role === 'hero')
      expect(hasHero, `Product ${product.slug} must have a hero image in gallery`).toBe(true)
      expect(manifestEntry?.cardDefault).toBeDefined()
      expect(manifestEntry?.cardHover).toBeDefined()
    }
  })

  it('verifies related products reference valid catalog slugs without self-referencing', () => {
    for (const product of products) {
      expect(product.related.length).toBeGreaterThanOrEqual(2)
      for (const relSlug of product.related) {
        expect(relSlug).not.toBe(product.slug)
        expect(productsBySlug[relSlug], `Related product ${relSlug} does not exist`).toBeDefined()
      }
    }
  })

  it('enforces supportive health wording rule: no claims of "cures" or "prevents"', () => {
    const forbiddenMedicalTerms = [/\bcures\b/i, /\bcure\b/i, /\bprevents\b/i, /\bprevent\b/i]

    for (const product of products) {
      const textToScan = [
        product.name,
        product.short,
        ...product.ingredients,
        ...Object.values(product.goalNotes),
        ...Object.values(product.specs),
        product.feedingNote ?? '',
      ].join(' ')

      for (const term of forbiddenMedicalTerms) {
        expect(term.test(textToScan), `Forbidden term ${term} found in product ${product.slug}`).toBe(
          false
        )
      }

      // Check that goal notes use supportive wording (supports / formulated)
      for (const [goal, note] of Object.entries(product.goalNotes)) {
        const hasSupportiveWord = /supports?|formulated|encourage/i.test(note ?? '')
        expect(
          hasSupportiveWord,
          `Goal note for ${goal} on ${product.slug} must use supportive wording ("supports", "formulated for")`
        ).toBe(true)
      }
    }
  })
})

describe('Currency & Unit Formatting (P08)', () => {
  it('formats USD and BDT according to fixed specifications and rounding rules', () => {
    // USD: integer with $ prefix
    expect(formatPrice(30, 'USD')).toBe('$30')
    expect(formatPrice(34, 'USD')).toBe('$34')
    expect(formatPrice(0, 'USD')).toBe('$0')

    // BDT: ৳ prefix, USD_TO_BDT = 123, rounded to nearest ৳10
    // 30 * 123 = 3690 -> ৳3,690
    expect(formatPrice(30, 'BDT')).toBe('৳3,690')

    // 34 * 123 = 4182 -> rounded to nearest 10 is 4180 -> ৳4,180
    expect(formatPrice(34, 'BDT')).toBe('৳4,180')

    // 14 * 123 = 1722 -> rounded to nearest 10 is 1720 -> ৳1,720
    expect(formatPrice(14, 'BDT')).toBe('৳1,720')

    // 89 * 123 = 10947 -> rounded to nearest 10 is 10950 -> ৳10,950
    expect(formatPrice(89, 'BDT')).toBe('৳10,950')
  })

  it('formats supply duration in days with proper pluralization', () => {
    expect(formatDays(1)).toBe('1 day')
    expect(formatDays(30)).toBe('30 days')
    expect(formatDays(33.4, { approximate: true })).toBe('~33 days')
  })

  it('formats caloric values with kcal suffix and thousands separators', () => {
    expect(formatKcal(45)).toBe('45 kcal')
    expect(formatKcal(234)).toBe('234 kcal')
    expect(formatKcal(9750)).toBe('9,750 kcal')
  })
})
