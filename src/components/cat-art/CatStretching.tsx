import type { CatArtProps } from './types'

/**
 * CatStretching — Classic downward-cat stretch
 * Mapping: Playful Explorer profile
 */
export function CatStretching({ className = '', title, ...props }: CatArtProps) {
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
      <path d="M 14 90 L 32 90 C 38 90 44 84 48 74 L 52 66 M 22 86 L 22 90 M 18 86 C 24 86 34 84 40 76 M 32 72 C 28 70 27 66 28 63 C 29 59 33 58 37 58 M 37 58 L 37 42 C 38 40 40 40 41 42 L 45 52 L 47 52 L 52 40 C 53 39 55 40 55 42 L 54 54 M 33 63 C 36 65 40 64 42 62 M 28 65 L 18 64 M 29 68 L 20 70 M 54 54 C 64 66 74 66 88 46 M 88 46 C 96 56 96 70 94 78 L 88 90 L 96 90 M 48 72 C 58 76 70 76 80 78 M 84 64 C 86 72 84 80 80 86 M 88 46 C 96 36 102 24 98 16 C 94 10 86 10 82 14 C 79 17 80 22 85 22 C 88 22 90 19 88 16" />
    </svg>
  )
}

export default CatStretching
