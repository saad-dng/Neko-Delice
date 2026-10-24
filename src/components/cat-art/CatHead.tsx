import type { CatArtProps } from './types'

/**
 * CatHead — Official NEKO DELICE brand glyph
 * Reuses the debossed packaging logo glyph, centered in a 120x120 viewBox.
 */
export function CatHead({ className = '', title, ...props }: CatArtProps) {
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
      <path d="M 26.8 21.5 L 43.8 46.2 C 48.6 42.4 71.4 42.4 76.2 46.2 L 93.2 21.5 C 98 35.8 101.8 47.2 101.8 57.6 C 101.8 81.4 81.9 98.5 60 98.5 C 38.1 98.5 18.2 81.4 18.2 57.6 C 18.2 47.2 22 35.8 26.8 21.5 Z" />
    </svg>
  )
}

export default CatHead
