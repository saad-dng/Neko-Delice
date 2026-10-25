import type { CatProfile, PlannerLifeStage } from '@/data/types'

export interface Step1AboutProps {
  profile: CatProfile
  onChange: (patch: Partial<CatProfile>) => void
}

export function Step1About({ profile, onChange }: Step1AboutProps) {
  const isKitten = profile.stage === 'kitten'

  const stages: Array<{
    id: PlannerLifeStage
    label: string
    helper: string
  }> = [
    { id: 'kitten', label: 'Kitten', helper: 'under 12 months' },
    { id: 'adult', label: 'Adult', helper: '1 to 10 years' },
    { id: 'senior', label: 'Senior', helper: '11+ years' },
  ]

  return (
    <div className="space-y-8">
      {/* Cat Name (Optional) */}
      <div>
        <label
          htmlFor="planner-cat-name"
          className="block text-base font-medium text-espresso-900 mb-1.5"
        >
          Cat&apos;s name{' '}
          <span className="text-sm font-normal text-espresso-600">
            (optional)
          </span>
        </label>
        <p className="text-xs text-espresso-600 mb-2.5">
          We&apos;ll personalize your cat&apos;s portion table and meal plan.
        </p>
        <input
          id="planner-cat-name"
          type="text"
          maxLength={24}
          value={profile.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Mochi"
          className="w-full max-w-md h-12 px-4 rounded-xl bg-cream-50 border border-sand-300 text-espresso-950 placeholder:text-espresso-400 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 transition-colors"
        />
      </div>

      {/* Life Stage */}
      <fieldset className="border-0 p-0 m-0">
        <legend className="text-base font-medium text-espresso-900 mb-1.5">
          Life stage
        </legend>
        <p className="text-xs text-espresso-600 mb-3">
          Energy needs change significantly across development and senior years.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stages.map((stage) => {
            const checked = profile.stage === stage.id
            return (
              <label
                key={stage.id}
                className={`relative flex flex-col p-4 rounded-2xl border cursor-pointer select-none transition-all ${
                  checked
                    ? 'border-sage-600 bg-sage-50/85 ring-1.5 ring-sage-500/40 shadow-xs'
                    : 'border-sand-300 bg-cream-50 hover:bg-sage-50/40 hover:border-sand-300/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-lg font-semibold text-espresso-950">
                    {stage.label}
                  </span>
                  <input
                    type="radio"
                    name="life-stage"
                    value={stage.id}
                    checked={checked}
                    onChange={() => onChange({ stage: stage.id })}
                    className="h-4 w-4 text-sage-700 accent-sage-600 focus:ring-sage-500"
                  />
                </div>
                <span className="text-xs text-espresso-600">{stage.helper}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Neuter Status */}
      <fieldset className="border-0 p-0 m-0">
        <legend className="text-base font-medium text-espresso-900 mb-1.5">
          Neutered or spayed?
        </legend>
        <p className="text-xs text-espresso-600 mb-3">
          Neutered cats have lower resting metabolic requirements.
        </p>

        {isKitten ? (
          <div className="p-4 rounded-xl bg-sage-50/80 border border-sage-200/80 text-xs sm:text-sm text-espresso-700 leading-relaxed mb-3">
            <span className="font-semibold text-espresso-900">
              Not applicable for kittens:
            </span>{' '}
            Neuter status is not factored into calorie calculations for kittens under 12 months.
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          <label
            className={`flex items-center gap-3 px-5 py-3 rounded-full border cursor-pointer select-none transition-all ${
              isKitten
                ? 'opacity-40 cursor-not-allowed border-sand-300/50 bg-cream-50'
                : profile.neutered
                  ? 'border-sage-600 bg-sage-50/85 ring-1.5 ring-sage-500/40 font-medium text-espresso-950'
                  : 'border-sand-300 bg-cream-50 hover:bg-sage-50/40 text-espresso-800'
            }`}
          >
            <input
              type="radio"
              name="neutered-status"
              value="yes"
              disabled={isKitten}
              checked={profile.neutered}
              onChange={() => onChange({ neutered: true })}
              className="h-4 w-4 text-sage-700 accent-sage-600 focus:ring-sage-500 disabled:cursor-not-allowed"
            />
            <span className="text-sm">Yes, neutered</span>
          </label>

          <label
            className={`flex items-center gap-3 px-5 py-3 rounded-full border cursor-pointer select-none transition-all ${
              isKitten
                ? 'opacity-40 cursor-not-allowed border-sand-300/50 bg-cream-50'
                : !profile.neutered
                  ? 'border-sage-600 bg-sage-50/85 ring-1.5 ring-sage-500/40 font-medium text-espresso-950'
                  : 'border-sand-300 bg-cream-50 hover:bg-sage-50/40 text-espresso-800'
            }`}
          >
            <input
              type="radio"
              name="neutered-status"
              value="no"
              disabled={isKitten}
              checked={!profile.neutered}
              onChange={() => onChange({ neutered: false })}
              className="h-4 w-4 text-sage-700 accent-sage-600 focus:ring-sage-500 disabled:cursor-not-allowed"
            />
            <span className="text-sm">No, intact</span>
          </label>
        </div>
      </fieldset>
    </div>
  )
}

export default Step1About
