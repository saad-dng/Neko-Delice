import type { CatArtProps } from './types'

/**
 * CatPeeking — Cat peeking curiously over botanical tea leaves
 * Mapping: Empty bag & curious discovery states
 * Calibrated directly from authentic NEKO DELICE packaging illustration (Matcha Tofu Litter pack).
 */
export function CatPeeking({ className = '', title, ...props }: CatArtProps) {
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
      <path d="M 50 111 C 50 100 48 89 47 83 M 47 83 C 31 88 18 75 11 54 C 20 54 35 56 47 64 M 47 83 C 35 77 25 68 20 60 M 47 83 C 69 89 89 72 104 45 C 86 51 69 58 49 73 M 47 83 C 64 73 78 63 92 51 M 39 36 C 38 43 39 51 45 58 M 39 36 L 40 18 C 40 17 42 17 42 18 L 53 26 M 53 26 L 68 25 M 68 25 L 76 14 C 77 13 79 13 79 15 L 85 33 M 85 33 C 86 37 86 40 84 43 M 79 45 C 79 40 90 38 92 44 C 90 47 83 48 79 45 M 83 40 L 83 43 M 88 41 L 87 44 M 48 65 C 49 59 59 59 59 66 C 56 70 49 69 48 65 M 53 61 L 53 65 M 56 62 L 55 65 M 38 46 L 31 46 M 39 50 L 32 51 M 48 42 C 50 40 54 40 56 42 M 67 38 C 69 36 72 36 74 38" />
      <circle cx="61" cy="44" r="1.4" fill="currentColor" />
    </svg>
  )
}

export default CatPeeking
