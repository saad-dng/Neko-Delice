import { beforeEach, describe, expect, it } from 'vitest'
import { products } from '@/data/products'
import {
  DEFAULT_FILTERS,
  filterProducts,
  matchesCategory,
  matchesGoal,
  matchesStage,
  nearestMatches,
  parseFilterParams,
  serializeFilterParams,
} from '@/lib/filters'
import { useBag } from '@/store/bag'
import { useCurrency } from '@/store/currency'
import { usePlannerProfile } from '@/store/planner'
import { safeLocalStorage } from '@/store/safe-storage'
import type { CatProfile } from '@/data/types'

describe('Zustand Stores with Persist & Corruption Recovery', () => {
  beforeEach(() => {
    localStorage.clear()
    useBag.getState().clear()
    useCurrency.setState({ currency: 'USD' })
    usePlannerProfile.getState().clearProfile()
  })

  it('useBag: adds, merges quantities, clamps to 1-9', () => {
    const bag = useBag.getState()
    bag.add('01', 2)
    expect(useBag.getState().lines).toEqual([{ productId: '01', qty: 2 }])
    expect(useBag.getState().count()).toBe(2)

    // Merge existing
    useBag.getState().add('01', 3)
    expect(useBag.getState().lines).toEqual([{ productId: '01', qty: 5 }])
    expect(useBag.getState().count()).toBe(5)

    // Clamp to 9
    useBag.getState().add('01', 10)
    expect(useBag.getState().lines).toEqual([{ productId: '01', qty: 9 }])
    expect(useBag.getState().count()).toBe(9)
  })

  it('useBag: setQty updates and removes when <= 0', () => {
    useBag.getState().add('02', 4)
    useBag.getState().setQty('02', 7)
    expect(useBag.getState().lines).toEqual([{ productId: '02', qty: 7 }])

    // Setting <= 0 removes the line
    useBag.getState().setQty('02', 0)
    expect(useBag.getState().lines).toEqual([])
    expect(useBag.getState().count()).toBe(0)
  })

  it('useBag: remove and clear work as expected', () => {
    useBag.getState().add('01', 1)
    useBag.getState().add('02', 2)
    expect(useBag.getState().count()).toBe(3)

    useBag.getState().remove('01')
    expect(useBag.getState().lines).toEqual([{ productId: '02', qty: 2 }])

    useBag.getState().clear()
    expect(useBag.getState().lines).toEqual([])
  })

  it('useBag: addMany merges batches with clamping', () => {
    useBag.getState().add('01', 2)
    useBag.getState().addMany([
      { productId: '01', qty: 5 },
      { productId: '03', qty: 2 },
    ])

    expect(useBag.getState().lines).toEqual([
      { productId: '01', qty: 7 },
      { productId: '03', qty: 2 },
    ])
    expect(useBag.getState().count()).toBe(9)
  })

  it('useCurrency: defaults to USD, toggles to BDT and back', () => {
    expect(useCurrency.getState().currency).toBe('USD')

    useCurrency.getState().toggleCurrency()
    expect(useCurrency.getState().currency).toBe('BDT')

    useCurrency.getState().toggleCurrency()
    expect(useCurrency.getState().currency).toBe('USD')

    useCurrency.getState().setCurrency('BDT')
    expect(useCurrency.getState().currency).toBe('BDT')
  })

  it('usePlannerProfile: saves and clears profile', () => {
    expect(usePlannerProfile.getState().profile).toBeNull()

    const profile: CatProfile = {
      name: 'Mochi',
      stage: 'adult',
      neutered: true,
      weightKg: 4.5,
      activity: 'lounger',
      healthFocus: 'sensitive-stomach',
    }

    usePlannerProfile.getState().setProfile(profile)
    expect(usePlannerProfile.getState().profile).toEqual(profile)

    usePlannerProfile.getState().clearProfile()
    expect(usePlannerProfile.getState().profile).toBeNull()
  })

  it('safeLocalStorage purges corrupted JSON and returns null without throwing', () => {
    // Intentionally corrupt the bag store entry
    localStorage.setItem('neko-delice-bag-v1', '{ invalid json @@#')

    // Reading should safely return null and purge corrupted key
    const result = safeLocalStorage.getItem('neko-delice-bag-v1')
    expect(result).toBeNull()
    expect(localStorage.getItem('neko-delice-bag-v1')).toBeNull()
  })
})

