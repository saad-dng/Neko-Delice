import { useState } from 'react'
import { PLANNER_CONFIG } from '@/config/planner'
import type { CatProfile } from '@/data/types'
import { sizeBand } from '@/lib/planner'

export interface Step2WeightProps {
  profile: CatProfile
  onChange: (patch: Partial<CatProfile>) => void
}

const KG_TO_LB = 2.20462

export function Step2Weight({ profile, onChange }: Step2WeightProps) {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')

  const weightKg = profile.weightKg
  const band = sizeBand(weightKg)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val) && isFinite(val)) {
      onChange({ weightKg: Math.round(val * 10) / 10 })
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value)
    if (!isNaN(rawVal) && isFinite(rawVal)) {
      let nextKg = rawVal
      if (unit === 'lb') {
        nextKg = rawVal / KG_TO_LB
      }
      const clamped = Math.max(
        PLANNER_CONFIG.weight.min,
        Math.min(PLANNER_CONFIG.weight.max, nextKg),
      )
      onChange({ weightKg: Math.round(clamped * 10) / 10 })
    }
  }

  const isExtreme =
    weightKg <= PLANNER_CONFIG.weight.min || weightKg >= PLANNER_CONFIG.weight.max

  // Formatted display values
  const displayVal =
    unit === 'kg'
      ? weightKg.toFixed(1)
      : (Math.round(weightKg * KG_TO_LB * 10) / 10).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Unit Selector & Numerical Input Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <label
            htmlFor="planner-weight-number"
            className="block text-base font-medium text-espresso-900 mb-1.5"
          >
            Body weight
          </label>
          <p className="text-xs text-espresso-600">
            Slide or enter your cat&apos;s current weight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Numeric synced input */}
          <div className="relative">
            <input
              id="planner-weight-number"
              type="number"
              min={
                unit === 'kg'
                  ? PLANNER_CONFIG.weight.min
                  : Math.round(PLANNER_CONFIG.weight.min * KG_TO_LB * 10) / 10
              }
              max={
                unit === 'kg'
                  ? PLANNER_CONFIG.weight.max
                  : Math.round(PLANNER_CONFIG.weight.max * KG_TO_LB * 10) / 10
              }
              step="0.1"
              value={displayVal}
              onChange={handleNumberChange}
              aria-label={`Cat weight in ${unit}`}
              className="w-28 h-12 px-3 text-right font-serif text-2xl font-semibold text-espresso-950 bg-cream-50 border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-espresso-900"
            />
          </div>

          {/* Unit Toggle Buttons */}
          <div
            className="inline-flex rounded-xl bg-oat-100 p-1 border border-sand-300/60"
            aria-label="Weight measurement unit"
          >
            <button
              type="button"
              onClick={() => setUnit('kg')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                unit === 'kg'
                  ? 'bg-cream-50 text-espresso-950 shadow-sm'
                  : 'text-espresso-600 hover:text-espresso-950'
              }`}
              aria-pressed={unit === 'kg'}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => setUnit('lb')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                unit === 'lb'
                  ? 'bg-cream-50 text-espresso-950 shadow-sm'
                  : 'text-espresso-600 hover:text-espresso-950'
              }`}
              aria-pressed={unit === 'lb'}
            >
              lb
            </button>
          </div>
        </div>
      </div>

      {/* Range Slider */}
      <div>
        <label htmlFor="planner-weight-slider" className="sr-only">
          Weight slider in kilograms
        </label>
        <input
          id="planner-weight-slider"
          type="range"
          min={PLANNER_CONFIG.weight.min}
          max={PLANNER_CONFIG.weight.max}
          step={PLANNER_CONFIG.weight.step}
          value={weightKg}
          onChange={handleSliderChange}
          aria-valuemin={PLANNER_CONFIG.weight.min}
          aria-valuemax={PLANNER_CONFIG.weight.max}
          aria-valuenow={weightKg}
          aria-valuetext={`${weightKg.toFixed(1)} kilograms (${(weightKg * KG_TO_LB).toFixed(1)} pounds)`}
          className="w-full h-2.5 bg-oat-200 rounded-lg appearance-none cursor-pointer accent-terracotta-600 focus:outline-none focus:ring-2 focus:ring-espresso-900 focus:ring-offset-2 focus:ring-offset-cream-50"
        />

        <div className="flex justify-between text-xs text-espresso-500 mt-2">
          <span>{PLANNER_CONFIG.weight.min} kg</span>
          <span>{PLANNER_CONFIG.weight.default} kg (typical)</span>
          <span>{PLANNER_CONFIG.weight.max} kg</span>
        </div>
      </div>

      {/* Size Band Indicator Card */}
      <div className="p-4 rounded-2xl bg-oat-100 border border-sand-300/80">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700">
            Size Indicator:
          </span>
          <span className="font-serif text-lg font-semibold text-espresso-950">
            {band}
          </span>
          <span className="text-xs text-espresso-600">
            {band === 'Petite'
              ? '(< 3.5 kg)'
              : band === 'Typical'
                ? '(3.5 – 6.0 kg)'
                : '(> 6.0 kg)'}
          </span>
        </div>
        <p className="text-xs text-espresso-600 leading-relaxed">
          This is an anatomical size indicator based on skeletal frame and body mass, not a veterinary body-condition score.
        </p>
      </div>

      {/* Extreme Weight Boundary Note */}
      {isExtreme ? (
        <div className="p-4 rounded-2xl bg-[#F6E8E2] border border-terracotta-300 text-xs text-espresso-800 leading-relaxed">
          <span className="font-semibold text-terracotta-800">
            Veterinary guidance notice:
          </span>{' '}
          Very small (&le;1.5 kg) or large (&ge;10 kg) cats have unique metabolic rates. Please consult your veterinarian for specialized feeding guidance.
        </div>
      ) : null}
    </div>
  )
}

export default Step2Weight
