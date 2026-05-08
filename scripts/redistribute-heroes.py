#!/usr/bin/env python3
"""Redistribute hero images across all 500 articles with 21-image pool for visual variety."""
import json
from pathlib import Path

CDN_BASE = 'https://religion-trauma.b-cdn.net'

# Full 21-image pool with topic/category mapping
CATEGORY_IMAGES = {
    # Primary category → best-fit image
    'religious-trauma': 'article-rts.webp',
    'deconstruction': 'article-deconstruction.webp',
    'healing': 'article-healing.webp',
    'community': 'article-community.webp',
    'identity': 'article-identity.webp',
    'therapy': 'article-therapy.webp',
    'shame': 'article-shame.webp',
    'grief': 'article-grief.webp',
    'trust': 'article-trust.webp',
    'somatic': 'article-somatic.webp',
    'sleep': 'article-sleep.webp',
    'lgbtq': 'article-lgbtq.webp',
}

# Keyword → image mapping for more granular assignment
KEYWORD_IMAGES = {
    'forgiv': 'article-forgiveness.webp',
    'childhood': 'article-childhood.webp',
    'child': 'article-childhood.webp',
    'parent': 'article-childhood.webp',
    'kid': 'article-childhood.webp',
    'freedom': 'article-freedom.webp',
    'leav': 'article-freedom.webp',
    'exit': 'article-freedom.webp',
    'depart': 'article-freedom.webp',
    'meditat': 'article-meditation.webp',
    'mindful': 'article-meditation.webp',
    'breath': 'article-meditation.webp',
    'journal': 'article-writing.webp',
    'writ': 'article-writing.webp',
    'letter': 'article-writing.webp',
    'famil': 'article-family.webp',
    'sibling': 'article-family.webp',
    'estrang': 'article-family.webp',
    'holiday': 'article-family.webp',
    'anger': 'article-anger.webp',
    'rage': 'article-anger.webp',
    'furious': 'article-anger.webp',
    'body': 'article-body.webp',
    'somat': 'article-body.webp',
    'nervous system': 'article-body.webp',
    'nature': 'article-nature.webp',
    'forest': 'article-nature.webp',
    'outdoor': 'article-nature.webp',
    'secular': 'article-books.webp',
    'humanis': 'article-books.webp',
    'atheist': 'article-books.webp',
    'book': 'article-books.webp',
    'read': 'article-books.webp',
    'intellectu': 'article-books.webp',
    'question': 'article-books.webp',
    'doubt': 'article-books.webp',
    'cult': 'article-rts.webp',
    'high-control': 'article-rts.webp',
    'purity': 'article-shame.webp',
    'sexual': 'article-shame.webp',
    'lgbtq': 'article-lgbtq.webp',
    'gay': 'article-lgbtq.webp',
    'queer': 'article-lgbtq.webp',
    'trans': 'article-lgbtq.webp',
    'sleep': 'article-sleep.webp',
    'insomnia': 'article-sleep.webp',
    'grief': 'article-grief.webp',
    'loss': 'article-grief.webp',
    'mourn': 'article-grief.webp',
    'trust': 'article-trust.webp',
    'betrayal': 'article-trust.webp',
    'therap': 'article-therapy.webp',
    'counseling': 'article-therapy.webp',
    'ptsd': 'article-therapy.webp',
    'trauma': 'article-rts.webp',
    'heal': 'article-healing.webp',
    'recover': 'article-healing.webp',
    'community': 'article-community.webp',
    'friend': 'article-community.webp',
    'connect': 'article-community.webp',
    'identity': 'article-identity.webp',
    'who am i': 'article-identity.webp',
    'self': 'article-identity.webp',
}

# Fallback pool for round-robin distribution
FALLBACK_POOL = [
    'article-rts.webp',
    'article-healing.webp',
    'article-deconstruction.webp',
    'article-community.webp',
    'article-identity.webp',
    'article-therapy.webp',
    'article-shame.webp',
    'article-grief.webp',
    'article-trust.webp',
    'article-somatic.webp',
    'article-forgiveness.webp',
    'article-childhood.webp',
    'article-freedom.webp',
    'article-meditation.webp',
    'article-writing.webp',
    'article-family.webp',
    'article-anger.webp',
    'article-body.webp',
    'article-nature.webp',
    'article-books.webp',
    'hero-main.webp',
]

def get_hero_image(article: dict, fallback_idx: int) -> str:
    title = article.get('title', '').lower()
    slug = article.get('slug', '').lower()
    category = article.get('category', '').lower()
    text = f'{title} {slug} {category}'
    
    # Check keyword mapping first
    for keyword, img in KEYWORD_IMAGES.items():
        if keyword in text:
            return f'{CDN_BASE}/{img}'
    
    # Check category mapping
    for cat_key, img in CATEGORY_IMAGES.items():
        if cat_key in category:
            return f'{CDN_BASE}/{img}'
    
    # Round-robin fallback
    return f'{CDN_BASE}/{FALLBACK_POOL[fallback_idx % len(FALLBACK_POOL)]}'

articles_dir = Path('/home/ubuntu/the-faith-wound/src/data/articles')
files = sorted(articles_dir.glob('*.json'))

updated = 0
distribution = {}
fallback_idx = 0

for f in files:
    article = json.loads(f.read_text())
    hero = get_hero_image(article, fallback_idx)
    fallback_idx += 1
    
    img_name = hero.split('/')[-1]
    distribution[img_name] = distribution.get(img_name, 0) + 1
    
    if article.get('hero_url') != hero:
        article['hero_url'] = hero
        f.write_text(json.dumps(article, indent=2, ensure_ascii=False))
        updated += 1

print(f'Updated {updated} articles')
print(f'\nNew distribution ({len(distribution)} unique images):')
for img, count in sorted(distribution.items(), key=lambda x: -x[1]):
    print(f'  {count:3d}  {img}')
