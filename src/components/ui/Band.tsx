import type React from 'react'
import { Wave } from '@/components/doodles/Wave'

export interface BandProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'cream' | 'oat' | 'sage'
  wave?: boolean
  waveFill?: string
  waveFlip?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: React.ElementType
  children: React.ReactNode
  className?: string
}

const variantStyles = {
  cream: 'bg-[var(--color-cream-50,#FBF6EE)]',
  oat: 'bg-[var(--color-sand-100,#F2E8D7)]',
  sage: 'bg-[color-mix(in_srgb,var(--color-sage-400,#9DAA8B)_12%,var(--color-cream-50,#FBF6EE))]',
}

const variantWaveFills = {
  cream: '#FBF6EE',
  oat: '#F2E8D7',
  sage: 'color-mix(in srgb, #9DAA8B 12%, #FBF6EE)',
}

const paddingStyles = {
  none: '',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16 md:py-20',
  lg: 'py-16 sm:py-24 md:py-28',
}

/**
 * Band — Section background wrapper with calm tones, optional wave divider, and fluid spacing
 */
export function Band({
  variant = 'cream',
  wave = false,
  waveFill,
  waveFlip = false,
  padding = 'md',
  as: Component = 'section',
  children,
  className = '',
  ...props
}: BandProps) {
  const bgClass = variantStyles[variant] || variantStyles.cream
  const fill = waveFill || variantWaveFills[variant] || variantWaveFills.cream

  return (
    <Component className={`relative w-full ${bgClass} ${className}`} {...props}>
      {wave ? (
        <div className="absolute top-0 left-0 w-full -translate-y-[99%] pointer-events-none z-10">
          <Wave fill={fill} flip={waveFlip} />
        </div>
      ) : null}
      <div className={`w-full ${paddingStyles[padding]}`}>
        {children}
      </div>
    </Component>
  )
}

export default Band
