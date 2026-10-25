import { NUTRITION_CONFIG } from '@/config/nutrition'
import { PLANNER_CONFIG } from '@/config/planner'
import { products } from '@/data/products'
import type {
  BundleLine,
  BundleResult,
  CatProfile,
  FeedingTableRow,
  PlannerActivity,
  PlannerHealthFocus,
  PlannerLifeStage,
} from '@/data/types'

/**
 * Validates, clamps, and fills defaults for a given cat profile.
 * Never throws and never returns NaN or infinite values.
 */
export function normalizeProfile(raw?: Partial<CatProfile> | null): CatProfile {
  const defaults = PLANNER_CONFIG.defaultProfile

  if (!raw) {
    return { ...defaults }
  }

  // Name: trimmed, capped at maxNameLength
  const name =
    typeof raw.name === 'string'
      ? raw.name.trim().slice(0, PLANNER_CONFIG.maxNameLength)
      : defaults.name

  // Stage: kitten | adult | senior
  const stage: PlannerLifeStage =
    raw.stage === 'kitten' || raw.stage === 'adult' || raw.stage === 'senior'
      ? raw.stage
      : defaults.stage

  // Neutered: boolean or '0' / '1'
  let neutered: boolean
  if (typeof raw.neutered === 'boolean') {
    neutered = raw.neutered
  } else if ((raw.neutered as unknown) === '1' || (raw.neutered as unknown) === 1) {
    neutered = true
  } else if ((raw.neutered as unknown) === '0' || (raw.neutered as unknown) === 0) {
    neutered = false
  } else {
    neutered = defaults.neutered
  }

  // Weight: parse, clamp to [min, max], round to 1 decimal place
  let weightNum: number
  if (typeof raw.weightKg === 'number') {
    weightNum = raw.weightKg
  } else if (typeof raw.weightKg === 'string') {
    weightNum = parseFloat(raw.weightKg)
  } else {
    weightNum = defaults.weightKg
  }

  if (isNaN(weightNum) || !isFinite(weightNum)) {
    weightNum = defaults.weightKg
  }

  const clampedWeight = Math.max(
    PLANNER_CONFIG.weight.min,
    Math.min(PLANNER_CONFIG.weight.max, weightNum),
  )
  const weightKg = Math.round(clampedWeight * 10) / 10

  // Activity: lounger | explorer | high-energy
  const activity: PlannerActivity =
    raw.activity && raw.activity in PLANNER_CONFIG.activityMultipliers
      ? raw.activity
      : defaults.activity

  // Health focus: none | urinary-care | hairball-control | sensitive-stomach | coat-shine
  const validFocuses: readonly PlannerHealthFocus[] = [
    'none',
    'urinary-care',
    'hairball-control',
    'sensitive-stomach',
    'coat-shine',
  ]
  const healthFocus: PlannerHealthFocus =
    raw.healthFocus && validFocuses.includes(raw.healthFocus)
      ? raw.healthFocus
      : defaults.healthFocus

  return {
    name,
    stage,
    neutered,
    weightKg,
    activity,
    healthFocus,
  }
}

/**
 * Resting Energy Requirement (RER) in kcal/day:
 * RER = 70 × W^0.75
 * Clamps weight to [1.5, 10.0] kg.
 */
export function calcRER(weightKg: number): number {
  const w =
    isNaN(weightKg) || !isFinite(weightKg)
      ? PLANNER_CONFIG.weight.default
      : Math.max(
          PLANNER_CONFIG.weight.min,
          Math.min(PLANNER_CONFIG.weight.max, weightKg),
        )

  return PLANNER_CONFIG.rerFactor * Math.pow(w, PLANNER_CONFIG.rerExponent)
}

/**
 * Maintenance Energy Requirement (MER) in kcal/day:
 * MER = RER × F_life × F_activity
 * For kittens, neuter status is ignored.
 */
