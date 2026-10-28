import type React from 'react'

export interface CatCardProps {
  pose: React.ReactNode
  title: string
  description: string
  href?: string
  selected?: boolean
  onSelect?: () => void
  className?: string
  badge?: string
  variant?: 'default' | 'flat'
}

/**
 * CatCard — Interactive card pairing a monoline cat pose, title, and description
 * Renders as a semantic <a> or <button>, tilts cat head on hover/focus-visible, 44px min target
 */
export function CatCard({
  pose,
  title,
  description,
  href,
  selected = false,
  onSelect,
  className = '',
  badge,
  variant = 'default',
}: CatCardProps) {
  const commonClasses = variant === 'flat'
    ? `
      group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl
      min-h-[140px] cursor-pointer
      transition-all duration-200 ease-out
      hover:bg-cream-50/70 focus-visible:bg-cream-50/70
      focus-visible:outline-2 focus-visible:outline-[var(--color-terracotta-600,#A94F33)] focus-visible:outline-offset-2
      ${className}
    `
    : `
      group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl
      min-h-[140px] cursor-pointer
      border transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out
      hover:-translate-y-1 focus-visible:-translate-y-1
      active:translate-y-0 active:scale-[0.99]
      focus-visible:outline-2 focus-visible:outline-[var(--color-terracotta-600,#A94F33)] focus-visible:outline-offset-2
      ${
        selected
          ? 'bg-cream-50 border-terracotta-600 shadow-md ring-1 ring-terracotta-600'
          : 'bg-cream-50/90 border-[#2B211A]/10 shadow-xs hover:shadow-md hover:border-[#2B211A]/25'
      }
      ${className}
    `

  const content = (
    <>
      {badge ? (
        <span className="absolute top-3 right-3 text-[11px] uppercase tracking-wider font-medium text-terracotta-700 bg-terracotta-100/80 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      ) : null}
      <div className="h-28 flex items-center justify-center text-espresso-800 mb-3 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-3 group-focus-visible:rotate-3">
        {pose}
      </div>
      <h3 className="font-serif text-[20px] text-espresso-950 font-semibold leading-snug mb-1 group-hover:text-terracotta-700 transition-colors">
        {title}
      </h3>
      <p className="text-[15px] text-espresso-800/85 leading-snug max-w-[260px]">
        {description}
      </p>
    </>
  )

  if (href && !onSelect) {
    return (
      <a href={href} className={commonClasses}>
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={commonClasses}
    >
      {content}
    </button>
  )
}

export default CatCard
