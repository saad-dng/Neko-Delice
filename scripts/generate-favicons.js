import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  const faviconSvgPath = path.join(publicDir, 'favicon.svg');
  const appleTouchPath = path.join(publicDir, 'apple-touch-icon.png');

  const svgBuffer = fs.readFileSync(faviconSvgPath);

  // Render 180x180 apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);

  console.log('Successfully generated public/apple-touch-icon.png (180x180)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
