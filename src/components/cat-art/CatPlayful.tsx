import type { CatArtProps } from './types'

/**
 * CatPlayful — Energetic cat in playful pounce crouch
 * Mapping: High-Energy profile
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
      <path d="M 62 48 L 65 34 C 66 32 68 33 69 35 L 72 45 L 75 45 L 80 35 C 81 34 83 35 83 37 L 81 48 M 81 48 C 84 50 86 53 84 56 C 83 58 80 59 76 59 C 72 61 66 61 62 60 M 84 54 L 94 53 M 83 57 L 92 59 M 62 60 C 58 64 56 72 58 80 L 68 88 L 76 88 M 66 76 L 76 84 L 84 84 M 62 48 C 52 48 44 46 36 44 M 58 68 C 48 68 40 68 34 72 M 36 44 C 26 50 20 60 18 72 L 24 88 L 32 88 M 28 58 C 30 68 28 78 24 86 M 36 44 C 26 34 22 22 25 15 C 28 9 36 10 40 14 C 43 18 40 23 35 24" />
      <circle cx="76" cy="50" r="1.3" fill="currentColor" />
    </svg>
  )
}

export default CatPlayful
