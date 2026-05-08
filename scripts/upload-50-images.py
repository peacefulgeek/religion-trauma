#!/usr/bin/env python3
"""Compress all new images to WebP and upload to Bunny CDN."""
import os
import sys
import json
from pathlib import Path
from PIL import Image
import requests

BUNNY_API_KEY = "d5f7f3e5-28cc-4ed9-bd1223ed3866-e676-467e"
BUNNY_STORAGE_ZONE = "religion-trauma"
BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com"
CDN_BASE = "https://religion-trauma.b-cdn.net"

NEW_IMAGES_DIR = Path("/home/ubuntu/the-faith-wound/public/images/new")
WEBP_DIR = Path("/home/ubuntu/the-faith-wound/public/images/webp")
WEBP_DIR.mkdir(parents=True, exist_ok=True)

url_map_path = Path("/home/ubuntu/the-faith-wound/scripts/cdn-url-map.json")
if url_map_path.exists():
    with open(url_map_path) as f:
        url_map = json.load(f)
else:
    url_map = {}

results = []

for img_path in sorted(NEW_IMAGES_DIR.glob("*.jpg")):
    stem = img_path.stem  # e.g. img-001
    webp_name = f"{stem}.webp"
    webp_path = WEBP_DIR / webp_name

    # Compress to WebP
    try:
        img = Image.open(img_path)
        img = img.convert("RGB")
        # Resize to max 1920px wide
        if img.width > 1920:
            ratio = 1920 / img.width
            new_h = int(img.height * ratio)
            img = img.resize((1920, new_h), Image.LANCZOS)
        img.save(webp_path, "WEBP", quality=82, method=6)
        size_kb = webp_path.stat().st_size // 1024
        print(f"  Compressed {stem}: {size_kb}KB")
    except Exception as e:
        print(f"  ERROR compressing {stem}: {e}")
        continue

    # Upload to Bunny CDN
    cdn_path = f"articles/{webp_name}"
    upload_url = f"https://{BUNNY_STORAGE_HOST}/{BUNNY_STORAGE_ZONE}/{cdn_path}"
    cdn_url = f"{CDN_BASE}/{cdn_path}"

    try:
        with open(webp_path, "rb") as f:
            data = f.read()
        resp = requests.put(
            upload_url,
            data=data,
            headers={
                "AccessKey": BUNNY_API_KEY,
                "Content-Type": "image/webp",
            },
            timeout=30,
        )
        if resp.status_code in (200, 201):
            url_map[stem] = cdn_url
            results.append({"stem": stem, "cdn_url": cdn_url, "status": "ok"})
            print(f"  Uploaded {stem} -> {cdn_url}")
        else:
            print(f"  UPLOAD FAILED {stem}: {resp.status_code} {resp.text[:100]}")
            results.append({"stem": stem, "cdn_url": cdn_url, "status": f"fail:{resp.status_code}"})
    except Exception as e:
        print(f"  ERROR uploading {stem}: {e}")
        results.append({"stem": stem, "cdn_url": cdn_url, "status": f"error:{e}"})

# Save updated url_map
with open(url_map_path, "w") as f:
    json.dump(url_map, f, indent=2)

ok = sum(1 for r in results if r["status"] == "ok")
print(f"\nDone: {ok}/{len(results)} images uploaded successfully")
print(f"Total CDN images in map: {len(url_map)}")
