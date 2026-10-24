import { describe, expect, it } from 'vitest'

// Helper function to calculate relative luminance according to WCAG 2.1 specs
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  const R = toLinear(r)
  const G = toLinear(g)
  const B = toLinear(b)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1)
  const lum2 = getLuminance(hex2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

describe('Design Tokens Contrast Ratios (WCAG AA)', () => {
  const colors = {
    cream50: '#FBF6EE',
    oat100: '#E5D8BC',
    beige200: '#DDD0BA',
    espresso900: '#2B211A',
    terracotta600: '#A94F33',
    oak600: '#8B6A45',
  }

  it('espresso on cream >= 4.5:1 (passes comfortably >= 10:1)', () => {
    const ratio = getContrastRatio(colors.espresso900, colors.cream50)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('espresso on oat >= 4.5:1', () => {
    const ratio = getContrastRatio(colors.espresso900, colors.oat100)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('espresso on beige >= 4.5:1', () => {
    const ratio = getContrastRatio(colors.espresso900, colors.beige200)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('cream on terracotta-600 >= 4.5:1 (button text)', () => {
    const ratio = getContrastRatio(colors.cream50, colors.terracotta600)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('terracotta-600 on cream >= 4.5:1 (accent text)', () => {
    const ratio = getContrastRatio(colors.terracotta600, colors.cream50)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  it('oak-600 on cream >= 4.5:1 (wood-tone details & hardware accent)', () => {
    const ratio = getContrastRatio(colors.oak600, colors.cream50)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})
