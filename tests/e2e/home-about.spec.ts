import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import fs from 'node:fs'
import path from 'node:path'

test.describe('Home Page (P14)', () => {
  test('renders hero with single h1, LCP image, bento grid, planner teaser, and featured products', async ({
    page,
  }) => {
    await page.goto('/')

    // Exactly one h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText('Feed your cat exactly what they need.')

    // Hero LCP image
    const heroImg = page.locator('section img[fetchpriority="high"]')
    await expect(heroImg).toBeVisible()
    await expect(heroImg).toHaveAttribute('alt', /Wild Salmon & Quail Paté/)

    // Primary & Secondary Hero CTAs
    const planCta = page.locator('a:has-text("Plan my cat\'s meals")').first()
    await expect(planCta).toHaveAttribute('href', '/meal-plan')

    const shopCta = page.locator('a:has-text("Shop the collection")').first()
    await expect(shopCta).toHaveAttribute('href', '/shop')

    // Bento Category Grid
    await expect(page.locator('h2:has-text("Everything your cat needs")')).toBeVisible()
    const bentoWet = page.locator('a[href="/shop?category=wet-food"]')
    await expect(bentoWet).toBeVisible()
    const bentoDry = page.locator('a[href="/shop?category=dry-food"]')
    await expect(bentoDry).toBeVisible()
    const bentoTreats = page.locator('a[href="/shop?category=treat-topper"]')
    await expect(bentoTreats).toBeVisible()
    const bentoLitter = page.locator('a[href="/shop?category=litter"]')
    await expect(bentoLitter).toBeVisible()
    const bentoHardware = page.locator('a[href="/shop?category=hardware"]')
    await expect(bentoHardware).toBeVisible()

    // Planner Teaser Section
    await expect(
      page.locator('h2:has-text("No guesswork. A meal plan tailored to your cat.")')
    ).toBeVisible()
    await expect(
      page.locator('text=Tell us the essentials')
    ).toBeVisible()
    await expect(
      page.locator('text=Clinical calculation')
    ).toBeVisible()
    await expect(
      page.locator('text=A month that lasts')
    ).toBeVisible()

    // Full Collection Products on Home (all 10 items)
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards).toHaveCount(10)

    // Category Filter Tab interaction
    const wetFoodTab = page.locator('button[role="tab"]:has-text("Wet Food")')
    await expect(wetFoodTab).toBeVisible()
    await wetFoodTab.click()
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2)

    // Switch back to All Items
    const allTab = page.locator('button[role="tab"]:has-text("All Items")')
    await allTab.click()
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(10)

    // Promise Strip (3 items)
    await expect(
      page.locator('h3:has-text("Formulated with a vet-informed approach")')
    ).toBeVisible()
    await expect(
      page.locator('h3:has-text("Short ingredient lists, no fillers")')
    ).toBeVisible()
    await expect(
      page.locator('h3:has-text("Know how long every bag lasts")')
    ).toBeVisible()

    // Closing CTA
    await expect(
      page.locator('h2:has-text("Honest food, quiet design, no guesswork.")')
    ).toBeVisible()
  })

  test('accessibility scan (axe) on Home page has zero serious or critical issues', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    )
    expect(seriousOrCritical).toEqual([])
  })
})

test.describe('About Page (P14)', () => {
  test('renders about page with single h1, philosophy, sourcing, ingredient close-ups, and Behind the Build case study', async ({
    page,
  }) => {
    await page.goto('/about')

    // Exactly one h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText('Honest food, quiet design')

    // Narrative sections
    await expect(page.locator('h2:has-text("Our approach")')).toBeVisible()
    await expect(page.locator('h2:has-text("Transparent sourcing")')).toBeVisible()
    await expect(page.locator('h2:has-text("Quality commitments")')).toBeVisible()

    // 4 Ingredient close-up cards
    await expect(page.locator('h2:has-text("Ingredient close-ups")')).toBeVisible()
    await expect(page.locator('text=Chicken Mousse & Broth')).toBeVisible()
    await expect(page.locator('text=Wild Salmon & Quail')).toBeVisible()
    await expect(page.locator('text=Oven-Baked Duck Kibble')).toBeVisible()
    await expect(page.locator('text=Cold-Filtered Salmon Oil')).toBeVisible()

    // Behind the Build section
    await expect(page.locator('h2:has-text("Behind the build")')).toBeVisible()
    await expect(page.locator('text=Resting Energy Requirement (RER)')).toBeVisible()
    await expect(page.locator('text=Maintenance Energy Requirement (MER)')).toBeVisible()

    // Live constants table from config
    await expect(page.locator('text=Kitten (under 12 mo)')).toBeVisible()
    await expect(page.locator('text=Indoor Lounger')).toBeVisible()

    // Workflow diagram & Design decisions
    await expect(page.locator('text=Packaging-Sampled Palette')).toBeVisible()
    await expect(page.locator('text=Monoline Cat Vector System')).toBeVisible()
    await expect(page.locator('text=Accessible Native <dialog>')).toBeVisible()
    await expect(page.locator('text=Zero-Hidden-State URL Sync')).toBeVisible()

    // Performance budgets table with verified values
    await expect(page.locator('text=Initial JS payload (gzip)')).toBeVisible()
    await expect(page.locator('text=Largest Contentful Paint (LCP)')).toBeVisible()
    await expect(page.locator('text=58.4 KB').first()).toBeVisible()

    // Disclosures
    await expect(
      page.locator('p:has-text("Concept imagery generated with AI. Products are fictional.")').first()
    ).toBeVisible()
  })

  test('accessibility scan (axe) on About page has zero serious or critical issues', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    )
    expect(seriousOrCritical).toEqual([])
  })
})

test.describe('Responsive Screenshots at 360, 768, 1280, 1920 px (P14)', () => {
  const viewports = [
    { width: 360, height: 800, name: '360' },
    { width: 768, height: 1024, name: '768' },
    { width: 1280, height: 900, name: '1280' },
    { width: 1920, height: 1080, name: '1920' },
  ]

  test.beforeAll(() => {
    const screensDir = path.resolve('docs/screens')
    if (!fs.existsSync(screensDir)) {
      fs.mkdirSync(screensDir, { recursive: true })
    }
  })

  for (const vp of viewports) {
    test(`captures Home screenshot at ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.screenshot({
        path: `docs/screens/home-${vp.name}.png`,
        fullPage: true,
      })
    })

    test(`captures About screenshot at ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/about')
      await page.waitForLoadState('networkidle')
      await page.screenshot({
        path: `docs/screens/about-${vp.name}.png`,
        fullPage: true,
      })
    })
  }
})