export function calcMER(profile: CatProfile): number {
  const p = normalizeProfile(profile)
  const rer = calcRER(p.weightKg)

  let fLife: number
  if (p.stage === 'kitten') {
    fLife = PLANNER_CONFIG.lifeFactors.kitten
  } else if (p.stage === 'adult') {
    fLife = p.neutered
      ? PLANNER_CONFIG.lifeFactors.adult.neutered
      : PLANNER_CONFIG.lifeFactors.adult.intact
  } else {
    fLife = p.neutered
      ? PLANNER_CONFIG.lifeFactors.senior.neutered
      : PLANNER_CONFIG.lifeFactors.senior.intact
  }

  const fActivity =
    PLANNER_CONFIG.activityMultipliers[p.activity] ??
    PLANNER_CONFIG.activityMultipliers.lounger

  return rer * fLife * fActivity
}

/**
 * Ratio of wet vs dry food calories.
 * Adult & Senior: 50% wet / 50% dry
 * Kitten: 60% wet / 40% dry
 * Urinary Care: 70% wet / 30% dry (takes precedence over kitten)
 */
export function splitRatio(profile: CatProfile): { wet: number; dry: number } {
  const p = normalizeProfile(profile)

  if (p.healthFocus === 'urinary-care') {
    return PLANNER_CONFIG.splits.urinaryCare
  }

  if (p.stage === 'kitten') {
    return PLANNER_CONFIG.splits.kitten
  }

  return PLANNER_CONFIG.splits.defaultAdultSenior
}

/**
 * Size band categorization based on weight.
 * Indicator only, not a veterinary body condition score.
 */
export function sizeBand(weightKg: number): 'Petite' | 'Typical' | 'Large' {
  const w =
    isNaN(weightKg) || !isFinite(weightKg)
      ? PLANNER_CONFIG.weight.default
      : weightKg

  if (w < PLANNER_CONFIG.sizeBands.petiteMax) {
    return 'Petite'
  }
  if (w <= PLANNER_CONFIG.sizeBands.typicalMax) {
    return 'Typical'
  }
  return 'Large'
}

/**
 * Helper to find a product by ID or slug.
 */
function getProductByIdOrSlug(idOrSlug: string) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
}

/**
 * Computes how many days a given quantity of a product will last.
 * Returns null for hardware items ("One-time purchase").
 * Returns a fixed estimate (30 days/bag) for litter.
 */
