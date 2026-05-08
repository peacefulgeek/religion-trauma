#!/usr/bin/env python3
"""Expand the 12 articles under 1800 words to 1800+ words."""
import json, os, re, sys
from pathlib import Path
from openai import OpenAI

client = OpenAI(
    api_key=os.environ['OPENAI_API_KEY'],
    base_url=os.environ.get('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
)

ARTICLES_DIR = Path('/home/ubuntu/the-faith-wound/src/data/articles')

UNDER_1800 = [
    'how-religious-trauma-affects-your-ability-to-experience-spontaneity.json',
    'how-to-create-secular-rituals-that-actually-mean-something.json',
    'how-to-handle-religious-trauma-when-youre-a-parent.json',
    'how-to-process-anger-at-religious-leaders-who-hurt-you.json',
    'how-to-talk-to-your-kids-about-why-you-left-the-church.json',
    'rebuilding-your-moral-framework-after-leaving-religion.json',
    'religious-trauma-and-eating-the-body-faith-connection.json',
    'the-psychological-profile-of-a-cult-leader.json',
    'the-trauma-of-leaving-a-fundamentalist-free-methodist-church.json',
    'what-is-internalized-oppression-in-a-religious-context.json',
    'what-is-secular-humanisms-approach-to-relationships-and-love.json',
    'what-is-the-difference-between-leaving-religion-and-becoming-atheist.json',
]

SYSTEM_PROMPT = """You are The Oracle Lover — a writer for religiontrauma.com.
Your voice is warm, fiercely compassionate, intellectually rigorous, and direct.
You validate pain without wallowing. You write for people healing from religious trauma.

BANNED WORDS (never use): profound, transformative, holistic, nuanced, multifaceted, delve,
tapestry, landscape, paradigm, synergy, leverage, unlock, empower, utilize, pivotal, embark,
underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, bespoke, resonate,
harness, intricate, plethora, myriad, groundbreaking, innovative, cutting-edge, game-changer,
ever-evolving, stakeholders.

BANNED PHRASES: "It's important to note", "It's worth noting", "It's crucial to",
"In today's world", "In conclusion", "To summarize", "As we have seen".

Write in Markdown. Use ## and ### headers. Write at a 9th-grade reading level.
Be specific, practical, and emotionally honest."""

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

def expand_article(filename):
    filepath = ARTICLES_DIR / filename
    article = json.loads(filepath.read_text())
    title = article.get('title', '')
    current_body = article.get('body', '')
    current_wc = count_words(current_body)
    
    print(f'  Expanding: {title[:60]} ({current_wc} words → 1800+)')
    
    prompt = f"""Expand this article to at least 1800 words. Keep all existing content and add substantial new sections.

Title: {title}

Current article:
{current_body}

Requirements:
- Keep all existing sections intact
- Add 2-4 new substantive sections with ## headers
- Each new section should be 200-350 words
- Stay in The Oracle Lover voice
- Total must be 1800+ words
- End with a brief conclusion paragraph (no "In conclusion" phrase)
- Return ONLY the expanded article body in Markdown, no preamble"""

    try:
        response = client.chat.completions.create(
            model='gpt-4.1-mini',
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0.7,
            max_tokens=2500,
        )
        new_body = response.choices[0].message.content.strip()
        new_wc = count_words(new_body)
        
        if new_wc < 1800:
            print(f'  WARNING: Still {new_wc} words after expansion')
        
        article['body'] = new_body
        article['word_count'] = new_wc
        filepath.write_text(json.dumps(article, indent=2, ensure_ascii=False))
        print(f'  Done: {new_wc} words ✓')
        return True
    except Exception as e:
        print(f'  ERROR: {e}')
        return False

def main():
    print(f'Expanding {len(UNDER_1800)} articles...\n')
    success = 0
    for filename in UNDER_1800:
        if expand_article(filename):
            success += 1
    print(f'\nDone: {success}/{len(UNDER_1800)} expanded successfully')

if __name__ == '__main__':
    main()
