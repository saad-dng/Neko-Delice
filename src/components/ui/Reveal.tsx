import type React from 'react'
import { useReveal } from './useReveal'

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  threshold?: number
  delay?: number
  as?: React.ElementType
  className?: string
}

/**
 * Reveal — Intersection-based fade + 12px rise animation
 * Fully accessible: renders visible by default in SSR and under prefers-reduced-motion
 */
export function Reveal({
  children,
  threshold = 0.15,
  delay = 0,
  as: Component = 'div',
  className = '',
  style,
  ...props
}: RevealProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>({ threshold, delay })

  return (
    <Component
      ref={ref}
      className={`transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Reveal
