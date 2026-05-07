#!/usr/bin/env python3
"""
Fast parallel article generator for The Faith Wound (religiontrauma.com)
Uses ThreadPoolExecutor with 20 workers to generate 490 articles quickly.
"""
import json, re, hashlib, os, sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from openai import OpenAI

OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
MODEL = "gpt-4.1-mini"
MAX_WORKERS = 20
OUTPUT_DIR = Path("/home/ubuntu/the-faith-wound/src/data/articles")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

CDN = "https://religion-trauma.b-cdn.net"
CATEGORY_IMAGES = {
    "religious-trauma": f"{CDN}/article-rts.webp",
    "deconstruction": f"{CDN}/article-deconstruction.webp",
    "healing": f"{CDN}/article-healing.webp",
    "leaving-church": f"{CDN}/article-community.webp",
    "purity-culture": f"{CDN}/article-shame.webp",
    "high-control-groups": f"{CDN}/article-trust.webp",
    "grief": f"{CDN}/article-grief.webp",
    "ocd-scrupulosity": f"{CDN}/article-rts.webp",
    "body-healing": f"{CDN}/article-somatic.webp",
    "somatic-healing": f"{CDN}/article-somatic.webp",
    "identity": f"{CDN}/article-identity.webp",
    "lgbtq-faith": f"{CDN}/article-lgbtq.webp",
    "secular-community": f"{CDN}/article-community.webp",
    "secular-spirituality": f"{CDN}/article-healing.webp",
    "therapy": f"{CDN}/article-therapy.webp",
    "sleep": f"{CDN}/article-sleep.webp",
    "spiritual-abuse": f"{CDN}/article-trust.webp",
    "relationships": f"{CDN}/article-community.webp",
    "mental-health": f"{CDN}/article-therapy.webp",
    "neuroscience": f"{CDN}/article-somatic.webp",
    "mindfulness": f"{CDN}/article-healing.webp",
    "anger": f"{CDN}/article-grief.webp",
    "shame": f"{CDN}/article-shame.webp",
    "anxiety": f"{CDN}/article-rts.webp",
    "depression": f"{CDN}/article-grief.webp",
    "community": f"{CDN}/article-community.webp",
    "spirituality": f"{CDN}/article-healing.webp",
    "family": f"{CDN}/article-community.webp",
    "parenting": f"{CDN}/article-community.webp",
    "relationships-after-faith": f"{CDN}/article-community.webp",
}

SYSTEM_PROMPT = """You are the Oracle Lover — a warm, wise, fiercely compassionate voice for people healing from religious trauma and faith deconstruction.

Voice rules:
- Warm, intimate, direct — like a trusted friend who has done the work
- Deeply validating — never minimize pain or rush healing
- Intellectually rigorous — cite real research, psychology, neuroscience when relevant
- Use "you" and "your" — speak directly to the reader
- BANNED words (use alternatives): "boundaries" → "limits", "toxic" → "harmful", "empower/empowerment" → "strengthen/agency", "journey" → "path" or "process", "healing journey" → "healing process", "safe space" → "supportive environment", "trauma-informed" → "trauma-aware", "self-care" → "self-tending", "unpack" → "examine", "dive deep" → "explore", "game-changer" → omit, "transformative" → "significant", "holistic" → "whole-person", "authentic self" → "true self"

Structure every article exactly:
1. Opening hook — a scene, question, or bold statement (NO H1 heading — title is separate)
2. ## TLDR — 3-4 bullet points with key insights
3. Main body — 6-8 ## sections, each 200-300 words
4. At least 2 inline citations [Author, Year]
5. ## Frequently Asked Questions — exactly 5 Q&As using this format:
   **1. Question text here?**
   Answer text here.
   
   **2. Next question?**
   Answer text here.
6. A compassionate closing paragraph (no heading)

Minimum 1800 words total. Write in Markdown only."""

def slugify(title):
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s[:80]

