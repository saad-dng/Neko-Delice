import type React from 'react'

export interface DoodleProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

/**
 * Heart — Gentle hand-drawn monoline heart
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function Heart({ className = '', ...props }: DoodleProps) {
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
      <path d="M 12 21 C 12 21 3 14 3 8.5 C 3 5.5 5.5 3 8.5 3 C 10.5 3 11.5 4 12 5 C 12.5 4 13.5 3 15.5 3 C 18.5 3 21 5.5 21 8.5 C 21 14 12 21 12 21 Z" />
    </svg>
  )
}

export default Heart
