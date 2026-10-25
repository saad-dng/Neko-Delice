import {
  buildProgressiveBlurLayers,
  DEFAULT_BANDS,
  DEFAULT_BLURS,
  PROGRESSIVE_BLUR_LAYERS,
} from '@/lib/progressiveBlur'

export interface ProgressiveBlurProps {
  height?: number | string
  tint?: string
  direction?: 'top' | 'bottom'
  className?: string
}

export function ProgressiveBlur({
  height = '100%',
  tint = 'linear-gradient(to bottom, rgba(254, 252, 247, 0.88) 0%, rgba(254, 252, 247, 0.55) 60%, rgba(254, 252, 247, 0) 100%)',
  direction = 'top',
  className = '',
}: ProgressiveBlurProps) {
  const layers =
    direction === 'top'
      ? PROGRESSIVE_BLUR_LAYERS
      : buildProgressiveBlurLayers(DEFAULT_BANDS, DEFAULT_BLURS, direction)

  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`absolute inset-x-0 pointer-events-none overflow-hidden select-none ${
        direction === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      style={{ height: heightStyle }}
      aria-hidden="true"
    >
      {layers.map((layer, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
      {/* Readability tint sitting cleanly above all blur bands */}
      <div className="absolute inset-0" style={{ background: tint }} />
    </div>
  )
}

export default ProgressiveBlur
