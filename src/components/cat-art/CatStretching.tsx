import type { CatArtProps } from './types'

/**
 * CatStretching — Classic downward-cat stretch
 * Mapping: Playful Explorer profile
 * Calibrated directly from authentic NEKO DELICE packaging illustration (Duck Kibble pack).
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
      <path d="M 37 82 C 30 89 22 95 13 100 C 11 102 10 99 11 98 C 15 95 26 86 35 79 M 41 85 C 32 93 21 101 11 105 C 8 107 8 105 9 103 C 14 98 27 89 33 81 M 33 81 C 26 82 24 76 26 70 C 28 66 31 64 33 64 M 33 64 L 32 55 C 32 54 34 54 35 55 L 36 63 M 36 63 L 38 63 M 38 63 L 39 56 C 39 55 41 55 41 56 L 43 63 M 43 63 C 56 69 70 64 96 42 M 96 42 C 106 30 105 18 90 16 C 75 15 66 23 67 25 C 68 26 77 20 90 20 C 100 21 101 31 95 43 M 96 42 C 107 56 110 71 107 87 C 105 96 104 101 100 102 C 96 103 94 100 94 96 C 95 90 96 82 91 75 M 92 69 C 94 78 91 86 87 92 M 88 86 L 85 94 C 84 96 86 97 88 96 L 90 93 M 41 85 C 55 94 70 92 85 85 M 29 71 C 30 72 32 72 33 70" />
    </svg>
  )
}

export default CatStretching
