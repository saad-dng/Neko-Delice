import { chromium } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const widths = [360, 640, 1024, 1536];
const outDir = path.resolve('docs/screens');
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
    });

    console.log(`Navigating at width ${width}px...`);
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    // Scroll through the page so all IntersectionObservers fire naturally
    await page.evaluate(async () => {
      const scrollStep = 500;
      for (let y = 0; y < document.body.scrollHeight; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 300));
    });

    const outPath = path.join(outDir, `home-v2-${width}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Captured: ${outPath}`);
    await page.close();
  }

  await browser.close();
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
