import { expect, test } from '@playwright/test'

test.describe('Shop Catalog, Filters & URL Sync (P10)', () => {
  test.beforeEach(async ({ page }) => {
    // Set desktop viewport so the filter sidebar is visible directly
    await page.setViewportSize({ width: 1280, height: 800 })
  })

  test('apply 3 filters -> URL changes -> reload restores -> remove chip -> URL updates', async ({
    page,
  }) => {
    await page.goto('/shop')

    // Initial state: 10 products
    const initialCards = page.locator('[data-testid="product-card"]')
    await expect(initialCards).toHaveCount(10)

    // 1. Apply category filter: "Wet Food"
    const wetFoodCheckbox = page.locator('label[for="cat-wet-food"]')
    await wetFoodCheckbox.click()
    await expect(page).toHaveURL(/category=wet-food/)
    // Product count should now be 2 (Product 01 and 02)
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2)

    // 2. Apply stage filter: "Adult"
    const adultCheckbox = page.locator('label[for="stage-adult"]')
    await adultCheckbox.click()
    await expect(page).toHaveURL(/stage=adult/)
    // Product 02 matches adult wet food
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1)

    // 3. Apply health goal filter: "Sensitive Stomach"
    const goalCheckbox = page.locator('label[for="goal-sensitive-stomach"]')
    await goalCheckbox.click()
    await expect(page).toHaveURL(/goal=sensitive-stomach/)
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1)

    // Verify 3 active filter chips are visible
    const chips = page.locator(
      'button[aria-label^="Remove filter"]',
    )
    await expect(chips).toHaveCount(3)

    // Reload the page and verify URL state restores the filtered view
    await page.reload()
    await expect(page).toHaveURL(/category=wet-food/)
    await expect(page).toHaveURL(/stage=adult/)
    await expect(page).toHaveURL(/goal=sensitive-stomach/)
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1)

    // Remove one chip: "Wet Food"
    const removeWetFoodChip = page.locator(
      'button[aria-label="Remove filter Wet Food"]',
    )
    await removeWetFoodChip.click()

    // URL should no longer contain wet-food
    await expect(page).not.toHaveURL(/category=wet-food/)
    // Remaining chips should be 2
    await expect(page.locator('button[aria-label^="Remove filter"]')).toHaveCount(
      2,
    )
  })

  test('zero-result combination shows empty state with CatPeeking and nearest matches', async ({
    page,
  }) => {
    // Navigate with a combination that yields 0 matches:
    // Category: Hardware + Goal: Sensitive Stomach
    await page.goto('/shop?category=hardware&goal=sensitive-stomach')

    // Empty state container should be visible
    const emptyState = page.locator('[data-testid="shop-empty-state"]')
    await expect(emptyState).toBeVisible()
    await expect(emptyState).toContainText('No exact matches')
    await expect(emptyState).toContainText(
      'Nothing matches all of these filters. Closest matches are below.',
    )

    // Nearest matches header and products are shown
    await expect(
      emptyState.locator('text=Closest suggested matches'),
    ).toBeVisible()
    const nearestCards = emptyState.locator('[data-testid="product-card"]')
    const count = await nearestCards.count()
    expect(count).toBeGreaterThan(0)

    // Clicking "Clear filters" resets everything back to 10 products
    const clearButton = emptyState.locator('button:has-text("Clear filters")')
    await clearButton.click()
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(10)
    await expect(page).toHaveURL(/\/shop$/)
  })

  test('bad parameter ?category=zzz is ignored safely', async ({ page }) => {
    await page.goto('/shop?category=zzz')

    // Invalid parameter is ignored, full catalog shown
    const cards = page.locator('[data-testid="product-card"]')
    await expect(cards).toHaveCount(10)
    // No active filter chips for invalid values
    await expect(
      page.locator('button[aria-label^="Remove filter"]'),
    ).toHaveCount(0)
  })

  test('quick-add button increments bag item count in header', async ({
    page,
  }) => {
    await page.goto('/shop')

    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await expect(bagButton).toContainText('0')

    // Click quick-add on the first product card
    const firstAddButton = page
      .locator('[data-testid="product-card"] button[aria-label^="Add "]')
      .first()
    await firstAddButton.click()

    // Bag modal opens automatically on add
    const bagDialog = page.locator('dialog.smart-bag-dialog')
    await expect(bagDialog).toBeVisible()

    // Bag badge in header increments to 1
    await expect(bagButton).toContainText('1')

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
    await page.goto('/shop')

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
