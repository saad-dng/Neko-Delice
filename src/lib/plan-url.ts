import { PLANNER_CONFIG } from '@/config/planner'
import type { CatProfile, PlannerStep } from '@/data/types'
import { normalizeProfile } from './planner'

/**
 * Serializes a cat profile (and optional step) into a URL query string
 * adhering strictly to the /meal-plan URL contract.
 *
 * Example output:
 * "name=Mochi&stage=adult&neutered=1&w=4.5&act=lounger&focus=sensitive-stomach&step=3"
 */
export function encodeProfile(
  profile: CatProfile,
  step?: PlannerStep | string,
): string {
  const p = normalizeProfile(profile)
  const params = new URLSearchParams()

  if (p.name) {
    params.set('name', p.name)
  }
  params.set('stage', p.stage)
  params.set('neutered', p.neutered ? '1' : '0')
  params.set('w', p.weightKg.toString())
  params.set('act', p.activity)
  params.set('focus', p.healthFocus)

  if (step) {
    const validSteps = PLANNER_CONFIG.steps as readonly string[]
    if (validSteps.includes(step)) {
      params.set('step', step)
    }
  }

  return params.toString()
}

/**
 * Deserializes URL search parameters or a full path/query string into
 * a validated CatProfile and PlannerStep.
 *
 * Falls back to defaults for any missing or invalid query values.
 * Never throws on malformed or garbage input.
 */
export function decodeProfile(
  searchParams?: string | URLSearchParams | null,
): {
  profile: CatProfile
  step: PlannerStep
} {
  const defaults = PLANNER_CONFIG.defaultProfile

  if (!searchParams) {
    return {
      profile: { ...defaults },
      step: '1',
    }
  }

  let params: URLSearchParams
  if (typeof searchParams === 'string') {
    try {
      const search = searchParams.includes('?')
        ? searchParams.slice(searchParams.indexOf('?') + 1)
        : searchParams
      params = new URLSearchParams(search)
    } catch {
      return {
        profile: { ...defaults },
        step: '1',
      }
    }
  } else {
    params = searchParams
  }

  // Name: max 24 chars, plain text trimmed
  const rawName = params.get('name')
  const name =
    typeof rawName === 'string'
      ? rawName.trim().slice(0, PLANNER_CONFIG.maxNameLength)
      : defaults.name

  // Stage: kitten | adult | senior
  const rawStage = params.get('stage')
  const stage =
    rawStage === 'kitten' || rawStage === 'adult' || rawStage === 'senior'
      ? rawStage
      : defaults.stage

  // Neutered: 1 -> true, 0 -> false
  const rawNeutered = params.get('neutered')
  let neutered: boolean
  if (rawNeutered === '1') {
    neutered = true
  } else if (rawNeutered === '0') {
    neutered = false
  } else {
    neutered = defaults.neutered
  }

  // Weight: float, clamped to [1.5, 10.0]
  const rawW = params.get('w')
  let weightKg = defaults.weightKg
  if (rawW !== null && rawW !== '') {
    const parsedW = parseFloat(rawW)
    if (!isNaN(parsedW) && isFinite(parsedW)) {
      const clamped = Math.max(
        PLANNER_CONFIG.weight.min,
        Math.min(PLANNER_CONFIG.weight.max, parsedW),
      )
      weightKg = Math.round(clamped * 10) / 10
    }
  }

  // Activity: lounger | explorer | high-energy
  const rawAct = params.get('act')
  const activity =
    rawAct && rawAct in PLANNER_CONFIG.activityMultipliers
      ? (rawAct as CatProfile['activity'])
      : defaults.activity

  // Health focus: none | urinary-care | hairball-control | sensitive-stomach | coat-shine
  const rawFocus = params.get('focus')
  const validFocuses = [
    'none',
    'urinary-care',
    'hairball-control',
    'sensitive-stomach',
    'coat-shine',
  ]
  const healthFocus =
    rawFocus && validFocuses.includes(rawFocus)
      ? (rawFocus as CatProfile['healthFocus'])
      : defaults.healthFocus

  // Step: 1 | 2 | 3 | 4 | result
  const rawStep = params.get('step')
  const validSteps = PLANNER_CONFIG.steps as readonly string[]
  const step: PlannerStep =
    rawStep && validSteps.includes(rawStep) ? (rawStep as PlannerStep) : '1'

  return {
    profile: {
      name,
      stage,
      neutered,
      weightKg,
      activity,
      healthFocus,
    },
    step,
  }
}
