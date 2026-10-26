import type { CatArtProps } from './types'

/**
 * CatCurious — Sitting cat tilted upward with wide inquisitive ears
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function CatCurious({ className = '', title, ...props }: CatArtProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {/* Head and ears looking up */}
      <path d="M 46 22 L 49 10 C 50 9 52 10 53 12 L 56 18 L 62 18 L 65 11 C 66 10 68 11 68 13 L 69 22" />
      <path d="M 46 22 C 43 25 42 29 44 33 C 47 37 53 38 58 38 C 64 38 68 35 69 29 C 70 25 68 22 69 22" />
      {/* Eyes & nose */}
      <circle cx="51" cy="27" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="61" cy="27" r="1.2" fill="currentColor" stroke="none" />
      <path d="M 55 31 L 57 31 L 56 33 Z" fill="currentColor" stroke="none" />
      {/* Whiskers */}
      <path d="M 42 30 L 32 29 M 42 33 L 31 35 M 70 30 L 80 29 M 70 33 L 81 35" />
      {/* Arched chest, upright front leg */}
      <path d="M 49 38 C 47 48 46 62 48 78 L 48 98 C 48 100 52 100 54 98 L 54 80" />
      {/* Second front leg */}
      <path d="M 57 80 L 57 98 C 57 100 61 100 63 98 L 63 76" />
      {/* Back curve, sitting hindquarter */}
      <path d="M 68 34 C 74 46 78 58 80 72 C 82 82 81 92 78 98 C 76 100 70 100 64 98" />
      {/* Curled tail */}
      <path d="M 80 94 C 88 95 94 90 94 82 C 94 74 88 70 82 72" />
    </svg>
  )
}

export default CatCurious
