import React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name:
    | 'bag'
    | 'close'
    | 'plus'
    | 'minus'
    | 'chevron'
    | 'filter'
    | 'check'
    | 'arrow'
    | 'globe'
  size?: number | string
}

export function Icon({ name, size = 24, className = '', ...props }: IconProps) {
  const commonProps: React.SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: `inline-block shrink-0 ${className}`,
    'aria-hidden': true,
    ...props,
  }

  switch (name) {
    case 'bag':
      return (
        <svg {...commonProps}>
          <path d="M6 8h12l1.5 12H4.5L6 8z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
      )
    case 'close':
      return (
        <svg {...commonProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...commonProps}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    case 'minus':
      return (
        <svg {...commonProps}>
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...commonProps}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )
    case 'filter':
      return (
        <svg {...commonProps}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      )
    case 'check':
      return (
        <svg {...commonProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...commonProps}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    default:
      return null
  }
}

export default Icon
