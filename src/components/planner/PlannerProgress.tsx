import { CatWalking } from '@/components/cat-art/CatWalking'

export interface PlannerProgressProps {
  currentStep: number // 1 to 4
  totalSteps?: number
}

export function PlannerProgress({
  currentStep,
  totalSteps = 4,
}: PlannerProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)
  // Marker percentage along the track (0% on step 1, 100% on step 4)
  const markerPercent = Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 100))

  return (
    <div className="w-full mb-8" data-testid="planner-progress">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-espresso-700 mb-1">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="text-espresso-500 tabular-nums">{percentage}%</span>
      </div>

      {/* Progress Track with Walking Cat Marker */}
      <div className="relative pt-6 pb-1">
        {/* Walking cat marker */}
        <div
          data-testid="planner-cat-marker"
          className="absolute top-0 -translate-x-1/2 transition-[left] duration-300 ease-out text-terracotta-700 pointer-events-none motion-reduce:transition-none"
          style={{ left: `${markerPercent}%` }}
          aria-hidden="true"
        >
          <CatWalking width={28} height={22} className="text-terracotta-700" />
        </div>

        {/* Semantic accessible progress element */}
        <progress
          value={currentStep}
          max={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
          className="w-full h-2 rounded-full overflow-hidden block appearance-none [&::-webkit-progress-bar]:bg-oat-200/90 [&::-webkit-progress-value]:bg-terracotta-600 [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-300 [&::-moz-progress-bar]:bg-terracotta-600 motion-reduce:[&::-webkit-progress-value]:transition-none"
        >
          {percentage}%
        </progress>
      </div>
    </div>
  )
}

export default PlannerProgress
