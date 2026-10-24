import React from 'react'
import { Icon } from './Icon'

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  onRemove?: () => void
  removeLabel?: string
  className?: string
}

export function Chip({
  children,
  onRemove,
  removeLabel = 'Remove filter',
  className = '',
  ...props
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 pl-3.5 pr-1 py-1 bg-oat-100 text-espresso-900 rounded-full text-sm font-sans font-medium min-h-[44px] ${className}`}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center w-11 h-11 rounded-full text-espresso-900/70 hover:text-espresso-900 hover:bg-espresso-900/10 cursor-pointer -mr-1"
          aria-label={removeLabel}
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </span>
  )
}

export default Chip
