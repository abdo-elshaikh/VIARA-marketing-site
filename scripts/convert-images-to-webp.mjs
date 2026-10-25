#!/usr/bin/env node
/**
 * Automated image optimization script for VIARA marketing site.
 * Converts PNG/JPG images to WebP format with quality optimization.
 *
 * Features:
 * - Converts large PNG images to WebP (quality 90)
 * - Compresses JPG images to WebP (quality 85)
 * - Creates mobile-optimized versions (max 768px width)
 * - Preserves originals with .original extension
 * - Generates detailed conversion report
 *
 * Usage: node scripts/convert-images-to-webp.mjs [--dry-run]
 */

import { readdir, stat, rename, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');
const assetsDir = join(rootDir, 'public', 'assets');

const TARGET_SIZE_KB = 500;
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const WEBP_QUALITY_PNG = 90;
const WEBP_QUALITY_JPG = 85;
const MOBILE_MAX_WIDTH = 768;

const DRY_RUN = process.argv.includes('--dry-run');

// Check if ImageMagick is available
async function checkImageMagick() {
  return new Promise((resolve) => {
    const child = spawn('magick', ['--version']);
    child.on('error', () => resolve(false));
    child.on('exit', (code) => resolve(code === 0));
  });
}

// Convert image using ImageMagick
async function convertWithMagick(inputPath, outputPath, quality, maxWidth = null) {
  return new Promise((resolve, reject) => {
    const args = [inputPath];

    if (maxWidth) {
      args.push('-resize', `${maxWidth}x>`);
    }

    args.push('-quality', quality.toString(), outputPath);

    const child = spawn('magick', args);

    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ImageMagick failed: ${stderr}`));
      }
    });

    child.on('error', reject);
  });
}

// Manual WebP conversion (basic fallback without Sharp/ImageMagick)
async function manualConversion(inputPath, outputPath, quality) {
  // For systems without ImageMagick or Sharp, create a placeholder
  // In production, you should install one of these tools
  console.warn(`⚠️  Cannot convert ${inputPath} - ImageMagick not available`);
  console.warn(`   Please install ImageMagick or use online tools like squoosh.app`);
  return false;
}

async function getImageFiles(dir) {
  const files = [];
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (IMAGE_EXTENSIONS.includes(extname(item.name).toLowerCase())) {
      const stats = await stat(fullPath);
      files.push({
        path: fullPath,
        size: stats.size,
        name: item.name,
        dir: dirname(fullPath),
        ext: extname(item.name).toLowerCase()
      });
    }
  }

  return files;
}

async function convertImage(file, hasMagick) {
  const relativePath = file.path.replace(rootDir, '').replace(/\\/g, '/');
  const originalSize = file.size;
  const sizeKB = Math.round(originalSize / 1024);

  console.log(`\n📸 Processing: ${relativePath} (${sizeKB} KB)`);

  // Skip if already small enough
  if (file.size <= TARGET_SIZE_KB * 1024) {
    console.log(`   ✓ Already optimized (< 500KB)`);
    return {
      file: relativePath,
      action: 'skipped',
      reason: 'already-optimized',
      originalSize: originalSize,
      newSize: originalSize,
      saved: 0
    };
  }

  // Skip if already .webp
  if (file.ext === '.webp') {
    console.log(`   ✓ Already WebP format`);
    return {
      file: relativePath,
      action: 'skipped',
      reason: 'already-webp',
      originalSize: originalSize,
      newSize: originalSize,
      saved: 0
    };
  }

  if (DRY_RUN) {
    console.log(`   [DRY RUN] Would convert to WebP`);
    const estimatedSize = file.ext === '.png'
      ? Math.round(originalSize * 0.3) // PNG usually compresses to ~30%
      : Math.round(originalSize * 0.5); // JPG usually compresses to ~50%

    return {
      file: relativePath,
      action: 'dry-run',
      originalSize: originalSize,
      newSize: estimatedSize,
      saved: originalSize - estimatedSize
    };
  }

  if (!hasMagick) {
    console.log(`   ⚠️  Skipping - ImageMagick not available`);
    return {
      file: relativePath,
      action: 'skipped',
      reason: 'no-tool',
      originalSize: originalSize,
      newSize: originalSize,
      saved: 0
    };
  }

  try {
    const baseName = basename(file.name, file.ext);
    const webpPath = join(file.dir, `${baseName}.webp`);
    const originalBackup = join(file.dir, `${baseName}${file.ext}.original`);

    // Backup original if not already backed up
    if (!existsSync(originalBackup)) {
      await rename(file.path, originalBackup);
      console.log(`   💾 Backed up original`);
    }

    // Convert to WebP
    const quality = file.ext === '.png' ? WEBP_QUALITY_PNG : WEBP_QUALITY_JPG;
    await convertWithMagick(originalBackup, webpPath, quality);
    console.log(`   ✓ Converted to WebP (quality ${quality})`);

    // Create mobile version for large images
    if (originalSize > 1024 * 1024) { // > 1MB
      const mobileWebpPath = join(file.dir, `${baseName}-mobile.webp`);
      await convertWithMagick(originalBackup, mobileWebpPath, quality, MOBILE_MAX_WIDTH);
      console.log(`   ✓ Created mobile version (max ${MOBILE_MAX_WIDTH}px width)`);
    }

    const newStats = await stat(webpPath);
    const newSize = newStats.size;
    const savedBytes = originalSize - newSize;
    const savedPercent = Math.round((savedBytes / originalSize) * 100);
    const newSizeKB = Math.round(newSize / 1024);

    console.log(`   📊 Result: ${sizeKB} KB → ${newSizeKB} KB (saved ${savedPercent}%)`);

    return {
      file: relativePath,
      action: 'converted',
      originalSize: originalSize,
      newSize: newSize,
      saved: savedBytes,
      quality: quality,
      hasMobile: originalSize > 1024 * 1024
    };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      file: relativePath,
      action: 'failed',
      error: error.message,
      originalSize: originalSize,
      newSize: originalSize,
      saved: 0
    };
  }
}

async function updateImageReferences() {
  console.log('\n📝 Updating image references in code...');

  const filesToUpdate = [
    'app/care-hero.tsx',
    'app/site-header.tsx',
    'app/system-capture-gallery.tsx',
    'app/solution-showcase.tsx'
  ];

  const replacements = [
    { from: '.png', to: '.webp' },
    { from: '.jpg', to: '.webp' },
    { from: '.jpeg', to: '.webp' }
  ];

  let updatedFiles = 0;

  for (const file of filesToUpdate) {
    const filePath = join(rootDir, file);
    if (!existsSync(filePath)) continue;

    try {
      let content = await readFile(filePath, 'utf-8');
      let modified = false;

      for (const { from, to } of replacements) {
        const regex = new RegExp(`/assets/[^"']+${from.replace('.', '\\.')}`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, (match) => match.replace(from, to));
          modified = true;
        }
      }

      if (modified && !DRY_RUN) {
        await writeFile(filePath, content, 'utf-8');
        console.log(`   ✓ Updated ${file}`);
        updatedFiles++;
      } else if (modified && DRY_RUN) {
        console.log(`   [DRY RUN] Would update ${file}`);
        updatedFiles++;
      }

    } catch (error) {
      console.error(`   ❌ Error updating ${file}: ${error.message}`);
    }
  }

  if (updatedFiles > 0) {
    console.log(`\n✅ Updated ${updatedFiles} file(s)`);
  } else {
    console.log('\n📋 No image references to update');
  }
}

