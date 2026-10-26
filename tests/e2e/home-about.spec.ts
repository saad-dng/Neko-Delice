import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import fs from 'node:fs'
import path from 'node:path'

test.describe('Home Page (P14)', () => {
  test('renders hero with single h1, unified collection with filter tabs, planner teaser, and promise strip', async ({
    page,
  }) => {
    await page.goto('/')

    // Exactly one h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText(/Good food for curious cats/i)

    // Primary & Secondary Hero CTAs
    const planCta = page.locator('a:has-text("Plan my cat\'s meals")').first()
    await expect(planCta).toHaveAttribute('href', '/meal-plan')

    const shopCta = page.locator('a:has-text("Shop the collection")').first()
    await expect(shopCta).toHaveAttribute('href', '/#shop')

    // Unified Collection Section
    await expect(
      page.locator('h2:has-text("Everything your cat needs, nothing they don\'t.")')
    ).toBeVisible()

    // Planner Teaser Section
    await expect(
      page.locator('h2:has-text("No guesswork. Just the right plan for your cat.")')
    ).toBeVisible()
    await expect(
      page.locator('text=Tell us about your cat')
    ).toBeVisible()
    await expect(
      page.locator('text=See daily calories')
    ).toBeVisible()
    await expect(
      page.locator('text=Get a monthly bundle')
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

    // Value Section
    await expect(
      page.locator('h3:has-text("Short, recognisable ingredients")')
    ).toBeVisible()
    await expect(
      page.locator('h3:has-text("Made for their stage")')
    ).toBeVisible()
    await expect(
      page.locator('h3:has-text("Plans that add up")')
    ).toBeVisible()

    // Closing CTA
    await expect(
      page.locator('h2:has-text("Feed your cat with confidence.")')
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
  test('renders about page with single h1, philosophy, nutrition with purpose, ingredient close-ups, and standards', async ({
    page,
  }) => {
    await page.goto('/about')

    // Exactly one h1
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText('Honest food, quiet design')

    // Narrative brand sections
    await expect(page.locator('h2:has-text("Nutrition with purpose")')).toBeVisible()
    await expect(page.locator('h2:has-text("Ingredients you can understand")')).toBeVisible()
    await expect(page.locator('h2:has-text("Designed for everyday care")')).toBeVisible()
    await expect(page.locator('h2:has-text("Our standards")')).toBeVisible()

    // 4 Ingredient close-up cards
    await expect(page.locator('text=Deboned Chicken & Broth')).toBeVisible()
    await expect(page.locator('text=Wild Salmon & Lean Quail')).toBeVisible()
    await expect(page.locator('text=Slow-Baked Duck Kibble')).toBeVisible()
    await expect(page.locator('text=Cold-Filtered Salmon Oil')).toBeVisible()

    // Closing CTA buttons
    await expect(page.locator('a:has-text("Plan your cat\'s meals")')).toBeVisible()
    await expect(page.locator('a:has-text("Explore the collection")')).toBeVisible()

    // Developer case study and prototype disclosures must NOT be present
    await expect(page.locator('text=Behind the build')).not.toBeVisible()
    await expect(page.locator('text=Resting Energy Requirement (RER)')).not.toBeVisible()
    await expect(page.locator('text=Concept imagery generated with AI')).not.toBeVisible()
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
      // Incremental scroll to trigger all lazy-loaded images
      await page.evaluate(async () => {
        const totalHeight = document.body.scrollHeight
        for (let y = 0; y <= totalHeight; y += 400) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 60))
        }
        await new Promise((r) => setTimeout(r, 400))
        window.scrollTo(0, 0)
        await new Promise((r) => setTimeout(r, 200))
      })
      await page.screenshot({
        path: `docs/screens/home-${vp.name}.png`,
        fullPage: true,
      })
    })

    test(`captures About screenshot at ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/about')
      await page.waitForLoadState('networkidle')
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(400)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(200)
      await page.screenshot({
        path: `docs/screens/about-${vp.name}.png`,
        fullPage: true,
      })
    })
  }
})
