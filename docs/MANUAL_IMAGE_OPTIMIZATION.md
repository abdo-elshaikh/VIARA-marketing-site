# Manual Image Optimization Guide

Since ImageMagick is not available in the current environment, this guide provides step-by-step instructions for manual image optimization.

## 🎯 Optimization Targets

Based on automated analysis, these 18 images need optimization:

### Critical Priority (> 1MB)

| File | Current Size | Target | Savings |
|------|-------------|--------|---------|
| `scenes/viara-brand-hero-v3.png` | 2,215 KB | ~665 KB | 70% |
| `system/portal-doctor.png` | 1,205 KB | ~360 KB | 70% |
| `system/portal-hub.png` | 1,238 KB | ~370 KB | 70% |
| `system/portal-patient.png` | 1,224 KB | ~370 KB | 70% |
| `viara-brand-logo-only.png` | 1,507 KB | ~450 KB | 70% |

**Subtotal**: 7,389 KB → ~2,215 KB (save ~5,174 KB)

### High Priority (700KB - 1MB)

| File | Current Size | Target | Savings |
|------|-------------|--------|---------|
| `system/viara-system-appointments.png` | 862 KB | ~260 KB | 70% |
| `system/viara-system-dashboard.png` | 800 KB | ~240 KB | 70% |
| `system/viara-system-modality.png` | 790 KB | ~240 KB | 70% |
| `scenes/hospital-inpatient.jpg` | 765 KB | ~380 KB | 50% |
| `system/viara-system-ris-worklist.png` | 767 KB | ~230 KB | 70% |
| `scenes/healthcare-command.jpg` | 778 KB | ~390 KB | 50% |
| `scenes/viara-brand-hero.png` | 724 KB | ~220 KB | 70% |
| `viara-brand.png` | 724 KB | ~220 KB | 70% |

**Subtotal**: 6,210 KB → ~2,180 KB (save ~4,030 KB)

### Medium Priority (500KB - 700KB)

| File | Current Size | Target | Savings |
|------|-------------|--------|---------|
| `system/viara-system-reception-cms.png` | 925 KB | ~280 KB | 70% |
| `viara-symbol.png` | 689 KB | ~210 KB | 70% |
| `scenes/diagnostic-pacs.jpg` | 670 KB | ~335 KB | 50% |
| `system/viara-system-pacs-workstation.jpg` | 670 KB | ~335 KB | 50% |
| `system/viara-system-login.png` | 664 KB | ~200 KB | 70% |

**Subtotal**: 3,618 KB → ~1,360 KB (save ~2,258 KB)

---

**TOTAL**: 17,217 KB (16.81 MB) → ~5,755 KB (5.62 MB)  
**Expected Savings**: ~11,462 KB (11.2 MB) — **67% reduction**

---

## 🛠️ Optimization Methods

### Method 1: Online Tools (Recommended for Quick Start)

#### Squoosh.app (Google)
**Best for**: PNG to WebP conversion with visual quality comparison

