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
          {/* Arched tote handle */}
          <path d="M9 7.5V5.5a3 3 0 0 1 6 0v2" />
          {/* Feline tote with perky cat ears at the top rim */}
          <path d="M5 8.5 L6.8 5 L8.8 8.5 L15.2 8.5 L17.2 5 L19 8.5 L17.8 20.2 a1.8 1.8 0 0 1 -1.8 1.8 H8 a1.8 1.8 0 0 1 -1.8 -1.8 Z" />
          {/* Miniature debossed cat paw insignia on the bag face */}
          <path
            d="M10.8 16.2 c-.6-.8 0-1.6.8-1.4.8-.2 1.4.6.8 1.4-.4.5-1.2.5-1.6 0z"
            fill="currentColor"
            stroke="none"
          />
          <circle cx="9.6" cy="13.6" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="11.2" cy="12.4" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="12.8" cy="12.4" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="14.4" cy="13.6" r="0.75" fill="currentColor" stroke="none" />
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
