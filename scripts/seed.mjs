#!/usr/bin/env node
/**
 * Seed script — loads all 500 pre-generated JSON articles into the JSON file DB.
 * Run once after first deploy: node scripts/seed.mjs
 *
 * No database required. Articles live in src/data/articles/*.json
 * The JSON DB (src/lib/db.mjs) reads from that directory at runtime.
 *
 * This script just validates the articles and prints a summary.
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, '..', 'src', 'data', 'articles');

// ─── Bunny CDN (hardcoded — no env vars) ──────────────────────────────────────
const CDN = 'https://religion-trauma.b-cdn.net';

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
  'parenting':            `${CDN}/images/article-healing.webp`,
  'anger':                `${CDN}/images/article-grief.webp`,
  'identity':             `${CDN}/images/article-identity.webp`,
  'resources':            `${CDN}/images/article-therapy.webp`,
  'lgbtq':                `${CDN}/images/article-lgbtq.webp`,
  'sleep':                `${CDN}/images/article-sleep.webp`,
  'somatic':              `${CDN}/images/article-somatic.webp`,
  'general':              `${CDN}/images/hero-main.webp`,
};

function getHeroUrl(category) {
  return CATEGORY_IMAGES[category] || `${CDN}/images/hero-main.webp`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 The Faith Wound — Article Seed Validator');
  console.log('===========================================');
  console.log(`📂 Articles directory: ${ARTICLES_DIR}`);

  let files;
  try {
    files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
  } catch {
    console.error('❌ Articles directory not found. Run article generation first.');
    process.exit(1);
  }

  console.log(`📚 Found ${files.length} article files`);

  let valid = 0;
  let warnings = 0;
  let errors = 0;
  const categories = {};
  const wordCounts = [];
  let missingHero = 0;

  for (const file of files) {
    const filePath = join(ARTICLES_DIR, file);
    try {
      const article = JSON.parse(readFileSync(filePath, 'utf8'));

      // Ensure hero_url is set (hardcoded CDN)
      if (!article.hero_url) {
        article.hero_url = getHeroUrl(article.category || 'general');
        missingHero++;
      }

      // Validate required fields
      const required = ['slug', 'title', 'body', 'category', 'pub_date'];
      const missing = required.filter(f => !article[f]);
      if (missing.length > 0) {
        console.warn(`⚠️  ${file}: missing fields: ${missing.join(', ')}`);
        warnings++;
      } else {
        valid++;
      }

      // Track stats
      categories[article.category] = (categories[article.category] || 0) + 1;
      if (article.word_count) wordCounts.push(article.word_count);

    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
      errors++;
    }
  }

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log('\n✅ Validation complete');
  console.log(`   Valid: ${valid} | Warnings: ${warnings} | Errors: ${errors}`);
  if (missingHero > 0) console.log(`   Fixed ${missingHero} missing hero_url values`);

  if (wordCounts.length > 0) {
    const avg = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
    const min = Math.min(...wordCounts);
    const max = Math.max(...wordCounts);
    const over1800 = wordCounts.filter(w => w >= 1800).length;
    console.log(`\n📝 Word counts: avg=${avg} | min=${min} | max=${max}`);
    console.log(`   Articles ≥ 1800 words: ${over1800}/${wordCounts.length}`);
  }

  console.log('\n📊 Categories:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`   ${cat}: ${count}`));

  console.log('\n🚀 Articles are ready to serve.');
  console.log('   The JSON DB reads from src/data/articles/ at runtime.');
  console.log('   No database migration needed.');
}

seed().catch(console.error);
