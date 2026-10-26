import type React from 'react'

export interface WaveProps extends React.SVGProps<SVGSVGElement> {
  fill?: string
  flip?: boolean
  className?: string
}

/**
 * Wave — Soft, gentle sinusoidal section divider edge
 * aria-hidden, responsive SVG with optional vertical flip
 */
export function Wave({
  fill = 'currentColor',
  flip = false,
  className = '',
  ...props
}: WaveProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 block"
        fill="none"
        {...props}
      >
        <path
          d="M 0 0 C 360 36 720 48 1080 24 C 1260 12 1380 4 1440 0 L 1440 48 L 0 48 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}

export default Wave
