import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SeoHead } from '@/components/seo/SeoHead'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { CatHead } from '@/components/cat-art/CatHead'
import { usePlannerProfile } from '@/store/planner'
import { decodeProfile, encodeProfile } from '@/lib/plan-url'
import { buildBundle } from '@/lib/planner'
import type { CatProfile, PlannerStep } from '@/data/types'
import { PlannerProgress } from '@/components/planner/PlannerProgress'
import { Step1About } from '@/components/planner/Step1About'
import { Step2Weight } from '@/components/planner/Step2Weight'
import { Step3Activity } from '@/components/planner/Step3Activity'
import { Step4HealthFocus } from '@/components/planner/Step4HealthFocus'
import { PlanResult } from '@/components/planner/PlanResult'

const STEP_TITLES: Record<string, string> = {
  '1': 'About your cat',
  '2': 'Weight',
  '3': 'Daily activity',
  '4': 'Health focus',
}

export function MealPlanPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const setStoreProfile = usePlannerProfile((s) => s.setProfile)

  // Single source of truth: decode profile and step from current URL search params
  const { profile, step: urlStep } = useMemo(() => {
    return decodeProfile(location.search)
  }, [location.search])

  const headingRef = useRef<HTMLHeadingElement>(null)

  // Mirror decoded profile into Zustand planner store for the Smart Bag modal
  useEffect(() => {
    setStoreProfile(profile)
  }, [profile, setStoreProfile])

  // Move focus to heading and scroll on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const timer = setTimeout(() => {
      headingRef.current?.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [urlStep])

  const profileRef = useRef(profile)
  useEffect(() => {
    profileRef.current = profile
  })

  // Helper to update profile and synchronize with URL
  const updateProfile = (patch: Partial<CatProfile>) => {
    const next = { ...profileRef.current, ...patch }
    profileRef.current = next
    setStoreProfile(next)
    navigate(`/meal-plan?${encodeProfile(next, urlStep)}`, { replace: true })
  }

  // Navigate to step
  const goToStep = (nextStep: PlannerStep) => {
    navigate(`/meal-plan?${encodeProfile(profileRef.current, nextStep)}`, { replace: true })
  }

  const handleNext = () => {
    if (urlStep === '1') goToStep('2')
    else if (urlStep === '2') goToStep('3')
    else if (urlStep === '3') goToStep('4')
    else if (urlStep === '4') goToStep('result')
  }

  const handleBack = () => {
    if (urlStep === '2') goToStep('1')
    else if (urlStep === '3') goToStep('2')
    else if (urlStep === '4') goToStep('3')
    else if (urlStep === 'result') goToStep('4')
  }

  // Pre-calculate bundle if at result step
  const bundle = useMemo(() => {
    return buildBundle(profile)
  }, [profile])

  const stepNumber = urlStep === 'result' ? 4 : parseInt(urlStep, 10) || 1
  const liveAnnouncement =
    urlStep === 'result'
      ? 'Meal plan result loaded'
      : `Step ${urlStep} of 4: ${STEP_TITLES[urlStep] || ''}`

  return (
    <>
      <SeoHead
        title="Calorie & Meal Planner | NEKO DELICE"
        description="Calculate your cat's exact daily calories and build a custom monthly meal bundle tailored to their life stage, activity, and health goals."
        path="/meal-plan"
      />

      {/* Screen Reader Live Region */}
      <output
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </output>

      <Section className="pb-28 sm:pb-20">
        <Container className="max-w-3xl">
          {/* Header Badge */}
          <div className="flex items-center gap-3 mb-4 text-sage-800">
            <CatHead width={32} height={32} aria-hidden="true" className="text-sage-700" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Clinical Feline Nutrition
            </span>
          </div>

          {urlStep === 'result' ? (
            /* Result View */
            <PlanResult
              bundle={bundle}
              profile={profile}
              onEditAnswers={() => goToStep('1')}
            />
          ) : (
            /* Wizard View */
            <div className="space-y-8">
              {/* Main Page Title */}
              <div>
                <Heading
                  level={1}
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-espresso-950 mb-3"
                >
                  Calorie & meal planner
                </Heading>
                <p className="text-base sm:text-lg text-espresso-700 leading-relaxed">
                  Tailor your cat&apos;s daily calorie target and monthly pantry bundle in four simple steps.
                </p>
              </div>

              {/* Progress Bar */}
              <PlannerProgress currentStep={stepNumber} totalSteps={4} />

              {/* Step Card Container */}
              <div className="p-6 sm:p-8 rounded-3xl bg-cream-50 border border-sand-300 shadow-xs">
                {/* Step Heading */}
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950 mb-6 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50 rounded-lg inline-block"
                >
                  {STEP_TITLES[urlStep] || 'About your cat'}
                </h2>

                {/* Step Content */}
                {urlStep === '1' && (
                  <Step1About profile={profile} onChange={updateProfile} />
                )}
                {urlStep === '2' && (
                  <Step2Weight profile={profile} onChange={updateProfile} />
                )}
                {urlStep === '3' && (
                  <Step3Activity profile={profile} onChange={updateProfile} />
                )}
                {urlStep === '4' && (
                  <Step4HealthFocus profile={profile} onChange={updateProfile} />
                )}

                {/* Desktop/Tablet Navigation Controls */}
                <div className="hidden sm:flex items-center justify-between pt-8 mt-8 border-t border-sand-300/80">
                  {stepNumber > 1 ? (
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleNext}
                    className="min-w-[140px]"
                  >
                    {urlStep === '4' ? 'View meal plan' : 'Next'}
                  </Button>
                </div>
              </div>

              {/* Mandatory Veterinary Disclaimer on Wizard */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sage-50/70 border border-sage-200/80 text-xs sm:text-sm text-espresso-800 leading-relaxed">
                <span className="font-semibold text-espresso-950">
                  Veterinary notice:{' '}
                </span>
                An estimate for healthy cats, not veterinary advice. Check with your vet for medical conditions, pregnancy, or rapid weight change.
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Mobile Sticky Navigation Bar (< 640px) on Wizard Steps */}
      {urlStep !== 'result' && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-4 bg-cream-50/90 backdrop-blur-md border-t border-sand-300/80 shadow-lg flex items-center justify-between gap-3">
          {stepNumber > 1 ? (
            <Button
              variant="secondary"
              type="button"
              onClick={handleBack}
              className="flex-1 min-h-[44px]"
            >
              Back
            </Button>
          ) : null}

          <Button
            variant="primary"
            type="button"
            onClick={handleNext}
            className="flex-1 min-h-[44px]"
          >
            {urlStep === '4' ? 'View meal plan' : 'Next'}
          </Button>
        </div>
      )}
    </>
  )
}

export default MealPlanPage
