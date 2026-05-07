#!/usr/bin/env python3
"""Generate articles for a single batch file. Called in parallel."""
import os, sys, json, re, hashlib
from pathlib import Path
from openai import OpenAI

client = OpenAI()
MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1-mini")
OUTPUT_DIR = Path("/home/ubuntu/the-faith-wound/src/data/articles")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

CDN_BASE = "https://religion-trauma.b-cdn.net"
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
5. FAQ section — 5 questions with detailed answers (use ## Frequently Asked Questions, then **1. Question?** format)
6. Closing — a compassionate, forward-looking paragraph

Minimum 1800 words. Maximum 2400 words.
Write in Markdown format."""

def slugify(title):
    s = title.lower()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s[:80]

def extract_tldr(body):
    m = re.search(r'## TLDR\n(.*?)(?=\n##|\Z)', body, re.DOTALL)
    if not m:
        return []
    return re.findall(r'^[-*•]\s+(.+)$', m.group(1), re.MULTILINE)[:4]

def extract_faqs(body):
    m = re.search(r'(?:## )?Frequently Asked Questions(.*?)(?=\n##|\Z)', body, re.DOTALL)
    if not m:
        return []
    faq_text = m.group(1)
    # **N. Question** format
    pairs = re.findall(r'\*\*\d+\.\s+(.+?)\*\*\s*\n+(.*?)(?=\n\*\*\d+\.|\Z)', faq_text, re.DOTALL)
    if pairs:
        return [{"q": q.strip(), "a": a.strip()} for q, a in pairs[:5]]
    # ### Question format
    pairs = re.findall(r'###\s+(.+?)\n(.*?)(?=\n###|\Z)', faq_text, re.DOTALL)
    if pairs:
        return [{"q": q.strip(), "a": a.strip()} for q, a in pairs[:5]]
    # **Question** format
    pairs = re.findall(r'\*\*(.+?)\*\*\s*\n+(.*?)(?=\n\*\*|\Z)', faq_text, re.DOTALL)
    return [{"q": q.strip(), "a": a.strip()} for q, a in pairs[:5]]

def generate_article(topic, pub_date):
    title = topic["title"]
    category = topic.get("category", "religious-trauma")
    tags = topic.get("tags", [])
    slug = slugify(title)
    out_path = OUTPUT_DIR / f"{slug}.json"
    if out_path.exists():
        return f"SKIP:{slug}"

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Write a complete article for The Faith Wound website.\n\nTitle: {title}\nCategory: {category}\nTarget keywords: {', '.join(tags)}\n\nFollow all voice and structure requirements exactly. Minimum 1800 words."}
            ],
            temperature=0.75,
            max_tokens=3500,
        )
        body = response.choices[0].message.content.strip()
    except Exception as e:
        return f"ERROR:{slug}:{e}"

    word_count = len(body.split())
    if word_count < 1200:
        return f"SHORT:{slug}:{word_count}"

    tldr = extract_tldr(body)
    faqs = extract_faqs(body)
    hero_url = CATEGORY_IMAGES.get(category, CATEGORY_IMAGES["default"])
    reading_time = max(1, round(word_count / 238))

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
        "author": "The Oracle Lover",
        "author_title": "Religious Trauma Specialist & Faith Transition Guide",
    }

    with open(out_path, 'w') as f:
        json.dump(article, f, indent=2, ensure_ascii=False)

    return f"OK:{slug}:{word_count}"

def main():
    if len(sys.argv) < 2:
        print("Usage: gen-batch.py <batch-file.json>")
        sys.exit(1)

    batch_file = sys.argv[1]
    with open(batch_file) as f:
        topics = json.load(f)

    results = []
    for topic in topics:
        pub_date = topic.get("pub_date", "2026-05-06")
        result = generate_article(topic, pub_date)
        results.append(result)
        print(result, flush=True)

    return results

if __name__ == "__main__":
    main()
