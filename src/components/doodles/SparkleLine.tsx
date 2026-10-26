import type React from 'react'

export interface SparkleLineProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

/**
 * SparkleLine — Hand-drawn decorative four-point star sparkle burst
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function SparkleLine({ className = '', ...props }: SparkleLineProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      <path d="M 12 2 C 12 8 13 11 19 12 C 13 13 12 16 12 22 C 12 16 11 13 5 12 C 11 11 12 8 12 2 Z" />
    </svg>
  )
}

export default SparkleLine