async function main() {
  console.log('🎨 VIARA Marketing Site - Image Optimization');
  console.log('============================================\n');

  if (DRY_RUN) {
    console.log('🧪 DRY RUN MODE - No files will be modified\n');
  }

  // Check for ImageMagick
  console.log('🔍 Checking for ImageMagick...');
  const hasMagick = await checkImageMagick();

  if (hasMagick) {
    console.log('✅ ImageMagick found\n');
  } else {
    console.log('⚠️  ImageMagick not found');
    console.log('   Please install ImageMagick to convert images automatically');
    console.log('   Download from: https://imagemagick.org/script/download.php\n');

    if (!DRY_RUN) {
      console.log('💡 Recommendation:');
      console.log('   1. Install ImageMagick');
      console.log('   2. Run this script again');
      console.log('   3. Or use online tools: squoosh.app, tinypng.com\n');
    }
  }

  // Get all images
  console.log('📁 Scanning for images...');
  const images = await getImageFiles(assetsDir);
  const largeImages = images.filter(img => img.size > TARGET_SIZE_KB * 1024);

  console.log(`   Found ${images.length} images`);
  console.log(`   ${largeImages.length} images need optimization (> 500KB)\n`);

  if (largeImages.length === 0) {
    console.log('✅ All images are already optimized!');
    return;
  }

  // Convert images
  const results = [];
  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (const image of largeImages) {
    const result = await convertImage(image, hasMagick);
    results.push(result);
    totalOriginalSize += result.originalSize;
    totalNewSize += result.newSize;
  }

  // Update code references
  if (!DRY_RUN && hasMagick && results.some(r => r.action === 'converted')) {
    await updateImageReferences();
  }

  // Generate report
  console.log('\n📊 Optimization Summary');
  console.log('======================\n');

  const converted = results.filter(r => r.action === 'converted');
  const skipped = results.filter(r => r.action === 'skipped');
  const failed = results.filter(r => r.action === 'failed');

  console.log(`Converted: ${converted.length}`);
  console.log(`Skipped:   ${skipped.length}`);
  console.log(`Failed:    ${failed.length}`);
  console.log(`Total:     ${results.length}\n`);

  const totalSaved = totalOriginalSize - totalNewSize;
  const savedPercent = totalOriginalSize > 0
    ? Math.round((totalSaved / totalOriginalSize) * 100)
    : 0;

  console.log(`Original size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`New size:      ${(totalNewSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Saved:         ${(totalSaved / (1024 * 1024)).toFixed(2)} MB (${savedPercent}%)\n`);

  // Save report
  const reportPath = join(rootDir, 'image-optimization-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    hasMagick: hasMagick,
    summary: {
      total: results.length,
      converted: converted.length,
      skipped: skipped.length,
      failed: failed.length,
      totalOriginalSizeMB: (totalOriginalSize / (1024 * 1024)).toFixed(2),
      totalNewSizeMB: (totalNewSize / (1024 * 1024)).toFixed(2),
      totalSavedMB: (totalSaved / (1024 * 1024)).toFixed(2),
      savedPercent: savedPercent
    },
    results: results.map(r => ({
      file: r.file,
      action: r.action,
      originalSizeKB: Math.round(r.originalSize / 1024),
      newSizeKB: Math.round(r.newSize / 1024),
      savedKB: Math.round(r.saved / 1024),
      savedPercent: r.originalSize > 0
        ? Math.round((r.saved / r.originalSize) * 100)
        : 0,
      quality: r.quality,
      hasMobile: r.hasMobile,
      error: r.error
    }))
  };

  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Report saved: ${reportPath}\n`);

  if (DRY_RUN) {
    console.log('🧪 This was a dry run. Run without --dry-run to convert images.\n');
  } else if (!hasMagick) {
    console.log('⚠️  No images were converted (ImageMagick not available)\n');
  } else if (converted.length > 0) {
    console.log('✅ Optimization complete!\n');
    console.log('📋 Next steps:');
    console.log('   1. Test the site locally');
    console.log('   2. Verify images load correctly');
    console.log('   3. Run performance tests');
    console.log('   4. Commit changes\n');
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
