export interface BlurLayer {
  blur: number
  mask: string
}

/**
 * Builds the banded progressive-blur layers.
 * Each layer only blurs a thin horizontal band, and the blur radius
 * increases as the bands get closer to the edge. Overlapping several
 * semi-blurred bands ramps up the blur amount smoothly (0 -> 1 -> 2 -> 4 -> 8 -> 16 -> 32 -> 48px)
 * without hard-edged ghosting or cutoff lines.
 */
export function buildProgressiveBlurLayers(
  bands: number[][],
  blurs: number[],
  direction: 'top' | 'bottom' = 'top'
): BlurLayer[] {
  const gradientDir = direction === 'top' ? 'to bottom' : 'to top'

  return bands.map((stops, i) => {
    const blur = blurs[i] ?? 0
    let mask: string
    if (stops.length === 3) {
      const [a, b, c] = stops
      mask = `linear-gradient(${gradientDir}, black ${a}%, black ${b}%, transparent ${c}%)`
    } else {
      const [a, b, c, d] = stops
      mask = `linear-gradient(${gradientDir}, transparent ${a}%, black ${b}%, black ${c}%, transparent ${d}%)`
    }
    return { blur, mask }
  })
}

export const DEFAULT_BANDS: number[][] = [
  [0, 12.5, 25],
  [0, 12.5, 25, 37.5],
  [12.5, 25, 37.5, 50],
  [25, 37.5, 50, 62.5],
  [37.5, 50, 62.5, 75],
  [50, 62.5, 75, 87.5],
  [62.5, 75, 87.5, 100],
]

export const DEFAULT_BLURS = [48, 32, 16, 8, 4, 2, 1]

export const PROGRESSIVE_BLUR_LAYERS: BlurLayer[] = buildProgressiveBlurLayers(
  DEFAULT_BANDS,
  DEFAULT_BLURS,
  'top'
)