export function supplyDays(
  productId: string,
  qty: number,
  profile?: CatProfile,
): number | null {
  if (qty <= 0) return 0

  const product = getProductByIdOrSlug(productId)
  if (!product) return null

  // Hardware items have no consumable supply duration
  if (
    product.category === 'hardware' ||
    product.unit.type === 'hardware' ||
    productId === PLANNER_CONFIG.products.waterFountain
  ) {
    return null
  }

  // Litter (consumable): 30 days per bag
  if (product.unit.type === 'litter' || product.category === 'litter') {
    return qty * NUTRITION_CONFIG.litter.estimatedDaysPerCat
  }

  // Treats & Toppers
  if (productId === PLANNER_CONFIG.products.salmonOil) {
    // 1 pump/day from 250 pumps bottle
    return qty * NUTRITION_CONFIG.treats.salmonOilTotalPumps
  }

  if (product.id === '05') {
    // Freeze-dried chicken hearts
    const prof = normalizeProfile(profile ?? PLANNER_CONFIG.referenceCat)
    const mer = calcMER(prof)
    const dailyTreatKcal = mer * PLANNER_CONFIG.maxTopperCalorieFraction
    const dailyGrams =
      dailyTreatKcal / NUTRITION_CONFIG.treats.chickenHeartsKcalPerGram
    const totalGrams = qty * NUTRITION_CONFIG.treats.chickenHeartsBagGrams
    return dailyGrams > 0 ? Math.floor(totalGrams / dailyGrams) : null
  }

  // Food calculation
  const isKittenProduct = productId === PLANNER_CONFIG.products.kittenWet
  const prof = normalizeProfile(
    profile ??
      (isKittenProduct
        ? { ...PLANNER_CONFIG.referenceCat, stage: 'kitten' }
        : PLANNER_CONFIG.referenceCat),
  )

  const mer = calcMER(prof)
  const hasTopper =
    prof.healthFocus === 'coat-shine' || prof.healthFocus === 'hairball-control'
  const topperKcal = hasTopper
    ? Math.min(
        NUTRITION_CONFIG.treats.salmonOilKcalPerPump,
        mer * PLANNER_CONFIG.maxTopperCalorieFraction,
      )
    : 0
  const foodKcal = mer - topperKcal
  const split = splitRatio(prof)

  if (
    productId === PLANNER_CONFIG.products.kittenWet ||
    productId === PLANNER_CONFIG.products.adultSeniorWet
  ) {
    const wetKcal = foodKcal * split.wet
    const kcalPerSachet =
      productId === PLANNER_CONFIG.products.kittenWet
        ? NUTRITION_CONFIG.wetFood.kittenMousseKcalPerSachet
        : NUTRITION_CONFIG.wetFood.salmonQuailPateKcalPerSachet
    const dailySachets = wetKcal / kcalPerSachet
    const totalSachets = qty * NUTRITION_CONFIG.wetFood.sachetsPerCarton
    return dailySachets > 0 ? Math.floor(totalSachets / dailySachets) : 0
  }

  if (productId === PLANNER_CONFIG.products.dryKibble) {
    const dryKcal = foodKcal * split.dry
    const dailyGrams = dryKcal / NUTRITION_CONFIG.dryFood.kibbleKcalPerGram
    const totalGrams = qty * NUTRITION_CONFIG.dryFood.bagGrams
    return dailyGrams > 0 ? Math.floor(totalGrams / dailyGrams) : 0
  }

  return null
}

/**
 * Builds the complete monthly nutrition bundle for a profiled cat.
 */
