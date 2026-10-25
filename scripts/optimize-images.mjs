#!/usr/bin/env node
/**
 * Image optimization script for VIARA marketing site.
 * Converts large PNG/JPG images to optimized WebP format.
 */
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');
const assetsDir = join(rootDir, 'public', 'assets');

const TARGET_SIZE_KB = 500;
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function getImageFiles(dir) {
  const files = [];
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (IMAGE_EXTENSIONS.includes(extname(item.name).toLowerCase())) {
      const stats = await stat(fullPath);
      files.push({ path: fullPath, size: stats.size, name: item.name });
    }
  }

  return files;
}

async function analyzeImages() {
  console.log('🔍 Analyzing images in public/assets...\n');

  const images = await getImageFiles(assetsDir);
  const largeImages = images.filter(img => img.size > TARGET_SIZE_KB * 1024);

  if (largeImages.length === 0) {
    console.log('✅ No images larger than 500KB found.');
    return;
  }

  console.log(`Found ${largeImages.length} images larger than 500KB:\n`);

  let totalSize = 0;
  for (const img of largeImages) {
    const sizeKB = Math.round(img.size / 1024);
    const sizeMB = (img.size / (1024 * 1024)).toFixed(2);
    const relativePath = img.path.replace(rootDir, '').replace(/\\/g, '/');
    console.log(`  ${relativePath}`);
    console.log(`    Size: ${sizeKB} KB (${sizeMB} MB)`);
    totalSize += img.size;
  }

  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`\n📊 Total size: ${totalMB} MB`);
  console.log(`\n⚠️  Manual optimization needed:`);
  console.log(`   Use tools like squoosh.app, tinypng.com, or ImageMagick to:`);
  console.log(`   1. Convert PNG to WebP format`);
  console.log(`   2. Compress JPG images with quality 85-90`);
  console.log(`   3. Resize images to actual display dimensions`);
  console.log(`\n📋 Image inventory saved to: image-inventory.json`);

  await writeFile(
    join(rootDir, 'image-inventory.json'),
    JSON.stringify({
      analyzed: new Date().toISOString(),
      largeImages: largeImages.map(img => ({
        path: img.path.replace(rootDir, '').replace(/\\/g, '/'),
        sizeKB: Math.round(img.size / 1024),
        sizeMB: (img.size / (1024 * 1024)).toFixed(2)
      })),
      totalSizeMB: totalMB
    }, null, 2)
  );
}

analyzeImages().catch(err => {
  console.error('Error analyzing images:', err);
  process.exit(1);
});
