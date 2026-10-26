import type { CatArtProps } from './types'

/**
 * CatStretch — Deep downward stretching cat with front paws extended and hips raised
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function CatStretch({ className = '', title, ...props }: CatArtProps) {
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
      {/* Head low to ground */}
      <path d="M 96 74 L 102 66 C 103 65 105 66 104 68 L 102 74 L 108 72 C 110 72 110 74 109 76 L 104 81" />
      <path d="M 96 74 C 94 77 94 82 98 85 C 102 88 107 86 108 81 C 108 78 105 76 104 76" />
      {/* Closed content eye */}
      <path d="M 100 78 C 102 80 104 80 105 78" />
      {/* Front paws extended forward */}
      <path d="M 98 85 L 110 94 C 112 95 114 94 114 92 L 106 88" />
      <path d="M 94 84 L 104 96 C 106 97 108 96 107 94 L 101 88" />
      {/* Spine arching up from low chest to high hips */}
      <path d="M 96 74 C 82 66 68 52 52 44 C 42 39 34 42 28 50" />
      {/* Belly curve */}
      <path d="M 92 84 C 78 78 66 70 52 66" />
      {/* Hind legs standing back and supporting */}
      <path d="M 28 50 C 24 58 20 72 18 88 C 17 92 20 94 23 93 L 28 80" />
      <path d="M 36 52 C 34 62 30 76 29 90 C 29 93 32 94 34 92 L 38 76" />
      {/* Playful curling tail lifting high */}
      <path d="M 28 48 C 22 38 18 26 22 18 C 24 14 29 14 31 18 C 32 23 29 30 26 36" />
    </svg>
  )
}

export default CatStretch
