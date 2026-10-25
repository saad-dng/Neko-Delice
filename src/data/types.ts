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

export type PlannerLifeStage = 'kitten' | 'adult' | 'senior'

export type PlannerActivity = 'lounger' | 'explorer' | 'high-energy'

export type PlannerHealthFocus =
  | 'none'
  | 'urinary-care'
  | 'hairball-control'
  | 'sensitive-stomach'
  | 'coat-shine'

export type PlannerStep = '1' | '2' | '3' | '4' | 'result'

export interface CatProfile {
  name: string
  stage: PlannerLifeStage
  neutered: boolean
  weightKg: number
  activity: PlannerActivity
  healthFocus: PlannerHealthFocus
}

export interface BundleLine {
  productId: string
  qty: number
  dailyAmount: number
  unit: string
  supplyDays: number | null
  price: number
  unitPrice?: number
  suggested?: boolean
  checked?: boolean
}

export interface BundleResult {
  profile: CatProfile
  rer: number
  mer: number
  topperKcal: number
  foodKcal: number
  wetKcal: number
  dryKcal: number
  wetSachetsPerDay: number
  dryGramsPerDay: number
  topperPumpsPerDay: number
  lines: BundleLine[]
  totalPriceUSD: number
  minSupplyDays: number
}

export interface FeedingTableRow {
  weightKg: number
  rer: number
  mer: number
  dailyAmount: number
  dailyAmountExact: number
  unit: string
  supplyDays: number
}
