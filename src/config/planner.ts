import type {
  PlannerActivity,
  PlannerHealthFocus,
  PlannerLifeStage,
  CatProfile,
} from '@/data/types'

/**
 * Planner Configuration & Mathematical Factors
 *
 * Source: docs/PRD.md section 5.1 and .agents/skills/neko-planner-logic/SKILL.md
 */

export const PLANNER_CONFIG = {
  // Weight limits in kg
  weight: {
    min: 1.5,
    max: 10.0,
    step: 0.1,
    default: 4.5,
  },

  // RER multiplier: RER = 70 × W^0.75
  rerFactor: 70,
  rerExponent: 0.75,

  // Life-stage factors (F_life)
  // For kittens, neuter status is ignored.
  lifeFactors: {
    kitten: 2.5,
    adult: {
      neutered: 1.2,
      intact: 1.4,
    },
    senior: {
      neutered: 1.1,
      intact: 1.3,
    },
  },

  // Activity multipliers (F_activity)
  activityMultipliers: {
    lounger: 0.9, // Indoor Lounger
    explorer: 1.0, // Playful Explorer
    'high-energy': 1.15, // High-Energy
  } as Record<PlannerActivity, number>,

  // Food split ratios (wet / dry fraction of food calories)
  // Urinary Care shifts to 70/30 and wins over life-stage defaults.
  splits: {
    defaultAdultSenior: { wet: 0.5, dry: 0.5 },
    kitten: { wet: 0.6, dry: 0.4 },
    urinaryCare: { wet: 0.7, dry: 0.3 },
  },

  // Days target for a monthly bundle
  daysTarget: 30,

  // Treat / topper caloric cap
  maxTopperCalorieFraction: 0.1, // 10% of MER

  // Name constraints
  maxNameLength: 24,

  // Reference cat (used when no profile exists or for baseline PDP supply estimates)
  referenceCat: {
    name: 'your cat',
    stage: 'adult' as PlannerLifeStage,
    neutered: true,
    weightKg: 4.5,
    activity: 'lounger' as PlannerActivity,
    healthFocus: 'none' as PlannerHealthFocus,
  } satisfies CatProfile,

  referenceLabel: 'Based on a 4.5 kg neutered adult',

  // Default profile for the wizard
  defaultProfile: {
    name: '',
    stage: 'adult' as PlannerLifeStage,
    neutered: true,
    weightKg: 4.5,
    activity: 'lounger' as PlannerActivity,
    healthFocus: 'none' as PlannerHealthFocus,
  } satisfies CatProfile,

  // Size band thresholds (indicator only, not a body condition score)
  sizeBands: {
    petiteMax: 3.5, // < 3.5 kg
    typicalMax: 6.0, // 3.5 - 6.0 kg
    // > 6.0 kg is large
  },

  // Product IDs mapped to planner roles
  products: {
    kittenWet: '01',
    adultSeniorWet: '02',
    dryKibble: '03',
    salmonOil: '04',
    waterFountain: '09',
  },

  // Reference weights for the PDP feeding table guide (kg)
  feedingTableWeights: [2, 3, 4, 5, 6, 8, 10] as const,

  // Allowed wizard steps
  steps: ['1', '2', '3', '4', 'result'] as const,
} as const

