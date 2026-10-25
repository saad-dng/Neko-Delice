import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')

const siteUrl = (process.env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')

const PRODUCT_SLUGS = [
  'kitten-growth-mousse-broth',
  'wild-salmon-quail-pate',
  'duck-sweet-potato-kibble',
  'norwegian-salmon-oil',
  'freeze-dried-chicken-hearts',
  'matcha-tofu-litter',
  'stainless-oak-litter-basin',
  'tilted-ceramic-whisker-bowl',
  'ceramic-water-fountain',
  'sisal-birch-scratcher',
]

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'weekly' },
  { path: '/meal-plan', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
]

const productRoutes = PRODUCT_SLUGS.map((slug) => ({
  path: `/product/${slug}`,
  priority: '0.8',
  changefreq: 'weekly',
}))

const allRoutes = [...staticRoutes, ...productRoutes]
const today = new Date().toISOString().split('T')[0]

async function generateSitemap() {
  const urlEntries = allRoutes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n')

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

  await fs.mkdir(distDir, { recursive: true })
  const sitemapPath = path.join(distDir, 'sitemap.xml')
  await fs.writeFile(sitemapPath, sitemapContent, 'utf-8')
  console.log(`Generated sitemap with ${allRoutes.length} URLs at ${sitemapPath}`)

  // Also update dist/robots.txt with exact sitemap link
  const robotsPath = path.join(distDir, 'robots.txt')
  const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  await fs.writeFile(robotsPath, robotsContent, 'utf-8')
  console.log(`Updated robots.txt at ${robotsPath}`)
}

generateSitemap().catch((err) => {
  console.error('Failed to generate sitemap:', err)
  process.exit(1)
})
