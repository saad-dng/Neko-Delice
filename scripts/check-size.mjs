import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const BUDGET_KB = 170
const DIST_DIR = path.resolve('dist')
const INDEX_HTML = path.join(DIST_DIR, 'index.html')

if (!fs.existsSync(INDEX_HTML)) {
  console.error('dist/index.html not found. Run "npm run build" first.')
  process.exit(1)
}

const html = fs.readFileSync(INDEX_HTML, 'utf8')

// Find script tags and modulepreload links in index.html
const scriptRegex = /<script[^>]+src=["']([^"']+\.js)["']/g
const preloadRegex = /<link[^>]+rel=["']modulepreload["'][^>]+href=["']([^"']+\.js)["']/g

const initialJsPaths = new Set()
let match

while ((match = scriptRegex.exec(html)) !== null) {
  initialJsPaths.add(match[1])
}
while ((match = preloadRegex.exec(html)) !== null) {
  initialJsPaths.add(match[1])
}

console.log('='.repeat(60))
console.log('NEKO DELICE — Initial JS Bundle Budget Audit')
console.log(`Budget Target: <= ${BUDGET_KB} KB gzip`)
console.log('='.repeat(60))

let totalRawBytes = 0
let totalGzipBytes = 0

console.log('\nInitial JS Chunks (loaded on Home index.html):')
console.log('-'.repeat(60))

for (const relPath of initialJsPaths) {
  // Normalize path removing leading slash
  const cleanPath = relPath.replace(/^\//, '')
  const fullPath = path.join(DIST_DIR, cleanPath)

  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: ${cleanPath} not found in dist/`)
    continue
  }

  const raw = fs.readFileSync(fullPath)
  const gzipped = zlib.gzipSync(raw)

  totalRawBytes += raw.length
  totalGzipBytes += gzipped.length

  const rawKb = (raw.length / 1024).toFixed(2)
  const gzipKb = (gzipped.length / 1024).toFixed(2)

  console.log(`  ${cleanPath.padEnd(40)} ${rawKb.padStart(8)} KB (raw) | ${gzipKb.padStart(8)} KB (gzip)`)
}

const totalRawKb = (totalRawBytes / 1024).toFixed(2)
const totalGzipKb = (totalGzipBytes / 1024).toFixed(2)

console.log('-'.repeat(60))
console.log(`Total Initial JS: ${totalRawKb} KB uncompressed | ${totalGzipKb} KB gzip`)
console.log(`Budget: <= ${BUDGET_KB} KB gzip`)

// Also inspect all assets chunks
console.log('\nAll Assets Chunks in dist/assets/:')
console.log('-'.repeat(60))
const assetsDir = path.join(DIST_DIR, 'assets')
if (fs.existsSync(assetsDir)) {
  const allFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'))
  const fileStats = allFiles.map(f => {
    const raw = fs.readFileSync(path.join(assetsDir, f))
    const gzipped = zlib.gzipSync(raw)
    return { name: f, rawKb: raw.length / 1024, gzipKb: gzipped.length / 1024 }
  }).sort((a, b) => b.gzipKb - a.gzipKb)

  for (const s of fileStats) {
    console.log(`  ${s.name.padEnd(40)} ${s.rawKb.toFixed(2).padStart(8)} KB | ${s.gzipKb.toFixed(2).padStart(8)} KB (gzip)`)
  }
}

console.log('='.repeat(60))

if (Number(totalGzipKb) <= BUDGET_KB) {
  console.log(`[PASS] Initial JS (${totalGzipKb} KB gzip) is within the ${BUDGET_KB} KB budget!`)
  process.exit(0)
} else {
  console.error(`[FAIL] Initial JS (${totalGzipKb} KB gzip) exceeds the ${BUDGET_KB} KB budget!`)
  process.exit(1)
}
