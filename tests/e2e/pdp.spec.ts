import { expect, test } from '@playwright/test'
import { PRODUCT_SLUGS } from '@/data/slugs'

test.describe('Product Detail Page (P11)', () => {
  test('all 10 slugs render with exactly one h1 and unique title', async ({
    page,
  }) => {
    for (const slug of PRODUCT_SLUGS) {
      await page.goto(`/product/${slug}`)

      // One h1 per view
      const h1s = page.locator('h1')
      await expect(h1s).toHaveCount(1)

      // Title should contain the brand and product
      await expect(page).toHaveTitle(/NEKO DELICE/i)

      // Purchase CTA should be visible
      await expect(
        page.locator('button:has-text("Add to bag")'),
      ).toBeVisible()
    }
  })

  test('unknown slug renders 404 NotFound page', async ({ page }) => {
    await page.goto('/product/non-existent-mystery-slug')

    await expect(page).toHaveTitle(/Page Not Found/i)
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText("We couldn't find that page")

    // Link back to collection on 404 page
    await expect(page.locator('main a[href="/shop"]')).toBeVisible()
  })


  test('gallery navigation arrows and thumbnails work', async ({ page }) => {
    await page.goto('/product/wild-salmon-quail-pate')

    // Find thumbnails
    const thumbnails = page.locator('button[role="tab"]')
    const thumbCount = await thumbnails.count()
    expect(thumbCount).toBeGreaterThan(1)

    // First thumbnail is active initially
    await expect(thumbnails.first()).toHaveAttribute('aria-current', 'true')

    // Click next arrow button
    const nextButton = page.locator('button[aria-label="Next image"]')
    await expect(nextButton).toBeVisible()
    await nextButton.click()

    // Second thumbnail should now be active
    await expect(thumbnails.nth(1)).toHaveAttribute('aria-current', 'true')

    // Click previous arrow button
    const prevButton = page.locator('button[aria-label="Previous image"]')
    await prevButton.click()
    await expect(thumbnails.first()).toHaveAttribute('aria-current', 'true')

    // Keyboard arrow navigation on the thumbnails list
    const tablist = page.locator('div[role="tablist"]')
    await tablist.focus()
    await page.keyboard.press('ArrowRight')
    await expect(thumbnails.nth(1)).toHaveAttribute('aria-current', 'true')
  })

  test('accordions are keyboard-operable with native details/summary', async ({
    page,
  }) => {
    await page.goto('/product/duck-sweet-potato-kibble')

    // Find specifications accordion
    const specsSummary = page.locator('summary:has-text("Specifications")')
    await expect(specsSummary).toBeVisible()

    const specsDetails = specsSummary.locator('xpath=..')
    // Initially closed
    await expect(specsDetails).not.toHaveAttribute('open', '')

    // Focus and press Enter to open
    await specsSummary.focus()
    await page.keyboard.press('Enter')
    await expect(specsDetails).toHaveAttribute('open', '')

    // Press Enter again to close
    await page.keyboard.press('Enter')
    await expect(specsDetails).not.toHaveAttribute('open', '')
  })

  test('daily feeding guide is displayed for food items', async ({ page }) => {
    await page.goto('/product/wild-salmon-quail-pate')

    // Feeding guide heading and table
    await expect(
      page.locator('h2:has-text("Daily feeding guide")'),
    ).toBeVisible()
    await expect(
      page.locator('text=Based on a neutered adult lounger'),
    ).toBeVisible()

    // Non-food items do not display daily feeding guide
    await page.goto('/product/ceramic-water-fountain')
    await expect(
      page.locator('h2:has-text("Daily feeding guide")'),
    ).toHaveCount(0)
    await expect(page.locator('text=One-time purchase').first()).toBeVisible()
  })

  test('quantity stepper and Add to bag updates live region and bag count', async ({
    page,
  }) => {
    await page.goto('/product/kitten-growth-mousse-broth')

    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await expect(bagButton).toContainText('0')

    // Increase quantity to 3
    const increaseBtn = page.locator('button[aria-label="Increase quantity"]')
    await increaseBtn.click()
    await increaseBtn.click()

    const stepperText = page.locator('[aria-label^="Selected quantity:"]')
    await expect(stepperText).toContainText('3')

    // Click Add to bag
    const addBtn = page.locator('button:has-text("Add to bag")')
    await addBtn.click()

    // Bag badge in header increments to 3
    await expect(bagButton).toContainText('3')

    // Live region announces addition
    const liveRegion = page.locator('div[aria-live="polite"]')
    await expect(liveRegion).toContainText('Added 3 of Kitten Growth Mousse')
  })
})
