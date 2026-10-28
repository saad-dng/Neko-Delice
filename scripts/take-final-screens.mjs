import { chromium } from '@playwright/test';

async function waitForAllImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      })
    );
  });
}

const viewports = [
  { width: 1440, height: 900, name: '1440', isMobile: false },
  { width: 1280, height: 800, name: '1280', isMobile: false },
  { width: 768, height: 1024, name: '768', isMobile: false },
  { width: 390, height: 844, name: '390', isMobile: true },
];

async function main() {
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

    // Scroll down to trigger lazy images and IntersectionObservers
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= totalHeight; y += 350) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(60);
    }
    await waitForAllImages(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    // Above the fold
    await page.screenshot({
      path: `docs/screens/premium/final-${vp.name}.png`,
      fullPage: false,
    });

    // Full page
    await page.screenshot({
      path: `docs/screens/premium/final-${vp.name}-full.png`,
      fullPage: true,
    });

    console.log(`Captured final screenshots for ${vp.name}`);
    await context.close();
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

