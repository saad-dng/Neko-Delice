import type React from 'react'
import { ScribbleArrow } from '@/components/doodles/ScribbleArrow'

export interface AnnotationProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  arrow?: 'curve-left' | 'curve-right' | 'down' | 'up' | boolean
  rotate?: number
  hideOnMobile?: boolean
  className?: string
}

/**
 * Annotation — Hand-written editorial callout with optional scribble arrow
 * Uses Cormorant Garamond 500 italic, aria-hidden, hides on mobile by default
 */
export function Annotation({
  text,
  arrow = false,
  rotate = -3,
  hideOnMobile = true,
  className = '',
  style,
  ...props
}: AnnotationProps) {
  const arrowVariant =
    typeof arrow === 'string'
      ? arrow
      : arrow
      ? 'curve-right'
      : undefined

  // Clamp rotation within reasonable ±8 degrees
  const clampedRotate = Math.max(-8, Math.min(8, rotate))

  return (
    <div
      aria-hidden="true"
      className={`items-center gap-2 select-none pointer-events-none ${
        hideOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'
      } ${className}`}
      style={{
        transform: `rotate(${clampedRotate}deg)`,
        ...style,
      }}
      {...props}
    >
      <span className="font-note text-lg md:text-xl text-terracotta-700 whitespace-nowrap leading-tight">
        {text}
      </span>
      {arrowVariant ? (
        <ScribbleArrow
          variant={arrowVariant}
          className="w-8 h-6 text-terracotta-600 shrink-0"
        />
      ) : null}
    </div>
  )
}

export default Annotation
