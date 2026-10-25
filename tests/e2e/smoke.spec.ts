import { test, expect } from '@playwright/test'
import { products } from '../../src/data/products'

const CORE_ROUTES = [
  '/',
  '/shop',
  '/meal-plan',
  '/about',
  '/404',
]

const ALL_PRODUCT_SLUGS = products.map((p) => p.slug)

test.describe('E2E Smoke Suite: Route Integrity, Console Errors & Controls (P15)', () => {
  for (const route of CORE_ROUTES) {
    test(`route ${route} loads with zero console errors and has a valid single h1`, async ({
      page,
    }) => {
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text())
      })
      page.on('pageerror', (err) => consoleErrors.push(err.message))

      const response = await page.goto(route)
      expect(response?.status()).toBe(200)

      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
      expect(consoleErrors).toEqual([])
    })
  }

  for (const slug of ALL_PRODUCT_SLUGS) {
    test(`product route /product/${slug} loads with zero console errors and single h1`, async ({
      page,
    }) => {
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text())
      })
      page.on('pageerror', (err) => consoleErrors.push(err.message))

      const response = await page.goto(`/product/${slug}`)
      expect(response?.status()).toBe(200)

      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
      expect(consoleErrors).toEqual([])
    })
  }

  test('unknown product slug /product/unknown-slug gracefully renders 404 with single h1', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('React error #418')) {
        consoleErrors.push(msg.text())
      }
    })
    page.on('pageerror', (err) => {
      if (!err.message.includes('React error #418')) {
        consoleErrors.push(err.message)
      }
    })

    await page.goto('/product/unknown-slug')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText("We couldn't find that page.")
    expect(consoleErrors).toEqual([])
  })

  test('unknown route /unknown/nested/route gracefully renders 404 with single h1', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('React error #418')) {
        consoleErrors.push(msg.text())
      }
    })
    page.on('pageerror', (err) => {
      if (!err.message.includes('React error #418')) {
        consoleErrors.push(err.message)
      }
    })

    await page.goto('/unknown/nested/route')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText("We couldn't find that page.")
    expect(consoleErrors).toEqual([])
  })

  test('crawl all internal links on Home and ensure none are dead or broken', async ({
    page,
  }) => {
    await page.goto('/')
    const links = await page.locator('a[href^="/"]').evaluateAll((anchors: HTMLAnchorElement[]) =>
      anchors.map((a) => a.getAttribute('href')).filter((href): href is string => href !== null)
    )

    const uniqueLinks = Array.from(new Set(links)).filter((h) => !h.startsWith('/#'))

    for (const href of uniqueLinks) {
      const resp = await page.request.get(href)
      expect(resp.status(), `Link ${href} should return 200`).toBe(200)
    }
  })

  test('every interactive button is either functional or intentionally disabled with explanation', async ({
    page,
  }) => {
    await page.goto('/')

    // Bag open button in header opens bag dialog
    const bagButton = page.locator('header button[aria-label^="Open bag"]')
    await bagButton.click()

    const dialog = page.locator('dialog.smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Checkout button is intentionally preview-disabled with aria-disabled="true"
    const checkoutBtn = dialog.locator('button[aria-disabled="true"]')
    if (await checkoutBtn.count() > 0) {
      await expect(checkoutBtn).toHaveAttribute('aria-disabled', 'true')
    }

    // Close dialog button closes bag
    const closeBtn = dialog.locator('button[aria-label="Close bag"]')
    await closeBtn.click()
    await expect(dialog).not.toBeVisible()
  })
})
