#!/usr/bin/env python3
"""
Fix date-gating on all 500 articles.
Phase 1: 5/day for 40 days (articles 0-199, dates May 8 - June 16)
Phase 2: 1/weekday from June 17 onward (articles 200-499)
"""
import json
from pathlib import Path
from datetime import datetime, timedelta

OUTPUT_DIR = Path("/home/ubuntu/the-faith-wound/src/data/articles")
START_DATE = datetime(2026, 5, 8).date()  # Start publishing May 8

def get_pub_date(index):
    """Get publish date for article at given index (0-based)."""
    if index < 200:
        # Phase 1: 5/day for 40 days
        day_offset = index // 5
        return (START_DATE + timedelta(days=day_offset)).isoformat()
    else:
        # Phase 2: 1/weekday from day 41
        weekday_count = index - 200
        base = START_DATE + timedelta(days=40)  # June 17
        if weekday_count == 0:
            # Find first weekday on or after base
            d = base
            while d.weekday() >= 5:
                d += timedelta(days=1)
            return d.isoformat()
        else:
            added = 0
            d = base
            while added < weekday_count:
                d += timedelta(days=1)
                if d.weekday() < 5:  # Mon-Fri
                    added += 1
            return d.isoformat()

# Get all article files sorted by slug (consistent ordering)
files = sorted(OUTPUT_DIR.glob('*.json'))
print(f"Total articles: {len(files)}")

for i, f in enumerate(files):
    article = json.load(open(f))
    new_date = get_pub_date(i)
    article['pub_date'] = new_date
    article['created_at'] = new_date
    article['updated_at'] = new_date
    with open(f, 'w') as out:
        json.dump(article, out, indent=2, ensure_ascii=False)

# Verify
from collections import Counter
dates = [json.load(open(f))['pub_date'] for f in files]
dates.sort()
c = Counter(dates)
print(f"Date range: {dates[0]} to {dates[-1]}")
print(f"Days with 5 articles: {sum(1 for v in c.values() if v==5)}")
print(f"Days with 1 article: {sum(1 for v in c.values() if v==1)}")
print(f"Total unique dates: {len(c)}")
print(f"First 5 dates: {sorted(c.keys())[:5]}")
print(f"Sample date 201: {dates[200]}")
print("Date-gating applied successfully!")
