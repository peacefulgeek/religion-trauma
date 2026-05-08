#!/usr/bin/env python3
"""
Assign a unique hero image to every article.
Strategy: keyword-score first, then round-robin to ensure even distribution.
All 70 images used, max ~8 per image across 500 articles.
"""
import json
import random
from pathlib import Path
from collections import defaultdict

CDN_BASE = "https://religion-trauma.b-cdn.net"

# All 70 available images with their CDN URLs
ALL_IMAGES = [
    # 50 new images
    *[f"img-{i:03d}" for i in range(1, 51)],
    # 20 existing thematic images
    "hero-main", "article-rts", "article-deconstruction", "article-healing",
    "article-community", "article-identity", "article-therapy", "article-shame",
    "article-lgbtq", "article-sleep", "article-somatic", "article-trust",
    "article-grief", "article-forgiveness", "article-childhood", "article-freedom",
    "article-meditation", "article-writing", "article-family", "article-anger",
    "article-body", "article-nature", "article-books",
]

# Remove non-article images
EXCLUDED = {"author-avatar", "assessments-hero"}
IMAGES = [img for img in ALL_IMAGES if img not in EXCLUDED]

def get_cdn_url(stem):
    if stem.startswith("img-"):
        return f"{CDN_BASE}/articles/{stem}.webp"
    return f"{CDN_BASE}/{stem}.webp"

# Keyword → image stem mapping for smart assignment
KEYWORD_MAP = {
    "mountain|summit|breakthrough|overcome|peak": "img-001",
    "therapy|therapist|counseling|counselor|psychologist|mental health session": "img-002",
    "barefoot|grounding|somatic|body awareness|earth": "img-003",
    "journal|journaling|writing therapy|diary|expressive writing": "img-004",
    "prayer|praying|devotion|ritual|spiritual practice": "img-005",
    "silhouette|horizon|future|new beginning|hope": "img-006",
    "meditation|mindfulness|stillness|breathe|calm": "img-007",
    "park|outdoor contemplation|solitude|bench": "img-008",
    "reading|books|library|knowledge|learning|education": "img-009",
    "candle|inner light|darkness|finding light": "img-010",
    "community|group|gathering|belonging|together": "img-011",
    "grief|loss|mourning|bereavement|sorrow": "img-012",
    "anger|rage|frustration|anger at god|anger at church": "img-013",
    "family|parents|children|relatives|estrangement": "img-014",
    "walking|path|journey|road|steps": "img-015",
    "yoga|movement|exercise|flexibility|body movement": "img-016",
    "ocean|sea|waves|beach|shore|coastal": "img-017",
    "church building|leaving church|empty pew|architecture": "img-018",
    "identity|mirror|self-discovery|who am i|self-image": "img-019",
    "shame|hiding|guilt|shame spiral|embarrassment": "img-020",
    "relationship|couple|intimacy|romantic|dating|love": "img-021",
    "anxiety|worry|stress|panic|fear|nervous|overwhelmed": "img-022",
    "childhood|child|young|growing up|memories|youth": "img-023",
    "freedom|liberation|free|release|unbound": "img-024",
    "sleep|insomnia|rest|night|tired|exhaustion": "img-025",
    "forgiveness|reconciliation|making peace|forgiving": "img-026",
    "doubt|questioning|uncertainty|skepticism|deconstruction": "img-027",
    "purity culture|sexual shame|modesty|abstinence|virginity": "img-028",
    "lgbtq|gay|lesbian|queer|transgender|bisexual|pride": "img-029",
    "cult|high control|coercive|manipulation|authoritarian": "img-030",
    "boundaries|boundary|limits|saying no|self-protection": "img-031",
    "depression|hopeless|despair|emptiness|low mood": "img-032",
    "trauma|ptsd|traumatic|wound|hurt|pain": "img-033",
    "leaving|exit|departure|deconverting|walking away": "img-034",
    "nature|trees|forest|woods|outdoors|natural world": "img-035",
    "spirituality|sacred|divine|transcendent|mystical": "img-036",
    "support group|circle|peer support|group therapy": "img-037",
    "self-care|self-compassion|nurturing|kindness|gentle": "img-038",
    "work|career|professional|vocation|employment": "img-039",
    "food|eating|nourishment|body image|diet": "img-040",
    "money|finances|tithe|financial abuse|prosperity gospel": "img-041",
    "music|singing|worship music|hymns|choir|praise": "img-042",
    "intercession|petition|spiritual discipline": "img-043",
    "bible|scripture|biblical|verse|passage|text": "img-044",
    "healing|recovery|wellness|restoration|wholeness": "img-045",
    "illumination|inner peace|sanctuary|peace": "img-046",
    "wildflowers|field|surrender|open sky|release": "img-047",
    "safe space|beginning healing|first step|starting over": "img-048",
    "open door|threshold|new life|new chapter|stepping out": "img-049",
    "secular peace|post-faith|finding meaning|ocean sunset": "img-050",
    "religious trauma syndrome|rts|symptoms|diagnosis": "article-rts",
    "deconstruction|deconstructing|faith deconstruction|unraveling": "article-deconstruction",
    "healing journey|recovery path|healing process": "article-healing",
    "secular community|new community|finding community": "article-community",
    "post-faith identity|secular identity|new identity": "article-identity",
    "trauma therapy|trauma-informed|emdr|finding therapist": "article-therapy",
    "religious shame|shame-based|shame cycle": "article-shame",
    "lgbtq faith|gay christian|queer faith": "article-lgbtq",
    "sleep trauma|nightmares|sleep anxiety|religious insomnia": "article-sleep",
    "somatic|body memory|nervous system|vagus nerve|polyvagal": "article-somatic",
    "trust|trusting again|rebuilding trust|betrayal": "article-trust",
    "grieving faith|mourning beliefs|faith grief": "article-grief",
    "forgiving church|forgiving god|religious forgiveness": "article-forgiveness",
    "childhood religion|religious upbringing|raised religious": "article-childhood",
    "spiritual freedom|religious freedom|free from religion": "article-freedom",
    "secular meditation|mindfulness practice|meditation without god": "article-meditation",
    "expressive writing|therapeutic writing|writing for healing": "article-writing",
    "family estrangement|religious family|family conflict": "article-family",
    "anger at god|anger at church|righteous anger": "article-anger",
    "body autonomy|reclaiming body|body liberation": "article-body",
    "nature spirituality|secular spirituality|nature healing": "article-nature",
    "books for healing|reading list|resources": "article-books",
    "religious trauma|faith wound|spiritual abuse|overview": "hero-main",
}

