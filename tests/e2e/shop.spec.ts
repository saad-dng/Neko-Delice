import { expect, test } from '@playwright/test'

test.describe('Shop Catalog, Category Filters & URL Sync (P10 Unified)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
  })

  test('apply category filter -> URL changes -> reload restores -> reset to all', async ({
    page,
  }) => {
    // Navigate to homepage shop
    await page.goto('/#shop')

    // Initial state: 10 products
    const initialCards = page.locator('[data-testid="product-card"]')
    await expect(initialCards).toHaveCount(4)

    // 1. Apply category filter: "Wet Food"
    const wetFoodTab = page.locator('button[role="tab"]:has-text("Wet Food")')
    await wetFoodTab.click()
    await expect(page).toHaveURL(/category=wet-food/)
    // Product count should now be 2
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2)

    // Reload the page and verify URL state restores the filtered view
    await page.reload()
    await expect(page).toHaveURL(/category=wet-food/)
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2)

    // Switch back to "All Items"
    const allTab = page.locator('button[role="tab"]:has-text("All Items")')
    await allTab.click()
    await expect(page).not.toHaveURL(/category=/)
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(4)
  })

  test('bad parameter ?category=zzz is ignored safely and shows full catalog', async ({ page }) => {
    await page.goto('/?category=zzz#shop')

    const cards = page.locator('[data-testid="product-card"]')
    await expect(cards).toHaveCount(4)
  })

  test('quick-add button increments bag item count in header', async ({
    page,
  }) => {
    await page.goto('/#shop')

    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await expect(bagButton).toContainText('0')

    // Click quick-add on the first product card
    const firstAddButton = page
      .locator('[data-testid="product-card"] button[aria-label^="Add "]')
      .first()
    await firstAddButton.click()

    // Bag badge in header increments to 1
    await expect(bagButton).toContainText('1')

    // Open bag dialog
    await bagButton.click()
    const bagDialog = page.locator('dialog.smart-bag-dialog')
    await expect(bagDialog).toBeVisible()

    // Close dialog via escape key
    await page.keyboard.press('Escape')
    await expect(bagDialog).not.toBeVisible()

    // Add again
    await firstAddButton.click()
    await expect(bagButton).toContainText('2')
  })

  test('currency toggle switches prices between USD and BDT', async ({
    page,
  }) => {
    await page.goto('/#shop')

    // First card price in USD
    const priceElement = page
      .locator('[data-testid="product-card"] span.tabular-nums')
      .first()
    await expect(priceElement).toContainText('$')

    // Click BDT button in currency segmented control
    const bdtButton = page.locator('button:has-text("BDT")').first()
    await bdtButton.click()

    // Price should now display in BDT (৳)
    await expect(priceElement).toContainText('৳')
  })

})