export function buildBundle(profile: CatProfile): BundleResult {
  const p = normalizeProfile(profile)
  const rer = calcRER(p.weightKg)
  const mer = calcMER(p)

  // 1. Treat / topper budget (Coat Shine or Hairball Control adds salmon oil)
  const needsOil =
    p.healthFocus === 'coat-shine' || p.healthFocus === 'hairball-control'
  const maxTopperKcal = mer * PLANNER_CONFIG.maxTopperCalorieFraction
  const topperKcal = needsOil
    ? Math.min(NUTRITION_CONFIG.treats.salmonOilKcalPerPump, maxTopperKcal)
    : 0
  const topperPumpsPerDay = needsOil ? 1 : 0

  // 2. Food budget (topper deducted from daily calories)
  const foodKcal = mer - topperKcal

  // 3. Wet/dry split
  const split = splitRatio(p)
  const wetKcal = foodKcal * split.wet
  const dryKcal = foodKcal * split.dry

  // 4. Products selection
  const wetProductId =
    p.stage === 'kitten'
      ? PLANNER_CONFIG.products.kittenWet
      : PLANNER_CONFIG.products.adultSeniorWet
  const dryProductId = PLANNER_CONFIG.products.dryKibble

  const wetProduct = getProductByIdOrSlug(wetProductId)!
  const dryProduct = getProductByIdOrSlug(dryProductId)!

  const kcalPerSachet =
    p.stage === 'kitten'
      ? NUTRITION_CONFIG.wetFood.kittenMousseKcalPerSachet
      : NUTRITION_CONFIG.wetFood.salmonQuailPateKcalPerSachet
  const kcalPerGram = NUTRITION_CONFIG.dryFood.kibbleKcalPerGram

  // 5. Daily amounts
  const wetSachetsPerDay = wetKcal / kcalPerSachet
  const dryGramsPerDay = dryKcal / kcalPerGram

  // 6. Packaging quantities for target days (minimum 1, covers at least 30 days)
  const wetBoxes = Math.max(
    1,
    Math.ceil(
      (PLANNER_CONFIG.daysTarget * wetSachetsPerDay) /
        NUTRITION_CONFIG.wetFood.sachetsPerCarton,
    ),
  )
  const dryBags = Math.max(
    1,
    Math.ceil(
      (PLANNER_CONFIG.daysTarget * dryGramsPerDay) /
        NUTRITION_CONFIG.dryFood.bagGrams,
    ),
  )

  // 7. Supply durations
  const totalWetSachets = wetBoxes * NUTRITION_CONFIG.wetFood.sachetsPerCarton
  const wetSupplyDays = Math.floor(totalWetSachets / wetSachetsPerDay)

  const totalDryGrams = dryBags * NUTRITION_CONFIG.dryFood.bagGrams
  const drySupplyDays = Math.floor(totalDryGrams / dryGramsPerDay)

  const lines: BundleLine[] = [
    {
      productId: wetProductId,
      qty: wetBoxes,
      dailyAmount: Math.round(wetSachetsPerDay * 10) / 10,
      unit: 'sachets/day',
      supplyDays: wetSupplyDays,
      price: wetProduct.priceUSD * wetBoxes,
      unitPrice: wetProduct.priceUSD,
      suggested: true,
      checked: true,
    },
    {
      productId: dryProductId,
      qty: dryBags,
      dailyAmount: Math.round(dryGramsPerDay * 10) / 10,
      unit: 'g/day',
      supplyDays: drySupplyDays,
      price: dryProduct.priceUSD * dryBags,
      unitPrice: dryProduct.priceUSD,
      suggested: true,
      checked: true,
    },
  ]

  // Add Norwegian Salmon Oil if indicated
  if (needsOil) {
    const oilProduct = getProductByIdOrSlug(PLANNER_CONFIG.products.salmonOil)!
    const oilSupplyDays = Math.floor(
      NUTRITION_CONFIG.treats.salmonOilTotalPumps / topperPumpsPerDay,
    )
    lines.push({
      productId: PLANNER_CONFIG.products.salmonOil,
      qty: 1,
      dailyAmount: topperPumpsPerDay,
      unit: 'pump/day',
      supplyDays: oilSupplyDays,
      price: oilProduct.priceUSD,
      unitPrice: oilProduct.priceUSD,
      suggested: true,
      checked: true,
    })
  }

  // Add Ceramic Water Fountain as suggested (unchecked) for urinary care
  if (p.healthFocus === 'urinary-care') {
    const fountainProduct = getProductByIdOrSlug(
      PLANNER_CONFIG.products.waterFountain,
    )!
    lines.push({
      productId: PLANNER_CONFIG.products.waterFountain,
      qty: 1,
      dailyAmount: 0,
      unit: 'unit',
      supplyDays: null,
      price: fountainProduct.priceUSD,
      unitPrice: fountainProduct.priceUSD,
      suggested: true,
      checked: false,
    })
  }

  const totalPriceUSD = lines
    .filter((l) => l.checked !== false)
    .reduce((sum, l) => sum + l.price, 0)

  const minSupplyDays = Math.min(wetSupplyDays, drySupplyDays)

  return {
    profile: p,
    rer: Math.round(rer * 10) / 10,
    mer: Math.round(mer * 10) / 10,
    topperKcal: Math.round(topperKcal * 10) / 10,
    foodKcal: Math.round(foodKcal * 10) / 10,
    wetKcal: Math.round(wetKcal * 10) / 10,
    dryKcal: Math.round(dryKcal * 10) / 10,
    wetSachetsPerDay: Math.round(wetSachetsPerDay * 10) / 10,
    dryGramsPerDay: Math.round(dryGramsPerDay * 10) / 10,
    topperPumpsPerDay,
    lines,
    totalPriceUSD,
    minSupplyDays,
  }
}

/**
 * Generates the feeding guide table for a food item across standard cat weights.
 * Evaluates for weights: 2, 3, 4, 5, 6, 8, 10 kg.
 * Kitten products use kitten factor (2.5); adult/other foods use neutered adult lounger reference.
 */
