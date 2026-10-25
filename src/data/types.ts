export type ProductCategory =
  | 'wet-food'
  | 'dry-food'
  | 'treat-topper'
  | 'litter'
  | 'hardware'

export type LifeStage = 'kitten' | 'adult' | 'senior' | 'all-stages'

export type HealthGoal =
  | 'urinary-care'
  | 'hairball-control'
  | 'sensitive-stomach'
  | 'coat-shine'

export type ProductAccent = 'sage' | 'terracotta' | 'ochre' | 'oak' | 'matcha'

export type UnitType =
  | 'sachet'
  | 'bag'
  | 'bottle'
  | 'pouch'
  | 'litter'
  | 'hardware'

export interface ProductUnit {
  type: UnitType
  countPerPack?: number
  gramsPerUnit?: number
  kcalPerUnit?: number
  kcalPerGram?: number
  packSizeLabel: string
}

export interface Product {
  id: string
  slug: string
  name: string
  short: string
  category: ProductCategory
  secondaryCategories: ProductCategory[]
  lifeStages: LifeStage[]
  healthGoals: HealthGoal[]
  priceUSD: number
  unit: ProductUnit
  accent: ProductAccent
  ingredients: string[]
  analysis: Record<string, string>
  specs: Record<string, string>
  goalNotes: Partial<Record<HealthGoal, string>>
  feedingNote?: string
  related: string[]
}

export type Currency = 'USD' | 'BDT'
