import React from 'react'
import { Link, type LinkProps } from 'react-router-dom'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  asChild?: boolean
  to?: LinkProps['to']
  children: React.ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  asChild = false,
  to,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-sans font-medium text-center transition-colors min-h-[48px] px-6 rounded-full cursor-pointer select-none text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

  const variantClasses = {
    primary:
      'bg-terracotta-600 text-cream-50 hover:bg-[#92422A] active:bg-[#7D3823] shadow-none',
    secondary:
      'bg-transparent text-espresso-900 border border-espresso-900 hover:bg-espresso-900/5 active:bg-espresso-900/10',
    tertiary:
      'bg-transparent text-terracotta-600 hover:text-[#92422A] underline underline-offset-4 px-2 min-h-[44px]',
  }

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (asChild && to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
