import type { CatArtProps } from './types'

/**
 * CatWalking — Cat walking gracefully with high upright tail
 */
export function CatWalking({ className = '', title, ...props }: CatArtProps) {
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
      {/* Head and forward alert ears */}
      <path d="M 82 46 L 86 34 C 87 33 89 33 90 35 L 92 41 L 97 42 L 102 36 C 103 35 105 36 104 38 L 102 48" />
      <path d="M 82 46 C 81 50 82 56 86 60 C 91 64 98 64 103 58 C 106 53 105 48 102 48" />
      {/* Eye & muzzle */}
      <circle cx="94" cy="50" r="1.2" fill="currentColor" stroke="none" />
      <path d="M 103 54 L 111 53 M 102 57 L 110 58" />
      {/* Chest and front walking leg (forward) */}
      <path d="M 85 61 C 82 68 80 76 82 86 L 86 98 C 87 100 90 100 91 98 L 88 84" />
      {/* Front walking leg (back) */}
      <path d="M 78 72 L 74 96 C 74 98 77 99 79 97 L 82 82" />
      {/* Supple back line to rump */}
      <path d="M 82 47 C 68 48 54 50 42 54 C 36 56 32 60 30 68" />
      {/* Back leg (stepping back) */}
      <path d="M 30 68 C 28 76 26 84 22 94 C 21 96 24 98 26 97 L 33 82" />
      {/* Back leg (stepping forward) */}
      <path d="M 36 68 C 36 74 38 82 42 96 C 43 98 46 98 47 96 L 44 76" />
      {/* Underbelly */}
      <path d="M 44 74 C 54 74 66 72 76 68" />
      {/* S-curved confident upright tail */}
      <path d="M 32 62 C 30 48 32 32 38 22 C 42 16 48 14 50 18 C 51 22 47 26 43 30" />
    </svg>
  )
}

export default CatWalking
