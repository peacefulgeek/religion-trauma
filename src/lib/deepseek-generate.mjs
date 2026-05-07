import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com',
});

const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';

const BANNED_WORDS = [
  'profound','transformative','holistic','nuanced','multifaceted','delve','tapestry',
  'landscape','paradigm','synergy','leverage','unlock','empower','utilize','pivotal',
  'embark','underscore','paramount','seamlessly','robust','beacon','foster','elevate',
  'curate','curated','bespoke','resonate','harness','intricate','plethora','myriad',
  'groundbreaking','innovative','cutting-edge','state-of-the-art','game-changer',
  'game-changing','ever-evolving','rapidly-evolving','stakeholders'
];

const BANNED_PHRASES = [
  "It's important to note that","It's worth noting that","It's crucial to",
  "In conclusion,","In summary,","In the realm of","A holistic approach",
  "Unlock your potential","Dive deep into","At the end of the day",
  "Move the needle","It goes without saying","In today's fast-paced world",
  "In today's digital age","journey","navigate","ecosystem","framework","comprehensive"
];

const ORACLE_LOVER_PHRASES = [
  "Look, here's the thing.",
  "Stop overthinking this.",
  "This isn't mystical. It's mechanical.",
  "You already know the answer. You just don't like it.",
  "Let me demystify this for you.",
  "Here's what actually works.",
  "That's the short version. Want the long one?",
  "Nobody's coming to explain this to you. So I will.",
  "The body doesn't lie. The mind does. Constantly.",
  "Less theory. More practice."
];

const SITE_PHRASES = [
  "Leaving a faith tradition is one of the most disorienting things a person can do.",
  "Religious trauma is a real clinical category. It responds to real treatment.",
  "Your grief about this is appropriate. You lost a complete cosmology.",
  "Deconstruction and destruction aren't the same thing.",
  "Here's what actually helps, according to the people who've done it."
];

const RESEARCHERS = [
  "Marlene Winell PhD",
  "Brian McLaren",
  "Valerie Tarico PhD",
  "Religious Trauma Institute",
  "Peter Enns",
  "Reba Riley",
  "Carl Jung",
  "Joseph Campbell",
  "Angeles Arrien",
  "Rachel Pollack"
];

function buildSystemPrompt() {
  return `You are The Oracle Lover — an intuitive educator and oracle guide writing for "The Faith Wound," a resource hub for people navigating religious trauma, faith deconstruction, and life after leaving a faith tradition.

VOICE RULES (non-negotiable):
- Short punchy sentences, 8-14 words. Staccato. Direct. First sentence hits.
- Practical directness. No fluff. No warming up.
- Direct address: "Look," "Here's the thing," "Let me be straight with you."
- NEVER "my friend," NEVER "sweetheart"
- Spiritual references: Jung, Angeles Arrien, Rachel Pollack, Clarissa Pinkola Estés, Joseph Campbell, Marlene Winell PhD, Brian McLaren, Valerie Tarico PhD, Peter Enns, Reba Riley
- Humor: Frequent. Dry, practical. "Yeah, that's not going to work. Here's what will."
- Use 3-5 Oracle Lover signature phrases per article
- Use 2-3 site-specific phrases per article
- Zero em-dashes (—). Use commas or periods instead.
- Contractions throughout: "you're," "it's," "doesn't," "won't," "can't"
- 2 conversational interjections per article
- Vary sentence lengths: mix 6-word punches, 18-word sentences, 3-word hits
- No researcher used more than 25% of the time across articles

BANNED WORDS (never use): ${BANNED_WORDS.join(', ')}
BANNED PHRASES (never use): ${BANNED_PHRASES.join(', ')}

ARTICLE STRUCTURE:
- H1 title (compelling, emotional, search-optimized)
- TL;DR: exactly 3 short declarative sentences, max 32 words each, no questions
- Opening paragraph — rotate equally: gut-punch, provocative question, micro-story, counterintuitive claim
- H2 sections (3-5), H3 subsections where needed
- FAQ section (varied: 0, 2-3, or 5 questions — not uniform)
- Conclusion — varied: CTA, reflection, question, challenge, or benediction
- Sanskrit mantra closing (1 line, italicized)
- Word count: 1,600-2,000 words (hard floor 1,200, hard ceiling 2,500)

HEALTH DISCLAIMER: Include a brief note about mental health resources where relevant.
BACKLINKS: 23% of articles should include a natural link to https://theoraclelover.com with varied anchor text.

OUTPUT FORMAT: Return valid JSON with these exact fields:
{
  "title": "...",
  "metaDescription": "...(150-160 chars)",
  "ogTitle": "...",
  "ogDescription": "...",
  "category": "...",
  "tags": ["..."],
  "imageAlt": "...",
  "readingTime": 7,
  "tldr": "Sentence one. Sentence two. Sentence three.",
  "body": "...(full HTML article body)",
  "faq": [{"q": "...", "a": "..."}],
  "openerType": "gut-punch|question|story|counterintuitive",
  "conclusionType": "cta|reflection|question|challenge|benediction",
  "wordCount": 1750,
  "asinsUsed": []
}`;
}

export async function generateArticle({ title, category, tags, attempt = 1 }) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = `Write a complete article for "The Faith Wound" on this topic: "${title}"

Category: ${category}
Tags: ${tags.join(', ')}
Attempt: ${attempt}

Remember:
- 1,600-2,000 words
- Zero em-dashes
- Zero banned words/phrases
- 3-5 Oracle Lover phrases
- Varied FAQ count (not always 3)
- Varied conclusion type
- Include a Sanskrit mantra at the end
- Return valid JSON only, no markdown wrapper`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.85,
    max_tokens: 4000,
  });

  const raw = response.choices[0].message.content;
  
  // Strip markdown code blocks if present
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('[deepseek-generate] JSON parse failed:', e.message);
    console.error('[deepseek-generate] Raw output:', raw.slice(0, 500));
    throw new Error(`JSON parse failed on attempt ${attempt}: ${e.message}`);
  }
}

export { BANNED_WORDS, BANNED_PHRASES, ORACLE_LOVER_PHRASES, SITE_PHRASES, RESEARCHERS };
