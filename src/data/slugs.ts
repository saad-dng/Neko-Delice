export interface ProductSlugMeta {
  slug: string
  name: string
  category: string
  short: string
}

export const PRODUCT_SLUGS = [
  'kitten-growth-mousse-broth',
  'wild-salmon-quail-pate',
  'duck-sweet-potato-kibble',
  'norwegian-salmon-oil',
  'freeze-dried-chicken-hearts',
  'matcha-tofu-litter',
  'stainless-oak-litter-basin',
  'tilted-ceramic-whisker-bowl',
  'ceramic-water-fountain',
  'sisal-birch-scratcher',
] as const

export type ProductSlug = (typeof PRODUCT_SLUGS)[number]

export const PRODUCT_META: Record<ProductSlug, ProductSlugMeta> = {
  'kitten-growth-mousse-broth': {
    slug: 'kitten-growth-mousse-broth',
    name: 'Kitten Growth Mousse & Broth',
    category: 'Wet food',
    short: 'A silky chicken mousse in its own broth, formulated for growing kittens.',
  },
  'wild-salmon-quail-pate': {
    slug: 'wild-salmon-quail-pate',
    name: 'Wild Salmon & Quail Paté',
    category: 'Wet food',
    short: 'A smooth paté of wild salmon and quail, formulated for adult and senior cats.',
  },
  'duck-sweet-potato-kibble': {
    slug: 'duck-sweet-potato-kibble',
    name: 'Oven-Baked Duck & Sweet Potato Kibble',
    category: 'Dry food',
    short: 'Slow oven-baked kibble with duck and sweet potato, formulated for every life stage.',
  },
  'norwegian-salmon-oil': {
    slug: 'norwegian-salmon-oil',
    name: 'Pure Norwegian Salmon Oil',
    category: 'Treat / topper',
    short: 'Cold-filtered salmon oil in an amber glass bottle. One pump over food, once a day.',
  },
  'freeze-dried-chicken-hearts': {
    slug: 'freeze-dried-chicken-hearts',
    name: 'Freeze-Dried Chicken Heart Bites',
    category: 'Treat / topper',
    short: 'One ingredient. Freeze-dried chicken heart, crumbled over a meal or given as a treat.',
  },
  'matcha-tofu-litter': {
    slug: 'matcha-tofu-litter',
    name: 'Matcha Green Tea Tofu Litter',
    category: 'Litter',
    short: 'Plant-based tofu pellets scented softly with matcha. Low dust, clumping.',
  },
  'stainless-oak-litter-basin': {
    slug: 'stainless-oak-litter-basin',
    name: 'The Neko Stainless & Oak Litter Basin',
    category: 'Litter + Hardware',
    short: 'A brushed stainless basin in a solid oak frame, with a matching scoop.',
  },
  'tilted-ceramic-whisker-bowl': {
    slug: 'tilted-ceramic-whisker-bowl',
    name: 'Tilted Ceramic Whisker-Relief Bowl',
    category: 'Hardware',
    short: 'A shallow, tilted ceramic bowl in an ash stand, shaped so whiskers stay clear of the rim.',
  },
  'ceramic-water-fountain': {
    slug: 'ceramic-water-fountain',
    name: 'Whisper-Quiet Ceramic Water Fountain',
    category: 'Hardware',
    short: 'A glazed ceramic fountain with a quiet pump, to encourage drinking.',
  },
  'sisal-birch-scratcher': {
    slug: 'sisal-birch-scratcher',
    name: 'Architectural Sisal & Birch Scratcher',
    category: 'Hardware',
    short: 'A tall sisal-wrapped column on a solid birch base.',
  },
}

export function isProductSlug(slug: string | undefined): slug is ProductSlug {
  if (!slug) return false
  return (PRODUCT_SLUGS as readonly string[]).includes(slug)
}
