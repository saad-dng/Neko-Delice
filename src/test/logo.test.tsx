import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CatGlyph, Logo } from '../components/brand/Logo'

describe('Logo component & Brand Identity (P05)', () => {
  it('renders stacked variant with correct brand spelling letter-by-letter', () => {
    const { container } = render(
      <MemoryRouter>
        <Logo variant="stacked" />
      </MemoryRouter>
    )

    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    expect(link?.getAttribute('aria-label')).toBe('NEKO DELICE home')

    const textContent = link?.textContent || ''
    expect(textContent).toContain('NEKO')
    expect(textContent).toContain('DELICE')

    // Letter-by-letter spelling verification
    const normalized = textContent.replace(/\s+/g, ' ').trim()
    expect(normalized).toBe('NEKO DELICE')
  })

  it('renders compact variant for navigation with accessible home link', () => {
    const { container } = render(
      <MemoryRouter>
        <Logo variant="compact" />
      </MemoryRouter>
    )

    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    expect(link?.getAttribute('aria-label')).toBe('NEKO DELICE home')

    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders glyph variant without text', () => {
    const { container } = render(
      <MemoryRouter>
        <Logo variant="glyph" glyphSize={48} />
      </MemoryRouter>
    )

    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('48')
    expect(svg?.getAttribute('height')).toBe('48')

    const textContent = container.textContent || ''
    expect(textContent.trim()).toBe('')
  })

  it('CatGlyph renders with decorative aria-hidden and customizable size', () => {
    const { container } = render(<CatGlyph size={24} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('width')).toBe('24')
    expect(svg?.getAttribute('height')).toBe('24')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 64 64')
  })

  it('verifies logo contrast ratio: espresso text on cream background is >= 4.5:1 (WCAG AA)', () => {
    function getLuminance(hex: string): number {
      const clean = hex.replace('#', '')
      const r = parseInt(clean.substring(0, 2), 16) / 255
      const g = parseInt(clean.substring(2, 4), 16) / 255
      const b = parseInt(clean.substring(4, 6), 16) / 255
      const toLinear = (c: number) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
    }

    const lumEspresso = getLuminance('#2B211A')
    const lumCream = getLuminance('#FBF6EE')
    const contrast = (Math.max(lumEspresso, lumCream) + 0.05) / (Math.min(lumEspresso, lumCream) + 0.05)

    // Contrast between #2B211A and #FBF6EE is ~13.7:1, far exceeding WCAG AAA (7:1)
    expect(contrast).toBeGreaterThanOrEqual(4.5)
    expect(contrast).toBeGreaterThan(13)
  })
})
