#!/usr/bin/env python3
"""
Compress all images to WebP and upload to Bunny CDN.
Storage zone: religion-trauma
CDN URL: https://religion-trauma.b-cdn.net
Storage endpoint: https://ny.storage.bunnycdn.com/religion-trauma
"""

import os
import sys
import subprocess
from PIL import Image

BUNNY_API_KEY = "d5f7f3e5-28cc-4ed9-bd1223ed3866-e676-467e"
STORAGE_ENDPOINT = "https://ny.storage.bunnycdn.com/religion-trauma"
CDN_BASE = "https://religion-trauma.b-cdn.net"
STORAGE_PATH = "images"
IMAGES_DIR = "/home/ubuntu/the-faith-wound/public/images"
WEBP_DIR = "/home/ubuntu/the-faith-wound/public/images/webp"

os.makedirs(WEBP_DIR, exist_ok=True)

images = [f for f in os.listdir(IMAGES_DIR) if f.endswith(('.jpg', '.jpeg', '.png')) and os.path.isfile(os.path.join(IMAGES_DIR, f))]
print(f"Found {len(images)} images to process")

results = {}

for filename in sorted(images):
    src_path = os.path.join(IMAGES_DIR, filename)
    stem = os.path.splitext(filename)[0]
    webp_filename = f"{stem}.webp"
    webp_path = os.path.join(WEBP_DIR, webp_filename)
    
    # Step 1: Compress to WebP
    print(f"\n[{filename}] Converting to WebP...")
    img = Image.open(src_path)
    
    # Resize if very large (max 1920px wide for hero, 800px for article cards)
    max_width = 1920 if 'hero' in stem or 'assessments' in stem else 900
    if img.width > max_width:
        ratio = max_width / img.width
        new_size = (max_width, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)
        print(f"  Resized to {new_size[0]}x{new_size[1]}")
    
    # Convert to RGB if needed (for JPEG sources with alpha)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    img.save(webp_path, "WEBP", quality=82, method=6)
    
    src_size = os.path.getsize(src_path) / 1024
    webp_size = os.path.getsize(webp_path) / 1024
    savings = (1 - webp_size / src_size) * 100
    print(f"  {src_size:.0f}KB → {webp_size:.0f}KB ({savings:.0f}% smaller)")
    
    # Step 2: Upload to Bunny CDN
    upload_url = f"{STORAGE_ENDPOINT}/{STORAGE_PATH}/{webp_filename}"
    cdn_url = f"{CDN_BASE}/{STORAGE_PATH}/{webp_filename}"
    
    print(f"  Uploading to {upload_url}...")
    result = subprocess.run([
        "curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
        "-X", "PUT",
        "-H", f"AccessKey: {BUNNY_API_KEY}",
        "-H", "Content-Type: image/webp",
        "--data-binary", f"@{webp_path}",
        upload_url
    ], capture_output=True, text=True)
    
    http_code = result.stdout.strip()
    if http_code in ("200", "201"):
        print(f"  ✓ Uploaded successfully (HTTP {http_code})")
        results[stem] = cdn_url
    else:
        print(f"  ✗ Upload failed (HTTP {http_code})")
        if result.stderr:
            print(f"    Error: {result.stderr}")
        results[stem] = None

# Print summary
print("\n" + "="*60)
print("UPLOAD SUMMARY")
print("="*60)
success = sum(1 for v in results.values() if v)
print(f"Uploaded: {success}/{len(results)}")
print("\nCDN URL Mapping:")
for stem, url in sorted(results.items()):
    status = "✓" if url else "✗"
    print(f"  {status} {stem}: {url or 'FAILED'}")

# Write mapping file for use in code updates
with open("/home/ubuntu/the-faith-wound/scripts/cdn-url-map.txt", "w") as f:
    for stem, url in sorted(results.items()):
        if url:
            f.write(f"{stem}={url}\n")

print("\nCDN URL map written to scripts/cdn-url-map.txt")
