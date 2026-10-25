import { test } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const VIEWPORTS = [
  { name: '360', width: 360, height: 740 },
  { name: '640', width: 640, height: 900 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1536', width: 1536, height: 960 },
  { name: '2560', width: 2560, height: 1440 },
]

const TARGET_DIR = path.resolve(process.cwd(), 'docs/screens')
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true })
}

test.describe('Responsive QA Screenshot Capture (P15)', () => {
  for (const vp of VIEWPORTS) {
    test(`Capture responsive views at ${vp.width}x${vp.height} (${vp.name})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })

      // 1. Home
      await page.goto('/', { waitUntil: 'networkidle' })
      await page.screenshot({
        path: path.join(TARGET_DIR, `home-${vp.name}.png`),
      })

      // 2. Shop
      await page.goto('/shop', { waitUntil: 'networkidle' })
      await page.screenshot({
        path: path.join(TARGET_DIR, `shop-${vp.name}.png`),
      })

      // 3. PDP
      await page.goto('/product/wild-salmon-quail-pate', { waitUntil: 'networkidle' })
      await page.screenshot({
        path: path.join(TARGET_DIR, `pdp-${vp.name}.png`),
      })

      // 4. Planner (result)
      await page.goto(
        '/meal-plan?step=result&name=Mochi&stage=adult&neutered=true&weightKg=4.5&activity=lounger&healthFocus=none',
        { waitUntil: 'networkidle' }
      )
      await page.screenshot({
        path: path.join(TARGET_DIR, `planner-result-${vp.name}.png`),
      })

      // 5. Bag open
      await page.goto('/shop', { waitUntil: 'networkidle' })
      const bagBtn = page.locator('header button[aria-label*="Open bag"]')
      await bagBtn.click()
      await page.waitForSelector('dialog.smart-bag-dialog[open]')
      await page.waitForTimeout(400) // allow transition
      await page.screenshot({
        path: path.join(TARGET_DIR, `bag-open-${vp.name}.png`),
      })
    })
  }
})
