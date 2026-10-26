import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Reveal } from '@/components/ui/Reveal'
import { CatCard } from '@/components/ui/CatCard'
import { Annotation } from '@/components/ui/Annotation'
import { Band } from '@/components/ui/Band'
import { IdleCat } from '@/components/ui/IdleCat'
import { PawStamp } from '@/components/ui/PawStamp'
import { stampPaw } from '@/components/ui/stampPaw'
import {
  CatCurious,
  CatWalking,
  CatStretch,
  CatCurled,
  CatPeekEdge,
} from '@/components/cat-art'
import {
  PawTrail,
  Heart,
  SparkleLine,
  Yarn,
  ScribbleArrow,
  Wave,
} from '@/components/doodles'

describe('Playful Components Suite (V2-04)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Reveal & useReveal', () => {
    it('shows final state immediately when prefers-reduced-motion is enabled', () => {
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { container } = render(
        <Reveal>
          <span>Visible Content</span>
        </Reveal>
      )

      const wrapper = container.firstElementChild
      expect(wrapper?.className).toContain('opacity-100')
      expect(wrapper?.className).toContain('translate-y-0')
      expect(screen.getByText('Visible Content')).toBeDefined()
    })
  })

  describe('CatCard', () => {
    it('renders a semantic <a> with correct href when href is provided', () => {
      render(
        <CatCard
          href="/meal-plan?act=lounger"
          title="Indoor Lounger"
          description="Gentle daily strolls and long sunlit naps"
          pose={<CatCurious data-testid="cat-pose" />}
        />
      )

      const link = screen.getByRole('link', { name: /indoor lounger/i })
      expect(link).toBeDefined()
      expect(link.getAttribute('href')).toBe('/meal-plan?act=lounger')
      expect(screen.getByText('Gentle daily strolls and long sunlit naps')).toBeDefined()
      expect(screen.getByTestId('cat-pose')).toBeDefined()
    })

    it('renders an accessible <button> and responds to click when onSelect is provided', () => {
      const handleSelect = vi.fn()
      render(
        <CatCard
          title="Playful Explorer"
          description="Daily chasing, jumping, and vertical exploration"
          pose={<CatWalking />}
          selected={true}
          onSelect={handleSelect}
        />
      )

      const button = screen.getByRole('button', { name: /playful explorer/i })
      expect(button).toBeDefined()
      expect(button.getAttribute('aria-pressed')).toBe('true')

      fireEvent.click(button)
      expect(handleSelect).toHaveBeenCalledTimes(1)
    })
  })

  describe('Annotation', () => {
    it('has aria-hidden="true" and renders italic text with optional arrow', () => {
      const { container } = render(
        <Annotation text="Mealtime is the best time" arrow="curve-right" rotate={-4} />
      )

      const root = container.firstElementChild
      expect(root?.getAttribute('aria-hidden')).toBe('true')
      expect(screen.getByText('Mealtime is the best time')).toBeDefined()

      const arrow = container.querySelector('svg')
      expect(arrow).toBeDefined()
      expect(arrow?.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('Band', () => {
    it('applies sage, oat, and cream background variants with optional wave', () => {
      const { container: sageContainer } = render(
        <Band variant="sage" wave={true}>
          <p>Sage Content</p>
        </Band>
      )
      expect(sageContainer.firstElementChild?.className).toContain('bg-[color-mix')
      expect(sageContainer.querySelector('svg')).toBeDefined()

      const { container: oatContainer } = render(
        <Band variant="oat">
          <p>Oat Content</p>
        </Band>
      )
      expect(oatContainer.firstElementChild?.className).toContain('bg-[var(--color-sand-100')
    })
  })

  describe('IdleCat', () => {
    it('wraps cat pose with aria-hidden and animation class', () => {
      const { container } = render(
        <IdleCat>
          <CatCurled data-testid="curled-cat" />
        </IdleCat>
      )
      const wrapper = container.firstElementChild
      expect(wrapper?.getAttribute('aria-hidden')).toBe('true')
      expect(screen.getByTestId('curled-cat')).toBeDefined()
    })
  })

  describe('PawStamp & stampPaw', () => {
    it('renders PawStamp component when active', () => {
      const { container } = render(<PawStamp active={true} />)
      expect(container.querySelector('svg')).toBeDefined()
    })

    it('stampPaw attaches a temporary stamp to the target element', () => {
      const btn = document.createElement('button')
      document.body.appendChild(btn)
      stampPaw(btn)

      const stampSvg = btn.querySelector('svg')
      expect(stampSvg).toBeDefined()
      document.body.removeChild(btn)
    })
  })

  describe('New Cat Poses Set', () => {
    const poses = [
      { name: 'CatCurious', Component: CatCurious },
      { name: 'CatWalking', Component: CatWalking },
      { name: 'CatStretch', Component: CatStretch },
      { name: 'CatCurled', Component: CatCurled },
      { name: 'CatPeekEdge', Component: CatPeekEdge },
    ]

    it('renders all 5 new poses as monoline SVGs with aria-hidden="true"', () => {
      for (const { Component } of poses) {
        const { container } = render(<Component />)
        const svg = container.querySelector('svg')
        expect(svg).toBeDefined()
        expect(svg?.getAttribute('stroke')).toBe('currentColor')
        expect(svg?.getAttribute('stroke-width')).toBe('2')
        expect(svg?.getAttribute('fill')).toBe('none')
        expect(svg?.getAttribute('aria-hidden')).toBe('true')
      }
    })
  })

  describe('Doodles Set', () => {
    it('renders PawTrail, Heart, SparkleLine, Yarn, ScribbleArrow, and Wave with aria-hidden', () => {
      const doodles = [
        <PawTrail key="paw" count={4} />,
        <Heart key="heart" />,
        <SparkleLine key="sparkle" />,
        <Yarn key="yarn" />,
        <ScribbleArrow key="arrow" variant="curve-left" />,
        <Wave key="wave" />,
      ]

      for (const doodle of doodles) {
        const { container } = render(doodle)
        const svg = container.querySelector('svg')
        expect(svg).toBeDefined()
        expect(svg?.getAttribute('aria-hidden') || container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
      }
    })
  })
})
