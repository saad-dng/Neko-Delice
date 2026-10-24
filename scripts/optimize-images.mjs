import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const CACHE_DIR = path.resolve('node_modules/.cache/neko-images');
const CACHE_FILE = path.join(CACHE_DIR, 'cache.json');
const MAP_FILE = path.resolve('src/data/image-map.source.json');
const MANIFEST_FILE = path.resolve('src/data/images.manifest.ts');
const OUT_DIR = path.resolve('public/images/products');

const BUDGETS = {
  640: 70 * 1024,
  1024: 150 * 1024,
  1600: 300 * 1024,
};

fs.mkdirSync(CACHE_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    cache = {};
  }
}

function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

async function optimize() {
  const rawMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  const kept = rawMap.filter((item) => item.keep !== false);

  console.log(`Starting image optimization for ${kept.length} images...`);

  const manifestEntries = [];
  const processedStats = [];
  let skippedCount = 0;
  let processedCount = 0;

  // Track role frequency per slug to handle duplicate roles cleanly
  const roleCounters = {};

  for (const item of kept) {
    const key = `${item.slug}-${item.role}`;
    roleCounters[key] = (roleCounters[key] || 0) + 1;
  }
  const roleCurrent = {};

  for (const item of kept) {
    const key = `${item.slug}-${item.role}`;
    roleCurrent[key] = (roleCurrent[key] || 0) + 1;
    const count = roleCounters[key];
    const index = roleCurrent[key];

    // File naming: <slug>-<role>[-<n>]-<size>.webp
    const roleBaseName = count > 1 ? `${item.role}-${index}` : item.role;
    const destDir = path.join(OUT_DIR, item.slug);
    fs.mkdirSync(destDir, { recursive: true });

    const sourcePath = path.resolve(item.source);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source photo not found: ${sourcePath}`);
    }

    const hash = getFileHash(sourcePath);
    const cacheKey = `${item.slug}:${roleBaseName}`;
    const cached = cache[cacheKey];

    const is1200x896 = item.width === 1200 && item.height === 896;
    // User selected: Crop Product 01 hero (1200x896) to 1:1 square.
    // We crop 896x896 from center, then resize to 1024x1024 so all 48 images standardise at 1024x1024 native.
    const targetBaseWidth = 1024;
    const targetBaseHeight = 1024;

    const targetWidths = [640, 1024];

    const srcsetObj = {};
    const fileStats = {};

    let needsProcessing = false;
    if (!cached || cached.hash !== hash) {
      needsProcessing = true;
    } else {
      for (const w of targetWidths) {
        const outFileName = `${item.slug}-${roleBaseName}-${w}.webp`;
        const outPath = path.join(destDir, outFileName);
        if (!fs.existsSync(outPath)) {
          needsProcessing = true;
          break;
        }
      }
    }

    if (needsProcessing) {
      for (const w of targetWidths) {
        const outFileName = `${item.slug}-${roleBaseName}-${w}.webp`;
        const outPath = path.join(destDir, outFileName);
        const relWebpPath = `/images/products/${item.slug}/${outFileName}`;

        let quality = 80;
        let buffer;
        let pipeline;

        // Try reducing quality down to min 70 if over budget
        while (quality >= 70) {
          pipeline = sharp(sourcePath);
          if (is1200x896) {
            pipeline = pipeline.extract({
              left: Math.round((1200 - 896) / 2),
              top: 0,
              width: 896,
              height: 896,
            });
            pipeline = pipeline.resize(w, w, { fit: 'cover' });
          } else {
            if (w < targetBaseWidth) {
              pipeline = pipeline.resize(w, w, { fit: 'cover' });
            }
          }

          buffer = await pipeline.webp({ quality }).toBuffer();
          if (buffer.length <= BUDGETS[w] || quality === 70) {
            break;
          }
          quality -= 3;
        }

        fs.writeFileSync(outPath, buffer);
        fileStats[w] = { size: buffer.length, quality };
        srcsetObj[w] = relWebpPath;

        if (buffer.length > BUDGETS[w]) {
          console.warn(
            `⚠️  Budget exceeded: ${outFileName} is ${(buffer.length / 1024).toFixed(1)} KB (budget ${(BUDGETS[w] / 1024).toFixed(0)} KB)`
          );
        }
      }

      cache[cacheKey] = {
        hash,
        srcset: srcsetObj,
        fileStats,
        width: targetBaseWidth,
        height: targetBaseHeight,
      };
      processedCount++;
    } else {
      Object.assign(srcsetObj, cached.srcset);
      Object.assign(fileStats, cached.fileStats);
      skippedCount++;
    }

    const largestW = Math.max(...targetWidths);
    const primarySrc = srcsetObj[largestW] || srcsetObj[targetWidths[0]];

    manifestEntries.push({
      slug: item.slug,
      role: item.role,
      roleName: roleBaseName,
      src: primarySrc,
      alt: item.alt,
      width: largestW,
      height: largestW,
      srcset: srcsetObj,
      fileStats,
    });

    processedStats.push({
      slug: item.slug,
      file: `${item.slug}-${roleBaseName}`,
      stats: fileStats,
    });
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

  // Build per-product structures
  const products = {};
  for (const entry of manifestEntries) {
    if (!products[entry.slug]) {
      products[entry.slug] = {
        slug: entry.slug,
        gallery: [],
        images: {},
      };
    }
    products[entry.slug].gallery.push(entry);
    products[entry.slug].images[entry.roleName] = entry;
  }

  for (const [slug, prod] of Object.entries(products)) {
    // Determine cardDefault (hero) and cardHover
    const heroImg =
      prod.images['hero'] ||
      prod.images['hero-1'] ||
      prod.gallery.find((g) => g.role === 'hero') ||
      prod.gallery[0];
    const isHardware = ['07', '08', '09', '10', 'stainless', 'tilted', 'ceramic-water', 'sisal'].some((k) =>
      slug.includes(k)
    );
    const hoverRole = isHardware ? 'together' : 'contents';
    const hoverImg =
      prod.images[hoverRole] ||
      prod.images[`${hoverRole}-1`] ||
      prod.gallery.find((g) => g.role === hoverRole) ||
      prod.gallery[1] ||
      heroImg;

    prod.cardDefault = heroImg;
    prod.cardHover = hoverImg;
  }

  // Generate src/data/images.manifest.ts
  const tsContent = `// GENERATED — do not edit
// Generated by scripts/optimize-images.mjs

export interface ImageManifestEntry {
  slug: string;
  role: string;
  roleName: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  srcset: Record<number, string>;
}

export interface ProductImageManifest {
  slug: string;
  cardDefault: ImageManifestEntry;
  cardHover: ImageManifestEntry;
  gallery: ImageManifestEntry[];
  images: Record<string, ImageManifestEntry>;
}

export const imageManifest: Record<string, ProductImageManifest> = ${JSON.stringify(
    products,
    (key, val) => {
      if (key === 'fileStats') return undefined;
      return val;
    },
    2
  )};

export default imageManifest;
`;

  fs.writeFileSync(MANIFEST_FILE, tsContent);
  console.log(`\nManifest written to ${path.relative(process.cwd(), MANIFEST_FILE)}`);
  console.log(`Processed: ${processedCount}, Cached/Skipped: ${skippedCount}`);

  // Print summary size table
  console.log('\n--- Image Budget & Size Summary ---');
  let totalBytes = 0;
  let largestFile = { name: '', size: 0 };
  const perProductSize = {};

  for (const stat of processedStats) {
    if (!perProductSize[stat.slug]) perProductSize[stat.slug] = 0;
    for (const [w, info] of Object.entries(stat.stats)) {
      totalBytes += info.size;
      perProductSize[stat.slug] += info.size;
      const fileName = `${stat.file}-${w}.webp`;
      if (info.size > largestFile.size) {
        largestFile = { name: fileName, size: info.size };
      }
    }
  }

  console.log('\nTotal optimized size per product:');
  for (const [slug, bytes] of Object.entries(perProductSize)) {
    console.log(`  • ${slug.padEnd(32)}: ${(bytes / 1024).toFixed(1)} KB`);
  }
  console.log(`\nOverall total WebP size: ${(totalBytes / 1024).toFixed(1)} KB`);
  console.log(
    `Largest file: ${largestFile.name} (${(largestFile.size / 1024).toFixed(1)} KB)`
  );
}

optimize().catch((err) => {
  console.error('Optimization error:', err);
  process.exit(1);
});
