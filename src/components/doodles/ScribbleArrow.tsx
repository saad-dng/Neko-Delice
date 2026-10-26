import type React from 'react'

export interface ScribbleArrowProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'curve-left' | 'curve-right' | 'down' | 'up'
  className?: string
}

/**
 * ScribbleArrow — Hand-drawn organic arrow for annotations and callouts
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function ScribbleArrow({
  variant = 'curve-right',
  className = '',
  ...props
}: ScribbleArrowProps) {
  // Flip or rotate based on variant
  const transform =
    variant === 'curve-left'
      ? 'scale(-1, 1) translate(-60, 0)'
      : variant === 'up'
      ? 'rotate(-90 30 20)'
      : variant === 'down'
      ? 'rotate(90 30 20)'
      : undefined

  return (
    <svg
      viewBox="0 0 60 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      <g transform={transform}>
        {/* Soft curving tail */}
        <path d="M 6 12 C 22 8 38 10 48 24" />
        {/* Arrowhead */}
        <path d="M 40 25 L 48 24 L 46 16" />
      </g>
    </svg>
  )
}

export default ScribbleArrow
