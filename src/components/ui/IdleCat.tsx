import React, { useEffect, useRef, useState } from 'react'

export interface IdleCatProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  pauseOffscreen?: boolean
}

/**
 * IdleCat — Wraps a monoline cat pose and adds an occasional gentle tail/ear twitch
 * (~6s cycle, respects prefers-reduced-motion, pauses when scrolled off-screen or tab is hidden)
 */
export function IdleCat({
  children,
  className = '',
  pauseOffscreen = true,
  ...props
}: IdleCatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(true)
  const [isTabVisible, setIsTabVisible] = useState(true)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    if (!pauseOffscreen || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      { threshold: 0.05 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [pauseOffscreen])

  const shouldAnimate = isInView && isTabVisible

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`inline-block select-none ${shouldAnimate ? 'animate-idle-cat' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default IdleCat
