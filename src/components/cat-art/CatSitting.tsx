import type { CatArtProps } from './types'

/**
 * CatSitting — Seated cat looking upward with curiosity
 * Mapping: 404 page & thoughtful contemplation
 */
export function CatSitting({ className = '', title, ...props }: CatArtProps) {
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
      <path d="M 42 34 C 40 31 36 28 37 24 C 38 21 41 20 44 20 M 44 20 L 47 7 C 48 6 50 7 51 9 L 54 15 L 56 15 L 62 8 C 63 7 65 8 65 10 L 64 20 M 64 20 C 69 34 76 50 80 64 C 86 72 90 80 86 94 M 74 94 L 84 94 M 42 34 C 40 44 34 54 36 66 C 37 74 41 84 44 94 M 42 94 C 42 96 46 96 51 96 C 53 96 54 94 54 91 L 54 70 M 48 92 L 48 96 M 54 76 L 57 92 L 61 94 M 43 23 C 45 20 50 21 51 25 M 37 28 L 26 27 M 38 32 L 27 34 M 76 66 C 81 74 81 84 76 92 M 86 94 C 89 98 81 100 70 100 L 40 100 C 28 100 22 94 26 88 C 29 84 34 86 35 90" />
      <circle cx="47" cy="23" r="1.2" fill="currentColor" />
    </svg>
  )
}

export default CatSitting
