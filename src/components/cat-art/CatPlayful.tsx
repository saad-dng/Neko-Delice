import type { CatArtProps } from './types'

/**
 * CatPlayful — Energetic cat with raised curious paw & high waving tail
 * Mapping: High-Energy profile
 * Harmonized with CatSitting anatomy and brand line aesthetic.
 */
export function CatPlayful({ className = '', title, ...props }: CatArtProps) {
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
      <path d="M 44 34 C 42 31 38 28 39 24 C 40 21 43 20 46 20 M 46 20 L 49 7 C 50 6 52 7 53 9 L 56 15 L 58 15 L 64 8 C 65 7 67 8 67 10 L 66 20 M 45 23 C 47 20 52 21 53 25 M 39 28 L 28 27 M 40 32 L 29 34 M 44 52 C 38 50 32 44 32 38 C 32 34 36 34 38 38 C 40 42 43 46 46 50 M 33 36 L 36 38 M 44 34 C 42 44 40 56 42 68 L 44 94 C 44 96 48 96 52 96 C 54 96 55 94 55 91 L 55 70 M 48 92 L 48 96 M 55 76 L 58 92 L 62 94 M 66 20 C 71 34 78 50 82 64 C 88 72 92 80 88 94 M 76 94 L 86 94 M 78 66 C 83 74 83 84 78 92 M 88 94 C 98 90 104 74 100 54 C 96 36 84 28 76 34 C 72 38 76 44 82 42 C 88 40 90 34 86 30" />
      <circle cx="49" cy="23" r="1.2" fill="currentColor" />
    </svg>
  )
}

export default CatPlayful
