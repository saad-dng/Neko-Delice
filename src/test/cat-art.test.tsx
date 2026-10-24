import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import {
  CatHead,
  CatSleeping,
  CatStretching,
  CatSitting,
  CatPlayful,
  CatPeeking,
} from '../components/cat-art'

describe('Monoline Cat Illustration Set (P06)', () => {
  const components = [
    { name: 'CatHead', Component: CatHead },
    { name: 'CatSleeping', Component: CatSleeping },
    { name: 'CatStretching', Component: CatStretching },
    { name: 'CatSitting', Component: CatSitting },
    { name: 'CatPlayful', Component: CatPlayful },
    { name: 'CatPeeking', Component: CatPeeking },
  ]

  it('renders all six components with correct SVG viewBox and stroke attributes', () => {
    for (const { name, Component } of components) {
      const { container } = render(<Component />)
      const svg = container.querySelector('svg')
      expect(svg, `${name} should render an svg element`).toBeTruthy()
      expect(svg?.getAttribute('viewBox')).toBe('0 0 120 120')
      expect(svg?.getAttribute('stroke')).toBe('currentColor')
      expect(svg?.getAttribute('stroke-width')).toBe('2')
      expect(svg?.getAttribute('stroke-linecap')).toBe('round')
      expect(svg?.getAttribute('stroke-linejoin')).toBe('round')
      expect(svg?.getAttribute('fill')).toBe('none')
      expect(svg?.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('renders accessible title when title prop is provided', () => {
    for (const { name, Component } of components) {
      const customTitle = `${name} title test`
      const { container } = render(<Component title={customTitle} />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('aria-hidden')).toBeNull()
      expect(svg?.getAttribute('role')).toBe('img')
      const titleEl = container.querySelector('title')
      expect(titleEl?.textContent).toBe(customTitle)
    }
  })

  it('applies custom className correctly for sizing and styling', () => {
    for (const { Component } of components) {
      const { container } = render(<Component className="w-12 h-12 text-espresso-900" />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('class')).toContain('w-12')
      expect(svg?.getAttribute('class')).toContain('h-12')
      expect(svg?.getAttribute('class')).toContain('text-espresso-900')
    }
  })
})
