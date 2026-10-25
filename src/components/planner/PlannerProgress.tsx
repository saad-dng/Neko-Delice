export interface PlannerProgressProps {
  currentStep: number // 1 to 4
  totalSteps?: number
}

export function PlannerProgress({
  currentStep,
  totalSteps = 4,
}: PlannerProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-espresso-700 mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="text-espresso-500">{percentage}%</span>
      </div>

      <progress
        value={currentStep}
        max={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
        className="w-full h-2 rounded-full overflow-hidden block appearance-none [&::-webkit-progress-bar]:bg-oat-200 [&::-webkit-progress-value]:bg-terracotta-600 [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-250 [&::-moz-progress-bar]:bg-terracotta-600"
      >
        {percentage}%
      </progress>
    </div>
  )
}

export default PlannerProgress
