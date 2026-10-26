import type React from 'react'

export interface YarnProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

/**
 * Yarn — Hand-drawn monoline yarn ball with loose trailing thread
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function Yarn({ className = '', ...props }: YarnProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {/* Outer ball circle */}
      <circle cx="16" cy="16" r="10" />
      {/* Thread loops */}
      <path d="M 9 12 C 13 14 19 14 23 12" />
      <path d="M 8 18 C 12 16 20 16 24 18" />
      <path d="M 12 8 C 14 13 14 19 12 24" />
      <path d="M 18 8 C 16 13 16 19 18 24" />
      {/* Trailing playful thread */}
      <path d="M 24 22 C 26 26 22 29 27 29 C 30 29 31 27 31 25" />
    </svg>
  )
}

export default Yarn
