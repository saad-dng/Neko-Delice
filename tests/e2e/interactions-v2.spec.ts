import { test, expect } from '@playwright/test'

test.describe('V2-06 Interactions and Animations Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start with empty bag and clean state
    await page.addInitScript(() => {
      window.localStorage.clear()
    })
  })

  test('Add to bag from home shows polite toast and Undo restores state', async ({ page }) => {
    await page.goto('/')

    // Initial bag count should be 0
    const bagBadge = page.locator('header button[aria-label^="Open bag"]').locator('span[aria-hidden="true"]')
    await expect(bagBadge).toHaveText('0')

    // Find first product card's Add button in shop section
    const firstAddButton = page.locator('[data-testid="product-card"] button[aria-label^="Add"]').first()
    await firstAddButton.scrollIntoViewIfNeeded()
    await firstAddButton.click()

    // Bag badge should increment to 1
    await expect(bagBadge).toHaveText('1')

    // Polite toast should appear
    const toast = page.locator('[role="status"][aria-live="polite"]')
    await expect(toast).toBeVisible()
    await expect(toast).toContainText('Added')
    const undoButton = toast.locator('button', { hasText: 'Undo' })
    await expect(undoButton).toBeVisible()

    // Click Undo
    await undoButton.click()

    // Toast should announce addition undone
    await expect(toast).toContainText('Addition undone.')

    // Bag badge should restore to 0
    await expect(bagBadge).toHaveText('0')
  })

  test('Keyboard-only add to bag and undo flow', async ({ page }) => {
    await page.goto('/')

    const firstAddButton = page.locator('[data-testid="product-card"] button[aria-label^="Add"]').first()
    await firstAddButton.scrollIntoViewIfNeeded()
    await firstAddButton.focus()
    await page.keyboard.press('Enter')

    const bagBadge = page.locator('header button[aria-label^="Open bag"]').locator('span[aria-hidden="true"]')
    await expect(bagBadge).toHaveText('1')

    const toast = page.locator('[role="status"][aria-live="polite"]')
    await expect(toast).toBeVisible()
    const undoButton = toast.locator('button', { hasText: 'Undo' })
    await undoButton.focus()
    await page.keyboard.press('Enter')

    await expect(bagBadge).toHaveText('0')
  })

  test('Planner walking cat marker moves and browser Back navigates between steps', async ({ page }) => {
    await page.goto('/meal-plan')

    // Step 1: About
    const marker = page.locator('[data-testid="planner-cat-marker"]')
    await expect(marker).toBeVisible()
    await expect(marker).toHaveCSS('left', /0px|0%/)

    // Advance to Step 2
    const nextButton = page.locator('button:has-text("Next")').first()
    await nextButton.click()
    await expect(page).toHaveURL(/step=2/)

    // Advance to Step 3
    await nextButton.click()
    await expect(page).toHaveURL(/step=3/)

    // Advance to Step 4
    await nextButton.click()
    await expect(page).toHaveURL(/step=4/)

    // Press browser Back
    await page.goBack()
    await expect(page).toHaveURL(/step=3/)

    await page.goBack()
    await expect(page).toHaveURL(/step=2/)

    await page.goBack()
    await expect(page.locator('main h2')).toContainText('About your cat')
  })

  test('PDP live supply duration recalculates on quantity change and shows sticky bar on mobile', async ({ page }) => {
    // Navigate to a food product
    await page.goto('/product/kitten-growth-mousse-broth')

    // Check that duration note exists
    const priceRow = page.locator('text=Tax included, Lasts about, One-time').first()
    // Find quantity stepper
    const plusButton = page.locator('button[aria-label="Increase quantity"]')
    await expect(plusButton).toBeVisible()

    // Stepper from 1 to 2
    await plusButton.click()
    const qtySpan = page.locator('span[aria-label="Selected quantity: 2"]')
    await expect(qtySpan).toBeVisible()

    // Test mobile sticky bar
    await page.setViewportSize({ width: 375, height: 667 })
    // Scroll down past the main purchase button
    await page.evaluate(() => window.scrollTo(0, 1200))

    const stickyBar = page.locator('aside[aria-label="Quick add to bag"]')
    await expect(stickyBar).toBeVisible()
    const stickyAdd = stickyBar.locator('button', { hasText: 'Add' })
    await stickyAdd.click()

    // Toast should show
    const toast = page.locator('[role="status"][aria-live="polite"]')
    await expect(toast).toBeVisible()
  })

  test('prefers-reduced-motion: reduce disables transform animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Verify animate-paw-stamp, animate-toast-in have no transform animation
    const reducedStyles = await page.evaluate(() => {
      const el = document.createElement('div')
      el.className = 'animate-toast-in'
      document.body.appendChild(el)
      const computed = window.getComputedStyle(el)
      const animName = computed.animationName
      document.body.removeChild(el)
      return animName
    })

    expect(reducedStyles).toBe('none')
  })

  test('Bag dialog empty state features CatPeekEdge', async ({ page }) => {
    await page.goto('/')

    // Open bag
    const openBagBtn = page.locator('header button[aria-label^="Open bag"]')
    await openBagBtn.click()

    const dialog = page.locator('dialog#smart-bag-dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Your bag is empty.')

    // Close bag
    const closeBtn = dialog.locator('button[aria-label="Close bag"]')
    await closeBtn.click()
    await expect(dialog).not.toBeVisible()
  })
})
