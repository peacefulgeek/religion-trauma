#!/usr/bin/env python3
"""Top up the 2 remaining articles under 1800 words."""
import json, os, re
from pathlib import Path
from openai import OpenAI

client = OpenAI(
    api_key=os.environ['OPENAI_API_KEY'],
    base_url=os.environ.get('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
)

ARTICLES_DIR = Path('/home/ubuntu/the-faith-wound/src/data/articles')

SHORT = [
    'rebuilding-your-moral-framework-after-leaving-religion.json',
    'how-religious-trauma-affects-your-ability-to-experience-spontaneity.json',
]

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

for filename in SHORT:
    filepath = ARTICLES_DIR / filename
    article = json.loads(filepath.read_text())
    title = article['title']
    body = article['body']
    wc = count_words(body)
    needed = 1800 - wc + 150  # add 150 buffer
    
    print(f'Topping up: {title} ({wc} words, need +{needed})')
    
    prompt = f"""The article below is {wc} words. Add exactly one new section of approximately {needed} words to bring it to 1800+ words total.

Title: {title}

Current article:
{body}

Write ONLY the new section to append (starting with ## header). Do not repeat existing content. Stay in The Oracle Lover voice — warm, direct, compassionate. No banned words (profound, transformative, holistic, nuanced, delve, tapestry, landscape, paradigm, synergy, leverage, unlock, empower, utilize, pivotal, embark, seamlessly, robust)."""

    try:
        response = client.chat.completions.create(
            model='gpt-4.1-mini',
            messages=[
                {'role': 'system', 'content': 'You are The Oracle Lover, writer for religiontrauma.com.'},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0.7,
            max_tokens=600,
        )
        new_section = response.choices[0].message.content.strip()
        new_body = body + '\n\n' + new_section
        new_wc = count_words(new_body)
        article['body'] = new_body
        article['word_count'] = new_wc
        filepath.write_text(json.dumps(article, indent=2, ensure_ascii=False))
        print(f'  Done: {new_wc} words ✓')
    except Exception as e:
        print(f'  ERROR: {e}')

print('Done.')
