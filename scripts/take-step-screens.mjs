import { chromium } from '@playwright/test';

const prefix = process.argv[2] || 'step09-before';

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

async function main() {
  const browser = await chromium.launch();
  
  // 1440x900
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  
  // Slowly scroll down to trigger lazy loading
  for (let y = 0; y <= 3000; y += 400) {
    await pageDesktop.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await pageDesktop.waitForTimeout(100);
  }
  await waitForAllImages(pageDesktop);
  await pageDesktop.evaluate(() => window.scrollTo(0, 0));
  await pageDesktop.waitForTimeout(300);

  await pageDesktop.screenshot({ path: `docs/screens/premium/${prefix}-1440.png`, fullPage: false });
  await pageDesktop.screenshot({ path: `docs/screens/premium/${prefix}-1440-full.png`, fullPage: true });

  // 390x844
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  for (let y = 0; y <= 4000; y += 400) {
    await pageMobile.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await pageMobile.waitForTimeout(100);
  }
  await waitForAllImages(pageMobile);
  await pageMobile.evaluate(() => window.scrollTo(0, 0));
  await pageMobile.waitForTimeout(300);

  await pageMobile.screenshot({ path: `docs/screens/premium/${prefix}-390.png`, fullPage: false });
  await pageMobile.screenshot({ path: `docs/screens/premium/${prefix}-390-full.png`, fullPage: true });

  await browser.close();
  console.log(`Captured screenshots for ${prefix}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
