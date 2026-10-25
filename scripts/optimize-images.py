#!/usr/bin/env python3
"""
Image optimization script for VIARA marketing site.
Compresses existing PNG and JPG files and creates modern WebP versions.
"""
import os
import sys
from PIL import Image

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets')

def optimize_image(filepath):
    rel_path = os.path.relpath(filepath, ASSETS_DIR)
    ext = os.path.splitext(filepath)[1].lower()
    orig_size = os.path.getsize(filepath)
    
    if orig_size < 50 * 1024:  # Skip already small files
        return None

    try:
        with Image.open(filepath) as img:
            base_path = os.path.splitext(filepath)[0]
            webp_path = base_path + '.webp'
            
            # 1. Generate WebP if not already present
            created_webp = False
            webp_size = 0
            if not os.path.exists(webp_path):
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img.save(webp_path, 'WEBP', quality=88, method=6)
                else:
                    rgb_img = img.convert('RGB')
                    rgb_img.save(webp_path, 'WEBP', quality=85, method=6)
                webp_size = os.path.getsize(webp_path)
                created_webp = True
            
            # 2. Optimize original file in-place if large
            if ext == '.png' and orig_size > 300 * 1024:
                img.save(filepath, 'PNG', optimize=True)
            elif ext in ('.jpg', '.jpeg') and orig_size > 300 * 1024:
                rgb_img = img if img.mode == 'RGB' else img.convert('RGB')
                rgb_img.save(filepath, 'JPEG', quality=85, optimize=True)
                
            new_size = os.path.getsize(filepath)
            return {
                'file': rel_path,
                'orig_kb': orig_size // 1024,
                'new_kb': new_size // 1024,
                'webp_kb': webp_size // 1024 if created_webp else None,
                'saved_kb': (orig_size - new_size) // 1024
            }
    except Exception as e:
        print(f"Error processing {rel_path}: {e}", file=sys.stderr)
        return None

def main():
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    print("Starting image optimization in public/assets...")
    total_saved = 0
    processed = 0
    
    for root, _, files in os.walk(ASSETS_DIR):
        for f in sorted(files):
            if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                full_path = os.path.join(root, f)
                res = optimize_image(full_path)
                if res:
                    processed += 1
                    saved = res['saved_kb']
                    total_saved += max(0, saved)
                    msg = f"  * {res['file']}: {res['orig_kb']}KB -> {res['new_kb']}KB (saved {saved}KB)"
                    if res['webp_kb'] is not None:
                        msg += f" | Generated WebP: {res['webp_kb']}KB"
                    print(msg)
                    
    print(f"\nOptimization Complete! Processed {processed} files, saved {total_saved // 1024} MB in originals.")

if __name__ == '__main__':
    main()
