import type { SVGProps } from 'react'

export interface PawPrintProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  filled?: boolean
}

/**
 * PawPrint — Pure vector monoline cat paw print glyph.
 * Calibrated for buttons, badges, and feline micro-interactions.
 */
export function PawPrint({
  size = 18,
  filled = false,
  className = '',
  ...props
}: PawPrintProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {/* 4 Digital Toe Pads */}
      <ellipse cx="6.5" cy="10" rx="1.5" ry="2" transform="rotate(-15 6.5 10)" fill={filled ? 'currentColor' : undefined} />
      <ellipse cx="10.2" cy="6.5" rx="1.6" ry="2.2" transform="rotate(-5 10.2 6.5)" fill={filled ? 'currentColor' : undefined} />
      <ellipse cx="13.8" cy="6.5" rx="1.6" ry="2.2" transform="rotate(5 13.8 6.5)" fill={filled ? 'currentColor' : undefined} />
      <ellipse cx="17.5" cy="10" rx="1.5" ry="2" transform="rotate(15 17.5 10)" fill={filled ? 'currentColor' : undefined} />

      {/* Main Metacarpal Pad (Organic heart/pad shape) */}
      <path
        d="M 12 18 C 9.5 18 7.8 16.2 8.2 14.5 C 8.5 13.2 9.8 12.6 11 13.3 C 11.5 13.6 12.5 13.6 13 13.3 C 14.2 12.6 15.5 13.2 15.8 14.5 C 16.2 16.2 14.5 18 12 18 Z"
        fill={filled ? 'currentColor' : undefined}
      />
    </svg>
  )
}

export default PawPrint
