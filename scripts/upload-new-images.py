#!/usr/bin/env python3
"""Compress new images to WebP and upload to Bunny CDN."""
import os, json, requests
from pathlib import Path
from PIL import Image

BUNNY_API_KEY = 'd5f7f3e5-28cc-4ed9-bd1223ed3866-e676-467e'
BUNNY_STORAGE_HOST = 'ny.storage.bunnycdn.com'
BUNNY_STORAGE_ZONE = 'religion-trauma'
CDN_BASE = 'https://religion-trauma.b-cdn.net'

IMAGES_DIR = Path('/home/ubuntu/the-faith-wound/public/images')
WEBP_DIR = IMAGES_DIR / 'webp'
WEBP_DIR.mkdir(exist_ok=True)

# New images to upload
NEW_IMAGES = [
    'article-forgiveness.jpg',
    'article-childhood.jpg',
    'article-freedom.jpg',
    'article-meditation.jpg',
    'article-writing.jpg',
    'article-family.jpg',
    'article-anger.jpg',
    'article-body.jpg',
    'article-nature.jpg',
    'article-books.jpg',
]

def compress_to_webp(src_path: Path, dst_path: Path, quality=82) -> bool:
    try:
        img = Image.open(src_path).convert('RGB')
        # Resize to max 1920px wide
        if img.width > 1920:
            ratio = 1920 / img.width
            img = img.resize((1920, int(img.height * ratio)), Image.LANCZOS)
        img.save(dst_path, 'WEBP', quality=quality, method=6)
        orig_kb = src_path.stat().st_size // 1024
        new_kb = dst_path.stat().st_size // 1024
        print(f'  Compressed: {src_path.name} → {dst_path.name} ({orig_kb}KB → {new_kb}KB)')
        return True
    except Exception as e:
        print(f'  ERROR compressing {src_path.name}: {e}')
        return False

def upload_to_bunny(webp_path: Path) -> str | None:
    url = f'https://{BUNNY_STORAGE_HOST}/{BUNNY_STORAGE_ZONE}/{webp_path.name}'
    headers = {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': 'image/webp',
    }
    try:
        with open(webp_path, 'rb') as f:
            resp = requests.put(url, headers=headers, data=f, timeout=30)
        if resp.status_code in (200, 201):
            cdn_url = f'{CDN_BASE}/{webp_path.name}'
            print(f'  Uploaded: {webp_path.name} → {cdn_url}')
            return cdn_url
        else:
            print(f'  ERROR uploading {webp_path.name}: {resp.status_code} {resp.text[:100]}')
            return None
    except Exception as e:
        print(f'  ERROR uploading {webp_path.name}: {e}')
        return None

url_map = {}

for img_name in NEW_IMAGES:
    src = IMAGES_DIR / img_name
    stem = Path(img_name).stem
    dst = WEBP_DIR / f'{stem}.webp'
    
    if not src.exists():
        print(f'SKIP (not found): {img_name}')
        continue
    
    print(f'\nProcessing: {img_name}')
    if compress_to_webp(src, dst):
        cdn_url = upload_to_bunny(dst)
        if cdn_url:
            url_map[stem] = cdn_url

print(f'\nUploaded {len(url_map)} new images:')
for k, v in url_map.items():
    print(f'  {k}: {v}')

# Save updated URL map
map_file = Path('/home/ubuntu/the-faith-wound/scripts/cdn-url-map.json')
existing = {}
if map_file.exists():
    existing = json.loads(map_file.read_text())
existing.update(url_map)
map_file.write_text(json.dumps(existing, indent=2))
print(f'\nURL map updated: {map_file}')
