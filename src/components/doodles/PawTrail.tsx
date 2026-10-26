import type React from 'react'

export interface PawTrailProps extends React.SVGProps<SVGSVGElement> {
  count?: number
  className?: string
}

/**
 * PawTrail — A trail of small alternating tilted paw prints
 * Monoline inline SVG, aria-hidden
 */
export function PawTrail({ count = 3, className = '', ...props }: PawTrailProps) {
  const prints = Array.from({ length: Math.min(Math.max(count, 1), 6) }, (_, i) => i)

  return (
    <svg
      viewBox={`0 0 ${prints.length * 36} 28`}
      fill="currentColor"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {prints.map((i) => {
        const x = i * 36 + 6
        const y = i % 2 === 0 ? 8 : 14
        const rot = i % 2 === 0 ? -15 : 15
        const opacity = 0.35 + (i / prints.length) * 0.45

        return (
          <g
            key={i}
            transform={`translate(${x}, ${y}) rotate(${rot} 8 8)`}
            opacity={opacity}
          >
            {/* Main pad */}
            <ellipse cx="8" cy="9.5" rx="3.5" ry="3" />
            {/* 4 toe beans */}
            <circle cx="4" cy="4.5" r="1.3" />
            <circle cx="6.8" cy="2.8" r="1.3" />
            <circle cx="10" cy="3.2" r="1.3" />
            <circle cx="12.2" cy="5.2" r="1.3" />
          </g>
        )
      })}
    </svg>
  )
}

export default PawTrail
