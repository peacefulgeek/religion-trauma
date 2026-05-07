#!/usr/bin/env python3
"""
Expand articles that are under 1800 words by appending additional sections.
Uses the OpenAI API to generate 2-3 more sections for short articles.
Runs with 15 parallel workers.
"""
import json, re, os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from openai import OpenAI

OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
MODEL = "gpt-4.1-mini"
MAX_WORKERS = 15
OUTPUT_DIR = Path("/home/ubuntu/the-faith-wound/src/data/articles")
MIN_WORDS = 1800

client_pool = None

def get_client():
    return OpenAI(api_key=OPENAI_KEY, base_url=OPENAI_BASE_URL)

EXPAND_SYSTEM = """You are the Oracle Lover — a warm, wise, fiercely compassionate voice for people healing from religious trauma.

Voice: warm, intimate, direct, validating, intellectually rigorous.
BANNED: "boundaries", "toxic", "empower", "journey", "healing journey", "safe space", "trauma-informed", "self-care", "unpack", "dive deep", "game-changer", "transformative", "holistic", "authentic self"

Write 2-3 additional body sections (each 250-350 words) to expand an existing article.
Each section must use a ## heading.
Do NOT repeat content already in the article.
Do NOT add a new FAQ section.
Write in Markdown only."""

def expand_article(file_path):
    article = json.load(open(file_path))
    title = article['title']
    category = article['category']
    current_body = article['body']
    current_words = article['word_count']
    
    if current_words >= MIN_WORDS:
        return f"SKIP:{file_path.stem}:{current_words}"
    
    needed = MIN_WORDS - current_words + 200  # add buffer
    
    client = get_client()
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": EXPAND_SYSTEM},
                {"role": "user", "content": f"""Article title: {title}
Category: {category}
Current word count: {current_words} (need {needed} more words to reach {MIN_WORDS})

Here is the existing article body (do NOT repeat this content):
---
{current_body[:3000]}
---

Write 2-3 new ## sections (250-350 words each) that add depth and value. Focus on practical guidance, research, or lived experience aspects not yet covered."""}
            ],
            temperature=0.7,
            max_tokens=1500,
        )
        expansion = response.choices[0].message.content.strip()
    except Exception as e:
        return f"ERROR:{file_path.stem}:{str(e)[:100]}"
    
    # Insert expansion before the FAQ section
    faq_match = re.search(r'\n## Frequently Asked Questions', current_body)
    if faq_match:
        new_body = current_body[:faq_match.start()] + '\n\n' + expansion + '\n\n' + current_body[faq_match.start():]
    else:
        new_body = current_body + '\n\n' + expansion
    
    new_word_count = len(new_body.split())
    article['body'] = new_body
    article['word_count'] = new_word_count
    article['reading_time'] = max(1, round(new_word_count / 238))
    
    with open(file_path, 'w') as f:
        json.dump(article, f, indent=2, ensure_ascii=False)
    
    return f"OK:{file_path.stem}:{current_words}->{new_word_count}"

# Find all short articles
files = list(OUTPUT_DIR.glob('*.json'))
short_files = []
for f in files:
    try:
        a = json.load(open(f))
        if a.get('word_count', 0) < MIN_WORDS:
            short_files.append(f)
    except:
        pass

print(f"Articles under {MIN_WORDS} words: {len(short_files)}")
print(f"Running with {MAX_WORKERS} workers...")

ok_count = 0
err_count = 0
skip_count = 0

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(expand_article, f): f for f in short_files}
    for i, future in enumerate(as_completed(futures), 1):
        result = future.result()
        if result.startswith("OK:"):
            ok_count += 1
        elif result.startswith("SKIP:"):
            skip_count += 1
        else:
            err_count += 1
            print(f"  {result}")
        if i % 20 == 0:
            print(f"Progress: {i}/{len(short_files)} | OK:{ok_count} ERR:{err_count}", flush=True)

# Final stats
wcs = [json.load(open(f))['word_count'] for f in files]
print(f"\nDONE! Expanded: {ok_count}, Skipped: {skip_count}, Errors: {err_count}")
print(f"Word count: min={min(wcs)}, avg={sum(wcs)//len(wcs)}, max={max(wcs)}")
print(f"Articles >= 1800 words: {sum(1 for w in wcs if w >= 1800)}")
