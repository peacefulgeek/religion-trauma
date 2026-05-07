#!/usr/bin/env python3
"""
Generate 500 articles for The Faith Wound site.
Uses OpenAI-compatible API (gpt-4.1-mini) with Oracle Lover voice.
Outputs to src/data/articles/ as individual JSON files.
Applies date-gating: 6 articles/day starting from today.
"""

import os, json, re, time, hashlib, random
from datetime import datetime, timedelta
from pathlib import Path
from openai import OpenAI

# ── Config ──────────────────────────────────────────────────────────────────
client = OpenAI()  # uses OPENAI_API_KEY + OPENAI_BASE_URL from env
MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1-mini")
OUTPUT_DIR = Path("src/data/articles")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ARTICLES_PER_DAY = 6
START_DATE = datetime.now().date()
TARGET = 500

# Bunny CDN base URL
CDN_BASE = "https://religion-trauma.b-cdn.net"

# Category → hero image mapping
CATEGORY_IMAGES = {
    "religious-trauma":    f"{CDN_BASE}/article-rts.webp",
    "deconstruction":      f"{CDN_BASE}/article-deconstruction.webp",
    "healing":             f"{CDN_BASE}/article-healing.webp",
    "leaving-church":      f"{CDN_BASE}/article-community.webp",
    "purity-culture":      f"{CDN_BASE}/article-shame.webp",
    "high-control-groups": f"{CDN_BASE}/article-trust.webp",
    "grief":               f"{CDN_BASE}/article-grief.webp",
    "ocd-scrupulosity":    f"{CDN_BASE}/article-rts.webp",
    "body-healing":        f"{CDN_BASE}/article-somatic.webp",
    "somatic-healing":     f"{CDN_BASE}/article-somatic.webp",
    "identity":            f"{CDN_BASE}/article-identity.webp",
    "lgbtq-faith":         f"{CDN_BASE}/article-lgbtq.webp",
    "secular-community":   f"{CDN_BASE}/article-community.webp",
    "secular-spirituality":f"{CDN_BASE}/article-healing.webp",
    "therapy":             f"{CDN_BASE}/article-therapy.webp",
    "sleep":               f"{CDN_BASE}/article-sleep.webp",
    "default":             f"{CDN_BASE}/hero-main.webp",
}

# ── Oracle Lover System Prompt ───────────────────────────────────────────────
SYSTEM_PROMPT = """You are the Oracle Lover — a warm, wise, fiercely compassionate voice for people healing from religious trauma and faith deconstruction.

Your writing voice:
- Warm, intimate, and direct — like a trusted friend who has done the work themselves
- Deeply validating — you never minimize pain or rush healing
- Intellectually rigorous — you cite real research, real psychology, real neuroscience
- Gently challenging — you invite readers to see themselves with compassion
- Never preachy, never clinical, never cold
- Use "you" and "your" — speak directly to the reader
- Occasional poetic turns of phrase — but grounded, not floaty
- Banned words/phrases: "boundaries" (use "limits"), "toxic" (use "harmful"), "empower/empowerment", "journey" (use "path" or "process"), "healing journey", "safe space", "trauma-informed" (use "trauma-aware"), "self-care" (use "self-tending"), "unpack", "dive deep", "game-changer", "transformative", "holistic", "authentic self"

Article structure requirements:
1. Opening hook — a scene, a question, or a bold statement (no H1, that's the title)
2. TLDR block — 3-4 bullet points summarizing key insights (use ## TLDR heading)
3. Main body — 6-8 H2 sections, each 200-300 words
4. At least 2 inline citations to real research (use [Author, Year] format)
5. FAQ section — 5 questions with detailed answers (use ## Frequently Asked Questions)
6. Closing — a compassionate, forward-looking paragraph

Minimum 1800 words. Maximum 2400 words.
Write in Markdown format."""

