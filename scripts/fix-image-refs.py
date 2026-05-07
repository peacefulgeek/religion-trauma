#!/usr/bin/env python3
"""Fix all remaining local /images/ references to Bunny CDN URLs."""
import re
from pathlib import Path

CDN = "https://religion-trauma.b-cdn.net"

REPLACEMENTS = {
    "/images/hero-main.jpg":    f"{CDN}/hero-main.webp",
    "/images/author-avatar.jpg": f"{CDN}/author-avatar.webp",
    "/images/article-rts.jpg":  f"{CDN}/article-rts.webp",
    "/images/logo.png":         f"{CDN}/hero-main.webp",
    "SITE_URL}/images/logo.png": f"{CDN}/hero-main.webp",
}

files_to_fix = list(Path("src/client").rglob("*.tsx")) + list(Path("src/client").rglob("*.ts"))

for path in files_to_fix:
    content = path.read_text()
    original = content
    for old, new in REPLACEMENTS.items():
        content = content.replace(old, new)
    if content != original:
        path.write_text(content)
        print(f"Fixed: {path}")

# Also fix .env.example - remove DATABASE_URL
env_path = Path(".env.example")
env = env_path.read_text()
lines = [l for l in env.splitlines() if "DATABASE_URL" not in l and "Postgres" not in l]
env_path.write_text("\n".join(lines) + "\n")
print("Fixed .env.example")

print("Done!")
