import { products as defaultProducts } from '@/data/products'
import type {
  HealthGoal,
  LifeStage,
  Product,
  ProductCategory,
} from '@/data/types'

export type ShopSort = 'featured' | 'price-asc' | 'price-desc'

export interface ShopFilters {
  categories: ProductCategory[]
  stages: LifeStage[]
  goals: HealthGoal[]
  sort: ShopSort
}

export const VALID_CATEGORIES: readonly ProductCategory[] = [
  'wet-food',
  'dry-food',
  'treat-topper',
  'litter',
  'hardware',
]

export const VALID_STAGES: readonly LifeStage[] = ['kitten', 'adult', 'senior']

export const VALID_GOALS: readonly HealthGoal[] = [
  'urinary-care',
  'hairball-control',
  'sensitive-stomach',
  'coat-shine',
]

export const VALID_SORTS: readonly ShopSort[] = [
  'featured',
  'price-asc',
  'price-desc',
]

export const DEFAULT_FILTERS: ShopFilters = {
  categories: [],
  stages: [],
  goals: [],
  sort: 'featured',
}

/**
 * Checks if a product matches the selected categories.
 * Matches if any selected category matches primary or secondary category.
 */
export function matchesCategory(
  product: Product,
  categories: ProductCategory[],
): boolean {
  if (categories.length === 0) return true
  return categories.some(
    (c) => product.category === c || product.secondaryCategories.includes(c),
  )
}

/**
 * Checks if a product matches the selected life stages.
 * Products tagged 'all-stages' match every life stage.
 */
export function matchesStage(product: Product, stages: LifeStage[]): boolean {
  if (stages.length === 0) return true
  return (
    product.lifeStages.includes('all-stages') ||
    stages.some((s) => product.lifeStages.includes(s))
  )
}

/**
 * Checks if a product matches the selected health goals.
 * Products with no tagged goals are excluded when any goal is selected.
 */
export function matchesGoal(product: Product, goals: HealthGoal[]): boolean {
  if (goals.length === 0) return true
  if (product.healthGoals.length === 0) return false
  return goals.some((g) => product.healthGoals.includes(g))
}

/**
 * Filters and sorts products according to the given criteria.
 * AND logic across active facets; OR logic within each facet.
 */
export function filterProducts(
  productsToFilter: Product[] = defaultProducts,
  filters: Partial<ShopFilters> = {},
): Product[] {
  const categories = filters.categories ?? []
  const stages = filters.stages ?? []
  const goals = filters.goals ?? []
  const sort = filters.sort ?? 'featured'

  // Filter matching all active facets (AND across facets)
  const filtered = productsToFilter.filter((product) => {
    return (
      matchesCategory(product, categories) &&
      matchesStage(product, stages) &&
      matchesGoal(product, goals)
    )
  })

  // Sort
  if (sort === 'price-asc') {
    return [...filtered].sort((a, b) => a.priceUSD - b.priceUSD)
  }
  if (sort === 'price-desc') {
    return [...filtered].sort((a, b) => b.priceUSD - a.priceUSD)
  }

  // 'featured' preserves catalog order
  return filtered
}

/**
 * When 0 products match all active filters, finds the nearest matching products
 * by dropping facets and finding items that match the most criteria.
 */
export function nearestMatches(
  filters: Partial<ShopFilters>,
  allProducts: Product[] = defaultProducts,
): Product[] {
  const categories = filters.categories ?? []
  const stages = filters.stages ?? []
  const goals = filters.goals ?? []

  const activeFacetsCount =
    (categories.length > 0 ? 1 : 0) +
    (stages.length > 0 ? 1 : 0) +
    (goals.length > 0 ? 1 : 0)

  if (activeFacetsCount === 0) {
    return allProducts
  }

  // Score each product by how many active facets it matches
  const scored = allProducts.map((product) => {
    let score = 0
    if (categories.length > 0 && matchesCategory(product, categories)) {
      score += 1
    }
    if (stages.length > 0 && matchesStage(product, stages)) {
      score += 1
    }
    if (goals.length > 0 && matchesGoal(product, goals)) {
      score += 1
    }
    return { product, score }
  })

  // Find the highest score achievable (strictly less than full match, which was 0)
  let maxScore = 0
  for (const item of scored) {
    if (item.score > maxScore) {
      maxScore = item.score
    }
  }

  if (maxScore === 0) {
    // If no product matches any criteria, return featured products as fallback
    return allProducts.slice(0, 4)
  }

  // Return products that match the most criteria, preserving original ordering
  return scored
    .filter((item) => item.score === maxScore)
    .map((item) => item.product)
}

/**
 * Parses URL search parameters into clean, validated ShopFilters.
 * Unknown or invalid parameter values are safely ignored.
 */
export function parseFilterParams(
  searchParams: URLSearchParams | string,
): ShopFilters {
  let params: URLSearchParams
  if (typeof searchParams === 'string') {
    const search = searchParams.includes('?')
      ? searchParams.slice(searchParams.indexOf('?') + 1)
      : searchParams
    params = new URLSearchParams(search)
  } else {
    params = searchParams
  }

  // Helper to split comma-separated and multiple query entries
  const getAllValues = (key: string): string[] => {
    const rawList = params.getAll(key)
    const tokens: string[] = []
    for (const raw of rawList) {
      for (const t of raw.split(',')) {
        const trimmed = t.trim()
        if (trimmed) tokens.push(trimmed)
      }
    }
    return tokens
  }

  const rawCategories = getAllValues('category')
  const categories = rawCategories.filter((c): c is ProductCategory =>
    VALID_CATEGORIES.includes(c as ProductCategory),
  )

  const rawStages = getAllValues('stage')
  const stages = rawStages.filter((s): s is LifeStage =>
    VALID_STAGES.includes(s as LifeStage),
  )

  const rawGoals = getAllValues('goal')
  const goals = rawGoals.filter((g): g is HealthGoal =>
    VALID_GOALS.includes(g as HealthGoal),
  )

  const rawSort = params.get('sort')?.trim()
  const sort: ShopSort =
    rawSort && VALID_SORTS.includes(rawSort as ShopSort)
      ? (rawSort as ShopSort)
      : 'featured'

  return {
    categories: Array.from(new Set(categories)),
    stages: Array.from(new Set(stages)),
    goals: Array.from(new Set(goals)),
    sort,
  }
}

/**
 * Serializes ShopFilters into a clean URLSearchParams object.
 * Empty facets and default sort are omitted for clean URLs.
 */
export function serializeFilterParams(
  filters: Partial<ShopFilters>,
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.categories && filters.categories.length > 0) {
    params.set('category', filters.categories.join(','))
  }

  if (filters.stages && filters.stages.length > 0) {
    params.set('stage', filters.stages.join(','))
  }

  if (filters.goals && filters.goals.length > 0) {
    params.set('goal', filters.goals.join(','))
  }

  if (filters.sort && filters.sort !== 'featured') {
    params.set('sort', filters.sort)
  }

  return params
}