export function feedingTable(productId: string): FeedingTableRow[] {
  const product = getProductByIdOrSlug(productId)
  if (!product) return []

  // Non-food items do not have feeding guides
  if (
    product.category === 'hardware' ||
    product.unit.type === 'hardware' ||
    product.category === 'litter' ||
    product.unit.type === 'litter' ||
    productId === PLANNER_CONFIG.products.waterFountain
  ) {
    return []
  }

  const isKitten = productId === PLANNER_CONFIG.products.kittenWet

  return PLANNER_CONFIG.feedingTableWeights.map((weightKg) => {
    const prof: CatProfile = {
      name: 'reference',
      stage: isKitten ? 'kitten' : 'adult',
      neutered: true,
      weightKg,
      activity: 'lounger',
      healthFocus: 'none',
    }

    const rer = calcRER(weightKg)
    const mer = calcMER(prof)
    const split = splitRatio(prof)

    if (productId === PLANNER_CONFIG.products.kittenWet) {
      const wetKcal = mer * split.wet
      const dailySachets =
        wetKcal / NUTRITION_CONFIG.wetFood.kittenMousseKcalPerSachet
      return {
        weightKg,
        rer: Math.round(rer * 10) / 10,
        mer: Math.round(mer * 10) / 10,
        dailyAmount: Math.round(dailySachets * 10) / 10,
        dailyAmountExact: dailySachets,
        unit: 'sachets/day',
        supplyDays: Math.floor(
          NUTRITION_CONFIG.wetFood.sachetsPerCarton / dailySachets,
        ),
      }
    }

    if (productId === PLANNER_CONFIG.products.adultSeniorWet) {
      const wetKcal = mer * split.wet
      const dailySachets =
        wetKcal / NUTRITION_CONFIG.wetFood.salmonQuailPateKcalPerSachet
      return {
        weightKg,
        rer: Math.round(rer * 10) / 10,
        mer: Math.round(mer * 10) / 10,
        dailyAmount: Math.round(dailySachets * 10) / 10,
        dailyAmountExact: dailySachets,
        unit: 'sachets/day',
        supplyDays: Math.floor(
          NUTRITION_CONFIG.wetFood.sachetsPerCarton / dailySachets,
        ),
      }
    }

    if (productId === PLANNER_CONFIG.products.dryKibble) {
      const dryKcal = mer * split.dry
      const dailyGrams = dryKcal / NUTRITION_CONFIG.dryFood.kibbleKcalPerGram
      return {
        weightKg,
        rer: Math.round(rer * 10) / 10,
        mer: Math.round(mer * 10) / 10,
        dailyAmount: Math.round(dailyGrams * 10) / 10,
        dailyAmountExact: dailyGrams,
        unit: 'g/day',
        supplyDays: Math.floor(NUTRITION_CONFIG.dryFood.bagGrams / dailyGrams),
      }
    }

    if (productId === PLANNER_CONFIG.products.salmonOil) {
      return {
        weightKg,
        rer: Math.round(rer * 10) / 10,
        mer: Math.round(mer * 10) / 10,
        dailyAmount: 1,
        dailyAmountExact: 1,
        unit: 'pump/day',
        supplyDays: NUTRITION_CONFIG.treats.salmonOilTotalPumps,
      }
    }

    // Product 05: freeze-dried chicken hearts
    const treatKcal = mer * PLANNER_CONFIG.maxTopperCalorieFraction
    const dailyGrams =
      treatKcal / NUTRITION_CONFIG.treats.chickenHeartsKcalPerGram
    return {
      weightKg,
      rer: Math.round(rer * 10) / 10,
      mer: Math.round(mer * 10) / 10,
      dailyAmount: Math.round(dailyGrams * 10) / 10,
      dailyAmountExact: dailyGrams,
      unit: 'g/day',
      supplyDays: Math.floor(
        NUTRITION_CONFIG.treats.chickenHeartsBagGrams / dailyGrams,
      ),
    }
  })
}