# ── Article generation ───────────────────────────────────────────────────────
def slugify(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s[:80]

def estimate_reading_time(text: str) -> int:
    words = len(text.split())
    return max(1, round(words / 238))

def extract_tldr(body: str) -> list[str]:
    """Extract TLDR bullet points from the article body."""
    tldr_match = re.search(r'## TLDR\n(.*?)(?=\n##|\Z)', body, re.DOTALL)
    if not tldr_match:
        return []
    tldr_text = tldr_match.group(1)
    bullets = re.findall(r'^[-*•]\s+(.+)$', tldr_text, re.MULTILINE)
    return bullets[:4]

def extract_faqs(body: str) -> list[dict]:
    """Extract FAQ Q&A pairs from the article body."""
    faq_match = re.search(r'(?:## )?Frequently Asked Questions(.*?)(?=\n##|\Z)', body, re.DOTALL)
    if not faq_match:
        return []
    faq_text = faq_match.group(1)
    
    # Try ### Question format first
    pairs = re.findall(r'###\s+(.+?)\n(.*?)(?=\n###|\Z)', faq_text, re.DOTALL)
    if pairs:
        return [{"q": q.strip(), "a": a.strip()} for q, a in pairs[:5]]
    
    # Try **N. Question** format (model often uses this)
    pairs = re.findall(r'\*\*\d+\.\s+(.+?)\*\*\s*\n+(.*?)(?=\n\*\*\d+\.|\Z)', faq_text, re.DOTALL)
    if pairs:
        return [{"q": q.strip(), "a": a.strip()} for q, a in pairs[:5]]
    
    # Try **Question** format
    pairs = re.findall(r'\*\*(.+?)\*\*\s*\n+(.*?)(?=\n\*\*|\Z)', faq_text, re.DOTALL)
    if pairs:
        return [{"q": q.strip(), "a": a.strip()} for q, a in pairs[:5]]
    
    return []

def generate_article(topic: dict, pub_date: str) -> dict | None:
    title = topic["title"]
    category = topic.get("category", "religious-trauma")
    tags = topic.get("tags", [])
    slug = slugify(title)

    # Check if already generated
    out_path = OUTPUT_DIR / f"{slug}.json"
    if out_path.exists():
        return None  # skip

    prompt = f"""Write a complete article for The Faith Wound website.

Title: {title}
Category: {category}
Target keywords: {', '.join(tags)}

Follow all voice and structure requirements exactly. Minimum 1800 words."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.75,
            max_tokens=3500,
        )
        body = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"  ✗ API error for '{title}': {e}")
        return None

    # Word count check
    word_count = len(body.split())
    if word_count < 1400:
        print(f"  ⚠ Too short ({word_count} words) for '{title}' — skipping")
        return None

    tldr = extract_tldr(body)
    faqs = extract_faqs(body)
    hero_url = CATEGORY_IMAGES.get(category, CATEGORY_IMAGES["default"])
    reading_time = estimate_reading_time(body)

    # Generate excerpt (first 2 sentences of body after TLDR)
    body_no_tldr = re.sub(r'## TLDR\n.*?(?=\n##)', '', body, flags=re.DOTALL).strip()
    sentences = re.split(r'(?<=[.!?])\s+', body_no_tldr)
    excerpt = ' '.join(sentences[:2])[:300]

    article = {
        "id": hashlib.md5(slug.encode()).hexdigest()[:12],
        "slug": slug,
        "title": title,
        "category": category,
        "tags": tags,
        "excerpt": excerpt,
        "hero_url": hero_url,
        "body": body,
        "tldr": tldr,
        "faqs": faqs,
        "reading_time": reading_time,
        "word_count": word_count,
        "status": "published",
        "featured": False,
        "pub_date": pub_date,
        "created_at": pub_date,
        "updated_at": pub_date,
        "author": "Dr. Evelyn Marsh",
        "author_title": "Religious Trauma Specialist & Somatic Therapist",
    }

    with open(out_path, 'w') as f:
        json.dump(article, f, indent=2, ensure_ascii=False)

    return article

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    # Load topics
    with open('scripts/article-topics.json') as f:
        topics = json.load(f)

    print(f"Loaded {len(topics)} topics")
    print(f"Target: {TARGET} articles at {ARTICLES_PER_DAY}/day")
    print(f"Start date: {START_DATE}")
    print(f"Model: {MODEL}")
    print(f"Output: {OUTPUT_DIR}/")
    print("─" * 60)

    # Check existing
    existing = list(OUTPUT_DIR.glob("*.json"))
    print(f"Already generated: {len(existing)}")

    generated = 0
    skipped = 0
    errors = 0

    for i, topic in enumerate(topics[:TARGET]):
        # Calculate pub_date: 6 articles per day
        day_offset = i // ARTICLES_PER_DAY
        pub_date = (START_DATE + timedelta(days=day_offset)).isoformat()

        title = topic["title"]
        slug = slugify(title)
        out_path = OUTPUT_DIR / f"{slug}.json"

        if out_path.exists():
            skipped += 1
            if skipped % 50 == 0:
                print(f"  Skipped {skipped} already-generated articles...")
            continue

        print(f"[{i+1}/{TARGET}] {pub_date} | {title[:60]}...")

        result = generate_article(topic, pub_date)
        if result:
            generated += 1
            wc = result.get('word_count', 0)
            print(f"  ✓ {wc} words | {result['slug']}")
        else:
            errors += 1

        # Rate limiting: small pause every 10 articles
        if generated % 10 == 0 and generated > 0:
            time.sleep(1)

    print("─" * 60)
    print(f"Done! Generated: {generated} | Skipped: {skipped} | Errors: {errors}")
    print(f"Total articles in {OUTPUT_DIR}: {len(list(OUTPUT_DIR.glob('*.json')))}")

    # Write an index file for fast lookup
    write_index()

def write_index():
    """Write a lightweight index of all articles for the server to load."""
    articles = []
    for path in sorted(OUTPUT_DIR.glob("*.json")):
        try:
            with open(path) as f:
                a = json.load(f)
            # Only include index fields (not full body)
            articles.append({
                "id": a.get("id"),
                "slug": a.get("slug"),
                "title": a.get("title"),
                "category": a.get("category"),
                "tags": a.get("tags", []),
                "excerpt": a.get("excerpt", ""),
                "hero_url": a.get("hero_url"),
                "reading_time": a.get("reading_time", 5),
                "word_count": a.get("word_count", 0),
                "status": a.get("status", "published"),
                "featured": a.get("featured", False),
                "pub_date": a.get("pub_date"),
                "created_at": a.get("created_at"),
                "updated_at": a.get("updated_at"),
                "author": a.get("author"),
            })
        except Exception as e:
            print(f"  Index error for {path}: {e}")

    # Sort by pub_date descending
    articles.sort(key=lambda x: x.get("pub_date", ""), reverse=True)

    index_path = Path("src/data/articles-index.json")
    with open(index_path, 'w') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print(f"✓ Index written: {index_path} ({len(articles)} articles)")

if __name__ == "__main__":
    main()
