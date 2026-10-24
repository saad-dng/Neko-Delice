import React from 'react'

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  className?: string
}

export function VisuallyHidden({
  children,
  className = '',
  ...props
}: VisuallyHiddenProps) {
  return (
    <span className={`sr-only ${className}`} {...props}>
      {children}
    </span>
  )
}

export default VisuallyHidden
