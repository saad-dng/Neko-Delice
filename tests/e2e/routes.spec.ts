import { test, expect } from '@playwright/test'

const CORE_ROUTES = [
  { path: '/', expectedTitle: /NEKO DELICE/i, expectedH1: /Feed your cat exactly what they need/i },
  { path: '/meal-plan', expectedTitle: /Meal Planner/i, expectedH1: /Calorie & meal planner/i },
  { path: '/about', expectedTitle: /About/i, expectedH1: /Honest food, quiet design/i },
  { path: '/404', expectedTitle: /Page Not Found/i, expectedH1: /We couldn't find that page/i },
]

const PRODUCT_SLUGS = [
  { slug: 'kitten-growth-mousse-broth', name: 'Kitten Growth Mousse & Broth' },
  { slug: 'wild-salmon-quail-pate', name: 'Wild Salmon & Quail Paté' },
  { slug: 'duck-sweet-potato-kibble', name: 'Oven-Baked Duck & Sweet Potato Kibble' },
  { slug: 'norwegian-salmon-oil', name: 'Pure Norwegian Salmon Oil' },
  { slug: 'freeze-dried-chicken-hearts', name: 'Freeze-Dried Chicken Heart Bites' },
  { slug: 'matcha-tofu-litter', name: 'Matcha Green Tea Tofu Litter' },
  { slug: 'stainless-oak-litter-basin', name: 'The Neko Stainless & Oak Litter Basin' },
  { slug: 'tilted-ceramic-whisker-bowl', name: 'Tilted Ceramic Whisker-Relief Bowl' },
  { slug: 'ceramic-water-fountain', name: 'Whisper-Quiet Ceramic Water Fountain' },
  { slug: 'sisal-birch-scratcher', name: 'Architectural Sisal & Birch Scratcher' },
]

test.describe('Route Architecture & Prerender Smoke Tests (P07)', () => {
  for (const route of CORE_ROUTES) {
    test(`route ${route.path} has exactly one h1 and unique title`, async ({ page }) => {
      await page.goto(route.path)

      // Title verification
      await expect(page).toHaveTitle(route.expectedTitle)

      // Single h1 per view
      const h1s = page.locator('h1')
      await expect(h1s).toHaveCount(1)
      await expect(h1s).toHaveText(route.expectedH1)

      // Landmark structure
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main#main')).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()

      // SkipLink verification
      const skipLink = page.locator('a[href="#main"]')
      await expect(skipLink).toHaveCount(1)

      // Route Announcer live region
      const announcer = page.locator('#route-announcer')
      await expect(announcer).toHaveAttribute('aria-live', 'polite')
    })
  }

  for (const product of PRODUCT_SLUGS) {
    test(`product route /product/${product.slug} renders with one h1`, async ({ page }) => {
      await page.goto(`/product/${product.slug}`)

      await expect(page).toHaveTitle(new RegExp(`${product.name} \\| NEKO DELICE`, 'i'))

      const h1s = page.locator('h1')
      await expect(h1s).toHaveCount(1)
      await expect(h1s).toHaveText(product.name)

      // Header, main, and footer
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main#main')).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    })
  }

  test('unknown route shows 404 with single h1 and links to Shop and Planner', async ({ page }) => {
    await page.goto('/unknown-nonexistent-slug')

    await expect(page).toHaveTitle(/Page Not Found/i)

    const h1s = page.locator('h1')
    await expect(h1s).toHaveCount(1)
    await expect(h1s).toHaveText(/We couldn't find that page/i)

    // Verify recovery links
    const shopLink = page.getByRole('link', { name: /Shop the collection/i })
    const plannerLink = page.getByRole('link', { name: /Try the meal planner/i })
    await expect(shopLink).toBeVisible()
    await expect(plannerLink).toBeVisible()
  })

  test('unknown product slug shows 404 page', async ({ page }) => {
    await page.goto('/product/non-existent-product-test')

    await expect(page).toHaveTitle(/Page Not Found/i)

    const h1s = page.locator('h1')
    await expect(h1s).toHaveCount(1)
    await expect(h1s).toHaveText(/We couldn't find that page/i)
  })

  test('header navigation and branding links work correctly', async ({ page }) => {
    await page.goto('/')

    // Navigate to shop
    await page.getByRole('navigation', { name: /primary/i }).getByRole('link', { name: 'Shop' }).click()
    await expect(page).toHaveURL(/#shop/)
    await expect(page.locator('#shop')).toBeVisible()

    // Navigate to meal planner
    await page.getByRole('navigation', { name: /primary/i }).getByRole('link', { name: 'Meal Planner' }).click()
    await expect(page).toHaveURL(/\/meal-plan/)
    await expect(page.locator('h1')).toHaveText(/Calorie & meal planner/i)

    // Navigate to about
    await page.getByRole('navigation', { name: /primary/i }).getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about/)
    await expect(page.locator('h1')).toHaveText(/Honest food, quiet design/i)

    // Click logo to return home
    await page.locator('header a[aria-label="NEKO DELICE home"]').click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('h1')).toHaveText(/Feed your cat exactly what they need/i)
  })
})
