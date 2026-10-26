import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const AUDIT_ROUTES = [
  '/',
  '/shop',
  '/meal-plan',
  '/about',
  '/404',
  '/product/wild-salmon-quail-pate',
]

test.describe('E2E Accessibility Suite: WCAG AA & Axe Audits (P15)', () => {
  for (const route of AUDIT_ROUTES) {
    test(`route ${route} has zero serious or critical Axe violations`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const seriousOrCritical = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      )
      expect(
        seriousOrCritical,
        `Expected 0 serious/critical violations on ${route}, found: ${JSON.stringify(seriousOrCritical, null, 2)}`
      ).toEqual([])
    })
  }

  test('Skip-to-content link is the first focusable element and moves focus to main landmark', async ({
    page,
  }) => {
    await page.goto('/')

    // Press Tab once from window focus
    await page.keyboard.press('Tab')

    const activeElementText = await page.evaluate(
      () => document.activeElement?.textContent?.trim()
    )
    expect(activeElementText).toBe('Skip to main content')

    // Press Enter to activate skip link
    await page.keyboard.press('Enter')

    const activeId = await page.evaluate(() => document.activeElement?.id)
    expect(activeId).toBe('main')
  })

  test('Smart Bag modal traps focus and returns focus to opener trigger on Escape', async ({
    page,
  }) => {
    await page.goto('/')

    const bagButton = page.locator('header button[aria-label^="Open bag"]')
    await bagButton.focus()
    await bagButton.press('Enter')

    const dialog = page.locator('dialog.smart-bag-dialog')
    await expect(dialog).toBeVisible()

    // Press Escape to dismiss modal
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()

    // Focus must return to opener bag button
    const isOpenerFocused = await bagButton.evaluate(
      (el) => document.activeElement === el
    )
    expect(isOpenerFocused).toBe(true)
  })
})
