import type { CatArtProps } from './types'

/**
 * CatPeekEdge — Cat head and two paws peeking over an edge or horizontal border
 * Monoline 2px SVG, currentColor, aria-hidden
 */
export function CatPeekEdge({ className = '', title, ...props }: CatArtProps) {
  return (
    <svg
      viewBox="0 0 120 60"
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
      {/* Ears & crown */}
      <path d="M 38 42 L 40 18 C 41 16 43 16 45 18 L 52 28 L 68 28 L 75 18 C 77 16 79 16 80 18 L 82 42" />
      {/* Head cheeks */}
      <path d="M 38 42 C 34 46 34 52 38 56" />
      <path d="M 82 42 C 86 46 86 52 82 56" />
      {/* Large curious eyes */}
      <ellipse cx="50" cy="38" rx="3" ry="3.5" fill="currentColor" stroke="none" />
      <ellipse cx="70" cy="38" rx="3" ry="3.5" fill="currentColor" stroke="none" />
      {/* Small nose and mouth line */}
      <path d="M 58 44 L 62 44 L 60 46 Z" fill="currentColor" stroke="none" />
      <path d="M 60 47 L 60 50 C 58 51 56 50 54 49 M 60 50 C 62 51 64 50 66 49" />
      {/* Whiskers */}
      <path d="M 40 46 L 24 44 M 40 50 L 22 51 M 80 46 L 96 44 M 80 50 L 98 51" />
      {/* Left paw resting on rim */}
      <path d="M 30 58 C 30 52 38 52 42 52 C 45 52 46 54 46 58" />
      <path d="M 34 54 L 34 58 M 38 54 L 38 58" />
      {/* Right paw resting on rim */}
      <path d="M 74 58 C 74 54 75 52 78 52 C 82 52 90 52 90 58" />
      <path d="M 82 54 L 82 58 M 86 54 L 86 58" />
    </svg>
  )
}

export default CatPeekEdge
