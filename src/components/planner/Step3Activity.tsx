import { CatSleeping } from '@/components/cat-art/CatSleeping'
import { CatStretching } from '@/components/cat-art/CatStretching'
import { CatPlayful } from '@/components/cat-art/CatPlayful'
import type { CatProfile, PlannerActivity } from '@/data/types'

export interface Step3ActivityProps {
  profile: CatProfile
  onChange: (patch: Partial<CatProfile>) => void
}

interface ActivityOption {
  id: PlannerActivity
  label: string
  description: string
  Icon: typeof CatSleeping
}

export function Step3Activity({ profile, onChange }: Step3ActivityProps) {
  const options: ActivityOption[] = [
    {
      id: 'lounger',
      label: 'Indoor Lounger',
      description: 'Naps in sunbeams, short play',
      Icon: CatSleeping,
    },
    {
      id: 'explorer',
      label: 'Playful Explorer',
      description: 'Daily play and curiosity',
      Icon: CatStretching,
    },
    {
      id: 'high-energy',
      label: 'High-Energy',
      description: 'Runs, climbs, never stops',
      Icon: CatPlayful,
    },
  ]

  return (
    <div className="space-y-6">
      <fieldset className="border-0 p-0 m-0">
        <legend className="text-base font-medium text-espresso-900 mb-1.5">
          Daily activity level
        </legend>
        <p className="text-xs text-espresso-600 mb-6">
          Activity multipliers adjust daily energy expenditure above resting rates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((opt) => {
            const checked = profile.activity === opt.id
            const IconComponent = opt.Icon

            return (
              <label
                key={opt.id}
                className={`relative flex flex-col items-center text-center p-5 rounded-2xl border cursor-pointer select-none transition-all ${
                  checked
                    ? 'border-sage-600 bg-sage-50/85 ring-1.5 ring-sage-500/40 shadow-xs'
                    : 'border-sand-300 bg-cream-50 hover:bg-sage-50/40 hover:border-sand-300/80'
                }`}
              >
                {/* SVG Monoline Cat Illustration */}
                <div
                  className={`w-20 h-20 flex items-center justify-center mb-3 transition-colors ${
                    checked ? 'text-sage-800' : 'text-espresso-700'
                  }`}
                >
                  <IconComponent className="w-16 h-16" />
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <input
                    type="radio"
                    name="activity-level"
                    value={opt.id}
                    checked={checked}
                    onChange={() => onChange({ activity: opt.id })}
                    className="h-4 w-4 text-sage-700 accent-sage-600 focus:ring-sage-500"
                  />
                  <span className="font-serif text-lg font-semibold text-espresso-950">
                    {opt.label}
                  </span>
                </div>

                <p className="text-xs text-espresso-700 leading-relaxed">
                  {opt.description}
                </p>
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

export default Step3Activity
