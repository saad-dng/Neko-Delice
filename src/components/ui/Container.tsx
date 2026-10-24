import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div
      className={`w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container
