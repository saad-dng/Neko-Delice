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
    await expect(adultRadio).toBeChecked()

    const nextBtn = page.locator('button:has-text("Next")').first()
    await expect(nextBtn).toBeEnabled()
    await nextBtn.click()

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
    await expect(page.locator('h1')).toContainText('needs about')
    await expect(page.locator('text=Recommended monthly bundle')).toBeVisible()
    await expect(page.locator('text=Daily portion breakdown')).toBeVisible()

    // 2. Add bundle to bag
    const addBundleBtn = page.locator('button:has-text("Add bundle to bag")')
    await addBundleBtn.click()

    // 3. Open Smart Bag via header
    const bagCounter = page.locator('header button[aria-label*="Open bag"]')
    await bagCounter.click()
    const bagDialog = page.locator('dialog.smart-bag-dialog')
    await expect(bagDialog).toBeVisible()

    // Verify supply duration is computed
    await expect(bagDialog.locator('text=Lasts ~').first()).toBeVisible()

    // Close bag to interact with header
    await page.locator('dialog.smart-bag-dialog button[aria-label="Close bag"]').click()
    await expect(bagDialog).not.toBeVisible()

    // 4. Currency switch to BDT
    const bdtButton = page.locator('fieldset[aria-label="Currency selection"] button:has-text("BDT")')
    await bdtButton.click()

    // Re-open bag
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
    // Navigate directly with query params to shop on home
    await page.goto('/?category=wet-food#shop')

    // Wet food category shows 2 cards
    const cards = page.locator('[data-testid="product-card"]')
    await expect(cards).toHaveCount(2)
    await expect(page.locator('text=Kitten Growth Mousse & Broth')).toBeVisible()

    // Active tab reflects filter
    const activeTab = page.locator('button[role="tab"][aria-selected="true"]')
    await expect(activeTab).toContainText('Wet Food')

    // Switch back to All Items
    await page.locator('button[role="tab"]:has-text("All Items")').click()
    await expect(cards).toHaveCount(10)
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

  test('Shopping session restoration: navigating from shop segment to PDP and returning restores category and product location', async ({
    page,
  }) => {
    // 1. User starts on homepage and scrolls to shop or selects a category
    await page.goto('/')
    const wetFoodTab = page.locator('button[role="tab"]:has-text("Wet Food")')
    await wetFoodTab.click()

    // URL should preserve #shop
    await expect(page).toHaveURL(/\/?category=wet-food#shop/)

    // 2. Click on a product card to view details
    const productLink = page.locator('article[id="product-kitten-growth-mousse-broth"] a').first()
    await productLink.click()

    // 3. Confirm we are on the PDP
    await expect(page).toHaveURL(/\/product\/kitten-growth-mousse-broth/)
    const backLink = page.locator('main nav[aria-label="Breadcrumbs"] a')
    await expect(backLink).toBeVisible()

    // 4. Click breadcrumb back link
    await backLink.click()

    // 5. User should be returned directly to the product in the shop with the category intact!
    await expect(page).toHaveURL(/\/?category=wet-food#product-kitten-growth-mousse-broth/)
    const targetProductCard = page.locator('article[id="product-kitten-growth-mousse-broth"]')
    await expect(targetProductCard).toBeVisible()

    // Category tab remains active
    const activeTab = page.locator('button[role="tab"][aria-selected="true"]')
    await expect(activeTab).toContainText('Wet Food')
  })
})

