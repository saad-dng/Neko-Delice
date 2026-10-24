import type { CatArtProps } from './types'

/**
 * CatPeeking — Cat peeking curiously over botanical tea leaves
 * Mapping: Empty bag & curious discovery states
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
      <path d="M 60 104 L 60 76 M 60 76 C 44 70 30 68 18 72 C 24 82 42 84 60 76 M 60 76 C 44 74 32 73 18 72 M 60 76 C 76 70 90 68 102 72 C 96 82 78 84 60 76 M 60 76 C 76 74 88 73 102 72 M 38 73 C 37 66 42 63 46 63 C 50 63 54 66 54 73 M 43 64 L 43 70 M 48 64 L 48 70 M 66 73 C 66 66 70 63 74 63 C 78 63 83 66 82 73 M 71 64 L 71 70 M 76 64 L 76 70 M 34 68 C 29 57 33 46 40 40 M 86 68 C 91 57 87 46 80 40 M 40 40 L 34 20 C 36 19 39 19 42 22 L 51 31 M 51 31 C 56 29 64 29 69 31 M 69 31 L 78 22 C 81 19 84 19 86 20 L 80 40 M 45 48 C 47 44 51 44 53 48 M 67 48 C 69 44 73 44 75 48 M 58 53 C 60 55 62 55 62 53 M 60 55 L 60 57 C 58 59 55 59 53 57 M 60 57 C 62 59 65 59 67 57 M 28 49 L 16 48 M 28 54 L 17 56 M 92 49 L 104 48 M 92 54 L 103 56" />
    </svg>
  )
}

export default CatPeeking
