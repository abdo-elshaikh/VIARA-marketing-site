#!/usr/bin/env node
/**
 * Clean build script for VIARA marketing site.
 * Safely cleans build artifacts and prepares for fresh build.
 */

import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

const foldersToClean = [
  'dist',
  '.next',
  '.wrangler',
  'node_modules/.cache',
  'node_modules/.vite'
];

console.log('🧹 VIARA Marketing Site - Clean Build\n');

async function cleanFolder(folderPath) {
  const fullPath = join(rootDir, folderPath);

  if (!existsSync(fullPath)) {
    console.log(`   ⏭️  ${folderPath} (doesn't exist)`);
    return;
  }

  try {
    await rm(fullPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 1000 });
    console.log(`   ✓ Cleaned ${folderPath}`);
  } catch (error) {
    if (error.code === 'EBUSY' || error.code === 'EPERM') {
      console.log(`   ⚠️  ${folderPath} (in use - close dev server first)`);
    } else {
      console.log(`   ❌ Error cleaning ${folderPath}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('📁 Cleaning build folders...\n');

  for (const folder of foldersToClean) {
    await cleanFolder(folder);
  }

  console.log('\n✅ Clean complete!\n');
  console.log('📋 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Or: npm run dev (for development)\n');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
