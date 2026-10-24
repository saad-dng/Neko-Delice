import React from 'react'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4
  children: React.ReactNode
  className?: string
}

export function Heading({
  level = 2,
  children,
  className = '',
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const
  const levelClasses = {
    1: 'font-serif font-semibold text-espresso-900 leading-[1.15] text-[clamp(2rem,1.4rem+2.5vw,4rem)]',
    2: 'font-serif font-semibold text-espresso-900 leading-[1.2] text-[clamp(1.6rem,1.2rem+1.8vw,2.5rem)]',
    3: 'font-serif font-medium text-espresso-900 leading-[1.25] text-[clamp(1.3rem,1.1rem+1vw,1.75rem)]',
    4: 'font-serif font-medium text-espresso-900 leading-[1.3] text-xl',
  }

  return (
    <Tag className={`${levelClasses[level]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export default Heading
