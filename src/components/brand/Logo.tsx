import type React from 'react'
import { Link } from 'react-router-dom'

export interface LogoProps {
  /**
   * Layout variant:
   * - `stacked`: Glyph centered above wordmark (About, Footer, 404, Splash)
   * - `compact`: Glyph on the left, wordmark on the right (Header / Sticky Nav)
   * - `glyph`: SVG cat-head glyph only
   */
  variant?: 'stacked' | 'compact' | 'glyph'
  /**
   * Target destination if rendered as a navigation link (default: '/')
   */
  to?: string
  /**
   * Whether to wrap in a router Link (default: true)
   */
  asLink?: boolean
  /**
   * Size of the glyph in pixels (optional custom override)
   */
  glyphSize?: number
  className?: string
}

/**
 * Monoline cat-head glyph matching the exact brand identity debossed artwork.
 * 64x64 viewBox, stroke 2.2, round caps and joins.
 */
export function CatGlyph({
  size = 32,
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M 14.5 12.5 L 23.5 25.5 C 26 23.5 38 23.5 40.5 25.5 L 49.5 12.5 C 52 20 54 26 54 31.5 C 54 44 43.5 53 32 53 C 20.5 53 10 44 10 31.5 C 10 26 12 20 14.5 12.5 Z" />
    </svg>
  )
}

export function Logo({
  variant = 'compact',
  to = '/',
  asLink = true,
  glyphSize,
  className = '',
}: LogoProps) {
  // Size calculations per variant
  const defaultGlyphSize =
    glyphSize ?? (variant === 'stacked' ? 56 : variant === 'glyph' ? 32 : 28)

  const renderContent = () => {
    if (variant === 'glyph') {
      return (
        <CatGlyph
          size={defaultGlyphSize}
          className="text-espresso-900 transition-transform origin-bottom group-hover/logo:animate-ear-twitch group-focus-visible/logo:animate-ear-twitch"
        />
      )
    }

    if (variant === 'stacked') {
      return (
        <div className="flex flex-col items-center text-center">
          <CatGlyph
            size={defaultGlyphSize}
            className="text-espresso-900 mb-3 transition-transform origin-bottom group-hover/logo:animate-ear-twitch group-focus-visible/logo:animate-ear-twitch"
          />
          <div className="flex flex-col items-center font-serif font-semibold uppercase text-espresso-950 leading-tight select-none">
            <span className="text-2xl sm:text-3xl tracking-[0.24em] pl-[0.24em]">
              NEKO
            </span>{' '}
            <span className="text-base sm:text-lg tracking-[0.3em] pl-[0.3em] opacity-95">
              DELICE
            </span>
          </div>
        </div>
      )
    }

    // Default: 'compact' (glyph on left, wordmark on right)
    return (
      <div className="inline-flex items-center gap-3">
        <CatGlyph
          size={defaultGlyphSize}
          className="text-espresso-900 transition-transform origin-bottom group-hover/logo:animate-ear-twitch group-focus-visible/logo:animate-ear-twitch"
        />
        <div className="flex flex-col font-serif font-semibold uppercase text-espresso-950 leading-none select-none">
          {/* Mobile: two compact lines */}
          <span className="sm:hidden flex flex-col tracking-[0.2em] pl-[0.2em]">
            <span className="text-base leading-tight">NEKO</span>
            <span className="text-[0.6875rem] tracking-[0.26em] pl-[0.06em] opacity-95">
              DELICE
            </span>
          </span>
          {/* Desktop (>= 640px): single horizontal line */}
          <span className="hidden sm:inline-block text-lg tracking-[0.22em] pl-[0.22em] whitespace-nowrap">
            NEKO DELICE
          </span>
        </div>
      </div>
    )
  }

  if (asLink) {
    return (
      <Link
        to={to}
        aria-label="NEKO DELICE home"
        className={`group/logo inline-flex items-center text-espresso-900 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-espresso-900 focus-visible:outline-offset-4 rounded-sm ${className}`}
      >
        {renderContent()}
      </Link>
    )
  }

  return (
    <div className={`group/logo inline-flex items-center text-espresso-900 ${className}`}>
      {renderContent()}
    </div>
  )
}

export default Logo
