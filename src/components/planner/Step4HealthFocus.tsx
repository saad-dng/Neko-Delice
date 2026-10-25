import type { CatProfile, PlannerHealthFocus } from '@/data/types'

export interface Step4HealthFocusProps {
  profile: CatProfile
  onChange: (patch: Partial<CatProfile>) => void
}

interface FocusOption {
  id: PlannerHealthFocus
  label: string
  description: string
}

export function Step4HealthFocus({ profile, onChange }: Step4HealthFocusProps) {
  const options: FocusOption[] = [
    {
      id: 'none',
      label: 'No specific focus',
      description: 'Complete, balanced everyday maintenance nutrition.',
    },
    {
      id: 'urinary-care',
      label: 'Urinary Care',
      description: 'Higher moisture formulation to support urinary tract hydration.',
    },
    {
      id: 'hairball-control',
      label: 'Hairball Control',
      description: 'Prebiotic fibers and gentle oils to ease natural passage of hairballs.',
    },
    {
      id: 'sensitive-stomach',
      label: 'Sensitive Stomach',
      description: 'Gentle, easily-digestible proteins and soothing natural ingredients.',
    },
    {
      id: 'coat-shine',
      label: 'Coat Shine',
      description: 'Omega-3 rich wild salmon oil to support skin hydration and coat gloss.',
    },
  ]

  return (
    <div className="space-y-6">
      <fieldset className="border-0 p-0 m-0">
        <legend className="text-base font-medium text-espresso-900 mb-1.5">
          Primary wellness focus
        </legend>
        <p className="text-xs text-espresso-600 mb-6">
          Tailors the wet/dry balance and selects purposeful complementary toppers.
        </p>

        <div className="space-y-3">
          {options.map((opt) => {
            const checked = profile.healthFocus === opt.id
            const inputId = `health-focus-${opt.id}`

            return (
              <label
                key={opt.id}
                htmlFor={inputId}
                aria-label={opt.label}
                className={`relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer select-none transition-all ${
                  checked
                    ? 'border-sage-600 bg-sage-50/85 ring-1.5 ring-sage-500/40 shadow-xs'
                    : 'border-sand-300 bg-cream-50 hover:bg-sage-50/40 hover:border-sand-300/80'
                }`}
              >
                <input
                  id={inputId}
                  type="radio"
                  name="health-focus"
                  value={opt.id}
                  checked={checked}
                  onChange={() => onChange({ healthFocus: opt.id })}
                  className="mt-1 h-4 w-4 text-sage-700 accent-sage-600 focus:ring-sage-500"
                />

                <div className="flex-1">
                  <div className="font-serif text-lg font-semibold text-espresso-950 mb-0.5">
                    {opt.label}
                  </div>
                  <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

export default Step4HealthFocus
