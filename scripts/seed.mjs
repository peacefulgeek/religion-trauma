#!/usr/bin/env node
/**
 * Seed script — loads all 500 pre-generated JSON articles into data/articles.json.
 * Run once after first deploy: node scripts/seed.mjs
 *
 * No database required. Reads from src/data/articles/*.json
 * Writes to <cwd>/data/articles.json (same path db.mjs reads from)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, '..', 'src', 'data', 'articles');
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');
const OUT_FILE = join(DATA_DIR, 'articles.json');

// ─── Bunny CDN image pool ─────────────────────────────────────────────────────
const CDN = 'https://religion-trauma.b-cdn.net';
const IMAGE_POOL = [
  `${CDN}/images/hero-main.webp`,
  `${CDN}/images/article-rts.webp`,
  `${CDN}/images/article-deconstruction.webp`,
  `${CDN}/images/article-healing.webp`,
  `${CDN}/images/article-community.webp`,
  `${CDN}/images/article-identity.webp`,
  `${CDN}/images/article-therapy.webp`,
  `${CDN}/images/article-shame.webp`,
  `${CDN}/images/article-lgbtq.webp`,
  `${CDN}/images/article-sleep.webp`,
  `${CDN}/images/article-somatic.webp`,
  `${CDN}/images/article-trust.webp`,
  `${CDN}/images/article-grief.webp`,
  `${CDN}/images/article-forgiveness.webp`,
  `${CDN}/images/article-childhood.webp`,
  `${CDN}/images/article-freedom.webp`,
  `${CDN}/images/article-meditation.webp`,
  `${CDN}/images/article-writing.webp`,
  `${CDN}/images/article-family.webp`,
  `${CDN}/images/article-anger.webp`,
  `${CDN}/images/article-body.webp`,
  `${CDN}/images/article-nature.webp`,
  `${CDN}/images/article-books.webp`,
];

const CATEGORY_IMAGES = {
  'religious-trauma':     `${CDN}/images/article-rts.webp`,
  'deconstruction':       `${CDN}/images/article-deconstruction.webp`,
  'purity-culture':       `${CDN}/images/article-shame.webp`,
  'leaving-church':       `${CDN}/images/article-community.webp`,
  'high-control-groups':  `${CDN}/images/article-rts.webp`,
  'relationships':        `${CDN}/images/article-trust.webp`,
  'body-healing':         `${CDN}/images/article-somatic.webp`,
  'ocd-scrupulosity':     `${CDN}/images/article-therapy.webp`,
  'trauma-healing':       `${CDN}/images/article-healing.webp`,
  'therapy':              `${CDN}/images/article-therapy.webp`,
  'grief':                `${CDN}/images/article-grief.webp`,
  'secular-community':    `${CDN}/images/article-community.webp`,
  'secular-spirituality': `${CDN}/images/article-identity.webp`,
  'atheism-agnosticism':  `${CDN}/images/article-identity.webp`,
  'parenting':            `${CDN}/images/article-family.webp`,
  'anger':                `${CDN}/images/article-anger.webp`,
  'identity':             `${CDN}/images/article-identity.webp`,
  'resources':            `${CDN}/images/article-books.webp`,
  'lgbtq':                `${CDN}/images/article-lgbtq.webp`,
  'sleep':                `${CDN}/images/article-sleep.webp`,
  'somatic':              `${CDN}/images/article-somatic.webp`,
  'forgiveness':          `${CDN}/images/article-forgiveness.webp`,
  'childhood':            `${CDN}/images/article-childhood.webp`,
  'freedom':              `${CDN}/images/article-freedom.webp`,
  'meditation':           `${CDN}/images/article-meditation.webp`,
  'writing':              `${CDN}/images/article-writing.webp`,
  'nature':               `${CDN}/images/article-nature.webp`,
  'general':              `${CDN}/images/hero-main.webp`,
};

function getHeroUrl(article, index) {
  if (article.hero_url && article.hero_url.includes('b-cdn.net')) return article.hero_url;
  if (article.category && CATEGORY_IMAGES[article.category]) return CATEGORY_IMAGES[article.category];
  return IMAGE_POOL[index % IMAGE_POOL.length];
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`[seed] The Faith Wound — Seed Script`);
console.log(`[seed] Reading from: ${ARTICLES_DIR}`);
console.log(`[seed] Writing to:   ${OUT_FILE}`);

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
  console.log(`[seed] Created: ${DATA_DIR}`);
}

let files;
try {
  files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json')).sort();
} catch {
  console.error(`[seed] ❌ Articles directory not found: ${ARTICLES_DIR}`);
  process.exit(1);
}

console.log(`[seed] Found ${files.length} article files`);

const articles = [];
let errors = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  try {
    const raw = JSON.parse(readFileSync(join(ARTICLES_DIR, file), 'utf8'));
    const pubDate = raw.publishedAt || raw.published_at || raw.pub_date || new Date().toISOString().slice(0, 10);
    articles.push({
      id: i + 1,
      slug: raw.slug,
      title: raw.title,
      category: raw.category || 'general',
      tags: raw.tags || [],
      excerpt: raw.excerpt || (raw.tldr && raw.tldr[0]) || '',
      body: raw.body || '',
      tldr: raw.tldr || [],
      faqs: raw.faqs || [],
      hero_url: getHeroUrl(raw, i),
      image_alt: raw.image_alt || raw.title,
      word_count: raw.word_count || 0,
      read_time: raw.read_time || Math.ceil((raw.word_count || 1800) / 200),
      status: raw.status || 'published',
      publishedAt: pubDate,
      published_at: pubDate,
      updated_at: raw.updated_at || new Date().toISOString(),
      dateModified: raw.dateModified || pubDate,
      featured: raw.featured || false,
      view_count: raw.view_count || 0,
      last_refreshed_at: raw.last_refreshed_at || null,
      meta_title: raw.meta_title || raw.title,
      meta_description: raw.meta_description || raw.excerpt || '',
    });
  } catch (e) {
    console.error(`[seed] ❌ Error reading ${file}: ${e.message}`);
    errors++;
  }
}

// Sort by publishedAt ascending
articles.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

writeFileSync(OUT_FILE, JSON.stringify(articles, null, 2), 'utf8');

const today = new Date().toISOString().slice(0, 10);
const published = articles.filter(a => a.status === 'published' && a.publishedAt <= today).length;
const queued = articles.filter(a => a.publishedAt > today).length;
const wordCounts = articles.map(a => a.word_count).filter(Boolean);
const avgWords = wordCounts.length ? Math.round(wordCounts.reduce((s, w) => s + w, 0) / wordCounts.length) : 0;
const under1800 = wordCounts.filter(w => w < 1800).length;

console.log(`\n[seed] ✅ Done!`);
console.log(`  Total articles:   ${articles.length}`);
console.log(`  Published today:  ${published}`);
console.log(`  Queued (future):  ${queued}`);
console.log(`  Avg word count:   ${avgWords}`);
console.log(`  Under 1800 words: ${under1800}`);
console.log(`  Errors:           ${errors}`);
console.log(`  Output:           ${OUT_FILE}`);
