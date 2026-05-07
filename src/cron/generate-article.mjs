/**
 * Article generation cron — The Faith Wound
 *
 * Schedule:
 *   Phase 1 (days 1-40): 5 articles/day at 6am, 9am, 12pm, 3pm, 6pm UTC
 *   Phase 2 (day 41+):   1 article/weekday at 9am UTC (Mon-Fri)
 *
 * SITE_LAUNCH_DATE env var (ISO date) controls phase boundary.
 * AUTO_GEN_ENABLED=true required for cron to fire.
 */

import cron from 'node-cron';
import { OpenAI } from 'openai';
import { upsertArticle, getTotalArticleCount, getPublishedSlugs } from '../lib/db.mjs';
import { runQualityGate } from '../lib/article-quality-gate.mjs';
import crypto from 'crypto';
import re2 from 're2';

const LAUNCH_DATE = process.env.SITE_LAUNCH_DATE
  ? new Date(process.env.SITE_LAUNCH_DATE)
  : new Date();

const CDN = 'https://religion-trauma.b-cdn.net';
const CATEGORY_IMAGES = {
  'religious-trauma':    `${CDN}/article-rts.webp`,
  'deconstruction':      `${CDN}/article-deconstruction.webp`,
  'healing':             `${CDN}/article-healing.webp`,
  'leaving-church':      `${CDN}/article-community.webp`,
  'purity-culture':      `${CDN}/article-shame.webp`,
  'high-control-groups': `${CDN}/article-trust.webp`,
  'grief':               `${CDN}/article-grief.webp`,
  'ocd-scrupulosity':    `${CDN}/article-rts.webp`,
  'body-healing':        `${CDN}/article-somatic.webp`,
  'somatic-healing':     `${CDN}/article-somatic.webp`,
  'identity':            `${CDN}/article-identity.webp`,
  'lgbtq-faith':         `${CDN}/article-lgbtq.webp`,
  'secular-community':   `${CDN}/article-community.webp`,
  'secular-spirituality':`${CDN}/article-healing.webp`,
  'therapy':             `${CDN}/article-therapy.webp`,
  'sleep':               `${CDN}/article-sleep.webp`,
};

const SYSTEM_PROMPT = `You are the Oracle Lover — a warm, wise, fiercely compassionate voice for people healing from religious trauma and faith deconstruction.

Voice rules:
- Warm, intimate, direct — like a trusted friend who has done the work
- Deeply validating — never minimize pain or rush healing
- Intellectually rigorous — cite real research, psychology, neuroscience
- Use "you" and "your" — speak directly to the reader
- BANNED: "boundaries" (say "limits"), "toxic" (say "harmful"), "empower/empowerment", "journey" (say "path" or "process"), "healing journey", "safe space", "trauma-informed" (say "trauma-aware"), "self-care" (say "self-tending"), "unpack", "dive deep", "game-changer", "transformative", "holistic", "authentic self"

Structure:
1. Opening hook — scene, question, or bold statement (NO H1)
2. ## TLDR — 3-4 bullet points
3. Main body — 6-8 ## sections, each 200-300 words
4. At least 2 inline citations [Author, Year]
5. ## Frequently Asked Questions — 5 Q&As using **1. Question?** format
6. Compassionate closing paragraph

Minimum 1800 words. Write in Markdown.`;

function getDaysSinceLaunch() {
  const now = new Date();
  return Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24));
}

function isPhase1() {
  return getDaysSinceLaunch() < 40;
}

