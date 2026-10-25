import { test, expect } from '@playwright/test'

test.describe('E2E Key User Journeys & State Resilience (P15)', () => {
  test('Complete Flow: Planner wizard -> monthly bundle -> Smart Bag auto-open -> currency toggle', async ({
    page,
  }) => {
    // 1. Start planner wizard
    await page.goto('/meal-plan')

    // Step 1: Name and Stage
    const nameInput = page.locator('input#planner-cat-name')
    await nameInput.fill('Mochi')

    const adultRadio = page.locator('input[value="adult"]')
    await adultRadio.check()

    await page.locator('button:has-text("Next")').first().click()

    // Step 2: Weight (default 4.5 kg)
    await expect(page.locator('text=Size Indicator:')).toBeVisible()
    await page.locator('button:has-text("Next")').first().click()

    // Step 3: Activity (Lounger default)
    await page.locator('input[value="lounger"]').check()
    await page.locator('button:has-text("Next")').first().click()

    // Step 4: Health focus (Sensitive Stomach)
    await page.locator('label[for="health-focus-sensitive-stomach"]').click()
    await page.locator('button:has-text("View meal plan")').first().click()

    // Results Step
    await expect(page.locator('text=Mochi needs about')).toBeVisible()
    await expect(page.locator('text=Recommended monthly bundle')).toBeVisible()
    await expect(page.locator('text=Daily portion breakdown')).toBeVisible()

    // 2. Add bundle to bag
    const addBundleBtn = page.locator('button:has-text("Add bundle to bag")')
    await addBundleBtn.click()

    // 3. Smart Bag opens automatically
    const bagDialog = page.locator('dialog.smart-bag-dialog')
    await expect(bagDialog).toBeVisible()

    // Verify supply duration is computed using Mochi's profile
    await expect(bagDialog.locator('text=Lasts ~').first()).toBeVisible()

    // Close bag to interact with header
    await page.locator('dialog.smart-bag-dialog button[aria-label="Close bag"]').click()
    await expect(bagDialog).not.toBeVisible()

    // 4. Currency switch to BDT
    const bdtButton = page.locator('fieldset[aria-label="Currency selection"] button:has-text("BDT")')
    await bdtButton.click()

    // Re-open bag
    const bagCounter = page.locator('header button[aria-label*="Open bag"]')
    await bagCounter.click()
    await expect(bagDialog).toBeVisible()

    // Price inside bag updates to BDT symbol (৳)
    await expect(bagDialog.locator('text=৳').first()).toBeVisible()
    await expect(bagDialog.locator('text=BDT prices are approximate')).toBeVisible()

    // Close bag
    await page.locator('dialog.smart-bag-dialog button[aria-label="Close bag"]').click()
    await expect(bagDialog).not.toBeVisible()

    // Header counter reflects items added
    await expect(bagCounter).toBeVisible()
  })

  test('Shop filters round-trip via URL parameters', async ({ page }) => {
    // Navigate directly with query params
    await page.goto('/shop?category=wet-food&stage=kitten')

    // Only Kitten Growth Mousse should match
    const cards = page.locator('[data-testid="product-card"]')
    await expect(cards).toHaveCount(1)
    await expect(page.locator('text=Kitten Growth Mousse & Broth')).toBeVisible()

    // Active chips reflect filters
    await expect(page.locator('button:has-text("Wet Food")')).toBeVisible()
    await expect(page.locator('button:has-text("Kitten")')).toBeVisible()

    // Remove category filter chip
    await page.locator('button[aria-label="Remove filter Wet Food"]').click()

    // URL updates without full reload and shows all kitten products
    await expect(page).toHaveURL(/\/shop\?stage=kitten/)
  })

  test('Corrupted localStorage resilience: app initializes safely without crashing', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    // Inject corrupted values before page loads
    await page.addInitScript(() => {
      window.localStorage.setItem('neko-bag', '{broken JSON!#$@}')
      window.localStorage.setItem('neko-currency', 'INVALID_NOT_JSON')
      window.localStorage.setItem('neko-planner-profile', '<<<CORRUPT>>>')
    })

    await page.goto('/')

    // Single H1 rendered
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)

    // Bag initializes to 0 items gracefully
    const bagButton = page.locator('header button[aria-label*="Open bag"]')
    await expect(bagButton).toContainText('0')

    // Currency control defaults to USD safely
    const usdButton = page.locator('fieldset[aria-label="Currency selection"] button:has-text("USD")')
    await expect(usdButton).toHaveAttribute('aria-pressed', 'true')

    // No unhandled exceptions or crashes
    expect(consoleErrors).toEqual([])
  })
})
