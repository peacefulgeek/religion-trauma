#!/usr/bin/env python3
"""Fix FAQ extraction on already-generated articles."""
import json, re
from pathlib import Path

OUTPUT_DIR = Path("src/data/articles")

def extract_faqs(body: str) -> list:
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

fixed = 0
for path in OUTPUT_DIR.glob("*.json"):
    with open(path) as f:
        a = json.load(f)
    
    if not a.get("faqs"):
        faqs = extract_faqs(a.get("body", ""))
        if faqs:
            a["faqs"] = faqs
            with open(path, "w") as f:
                json.dump(a, f, indent=2, ensure_ascii=False)
            fixed += 1
            print(f"Fixed {len(faqs)} FAQs in: {path.name}")

print(f"\nFixed {fixed} articles")