describe('Filter Logic (Pure Functions)', () => {
  it('matchesCategory: handles primary and secondary categories', () => {
    const salmonOil = products.find((p) => p.id === '04')!
    expect(matchesCategory(salmonOil, ['treat-topper'])).toBe(true)
    expect(matchesCategory(salmonOil, ['wet-food'])).toBe(false)

    // Product 07 has category 'litter' and secondary 'hardware'
    const litterBasin = products.find((p) => p.id === '07')!
    expect(matchesCategory(litterBasin, ['litter'])).toBe(true)
    expect(matchesCategory(litterBasin, ['hardware'])).toBe(true)
    expect(matchesCategory(litterBasin, ['wet-food'])).toBe(false)
  })

  it('matchesStage: products tagged all-stages match every stage', () => {
    const kibble = products.find((p) => p.id === '03')!
    expect(kibble.lifeStages).toContain('all-stages')

    expect(matchesStage(kibble, ['kitten'])).toBe(true)
    expect(matchesStage(kibble, ['adult'])).toBe(true)
    expect(matchesStage(kibble, ['senior'])).toBe(true)

    // Product 01 is kitten-only
    const kittenMousse = products.find((p) => p.id === '01')!
    expect(matchesStage(kittenMousse, ['kitten'])).toBe(true)
    expect(matchesStage(kittenMousse, ['adult'])).toBe(false)
  })

  it('matchesGoal: products without tagged goals are excluded when a goal is selected', () => {
    const tofuLitter = products.find((p) => p.id === '06')!
    expect(tofuLitter.healthGoals).toEqual([])

    // Excluded when a goal is selected
    expect(matchesGoal(tofuLitter, ['sensitive-stomach'])).toBe(false)

    // Included when no goal is selected
    expect(matchesGoal(tofuLitter, [])).toBe(true)

    // Product 02 has urinary-care, sensitive-stomach, coat-shine
    const salmonPate = products.find((p) => p.id === '02')!
    expect(matchesGoal(salmonPate, ['urinary-care'])).toBe(true)
    expect(matchesGoal(salmonPate, ['hairball-control'])).toBe(false)
  })

  it('filterProducts: AND across facets, OR within facets', () => {
    // Wet Food (01, 02) + Kitten stage -> only Product 01
    const wetKitten = filterProducts(products, {
      categories: ['wet-food'],
      stages: ['kitten'],
    })
    expect(wetKitten.map((p) => p.id)).toEqual(['01'])

    // Wet Food OR Dry Food + Coat Shine -> Product 02 (wet) has coat-shine
    const coatFood = filterProducts(products, {
      categories: ['wet-food', 'dry-food'],
      goals: ['coat-shine'],
    })
    expect(coatFood.map((p) => p.id)).toEqual(['02'])
  })

  it('filterProducts: sorting by featured, price-asc, price-desc', () => {
    const asc = filterProducts(products, { sort: 'price-asc' })
    for (let i = 0; i < asc.length - 1; i++) {
      expect(asc[i]!.priceUSD).toBeLessThanOrEqual(asc[i + 1]!.priceUSD)
    }

    const desc = filterProducts(products, { sort: 'price-desc' })
    for (let i = 0; i < desc.length - 1; i++) {
      expect(desc[i]!.priceUSD).toBeGreaterThanOrEqual(desc[i + 1]!.priceUSD)
    }
  })

  it('nearestMatches: returns highest matching items when zero exact matches exist', () => {
    // Zero match combo: Hardware + Kitten + Hairball Control
    const filtered = filterProducts(products, {
      categories: ['hardware'],
      stages: ['kitten'],
      goals: ['hairball-control'],
    })
    expect(filtered).toHaveLength(0)

    const nearest = nearestMatches(
      {
        categories: ['hardware'],
        stages: ['kitten'],
        goals: ['hairball-control'],
      },
      products,
    )

    // Should return nearest matches (not empty)
    expect(nearest.length).toBeGreaterThan(0)

    // Any hardware item matches 2 facets: hardware category + kitten (via all-stages)!
    const fountain = products.find((p) => p.id === '09')!
    expect(nearest).toContainEqual(fountain)
  })

  it('URL parsing: ignores bad parameters and extracts clean filters', () => {
    const badUrl =
      '?category=wet-food,zzz&stage=alien,kitten&goal=magic,urinary-care&sort=quantum'
    const parsed = parseFilterParams(badUrl)

    expect(parsed.categories).toEqual(['wet-food'])
    expect(parsed.stages).toEqual(['kitten'])
    expect(parsed.goals).toEqual(['urinary-care'])
    expect(parsed.sort).toBe('featured')
  })

  it('URL serialization and deserialization round-trip', () => {
    const original = {
      categories: ['wet-food' as const, 'dry-food' as const],
      stages: ['adult' as const],
      goals: ['sensitive-stomach' as const],
      sort: 'price-asc' as const,
    }

    const serialized = serializeFilterParams(original)
    expect(serialized.toString()).toBe(
      'category=wet-food%2Cdry-food&stage=adult&goal=sensitive-stomach&sort=price-asc',
    )

    const restored = parseFilterParams(serialized)
    expect(restored).toEqual(original)
  })

  it('URL serialization of empty filters yields empty search params', () => {
    const emptyParams = serializeFilterParams(DEFAULT_FILTERS)
    expect(emptyParams.toString()).toBe('')
  })
})
