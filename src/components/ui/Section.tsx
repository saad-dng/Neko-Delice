import React, { useEffect, useRef } from 'react'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  reveal?: boolean
  defer?: boolean
}

export function Section({
  children,
  className = '',
  reveal = false,
  defer = false,
  ...props
}: SectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!reveal) return
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const el = ref.current
    if (!el) return

    el.classList.add('section-reveal')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reveal])

  const deferClass = defer ? 'section-deferred' : ''

  return (
    <section
      ref={ref}
      className={`py-12 md:py-20 lg:py-24 ${deferClass} ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export default Section
