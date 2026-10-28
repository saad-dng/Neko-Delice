import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div
      className={`w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container