# Load all articles
articles_dir = Path("/home/ubuntu/the-faith-wound/src/data/articles")
article_files = sorted(articles_dir.glob("*.json"))
print(f"Total articles: {len(article_files)}")

# Phase 1: keyword-based assignment
keyword_assigned = {}  # slug -> stem
usage_count = defaultdict(int)

for fpath in article_files:
    with open(fpath) as f:
        article = json.load(f)
    slug = article.get("slug", fpath.stem)
    title = article.get("title", "").lower()
    category = article.get("category", "").lower()
    text = f"{title} {category} {slug.replace('-', ' ')}"

    best_stem = None
    for keywords_str, stem in KEYWORD_MAP.items():
        keywords = [k.strip() for k in keywords_str.split("|")]
        if any(kw in text for kw in keywords):
            best_stem = stem
            break

    if best_stem:
        keyword_assigned[slug] = best_stem
        usage_count[best_stem] += 1

print(f"Keyword-matched: {len(keyword_assigned)}/{len(article_files)}")

# Phase 2: round-robin for unmatched articles
# Build a cycling list of all images, weighted by how many times they've been used
# Target: max 8 uses per image (500/70 ≈ 7.1)
MAX_PER_IMAGE = 8

# Create a pool: each image repeated (MAX_PER_IMAGE - current_usage) times
pool = []
for stem in IMAGES:
    remaining = MAX_PER_IMAGE - usage_count.get(stem, 0)
    if remaining > 0:
        pool.extend([stem] * remaining)

random.seed(42)  # Deterministic
random.shuffle(pool)
pool_iter = iter(pool)

# Phase 3: assign all articles
final_assignments = []
for fpath in sorted(article_files):
    with open(fpath) as f:
        article = json.load(f)
    slug = article.get("slug", fpath.stem)

    if slug in keyword_assigned:
        stem = keyword_assigned[slug]
    else:
        # Round-robin from pool
        try:
            stem = next(pool_iter)
        except StopIteration:
            # Pool exhausted — refill
            pool2 = []
            for s in IMAGES:
                pool2.extend([s] * MAX_PER_IMAGE)
            random.shuffle(pool2)
            pool_iter = iter(pool2)
            stem = next(pool_iter)

    cdn_url = get_cdn_url(stem)
    article["hero_url"] = cdn_url
    usage_count[stem] += 1
    final_assignments.append((slug, stem, cdn_url))

    with open(fpath, "w") as f:
        json.dump(article, f, indent=2, ensure_ascii=False)

# Stats
usage_vals = [usage_count[s] for s in IMAGES]
print(f"\nFinal stats:")
print(f"  Total assigned: {len(final_assignments)}")
print(f"  Unique images used: {sum(1 for v in usage_vals if v > 0)}/{len(IMAGES)}")
print(f"  Min usage: {min(usage_vals)}, Max usage: {max(usage_vals)}, Avg: {sum(usage_vals)/len(usage_vals):.1f}")
blank = sum(1 for _, _, url in final_assignments if not url)
print(f"  Articles with blank hero_url: {blank}")

# Show top 5 most used
from collections import Counter
top = Counter(usage_count).most_common(5)
print(f"  Top 5 most used: {top}")
print("\nDone!")
