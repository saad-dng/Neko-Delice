import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function runBlendTest() {
  const screensDir = path.resolve('docs/screens');
  fs.mkdirSync(screensDir, { recursive: true });

  const heroPath = path.resolve('public/images/site/hero-1024.webp');
  const productPath = path.resolve(
    'public/images/products/duck-sweet-potato-kibble/duck-sweet-potato-kibble-hero-1024.webp'
  );
  const outPath = path.join(screensDir, 'blend-test.png');

  if (!fs.existsSync(heroPath)) {
    throw new Error(`Hero image not found: ${heroPath}`);
  }
  if (!fs.existsSync(productPath)) {
    throw new Error(`Product image not found: ${productPath}`);
  }

  // Get hero dimensions
  const heroMeta = await sharp(heroPath).metadata();
  console.log(`Hero dimensions: ${heroMeta.width}x${heroMeta.height}`);

  // Product carton scaled to ~420px width
  const productWidth = 420;
  const productHeight = 420;
  const productResized = await sharp(productPath)
    .resize(productWidth, productHeight, { fit: 'contain' })
    .toBuffer();

  // Position product in lower left/center where backdrop meets
  // Cat is on the right side, so placing carton at left: 60, top: heroMeta.height - 450
  const left = 60;
  const top = Math.max(0, heroMeta.height - productHeight - 40);

  const compositeResult = await sharp(heroPath)
    .composite([
      {
        input: productResized,
        top,
        left,
        blend: 'multiply',
      },
    ])
    .png()
    .toFile(outPath);

  console.log(`Blend test generated at ${outPath}:`, compositeResult);
}

runBlendTest().catch((err) => {
  console.error('Blend test error:', err);
  process.exit(1);
});
