import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630
const OUT_PATH = path.resolve('public/og-image.png')
const PRODUCT_PHOTO_PATH = path.resolve('public/images/products/wild-salmon-quail-pate/wild-salmon-quail-pate-hero-1024.webp')

async function generateOgImage() {
  console.log('Generating public/og-image.png (1200x630)...')

  // 1. Prepare product photo on card
  const photoSize = 480
  const resizedPhotoBuffer = await sharp(PRODUCT_PHOTO_PATH)
    .resize(photoSize, photoSize, { fit: 'cover' })
    .toBuffer()

  // 2. SVG overlay with branding, glyph, live wordmark and typography
  const svgOverlay = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Border -->
      <rect x="24" y="24" width="${WIDTH - 48}" height="${HEIGHT - 48}" rx="24" fill="none" stroke="#D9C3A5" stroke-width="2" />
      
      <!-- Right Image Card Frame -->
      <rect x="630" y="65" width="500" height="500" rx="20" fill="#DDD0BA" stroke="#D9C3A5" stroke-width="1.5" />

      <!-- Eyebrow Pill -->
      <rect x="75" y="80" width="370" height="36" rx="18" fill="#E5D8BC" stroke="#D9C3A5" stroke-width="1" />
      <circle cx="95" cy="98" r="4.5" fill="#A94F33" />
      <text x="112" y="103" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#2B211A" letter-spacing="0.5">
        Vet-informed feline nutrition &amp; quiet hardware
      </text>

      <!-- Cat Glyph -->
      <g transform="translate(75, 145) scale(0.9)">
        <path d="M 14.5 12.5 L 23.5 25.5 C 26 23.5 38 23.5 40.5 25.5 L 49.5 12.5 C 52 20 54 26 54 31.5 C 54 44 43.5 53 32 53 C 20.5 53 10 44 10 31.5 C 10 26 12 20 14.5 12.5 Z"
              fill="none" stroke="#2B211A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </g>

      <!-- Wordmark -->
      <text x="145" y="172" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#2B211A" letter-spacing="4">
        NEKO DELICE
      </text>

      <!-- Main Headline -->
      <text x="75" y="260" font-family="Georgia, serif" font-size="46" font-weight="700" fill="#2B211A" letter-spacing="-0.5">
        Feed your cat
      </text>
      <text x="75" y="315" font-family="Georgia, serif" font-size="46" font-weight="700" fill="#2B211A" letter-spacing="-0.5">
        exactly what they need.
      </text>

      <!-- Tagline / Subcopy -->
      <text x="75" y="380" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" fill="#3E3228" font-weight="400">
        Tell us about your cat. We work out the calories
      </text>
      <text x="75" y="412" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" fill="#3E3228" font-weight="400">
        and build a month of meals with zero guesswork.
      </text>

      <!-- Features Checklist -->
      <g transform="translate(75, 470)">
        <circle cx="8" cy="8" r="8" fill="#A94F33" />
        <path d="M 5 8 L 7.5 10.5 L 11.5 5.5" stroke="#FBF6EE" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <text x="26" y="13" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#2B211A">
          Clinical RER &amp; MER formulas
        </text>

        <circle cx="270" cy="8" r="8" fill="#A94F33" />
        <path d="M 267 8 L 269.5 10.5 L 273.5 5.5" stroke="#FBF6EE" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <text x="288" y="13" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#2B211A">
          Transparent supply days
        </text>
      </g>

      <!-- Product Caption inside right frame -->
      <text x="648" y="540" font-family="Georgia, serif" font-size="15" font-weight="600" fill="#2B211A">
        Wild Salmon &amp; Quail Paté · 24 stick sachets × 40 g
      </text>
    </svg>
  `)

  // 3. Compose image
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: '#FBF6EE', // warm cream-50
    },
  })
    .composite([
      {
        input: resizedPhotoBuffer,
        left: 640,
        top: 75,
      },
      {
        input: svgOverlay,
        left: 0,
        top: 0,
      },
    ])
    .png({ quality: 90 })
    .toFile(OUT_PATH)

  console.log(`Generated ${OUT_PATH} successfully!`)
}

generateOgImage().catch((err) => {
  console.error(err)
  process.exit(1)
})
