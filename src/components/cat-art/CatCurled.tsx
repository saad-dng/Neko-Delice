import type { CatArtProps } from './types'

/**
 * CatCurled — Sleeping cat curled in an organic resting spiral
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function CatCurled({ className = '', title, ...props }: CatArtProps) {
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
      {/* Outer spiral back line */}
      <path d="M 38 78 C 22 72 16 54 22 38 C 28 22 46 16 66 18 C 86 20 102 34 104 54 C 106 74 94 92 76 98 C 58 104 38 100 28 88" />
      {/* Ears tucked gently */}
      <path d="M 44 54 L 38 44 C 37 43 39 42 41 43 L 47 48 L 53 45 C 55 45 56 46 55 48 L 52 56" />
      {/* Tucked head and nose */}
      <path d="M 44 54 C 42 60 46 66 52 68 C 58 70 64 66 66 60 C 67 54 62 48 54 48" />
      {/* Sleeping slit eye */}
      <path d="M 47 58 C 49 60 52 60 53 58" />
      {/* Whiskers */}
      <path d="M 42 63 L 34 64 M 43 66 L 36 70" />
      {/* Inner tail wrap curling around paws */}
      <path d="M 28 88 C 24 82 26 76 34 76 C 42 76 52 82 62 82 C 72 82 80 76 82 68 C 84 58 78 52 70 52" />
    </svg>
  )
}

export default CatCurled