1. Go to [squoosh.app](https://squoosh.app)
2. Drop your image
3. Select "WebP" from right panel
4. Set quality:
   - PNG images: 90
   - JPG images: 85
5. Compare before/after
6. Download optimized image

**Advantages**:
- Visual quality comparison
- Instant preview
- No installation needed
- Supports batch via browser automation

---

#### TinyPNG / TinyJPG
**Best for**: Quick PNG/JPG optimization

1. Go to [tinypng.com](https://tinypng.com)
2. Upload up to 20 images (max 5MB each)
3. Download compressed images
4. **Note**: Outputs PNG/JPG, not WebP

**Advantages**:
- Batch upload (20 files)
- Very easy to use
- Good compression
- Free tier available

---

#### CloudConvert
**Best for**: Batch conversion

1. Go to [cloudconvert.com](https://cloudconvert.com)
2. Select "Convert to WebP"
3. Upload multiple files
4. Configure quality settings
5. Download all

**Advantages**:
- Batch processing
- API available
- Multiple formats
- Free tier: 25 conversions/day

---

### Method 2: Desktop Tools

#### ImageMagick (Command Line)

**Installation**:
- Windows: Download from [imagemagick.org](https://imagemagick.org/script/download.php#windows)
- Mac: `brew install imagemagick`
- Linux: `sudo apt install imagemagick`

**Usage**:

```bash
# Single image conversion
magick input.png -quality 90 output.webp

# Batch conversion (all PNG in directory)
for file in *.png; do magick "$file" -quality 90 "${file%.png}.webp"; done

# Resize and convert (mobile version)
magick input.png -resize 768x> -quality 90 output-mobile.webp

# Batch with resize
for file in *.png; do 
  magick "$file" -quality 90 "${file%.png}.webp"
  magick "$file" -resize 768x> -quality 90 "${file%.png}-mobile.webp"
done
```

**After installation**, run the automated script:
```bash
node scripts/convert-images-to-webp.mjs
```

---

#### XnConvert (GUI, Free)

**Download**: [xnview.com/en/xnconvert](https://www.xnview.com/en/xnconvert/)

**Steps**:
1. Launch XnConvert
2. Add files (Input tab)
3. Actions tab → Add action → "Resize" (optional, 768px max width for mobile)
4. Output tab:
   - Format: WebP
   - Quality: 90 (PNG) or 85 (JPG)
5. Convert

**Advantages**:
- Visual interface
- Batch processing
- Cross-platform
- Free

---

### Method 3: Node.js Script (Automated)

#### Option A: Using Sharp (Recommended if you can install native modules)

```bash
# Install Sharp
npm install --save-dev sharp

# Create optimization script
```

```javascript
// scripts/optimize-with-sharp.mjs
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const files = await readdir('public/assets/scenes');

for (const file of files) {
  if (file.endsWith('.png') || file.endsWith('.jpg')) {
    const input = join('public/assets/scenes', file);
    const output = input.replace(/\.(png|jpg)$/, '.webp');
    
    await sharp(input)
      .webp({ quality: 90 })
      .toFile(output);
    
    console.log(`Converted: ${file} → ${output}`);
  }
}
```

```bash
# Run
node scripts/optimize-with-sharp.mjs
```

---

#### Option B: Use the created script (after ImageMagick installation)

```bash
# Install ImageMagick first (see above)
# Then run
node scripts/convert-images-to-webp.mjs
```

This automated script will:
- ✅ Convert all PNG to WebP (quality 90)
- ✅ Convert all JPG to WebP (quality 85)
- ✅ Create mobile versions for files > 1MB
- ✅ Backup originals with `.original` extension
- ✅ Update code references automatically
- ✅ Generate detailed report

---

## 📋 Step-by-Step Manual Process

### Phase 1: Critical Images (30-45 minutes)

**Process the 5 largest files first**:

1. **viara-brand-hero-v3.png** (2.2 MB)
   - Open in [squoosh.app](https://squoosh.app)
   - Convert to WebP, quality 90
   - Save as `viara-brand-hero-v3.webp`
   - Create mobile version: resize to 768px width, save as `viara-brand-hero-v3-mobile.webp`
   - Expected: ~665 KB desktop, ~200 KB mobile

2. **portal-hub.png** (1.2 MB)
   - Same process
   - Expected: ~370 KB

3. **portal-doctor.png** (1.2 MB)
   - Same process
   - Expected: ~360 KB

4. **portal-patient.png** (1.2 MB)
   - Same process
   - Expected: ~370 KB

5. **viara-brand-logo-only.png** (1.5 MB)
   - Same process
   - Expected: ~450 KB

**Checkpoint**: You should save ~5 MB at this point.

---

### Phase 2: High Priority Images (30-45 minutes)

Process the 8 files between 700KB - 1MB using the same method.

**Expected savings**: ~4 MB

---

### Phase 3: Medium Priority Images (20-30 minutes)

Process the remaining 5 files.

**Expected savings**: ~2 MB

---

### Phase 4: Update Code References (10-15 minutes)

Update image paths in these files:

#### app/care-hero.tsx

Find:
```typescript
<img src="/assets/scenes/viara-brand-hero-v3.png"
```

Replace with:
```typescript
<img src="/assets/scenes/viara-brand-hero-v3.webp"
     srcSet="/assets/scenes/viara-brand-hero-v3-mobile.webp 768w,
             /assets/scenes/viara-brand-hero-v3.webp 1440w"
```

#### app/site-header.tsx

Update logo references:
```typescript
// Old
<img src="/assets/viara-symbol.png"

// New
<img src="/assets/viara-symbol.webp"
```

#### Other files to check:
- `app/solution-showcase.tsx`
- `app/system-capture-gallery.tsx`
- `app/systems-page.tsx`
- `app/journeys-view.tsx`

**Search pattern**: `/assets/.*\.(png|jpg|jpeg)`

**Replace with**: Same path but `.webp` extension

---

## ✅ Verification Checklist

After optimization, verify:

### 1. File Sizes
```bash
# Check new sizes
cd public/assets
find . -name "*.webp" -exec ls -lh {} \;

# Should see files < 500KB each
```

### 2. Visual Quality
- [ ] Open site locally: `npm run dev`
- [ ] Check homepage hero image
- [ ] Check solution pages
- [ ] Check system screenshots
- [ ] Verify no quality degradation

### 3. Performance
```bash
# Build and check bundle size
npm run build

# Expected: faster page loads, better LCP scores
```

### 4. Browser Compatibility
- [ ] Chrome (WebP supported)
- [ ] Firefox (WebP supported)
- [ ] Safari (WebP supported since 2020)
- [ ] Edge (WebP supported)

**Note**: All modern browsers support WebP. If supporting very old browsers, keep PNG/JPG as fallback.

---

## 🔄 Fallback Strategy (If WebP Not Suitable)

If you need to keep PNG/JPG:

### PNG Optimization
1. Use [pngquant](https://pngquant.org/) or [optipng](http://optipng.sourceforge.net/)
2. Target: 256 colors for non-photographic images
3. Expected: 50-60% reduction

### JPG Optimization  
1. Use [jpegoptim](https://github.com/tjko/jpegoptim) or [mozjpeg](https://github.com/mozilla/mozjpeg)
2. Quality: 85 for web
3. Progressive encoding
4. Expected: 30-40% reduction

---

## 📊 Expected Performance Improvements

After optimization:

### Page Load Metrics (Estimated)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Homepage size | ~5 MB | ~2 MB | 60% |
| LCP (3G) | ~5-6s | ~2-3s | 50% |
| Time to Interactive | ~4s | ~2s | 50% |
| Lighthouse Performance | 70-80 | 90-95 | +15-20 |

### Bandwidth Savings (Monthly Estimate)

Assuming 10,000 page views/month:
- Before: 50 GB transferred
- After: 20 GB transferred
- **Saved**: 30 GB/month

---

## 🚀 Quick Start (Choose One)

### Option 1: Online (Easiest, no installation)
1. Go to [squoosh.app](https://squoosh.app)
2. Process 18 images (10-15 minutes each)
3. Download optimized versions
4. Replace original files
5. Update code references
6. Test locally

**Total time**: ~2-3 hours

---

### Option 2: Desktop Tool (Batch processing)
1. Download [XnConvert](https://www.xnview.com/en/xnconvert/)
2. Add all 18 images
3. Set output to WebP, quality 90
4. Convert all at once
5. Replace original files
6. Update code references
7. Test locally

**Total time**: ~30-45 minutes

---

### Option 3: Automated (Best, requires ImageMagick)
1. Install ImageMagick
2. Run: `node scripts/convert-images-to-webp.mjs`
3. Test locally

**Total time**: ~10 minutes (after installation)

---

## 📝 Optimization Log Template

Use this to track progress:

```markdown
# Image Optimization Progress

## Phase 1: Critical (Target: 5 MB savings)
- [ ] viara-brand-hero-v3.png → .webp (2.2 MB → 665 KB)
- [ ] portal-hub.png → .webp (1.2 MB → 370 KB)
- [ ] portal-doctor.png → .webp (1.2 MB → 360 KB)
- [ ] portal-patient.png → .webp (1.2 MB → 370 KB)
- [ ] viara-brand-logo-only.png → .webp (1.5 MB → 450 KB)

**Phase 1 Total**: _____ MB saved

## Phase 2: High Priority (Target: 4 MB savings)
- [ ] viara-system-appointments.png
- [ ] viara-system-dashboard.png
- [ ] viara-system-modality.png
- [ ] hospital-inpatient.jpg
- [ ] viara-system-ris-worklist.png
- [ ] healthcare-command.jpg
- [ ] viara-brand-hero.png
- [ ] viara-brand.png

**Phase 2 Total**: _____ MB saved

## Phase 3: Medium Priority (Target: 2 MB savings)
- [ ] viara-system-reception-cms.png
- [ ] viara-symbol.png
- [ ] diagnostic-pacs.jpg
- [ ] viara-system-pacs-workstation.jpg
- [ ] viara-system-login.png

**Phase 3 Total**: _____ MB saved

## Phase 4: Code Updates
- [ ] app/care-hero.tsx updated
- [ ] app/site-header.tsx updated
- [ ] Other components checked
- [ ] All references updated

## Verification
- [ ] Visual quality checked
- [ ] Site loads correctly
- [ ] Performance improved
- [ ] All browsers tested

**Overall Total**: _____ MB saved (Target: 11 MB)
**Date Completed**: _____________
**Completed By**: _____________
```

---

## 💡 Pro Tips

1. **Use WebP**: Modern format, best compression, universal browser support
2. **Keep originals**: Backup with `.original` extension before converting
3. **Test locally first**: Always verify quality before deploying
4. **Batch process**: Use tools that support multiple files
5. **Automate**: Install ImageMagick for future updates
6. **Monitor**: Track file sizes in CI/CD
7. **Document**: Note any quality tradeoffs

---

## 🆘 Troubleshooting

### "WebP images look blurry"
- Increase quality from 85 to 90
- Check source image resolution
- Verify no double-compression

### "Code still references .png files"
- Search project for `/assets/.*\.png`
- Update all matches to `.webp`
- Clear browser cache

### "Build fails after changes"
- Run `npm run typecheck`
- Run `npm test`
- Check for broken image imports

### "Old browsers don't show images"
- Add fallback: `<img src="image.webp" onerror="this.src='image.png'">`
- Or use `<picture>` element with sources

---

**Need Help?**
- Check [image-inventory.json](../image-inventory.json) for current state
- Run `node scripts/optimize-images.mjs --dry-run` for simulation
- See [IMPROVEMENT_TASKS.md](IMPROVEMENT_TASKS.md#1-image-optimization) for context

---

**Last Updated**: 2026-10-20  
**Status**: Ready for execution
