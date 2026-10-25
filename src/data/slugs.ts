import { products } from './products'

export const PRODUCT_SLUGS = products.map((p) => p.slug)

export type ProductSlug = (typeof PRODUCT_SLUGS)[number]

export interface ProductSlugMeta {
  slug: string
  name: string
  category: string
  short: string
}

export const PRODUCT_META: Record<string, ProductSlugMeta> = Object.fromEntries(
  products.map((p) => [
    p.slug,
    {
      slug: p.slug,
      name: p.name,
      category: p.category,
      short: p.short,
    },
  ])
)

export function isProductSlug(slug: string | undefined): boolean {
  if (!slug) return false
  return products.some((p) => p.slug === slug)
}
