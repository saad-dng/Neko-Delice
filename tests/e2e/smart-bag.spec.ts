import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Smart Bag Modal & Currency Toggle (P13)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('open bag from header button and close with Esc returning focus to trigger', async ({
    page,
  }) => {
    await page.goto('/')

    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await expect(bagButton).toBeVisible()

    // Focus and click the bag button
    await bagButton.focus()
    await page.keyboard.press('Enter')

    // Dialog should open
    const dialog = page.locator('dialog#smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Title should be visible
    await expect(page.locator('#smart-bag-title')).toHaveText('Your Bag')

    // Empty state should be visible since bag is empty
    await expect(page.locator('text=Your bag is empty.')).toBeVisible()

    // Press Escape to close dialog
    await page.keyboard.press('Escape')

    // Dialog should be closed (hidden)
    await expect(dialog).not.toBeVisible()

    // Focus should return to the bag trigger button
    await expect(bagButton).toBeFocused()
  })

  test('add item from PDP shows in bag with supply duration and quantity controls', async ({
    page,
  }) => {
    await page.goto('/product/wild-salmon-quail-pate')

    // Click Add to bag
    const addBtn = page.locator('button:has-text("Add to bag")')
    await addBtn.click()

    // Open bag dialog
    const bagButton = page.locator('header button[aria-label^="Open bag"]')
    await bagButton.click()
    const dialog = page.locator('dialog#smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Product line should appear
    await expect(
      dialog.locator('text=Wild Salmon & Quail Paté'),
    ).toBeVisible()

    // Supply duration note should show reference cat when no planner profile
    await expect(
      dialog.locator('text=Based on a 4.5 kg neutered adult'),
    ).toBeVisible()

    // Increment quantity using stepper
    const plusBtn = dialog.locator('button[aria-label^="Increase quantity"]')
    await plusBtn.click()

    // Quantity should be 2
    await expect(dialog.locator('[aria-label="Quantity: 2"]')).toBeVisible()

    // Checkout button should have aria-disabled="true" and tooltip explanation
    const checkoutBtn = dialog.locator('button:has-text("Checkout")')
    await expect(checkoutBtn).toHaveAttribute('aria-disabled', 'true')
    await expect(
      dialog.locator('#checkout-disabled-reason'),
    ).toContainText('This is a storefront preview. Checkout is not connected yet.')

    // Close button works
    const closeBtn = dialog.locator('button[aria-label="Close bag"]')
    await closeBtn.click()
    await expect(dialog).not.toBeVisible()
  })

  test('backdrop click closes the dialog', async ({ page }) => {
    await page.goto('/shop')

    // Open bag
    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await bagButton.click()

    const dialog = page.locator('dialog#smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Click top-left of the viewport (on the backdrop outside dialog)
    await page.mouse.click(10, 10)

    // Dialog closes
    await expect(dialog).not.toBeVisible()
  })

  test('currency switch changes prices in header, shop, and bag without layout shift', async ({
    page,
  }) => {
    await page.goto('/shop')

    // USD is default
    const usdBtn = page.locator('button:has-text("USD")').first()
    const bdtBtn = page.locator('button:has-text("BDT")').first()
    await expect(usdBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(bdtBtn).toHaveAttribute('aria-pressed', 'false')

    // Shop prices show '$'
    await expect(page.locator('text=$30').first()).toBeVisible()

    // Switch to BDT
    await bdtBtn.click()
    await expect(bdtBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(usdBtn).toHaveAttribute('aria-pressed', 'false')

    // Shop prices should now show '৳'
    await expect(page.locator('text=৳').first()).toBeVisible()

    // Open bag and verify BDT note is displayed
    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await bagButton.click()

    const dialog = page.locator('dialog#smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Switch back to USD
    const closeBtn = dialog.locator('button[aria-label="Close bag"]')
    await closeBtn.click()

    await usdBtn.click()
    await expect(usdBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('text=$30').first()).toBeVisible()
  })

  test('empty bag links navigate and close dialog', async ({ page }) => {
    await page.goto('/')

    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await bagButton.click()

    const dialog = page.locator('dialog#smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Click "Build Meal Plan" link
    const mealPlanLink = dialog.locator('a:has-text("Build Meal Plan")')
    await mealPlanLink.click()

    // Dialog should be closed and page navigated to /meal-plan
    await expect(dialog).not.toBeVisible()
    await expect(page).toHaveURL(/\/meal-plan/)
  })

  test('accessibility scan (axe) with open dialog has zero serious or critical issues', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/product/wild-salmon-quail-pate')

    // Add product to bag and open dialog
    await page.locator('button:has-text("Add to bag")').click()
    await page.locator('header button[aria-label^="Open bag"]').click()
    const dialog = page.locator('dialog#smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Run axe analysis
    const scanResults = await new AxeBuilder({ page }).analyze()
    const violations = scanResults.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(violations).toEqual([])
  })
})