function slugify(title) {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function extractTldr(body) {
  const m = body.match(/## TLDR\n([\s\S]*?)(?=\n##|$)/);
  if (!m) return [];
  return (m[1].match(/^[-*•]\s+(.+)$/gm) || []).map(l => l.replace(/^[-*•]\s+/, '')).slice(0, 4);
}

function extractFaqs(body) {
  const m = body.match(/(?:## )?Frequently Asked Questions([\s\S]*?)(?=\n##|$)/);
  if (!m) return [];
  const faqText = m[1];
  const pairs = [...faqText.matchAll(/\*\*\d+\.\s+(.+?)\*\*\s*\n+([\s\S]*?)(?=\n\*\*\d+\.|\n##|$)/g)];
  if (pairs.length) return pairs.slice(0, 5).map(p => ({ q: p[1].trim(), a: p[2].trim() }));
  const pairs2 = [...faqText.matchAll(/###\s+(.+?)\n([\s\S]*?)(?=\n###|\n##|$)/g)];
  return pairs2.slice(0, 5).map(p => ({ q: p[1].trim(), a: p[2].trim() }));
}

// Import topics from the topics file
import { ARTICLE_TOPICS } from './article-topics.mjs';

async function runGeneration() {
  if (process.env.AUTO_GEN_ENABLED !== 'true') return;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
  });
  const model = 'gpt-4.1-mini';

  // Find next unused topic
  const existingSlugs = await getPublishedSlugs();
  const slugSet = new Set(existingSlugs);
  const nextTopic = ARTICLE_TOPICS.find(t => !slugSet.has(slugify(t.title)));

  if (!nextTopic) {
    console.log('[cron] All topics exhausted — no article generated');
    return;
  }

  const { title, category = 'religious-trauma', tags = [] } = nextTopic;
  const slug = slugify(title);
  const today = new Date().toISOString().slice(0, 10);

  console.log(`[cron] Generating: "${title}"`);

  let body = '';
  let attempts = 0;
  while (attempts < 4) {
    attempts++;
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Write a complete article.\n\nTitle: ${title}\nCategory: ${category}\nKeywords: ${tags.join(', ')}\n\nMinimum 1800 words. Follow all voice and structure rules.` },
        ],
        temperature: 0.75,
        max_tokens: 3500,
      });
      body = res.choices[0].message.content.trim();
    } catch (err) {
      console.error(`[cron] API error attempt ${attempts}:`, err.message);
      continue;
    }

    const qg = runQualityGate(body, title);
    if (qg.pass) break;
    console.warn(`[cron] Quality gate failed (attempt ${attempts}):`, qg.reasons.join(', '));
    body = '';
  }

  if (!body) {
    console.error('[cron] Failed to generate quality article after 4 attempts');
    return;
  }

  const wordCount = body.split(/\s+/).length;
  const tldr = extractTldr(body);
  const faqs = extractFaqs(body);
  const heroUrl = CATEGORY_IMAGES[category] || `${CDN}/hero-main.webp`;
  const readingTime = Math.max(1, Math.round(wordCount / 238));
  const sentences = body.split(/(?<=[.!?])\s+/);
  const excerpt = sentences.slice(0, 2).join(' ').slice(0, 300);

  const article = {
    id: crypto.createHash('md5').update(slug).digest('hex').slice(0, 12),
    slug, title, category, tags, excerpt, hero_url: heroUrl,
    body, tldr, faqs, reading_time: readingTime, word_count: wordCount,
    status: 'published', featured: false,
    pub_date: today, created_at: today, updated_at: today,
    author: 'The Oracle Lover',
    author_title: 'Religious Trauma Specialist & Faith Transition Guide',
  };

  await upsertArticle(article);
  console.log(`[cron] Published: "${title}" (${wordCount} words)`);
}

// Phase 1: 5x daily — 6am, 9am, 12pm, 3pm, 6pm UTC
const phase1Cron = cron.schedule('0 6,9,12,15,18 * * *', async () => {
  if (!isPhase1()) return;
  await runGeneration();
}, { scheduled: false });

// Phase 2: 1x weekday — 9am UTC Mon-Fri
const phase2Cron = cron.schedule('0 9 * * 1-5', async () => {
  if (isPhase1()) return;
  await runGeneration();
}, { scheduled: false });

export function startArticleCron() {
  if (process.env.AUTO_GEN_ENABLED !== 'true') {
    console.log('[cron] AUTO_GEN_ENABLED not set — article cron disabled');
    return;
  }
  phase1Cron.start();
  phase2Cron.start();
  const day = getDaysSinceLaunch();
  const phase = day < 40 ? `Phase 1 (5/day, day ${day}/40)` : 'Phase 2 (1/weekday)';
  console.log(`[cron] Article cron started — ${phase}`);
}
