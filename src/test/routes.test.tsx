import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { routes } from '../routes'
import { PRODUCT_SLUGS, PRODUCT_META, isProductSlug } from '../data/slugs'
import { Layout } from '../components/layout/Layout'
import { NotFoundPage } from '../pages/NotFound'
import { ProductPage } from '../pages/Product'

describe('Route Architecture & Layout Shell (P07)', () => {
  it('defines the 10 fixed product slugs with required metadata', () => {
    expect(PRODUCT_SLUGS).toHaveLength(10)
    for (const slug of PRODUCT_SLUGS) {
      expect(isProductSlug(slug)).toBe(true)
      const meta = PRODUCT_META[slug]
      expect(meta).toBeDefined()
      expect(meta?.slug).toBe(slug)
      expect(meta?.name.length).toBeGreaterThan(0)
      expect(meta?.short.length).toBeGreaterThan(0)
    }
  })

  it('declares all expected routes in RouteRecord hierarchy', () => {
    expect(routes).toHaveLength(1)
    const rootRoute = routes[0]
    expect(rootRoute?.path).toBe('/')
    expect(rootRoute?.children).toBeDefined()

    const childPaths = rootRoute?.children?.map((c) => ('index' in c && c.index ? '/' : c.path))
    expect(childPaths).toContain('/')
    expect(childPaths).toContain('shop')
    expect(childPaths).toContain('product/:slug')
    expect(childPaths).toContain('meal-plan')
    expect(childPaths).toContain('about')
    expect(childPaths).toContain('*')
  })

  it('renders Layout with SkipLink first, Header landmarks, and Footer disclosures', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <h1>Test Heading</h1>
        </Layout>
      </MemoryRouter>
    )

    // SkipLink is the first focusable element targeting #main
    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    expect(skipLink).not.toBeNull()
    expect(skipLink.getAttribute('href')).toBe('#main')

    // Header landmark
    const header = container.querySelector('header')
    expect(header).not.toBeNull()
    if (header) {
      const headerQueries = within(header)
      expect(headerQueries.getByRole('link', { name: 'Shop' })).not.toBeNull()
      expect(headerQueries.getByRole('link', { name: 'Meal Planner' })).not.toBeNull()
      expect(headerQueries.getByRole('link', { name: 'About' })).not.toBeNull()
    }

    // Currency segmented control and Bag button with accessible name
    expect(screen.getAllByRole('button', { name: /^USD$/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /^BDT$/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Open bag, 0 items/i })).not.toBeNull()

    // Main landmark with id="main" and tabIndex="-1"
    const main = container.querySelector('main#main')
    expect(main).not.toBeNull()
    expect(main?.getAttribute('tabindex')).toBe('-1')

    // Footer landmark with care, accessibility statements, and creator credit
    const footer = container.querySelector('footer')
    expect(footer).not.toBeNull()
    expect(footer?.textContent).toContain('Honest food, quiet design.')
    expect(footer?.textContent).toContain('Care & Standards')
    expect(footer?.textContent).toContain('NEKO DELICE is committed to digital accessibility.')
    expect(footer?.textContent).toContain('Made with')
    expect(footer?.textContent).toContain('Saad Bin Kabir')

    const creatorLink = within(footer!).getByRole('link', { name: 'Saad Bin Kabir' })
    expect(creatorLink.getAttribute('href')).toBe('https://www.instagram.com/saaad.dng/')
    expect(creatorLink.getAttribute('target')).toBe('_blank')
    expect(creatorLink.getAttribute('rel')).toContain('noopener')
  })

  it('renders NotFoundPage with CatSitting illustration and single h1', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )

    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain("We couldn't find that page.")

    // Recovers with shop and meal plan links
    expect(screen.getByRole('link', { name: /Shop the collection/i })).not.toBeNull()
    expect(screen.getByRole('link', { name: /Try the meal planner/i })).not.toBeNull()

    // Contains cat art SVG
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('renders ProductPage for valid slug', () => {
    render(
      <MemoryRouter initialEntries={['/product/kitten-growth-mousse-broth']}>
        <Routes>
          <Route path="/product/:slug" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Kitten Growth Mousse & Broth'
    )
  })

  it('renders ProductPage fallback to NotFound for invalid slug', () => {
    render(
      <MemoryRouter initialEntries={['/product/unknown-dog-food']}>
        <Routes>
          <Route path="/product/:slug" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      "We couldn't find that page."
    )
  })
})
