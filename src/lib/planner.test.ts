import { describe, expect, it } from 'vitest'
import { PLANNER_CONFIG } from '@/config/planner'
import {
  buildBundle,
  calcMER,
  calcRER,
  feedingTable,
  normalizeProfile,
  sizeBand,
  splitRatio,
  supplyDays,
} from './planner'
import { decodeProfile, encodeProfile } from './plan-url'
import type {
  CatProfile,
  PlannerActivity,
  PlannerHealthFocus,
  PlannerLifeStage,
  PlannerStep,
} from '@/data/types'

describe('Planner Engine (Pure Logic)', () => {
  describe('Golden Tests from neko-planner-logic', () => {
    it('Adult neutered, 4.5 kg, lounger -> RER ≈ 216.3, MER ≈ 233.6', () => {
      const profile: CatProfile = {
        name: 'Mochi',
        stage: 'adult',
        neutered: true,
        weightKg: 4.5,
        activity: 'lounger',
        healthFocus: 'none',
      }

      const rer = calcRER(profile.weightKg)
      const mer = calcMER(profile)

      expect(rer).toBeCloseTo(216.26, 1)
      expect(Math.round(rer * 10) / 10).toBe(216.3)

      expect(mer).toBeCloseTo(233.56, 1)
      expect(Math.round(mer * 10) / 10).toBe(233.6)
    })

    it('Same cat, focus sensitive-stomach -> 116.8 kcal wet/dry, ≈3.1 sachets/day -> 4 boxes (≈31 days), dry ≈30 g/day -> 1 bag (≈83 days)', () => {
      const profile: CatProfile = {
        name: 'Mochi',
        stage: 'adult',
        neutered: true,
        weightKg: 4.5,
        activity: 'lounger',
        healthFocus: 'sensitive-stomach',
      }

      const bundle = buildBundle(profile)

      expect(bundle.rer).toBe(216.3)
      expect(bundle.mer).toBe(233.6)
      expect(bundle.topperKcal).toBe(0)
      expect(bundle.wetKcal).toBe(116.8)
      expect(bundle.dryKcal).toBe(116.8)

      // Wet line: Product 02 (Wild Salmon & Quail Paté)
      const wetLine = bundle.lines.find((l) => l.productId === '02')
      expect(wetLine).toBeDefined()
      expect(wetLine?.dailyAmount).toBeCloseTo(3.1, 1)
      expect(wetLine?.qty).toBe(4) // 4 boxes = 96 sachets
      expect(wetLine?.supplyDays).toBe(31) // floor(96 / (116.78 / 38)) = 31

      // Dry line: Product 03 (Duck & Sweet Potato Kibble)
      const dryLine = bundle.lines.find((l) => l.productId === '03')
      expect(dryLine).toBeDefined()
      expect(dryLine?.dailyAmount).toBeCloseTo(29.9, 0) // ≈30 g/day
      expect(dryLine?.qty).toBe(1) // 1 bag = 2500 g
      expect(dryLine?.supplyDays).toBe(83) // floor(2500 / (116.78 / 3.9)) = 83

      // Direct supplyDays calls match the bundle
      expect(supplyDays('02', 4, profile)).toBe(31)
      expect(supplyDays('03', 1, profile)).toBe(83)
    })



    it('Kitten ignores neuter flag (neutered true/false gives identical MER)', () => {
      const intactKitten: CatProfile = {
        name: 'Leo',
        stage: 'kitten',
        neutered: false,
        weightKg: 2.5,
        activity: 'explorer',
        healthFocus: 'none',
      }

      const neuteredKitten: CatProfile = {
        ...intactKitten,
        neutered: true,
      }

      const intactMER = calcMER(intactKitten)
      const neuteredMER = calcMER(neuteredKitten)

      expect(intactMER).toBe(neuteredMER)
      expect(calcRER(2.5) * 2.5 * 1.0).toBeCloseTo(intactMER, 4)
    })

    it('Focus urinary-care -> 70/30 split and fountain suggested, unchecked', () => {
      const profile: CatProfile = {
        name: 'Milo',
        stage: 'adult',
        neutered: true,
        weightKg: 5.0,
        activity: 'lounger',
        healthFocus: 'urinary-care',
      }

      const split = splitRatio(profile)
      expect(split.wet).toBe(0.7)
      expect(split.dry).toBe(0.3)

      const bundle = buildBundle(profile)
      const fountainLine = bundle.lines.find((l) => l.productId === '09')
      expect(fountainLine).toBeDefined()
      expect(fountainLine?.suggested).toBe(true)
      expect(fountainLine?.checked).toBe(false)
      expect(fountainLine?.supplyDays).toBeNull()

      // Fountain should NOT be added for other focuses
      const normalBundle = buildBundle({ ...profile, healthFocus: 'none' })
      expect(normalBundle.lines.some((l) => l.productId === '09')).toBe(false)
    })

    it('Kitten + urinary-care gives 70/30 (urinary care wins over kitten 60/40)', () => {
      const profile: CatProfile = {
        name: 'Tiny',
        stage: 'kitten',
        neutered: true,
        weightKg: 2.0,
        activity: 'explorer',
        healthFocus: 'urinary-care',
      }

      const split = splitRatio(profile)
      expect(split.wet).toBe(0.7)
      expect(split.dry).toBe(0.3)
    })

    it('Focus coat-shine -> bottle of product 04 added; topper kcal <= 10% of MER and deducted from food', () => {
      const profile: CatProfile = {
        name: 'Silky',
        stage: 'adult',
        neutered: true,
        weightKg: 4.0,
        activity: 'explorer',
        healthFocus: 'coat-shine',
      }

      const bundle = buildBundle(profile)
      const oilLine = bundle.lines.find((l) => l.productId === '04')
      expect(oilLine).toBeDefined()
      expect(oilLine?.qty).toBe(1)
      expect(oilLine?.dailyAmount).toBe(1)
      expect(oilLine?.supplyDays).toBe(250)

      // Topper kcal deducted from food budget
      expect(bundle.topperKcal).toBe(9)
      expect(bundle.foodKcal).toBe(bundle.mer - bundle.topperKcal)
      expect(bundle.topperKcal).toBeLessThanOrEqual(bundle.mer * 0.1)

      // Hairball control also adds salmon oil
      const hairballBundle = buildBundle({
        ...profile,
        healthFocus: 'hairball-control',
      })
      expect(hairballBundle.lines.some((l) => l.productId === '04')).toBe(true)
      expect(hairballBundle.topperKcal).toBe(9)
    })

    it('Boxes always cover >= 30 days and are never 0', () => {
      // Test across extreme and typical profiles
      const weights = [1.5, 2.0, 4.5, 7.0, 10.0]
      const stages: PlannerLifeStage[] = ['kitten', 'adult', 'senior']

      for (const stage of stages) {
        for (const weightKg of weights) {
          const bundle = buildBundle({
            name: 'Test',
            stage,
            neutered: true,
            weightKg,
            activity: 'lounger',
            healthFocus: 'none',
          })

          const wetLine = bundle.lines.find(
            (l) => l.productId === '01' || l.productId === '02',
          )
          const dryLine = bundle.lines.find((l) => l.productId === '03')

          expect(wetLine?.qty).toBeGreaterThanOrEqual(1)
          expect(wetLine?.supplyDays).toBeGreaterThanOrEqual(30)

          expect(dryLine?.qty).toBeGreaterThanOrEqual(1)
          expect(dryLine?.supplyDays).toBeGreaterThanOrEqual(30)
        }
      }
    })
  })

  describe('Validation, Clamping & Normalization', () => {
    it('Weight 1.5 and 10.0 are valid boundary values', () => {
      const pMin = normalizeProfile({ weightKg: 1.5 })
      expect(pMin.weightKg).toBe(1.5)

      const pMax = normalizeProfile({ weightKg: 10.0 })
      expect(pMax.weightKg).toBe(10.0)
    })

    it('Weight 1.4 clamps to 1.5; weight 10.1 clamps to 10.0', () => {
      const pUnder = normalizeProfile({ weightKg: 1.4 })
      expect(pUnder.weightKg).toBe(1.5)

      const pOver = normalizeProfile({ weightKg: 10.1 })
      expect(pOver.weightKg).toBe(10.0)

      const pExtremeLow = normalizeProfile({ weightKg: -5 })
      expect(pExtremeLow.weightKg).toBe(1.5)

      const pExtremeHigh = normalizeProfile({ weightKg: 99 })
      expect(pExtremeHigh.weightKg).toBe(10.0)
    })

    it('NaN, string "abc", and missing values fall back to defaults', () => {
      const pNaN = normalizeProfile({ weightKg: NaN })
      expect(pNaN.weightKg).toBe(PLANNER_CONFIG.weight.default)

      const pStr = normalizeProfile({
        weightKg: 'abc' as unknown as number,
      })
      expect(pStr.weightKg).toBe(PLANNER_CONFIG.weight.default)

      const pNull = normalizeProfile(null)
      expect(pNull).toEqual(PLANNER_CONFIG.defaultProfile)

      const pUndefined = normalizeProfile(undefined)
      expect(pUndefined).toEqual(PLANNER_CONFIG.defaultProfile)
    })

    it('Name is trimmed and capped at maxNameLength (24 chars)', () => {
      const p1 = normalizeProfile({ name: '   Mochi   ' })
      expect(p1.name).toBe('Mochi')

      const longName = 'Sir Reginald Whiskerbottom III of Sussex'
      const p2 = normalizeProfile({ name: longName })
      expect(p2.name).toHaveLength(24)
      expect(p2.name).toBe(longName.slice(0, 24))
    })

    it('Invalid enum values fall back to defaults safely', () => {
      const invalid = normalizeProfile({
        stage: 'mythical' as unknown as PlannerLifeStage,
        activity: 'supersonic' as unknown as PlannerActivity,
        healthFocus: 'wings' as unknown as PlannerHealthFocus,
      })
      expect(invalid.stage).toBe('adult')
      expect(invalid.activity).toBe('lounger')
      expect(invalid.healthFocus).toBe('none')
    })
  })

  describe('Size Bands', () => {
    it('correctly classifies Petite (< 3.5 kg), Typical (3.5 - 6.0 kg), and Large (> 6.0 kg)', () => {
      expect(sizeBand(2.0)).toBe('Petite')
      expect(sizeBand(3.4)).toBe('Petite')
      expect(sizeBand(3.5)).toBe('Typical')
      expect(sizeBand(4.5)).toBe('Typical')
      expect(sizeBand(6.0)).toBe('Typical')
      expect(sizeBand(6.1)).toBe('Large')
      expect(sizeBand(8.5)).toBe('Large')
    })
  })

  describe('supplyDays calculations', () => {
    it('returns null for hardware (ceramic fountain, bowls, scoop)', () => {
      expect(supplyDays('07', 1)).toBeNull()
      expect(supplyDays('08', 1)).toBeNull()
      expect(supplyDays('09', 1)).toBeNull()
      expect(supplyDays('10', 1)).toBeNull()
    })

    it('returns 30 days per bag for litter (Product 06)', () => {
      expect(supplyDays('06', 1)).toBe(30)
      expect(supplyDays('06', 2)).toBe(60)
    })

    it('returns 0 if quantity is zero or negative', () => {
      expect(supplyDays('02', 0)).toBe(0)
      expect(supplyDays('02', -1)).toBe(0)
    })

    it('uses reference cat if no profile provided for food items', () => {
      const days = supplyDays('02', 4)
      // Reference cat is 4.5 kg neutered adult lounger: 4 boxes = 31 days
      expect(days).toBe(31)
    })
  })

  describe('feedingTable Guide', () => {
    it('returns rows for weights 2, 3, 4, 5, 6, 8, 10 kg for food items', () => {
      const tableWet = feedingTable('02')
      expect(tableWet).toHaveLength(7)
      expect(tableWet.map((r) => r.weightKg)).toEqual([2, 3, 4, 5, 6, 8, 10])
      expect(tableWet[0]?.unit).toBe('sachets/day')
      expect(tableWet[0]?.dailyAmount).toBeGreaterThan(0)
      expect(tableWet[0]?.supplyDays).toBeGreaterThan(0)

      const tableDry = feedingTable('03')
      expect(tableDry).toHaveLength(7)
      expect(tableDry[0]?.unit).toBe('g/day')
    })

    it('uses kitten factor (2.5) for kitten mousse (Product 01)', () => {
      const tableKitten = feedingTable('01')
      const tableAdult = feedingTable('02')

      // A 2 kg kitten requires more calories than a 2 kg adult
      expect(tableKitten[0]?.mer).toBeGreaterThan(tableAdult[0]?.mer ?? 0)
    })


    it('returns empty array for non-food hardware/litter products', () => {
      expect(feedingTable('06')).toEqual([])
      expect(feedingTable('07')).toEqual([])
      expect(feedingTable('09')).toEqual([])
      expect(feedingTable('non-existent')).toEqual([])
    })
  })

  describe('URL Contract & Round-Trip Serialization', () => {
    it('encodes and decodes according to the skill contract', () => {
      const profile: CatProfile = {
        name: 'Mochi',
        stage: 'adult',
        neutered: true,
        weightKg: 4.5,
        activity: 'lounger',
        healthFocus: 'sensitive-stomach',
      }

      const queryString = encodeProfile(profile, '3')
      expect(queryString).toBe(
        'name=Mochi&stage=adult&neutered=1&w=4.5&act=lounger&focus=sensitive-stomach&step=3',
      )

      const decoded = decodeProfile(queryString)
      expect(decoded.profile).toEqual(profile)
      expect(decoded.step).toBe('3')
    })

    it('handles &step=result correctly', () => {
      const profile: CatProfile = {
        name: 'Luna',
        stage: 'senior',
        neutered: false,
        weightKg: 3.8,
        activity: 'explorer',
        healthFocus: 'coat-shine',
      }

      const url = `/meal-plan?${encodeProfile(profile, 'result')}`
      const decoded = decodeProfile(url)

      expect(decoded.profile).toEqual(profile)
      expect(decoded.step).toBe('result')
    })

    it('URL round-trip equals original for 50 random valid profiles', () => {
      const stages: PlannerLifeStage[] = ['kitten', 'adult', 'senior']
      const activities: PlannerActivity[] = [
        'lounger',
        'explorer',
        'high-energy',
      ]
      const focuses: PlannerHealthFocus[] = [
        'none',
        'urinary-care',
        'hairball-control',
        'sensitive-stomach',
        'coat-shine',
      ]
      const steps: PlannerStep[] = ['1', '2', '3', '4', 'result']
      const names = ['Mochi', 'Luna', 'Simba', 'Oliver', 'Milo', 'Cleo', '']

      for (let i = 0; i < 50; i++) {
        const original: CatProfile = {
          name: names[i % names.length]!,
          stage: stages[i % stages.length]!,
          neutered: i % 2 === 0,
          weightKg: Math.round((1.5 + (i * 0.17) % 8.5) * 10) / 10,
          activity: activities[i % activities.length]!,
          healthFocus: focuses[i % focuses.length]!,
        }
        const step = steps[i % steps.length]!

        const encoded = encodeProfile(original, step)
        const { profile: decoded, step: decodedStep } = decodeProfile(encoded)

        expect(decoded).toEqual(original)
        expect(decodedStep).toBe(step)
      }

    })

    it('garbage query string never throws and falls back to defaults', () => {
      const garbageCases = [
        '',
        '???',
        'something-random',
        '!@#$%^&*()_+{}|:"<>?',
        'name=VeryLongNameExceedingTwentyFourCharactersInTotal&stage=martian&neutered=maybe&w=abc&act=lightning&focus=magic&step=99',
        '/meal-plan?w=999.9&neutered=invalid&stage=123',
        'w=-50&neutered=0',
      ]

      for (const query of garbageCases) {
        expect(() => {
          const { profile, step } = decodeProfile(query)
          expect(profile).toBeDefined()
          expect(profile.weightKg).toBeGreaterThanOrEqual(1.5)
          expect(profile.weightKg).toBeLessThanOrEqual(10.0)
          expect(profile.name.length).toBeLessThanOrEqual(24)
          expect(step).toBeDefined()
        }).not.toThrow()
      }
    })
  })
})
