import React from 'react'
import { Link, type LinkProps } from 'react-router-dom'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  asChild?: boolean
  to?: LinkProps['to']
  children: React.ReactNode
  className?: string
  catIcon?: 'paw' | 'head' | 'none'
  catIconPosition?: 'left' | 'right'
}

export function Button({
  variant = 'primary',
  asChild = false,
  to,
  children,
  className = '',
  disabled,
  catIcon: _catIcon = 'none',
  catIconPosition: _catIconPosition = 'left',
  ...props
}: ButtonProps) {
  // Height: 56px desktop, 48px mobile. 16px / 500. No icons inside buttons per premium spec.
  const baseClasses =
    'group/btn inline-flex items-center justify-center gap-2 font-sans font-medium text-center transition-all duration-200 active:scale-[0.98] min-h-[48px] sm:min-h-[56px] h-12 sm:h-14 px-7 sm:px-8 rounded-full cursor-pointer select-none text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

  const variantClasses = {
    primary:
      'bg-terracotta-600 text-cream-50 hover:bg-[#92422A] active:bg-[#7D3823] shadow-xs hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
    secondary:
      'bg-oat-100/90 text-espresso-950 border border-sand-300 hover:bg-sage-50 hover:border-sage-300 hover:text-espresso-950 active:bg-sand-200/80 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
    tertiary:
      'bg-transparent text-terracotta-600 hover:text-[#92422A] underline underline-offset-4 px-2 min-h-[44px] h-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2',
  }

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`

  const content = <span>{children}</span>

  if (asChild && to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {content}
    </button>
  )
}

export default Button
