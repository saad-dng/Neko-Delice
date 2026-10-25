/**
 * Nutrition Constants & Energy Densities (Placeholders)
 *
 * All figures are based on approved pack specifications documented in PLAN.md
 * and docs/CONTENT.md. They serve as the single source of truth for the calorie
 * planner and product detail calculations.
 */

export const NUTRITION_CONFIG = {
  // Wet Food Format: 24 stick sachets × 40 g per carton
  wetFood: {
    sachetGrams: 40,
    sachetsPerCarton: 24,
    // Product 01: Kitten Growth Mousse & Broth
    kittenMousseKcalPerSachet: 45, // ≈1.12 kcal/g
    // Product 02: Wild Salmon & Quail Paté
    salmonQuailPateKcalPerSachet: 38, // ≈0.94 kcal/g
  },

  // Dry Food Format: Oven-Baked Duck & Sweet Potato Kibble
  dryFood: {
    kibbleKcalPerGram: 3.9,
    bagGrams: 2500, // 2.5 kg
    totalBagKcal: 9750, // 2,500 g × 3.9 kcal/g
  },

  // Treats & Toppers
  treats: {
    // Product 04: Pure Norwegian Salmon Oil
    salmonOilKcalPerPump: 9, // 1 pump ≈ 1 ml
    salmonOilTotalPumps: 250, // 250 ml amber bottle
    // Product 05: Freeze-Dried Chicken Heart Bites
    chickenHeartsKcalPerGram: 4.0,
    chickenHeartsBagGrams: 100, // 100 g paper pouch
    chickenHeartsTotalKcal: 400,
    // Maximum percentage of daily caloric budget for treats & toppers
    maxDailyCalorieFraction: 0.1, // 10%
  },

  // Litter
  litter: {
    bagKg: 5.4,
    estimatedDaysPerCat: 30, // Approx 30 days for one cat
  },
} as const
