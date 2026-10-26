import { useEffect, useState } from 'react'

export interface PawStampProps {
  active?: boolean
  className?: string
  onComplete?: () => void
}

/**
 * PawStamp — Declarative component that renders a temporary paw print stamp
 */
export function PawStamp({ active = false, className = '', onComplete }: PawStampProps) {
  const [animating, setAnimating] = useState(false)

  // Trigger animation cycle whenever active becomes true
  useEffect(() => {
    if (!active) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced) {
      onComplete?.()
      return
    }

    const startTimer = setTimeout(() => {
      setAnimating(true)
    }, 0)

    const endTimer = setTimeout(() => {
      setAnimating(false)
      onComplete?.()
    }, 350)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(endTimer)
    }
  }, [active, onComplete])

  if (!active && !animating) return null

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 text-current opacity-85 animate-paw-stamp"
        fill="currentColor"
      >
        <ellipse cx="12" cy="14" rx="4.5" ry="4" />
        <circle cx="7" cy="8" r="1.8" />
        <circle cx="10.5" cy="5.8" r="1.8" />
        <circle cx="14.5" cy="6" r="1.8" />
        <circle cx="17.8" cy="8.8" r="1.8" />
      </svg>
    </div>
  )
}

export default PawStamp
