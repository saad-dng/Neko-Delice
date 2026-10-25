import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Meal Planner UI & Wizard (P12)', () => {
  test('default run: Next x4 reaches result, shows MER/RER, and adds bundle to bag', async ({
    page,
  }) => {
    await page.goto('/meal-plan')

    // Starts on step 1: About your cat
    await expect(page.locator('main h2')).toContainText('About your cat')
    await expect(page.getByText('Step 1 of 4', { exact: true })).toBeVisible()

    // Tap Next -> Step 2: Weight
    const nextBtn = page.locator('button:has-text("Next")').first()
    await nextBtn.click()
    await expect(page.locator('main h2')).toContainText('Weight')
    await expect(page.getByText('Step 2 of 4', { exact: true })).toBeVisible()

    // Tap Next -> Step 3: Daily activity
    await nextBtn.click()
    await expect(page.locator('main h2')).toContainText('Daily activity')
    await expect(page.getByText('Step 3 of 4', { exact: true })).toBeVisible()

    // Tap Next -> Step 4: Health focus
    await nextBtn.click()
    await expect(page.locator('main h2')).toContainText('Health focus')
    await expect(page.getByText('Step 4 of 4', { exact: true })).toBeVisible()

    // Tap "View meal plan" -> Result screen
    const viewPlanBtn = page.locator('button:has-text("View meal plan")').first()
    await viewPlanBtn.click()

    // Check Result View
    await expect(page).toHaveURL(/step=result/)
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText('needs about')
    await expect(h1).toContainText('kcal a day')

    // RER and MER cards
    await expect(page.locator('text=Resting Energy (RER)')).toBeVisible()
    await expect(page.locator('text=Maintenance Target (MER)')).toBeVisible()

    // Add bundle to bag
    const bagButton = page.locator('button[aria-label^="Open bag"]')
    await expect(bagButton).toContainText('0')

    const addBundleBtn = page.locator('button:has-text("Add bundle to bag")')
    await addBundleBtn.click()

    // Verify bag count increased
    await expect(bagButton).not.toContainText('0')
    await expect(page.locator('text=Added to bag')).toBeVisible()
  })

  test('golden test: 4.5 kg neutered adult lounger with sensitive-stomach shows 4 wet boxes + 1 dry bag', async ({
    page,
  }) => {
    // Navigate directly using URL parameters
    await page.goto(
      '/meal-plan?name=Mochi&stage=adult&neutered=1&w=4.5&act=lounger&focus=sensitive-stomach&step=result',
    )

    // Heading should personalize with cat name
    const h1 = page.locator('h1')
    await expect(h1).toContainText('Mochi needs about')
    await expect(h1).toContainText('234 kcal a day') // MER ≈ 233.6 rounds to 234

    // RER should show 216.3 kcal/day
    await expect(page.locator('text=216.3').first()).toBeVisible()

    // Bundle lines: 4 boxes wet + 1 bag dry
    // Check wet food (Wild Salmon & Quail Paté)
    const wetLine = page.locator('text=Wild Salmon & Quail Paté').locator('..')
    await expect(wetLine).toContainText('Quantity: 4 cartons')
    await expect(wetLine).toContainText('~31 days supply')

    // Check dry kibble (Oven-Baked Duck & Sweet Potato Kibble)
    const dryLine = page.locator('text=Oven-Baked Duck & Sweet Potato Kibble').locator('xpath=..')
    await expect(dryLine).toContainText('Quantity: 1 bag')
    await expect(dryLine).toContainText('~83 days supply')
  })

  test('reload on ?...&step=result restores identical result', async ({
    page,
  }) => {
    const testUrl =
      '/meal-plan?name=Pippin&stage=senior&neutered=1&w=3.8&act=explorer&focus=coat-shine&step=result'

    await page.goto(testUrl)
    await expect(page.locator('h1')).toContainText('Pippin needs about')

    // Norwegian salmon oil should be present in bundle for coat-shine
    await expect(
      page.locator('text=Pure Norwegian Salmon Oil'),
    ).toBeVisible()

    // Reload page
    await page.reload()
    await expect(page).toHaveURL(new RegExp('name=Pippin'))
    await expect(page.locator('h1')).toContainText('Pippin needs about')
    await expect(
      page.locator('text=Pure Norwegian Salmon Oil'),
    ).toBeVisible()
  })

  test('kitten disables neuter option with explanatory notice', async ({
    page,
  }) => {
    await page.goto('/meal-plan?stage=kitten&step=1')

    // Radio inputs for neutered should be disabled
    const yesRadio = page.locator('input[name="neutered-status"][value="yes"]')
    const noRadio = page.locator('input[name="neutered-status"][value="no"]')

    await expect(yesRadio).toBeDisabled()
    await expect(noRadio).toBeDisabled()

    // Explanatory text should be visible
    await expect(
      page.locator('text=Not applicable for kittens'),
    ).toBeVisible()
  })

  test('urinary care focus shows unchecked water fountain add-on', async ({
    page,
  }) => {
    await page.goto(
      '/meal-plan?stage=adult&neutered=1&w=4.5&act=lounger&focus=urinary-care&step=result',
    )

    // Checkbox for fountain starts unchecked
    const fountainCheckbox = page.locator(
      'input[aria-label="Add Ceramic Water Fountain to bundle"]',
    )
    await expect(fountainCheckbox).toBeVisible()
    await expect(fountainCheckbox).not.toBeChecked()

    // Subtotal before adding fountain
    const subtotal = page.locator('text=Bundle subtotal').locator('xpath=..')
    const initialText = await subtotal.innerText()

    // Check the box
    await fountainCheckbox.check()
    await expect(fountainCheckbox).toBeChecked()

    // Subtotal should increase
    const updatedText = await subtotal.innerText()
    expect(updatedText).not.toEqual(initialText)
  })

  test('edit answers returns to step 1 preserving answers', async ({
    page,
  }) => {
    await page.goto(
      '/meal-plan?name=Luna&stage=adult&neutered=0&w=5.2&act=high-energy&focus=hairball-control&step=result',
    )

    // Click "Edit answers"
    const editBtn = page.locator('button:has-text("Edit answers")')
    await editBtn.click()

    // Should navigate to step 1
    await expect(page).toHaveURL(/step=1/)
    await expect(page.locator('main h2')).toContainText('About your cat')

    // Name input should preserve "Luna"
    const nameInput = page.locator('input#planner-cat-name')
    await expect(nameInput).toHaveValue('Luna')

    // Intact radio should be checked
    const intactRadio = page.locator('input[name="neutered-status"][value="no"]')
    await expect(intactRadio).toBeChecked()
  })

  test('copy link copies shareable URL with status announcement', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/meal-plan?name=Simba&w=4.0&step=result')

    const copyBtn = page.locator('button:has-text("Copy shareable link")')
    await copyBtn.click()

    await expect(page.locator('text=Link copied!')).toBeVisible()
  })

  test('accessibility scan (axe) has no serious or critical violations', async ({
    page,
  }) => {
    // Check Wizard Step 1
    await page.goto('/meal-plan?step=1')
    const scanWizard = await new AxeBuilder({ page }).analyze()
    const wizardViolations = scanWizard.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(wizardViolations).toEqual([])

    // Check Results Step
    await page.goto(
      '/meal-plan?name=Mochi&stage=adult&neutered=1&w=4.5&act=lounger&focus=sensitive-stomach&step=result',
    )
    const scanResult = await new AxeBuilder({ page }).analyze()
    const resultViolations = scanResult.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(resultViolations).toEqual([])
  })
})
