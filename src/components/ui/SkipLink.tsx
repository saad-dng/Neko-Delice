import React from 'react'

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string
  children?: React.ReactNode
  className?: string
}

export function SkipLink({
  targetId = 'main-content',
  children = 'Skip to main content',
  className = '',
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:bg-cream-50 focus:text-espresso-900 focus:font-medium focus:rounded-md focus:shadow-md focus:outline-2 focus:outline-espresso-900 ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}

export default SkipLink
