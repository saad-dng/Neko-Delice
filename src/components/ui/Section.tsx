import React from 'react'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
  reveal?: boolean
  defer?: boolean
}

export function Section({
  children,
  className = '',
  reveal: _reveal = false,
  defer: _defer = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={`py-12 md:py-20 lg:py-24 ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export default Section
