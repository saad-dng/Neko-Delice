import { useEffect, useRef, useState } from 'react'

/**
 * Animated count-up hook for numbers.
 * Respects prefers-reduced-motion (instantly returns target without extra render cycles).
 * Capped to durationMs (default 800ms <= 900ms requirement).
 */
export function useCountUp(target: number, durationMs = 800): number {
  const isReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [current, setCurrent] = useState<number>(() => target)
  const prevTargetRef = useRef<number>(target)

  useEffect(() => {
    if (typeof window === 'undefined' || isReduced) {
      prevTargetRef.current = target
      return
    }

    const startVal = prevTargetRef.current
    const diff = target - startVal
    if (diff === 0) return

    const startTime = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      // Ease-out cubic curve
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextVal = Math.round(startVal + diff * eased)
      setCurrent(nextVal)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        setCurrent(target)
        prevTargetRef.current = target
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [target, durationMs, isReduced])

  return isReduced ? target : current
}
