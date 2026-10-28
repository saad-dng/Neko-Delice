import { chromium } from '@playwright/test';

const prefix = process.argv[2] || 'step09-before';

async function main() {
  const browser = await chromium.launch();
  
  // 1440x900
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await pageDesktop.screenshot({ path: `docs/screens/premium/${prefix}-1440.png`, fullPage: false });
  await pageDesktop.screenshot({ path: `docs/screens/premium/${prefix}-1440-full.png`, fullPage: true });

  // 390x844
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await pageMobile.screenshot({ path: `docs/screens/premium/${prefix}-390.png`, fullPage: false });
  await pageMobile.screenshot({ path: `docs/screens/premium/${prefix}-390-full.png`, fullPage: true });

  await browser.close();
  console.log(`Captured screenshots for ${prefix}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
