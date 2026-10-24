import type { CatArtProps } from './types'

/**
 * CatSleeping — Peaceful curled sleeping cat
 * Mapping: Indoor Lounger profile
 */
export function CatSleeping({ className = '', title, ...props }: CatArtProps) {
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
      <path d="M 50 42 C 65 35 84 37 95 46 C 105 55 104 68 96 78 C 91 84 82 89 70 89 C 54 89 40 86 34 81 C 30 78 32 74 36 74 C 40 74 44 76 48 78 M 50 42 L 48 28 C 47 26 44 26 43 28 L 39 39 C 36 40 33 41 30 43 L 22 30 C 20 29 18 30 18 32 L 20 46 C 18 52 18 58 21 62 C 23 65 27 66 32 66 M 25 54 C 28 57 33 57 36 53 M 19 60 L 11 59 M 20 63 L 12 65 M 32 66 C 30 72 35 76 43 76 C 51 76 59 74 65 70 M 38 71 C 39 75 42 75 43 71 M 72 50 C 78 58 80 68 76 76" />
    </svg>
  )
}

export default CatSleeping
