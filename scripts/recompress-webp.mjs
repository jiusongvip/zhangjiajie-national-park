import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const QUALITY = 80;

async function convertAll(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let converted = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const r = await convertAll(fullPath);
      converted += r.converted;
      totalBefore += r.totalBefore;
      totalAfter += r.totalAfter;
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      const webpPath = fullPath.replace(/\.(jpe?g|png)$/i, '.webp');
      const before = (await stat(fullPath)).size;
      totalBefore += before;
      try {
        await sharp(fullPath)
          .webp({ quality: QUALITY })
          .toFile(webpPath);
        const after = (await stat(webpPath)).size;
        totalAfter += after;
        converted++;
        const pct = ((1 - after / before) * 100).toFixed(0);
        console.log(`  ✓ ${entry.name} → ${pct}% smaller (${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB)`);
      } catch (err) {
        console.error(`  ✗ ${entry.name}: ${err.message}`);
      }
    }
  }
  return { converted, totalBefore, totalAfter };
}

console.log(`🖼  Converting images to WebP (quality=${QUALITY}%)...\n`);
const result = await convertAll(PUBLIC_DIR);
if (result.converted > 0) {
  const totalPct = ((1 - result.totalAfter / result.totalBefore) * 100).toFixed(0);
  console.log(`\n✅ Done: ${result.converted} images, ${(result.totalBefore/1024).toFixed(0)}KB → ${(result.totalAfter/1024).toFixed(0)}KB (${totalPct}% overall saving)`);
} else {
  console.log('\n⚠️  No images found to convert.');
}
