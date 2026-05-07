#!/usr/bin/env python3
"""Fix the truncated article-topics.json and add remaining topics to reach 500."""
import json, re

# Read the raw file
with open('scripts/article-topics.json', 'r') as f:
    raw = f.read()

# The file is a JSON array that got truncated. Strip the incomplete last entry.
# Find last complete entry (ends with },)
last_complete = raw.rfind('},\n  {"title":')
if last_complete == -1:
    last_complete = raw.rfind('},')

# Keep everything up to and including the last complete entry
raw_clean = raw[:last_complete + 2]  # include the },

# Parse what we have so far
try:
    existing = json.loads(raw_clean + '\n]')
    print(f"Parsed {len(existing)} existing topics")
except Exception as e:
    print(f"Parse error: {e}")
    # Try stripping trailing comma
    raw_clean2 = raw_clean.rstrip().rstrip(',')
    existing = json.loads('[' + raw_clean2.lstrip('[') + '\n]')
    print(f"Parsed {len(existing)} existing topics (fallback)")

# Add remaining topics to reach 500
remaining_needed = 500 - len(existing)
print(f"Need {remaining_needed} more topics")

additional_topics = [
    {"title": "The Trauma of Leaving a High-Control Religious Community", "category": "high-control-groups", "tags": ["high-control", "leaving", "community", "trauma"]},
    {"title": "How Religious Shame Shapes Your Relationship With Money", "category": "religious-trauma", "tags": ["shame", "money", "prosperity gospel", "healing"]},
    {"title": "When Prayer Stops Working: What It Means and What Comes Next", "category": "deconstruction", "tags": ["prayer", "deconstruction", "meaning", "spirituality"]},
    {"title": "The Hidden Grief of Losing Your Religious Identity", "category": "grief", "tags": ["identity", "grief", "faith loss", "healing"]},
    {"title": "How to Rebuild Trust After Religious Betrayal", "category": "healing", "tags": ["trust", "betrayal", "healing", "relationships"]},
    {"title": "Religious Trauma and the Nervous System: A Somatic Perspective", "category": "somatic-healing", "tags": ["nervous system", "somatic", "trauma", "healing"]},
    {"title": "What Happens to Your Brain When You Leave a Cult", "category": "high-control-groups", "tags": ["brain", "cult recovery", "neuroscience", "healing"]},
    {"title": "The Spiritual Bypassing Trap: When Healing Becomes Avoidance", "category": "healing", "tags": ["spiritual bypassing", "avoidance", "healing", "awareness"]},
    {"title": "How to Find Secular Community After Leaving Religion", "category": "secular-community", "tags": ["secular", "community", "belonging", "post-faith"]},
    {"title": "Religious Trauma in the LGBTQ+ Community: Stories of Survival", "category": "lgbtq-faith", "tags": ["LGBTQ", "survival", "religious trauma", "community"]},
    {"title": "When Your Family Shuns You for Leaving the Faith", "category": "leaving-church", "tags": ["shunning", "family", "estrangement", "healing"]},
    {"title": "The Role of Anger in Religious Trauma Recovery", "category": "healing", "tags": ["anger", "recovery", "processing", "emotions"]},
    {"title": "How Authoritarian Parenting and Religion Intersect", "category": "religious-trauma", "tags": ["authoritarian parenting", "religion", "childhood trauma", "healing"]},
    {"title": "Post-Traumatic Growth After Religious Trauma: Is It Possible?", "category": "healing", "tags": ["post-traumatic growth", "resilience", "healing", "transformation"]},
    {"title": "The Psychology of Religious Doubt and How to Sit With Uncertainty", "category": "deconstruction", "tags": ["doubt", "uncertainty", "psychology", "deconstruction"]},
    {"title": "How to Talk to Your Children About Leaving Religion", "category": "leaving-church", "tags": ["children", "parenting", "leaving religion", "family"]},
    {"title": "Religious Trauma and Eating Disorders: The Hidden Connection", "category": "body-healing", "tags": ["eating disorders", "body image", "religious trauma", "healing"]},
    {"title": "When God Was Weaponized: Understanding Spiritual Violence", "category": "religious-trauma", "tags": ["spiritual violence", "weaponized religion", "abuse", "healing"]},
    {"title": "The Loneliness of Deconstruction: You Are Not Alone", "category": "deconstruction", "tags": ["loneliness", "deconstruction", "community", "healing"]},
    {"title": "How to Set Boundaries With Religious Family Members", "category": "leaving-church", "tags": ["boundaries", "family", "religion", "healing"]},
    {"title": "Reclaiming Sabbath: Rest Without Religion", "category": "secular-spirituality", "tags": ["sabbath", "rest", "secular", "reclaiming"]},
    {"title": "The Gift of Deconstruction: What You Gain When You Lose Your Faith", "category": "deconstruction", "tags": ["gift", "deconstruction", "growth", "transformation"]},
]

# Take only as many as needed
additional_topics = additional_topics[:remaining_needed]

# Combine
all_topics = existing + additional_topics
print(f"Total topics: {len(all_topics)}")

# Write the clean JSON
with open('scripts/article-topics.json', 'w') as f:
    json.dump(all_topics, f, indent=2, ensure_ascii=False)

print("✓ article-topics.json written cleanly with", len(all_topics), "topics")