def extract_tldr(body):
    m = re.search(r'## TLDR\n([\s\S]*?)(?=\n##|$)', body)
    if not m: return []
    return re.findall(r'^[-*•]\s+(.+)$', m.group(1), re.MULTILINE)[:4]

def extract_faqs(body):
    m = re.search(r'(?:## )?Frequently Asked Questions([\s\S]*?)(?=\n##\s|\Z)', body, re.IGNORECASE)
    if not m: return []
    faq_text = m.group(1)
    # Try **N. Question?** format
    pairs = list(re.finditer(r'\*\*\d+\.\s+(.+?)\*\*\s*\n+([\s\S]*?)(?=\n\*\*\d+\.|\Z)', faq_text))
    if pairs:
        return [{"q": p.group(1).strip(), "a": p.group(2).strip()[:500]} for p in pairs[:5]]
    # Try ### format
    pairs2 = list(re.finditer(r'###\s+(.+?)\n([\s\S]*?)(?=\n###|\Z)', faq_text))
    return [{"q": p.group(1).strip(), "a": p.group(2).strip()[:500]} for p in pairs2[:5]]

def generate_article(topic):
    title = topic["title"]
    category = topic.get("category", "religious-trauma")
    tags = topic.get("tags", [])
    pub_date = topic.get("pub_date", "2026-05-06")
    slug = slugify(title)
    out_path = OUTPUT_DIR / f"{slug}.json"

    if out_path.exists():
        return f"SKIP:{slug}"

    client = OpenAI(api_key=OPENAI_KEY, base_url=OPENAI_BASE_URL)
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Write a complete article.\n\nTitle: {title}\nCategory: {category}\nKeywords: {', '.join(tags)}\n\nMinimum 1800 words. Follow ALL voice and structure rules exactly. Include exactly 5 FAQs in **N. Question?** format."}
            ],
            temperature=0.75,
            max_tokens=3500,
        )
        body = response.choices[0].message.content.strip()
    except Exception as e:
        return f"ERROR:{slug}:{str(e)[:120]}"

    word_count = len(body.split())
    tldr = extract_tldr(body)
    faqs = extract_faqs(body)
    hero_url = CATEGORY_IMAGES.get(category, f"{CDN}/hero-main.webp")
    reading_time = max(1, round(word_count / 238))
    sentences = re.split(r'(?<=[.!?])\s+', body)
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
        "author": "The Oracle Lover",
        "author_title": "Religious Trauma Specialist & Faith Transition Guide",
    }

    with open(out_path, 'w') as f:
        json.dump(article, f, indent=2, ensure_ascii=False)

    return f"OK:{slug}:{word_count}"

# Load all topics
topics = json.load(open('/home/ubuntu/the-faith-wound/scripts/article-topics.json'))[:500]

# Skip already done
existing = {f.stem for f in OUTPUT_DIR.glob('*.json')}
remaining = [t for t in topics if slugify(t['title']) not in existing]
print(f"Already done: {len(existing)}, Remaining: {len(remaining)}", flush=True)

# Run with thread pool
ok_count = 0
err_count = 0
skip_count = 0

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(generate_article, t): t for t in remaining}
    for i, future in enumerate(as_completed(futures), 1):
        result = future.result()
        if result.startswith("OK:"):
            ok_count += 1
        elif result.startswith("SKIP:"):
            skip_count += 1
        else:
            err_count += 1
            print(f"  {result}", flush=True)
        if i % 10 == 0:
            total_done = len(list(OUTPUT_DIR.glob('*.json')))
            print(f"Progress: {i}/{len(remaining)} processed | {total_done} total files | {err_count} errors", flush=True)

total_final = len(list(OUTPUT_DIR.glob('*.json')))
print(f"\nDONE! Generated: {ok_count}, Skipped: {skip_count}, Errors: {err_count}", flush=True)
print(f"Total article files: {total_final}", flush=True)
