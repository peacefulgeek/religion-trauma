#!/usr/bin/env node
/**
 * Seed script: inserts all 30 articles into the database.
 * Run with: node scripts/seed.mjs
 *
 * Assigns Bunny CDN hero_url values by category mapping.
 * TypeScript source files are transpiled on-the-fly via tsx.
 */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Load .env ────────────────────────────────────────────────────────────────
const envPath = join(__dirname, '..', '.env');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length > 0) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  }
} catch {
  // .env not found — use existing env
}

// ─── CDN image mapping ────────────────────────────────────────────────────────
const CDN = process.env.BUNNY_CDN_URL || 'https://religion-trauma.b-cdn.net';

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

// ─── Load articles from TypeScript source via esbuild ────────────────────────
async function loadArticles() {
  const projectRoot = join(__dirname, '..');
  const outDir = join(projectRoot, 'dist', 'seed-tmp');

  // Compile seed data files with esbuild
  try {
    execSync(
      `node_modules/.bin/esbuild \
        src/data/seed-articles.ts \
        src/data/seed-articles-2.ts \
        src/data/seed-articles-3.ts \
        --bundle=false --platform=node --format=esm --outdir=dist/seed-tmp --log-level=silent`,
      { cwd: projectRoot, stdio: 'pipe' }
    );

    const [m1, m2, m3] = await Promise.all([
      import(join(outDir, 'seed-articles.js')),
      import(join(outDir, 'seed-articles-2.js')),
      import(join(outDir, 'seed-articles-3.js')),
    ]);

    const articles = [
      ...(m1.SEED_ARTICLES || []),
      ...(m2.SEED_ARTICLES_2 || []),
      ...(m3.SEED_ARTICLES_3 || []),
    ];

    console.log(`📚 Loaded ${articles.length} articles from TypeScript source`);
    return articles;
  } catch (err) {
    console.warn('⚠️  Could not compile TypeScript seed data:', err.message);
    console.log('Using fallback article data...');
    return getFallbackArticles();
  }
}

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Starting seed process...');

  const { default: pg } = await import('pg');
  const { Pool } = pg;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required. Set it in .env or as an env var.');
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    // ─── Schema ───────────────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id              SERIAL PRIMARY KEY,
        slug            TEXT UNIQUE NOT NULL,
        title           TEXT NOT NULL,
        meta_description TEXT,
        og_title        TEXT,
        og_description  TEXT,
        category        TEXT NOT NULL DEFAULT 'general',
        tags            TEXT[] DEFAULT '{}',
        body            TEXT NOT NULL DEFAULT '',
        tldr            TEXT,
        hero_url        TEXT,
        image_alt       TEXT,
        reading_time    INT DEFAULT 5,
        author          TEXT DEFAULT 'The Oracle Lover',
        cta_primary     TEXT,
        faq             JSONB DEFAULT '[]',
        status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','queued','published')),
        published_at    TIMESTAMPTZ DEFAULT NOW(),
        queued_at       TIMESTAMPTZ,
        last_refreshed_at TIMESTAMPTZ,
        asins_used      TEXT[] DEFAULT '{}',
        word_count      INT DEFAULT 0,
        opener_type     TEXT,
        conclusion_type TEXT,
        featured        BOOLEAN DEFAULT false,
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Migrations for existing tables
    await pool.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false`).catch(() => {});
    await pool.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS hero_url TEXT`).catch(() => {});
    await pool.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS og_title TEXT`).catch(() => {});
    await pool.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS og_description TEXT`).catch(() => {});

    console.log('✅ Schema ready');

    // ─── Load articles ────────────────────────────────────────────────────────
    const articles = await loadArticles();
    console.log(`📝 Seeding ${articles.length} articles...`);

    let inserted = 0;
    let skipped = 0;

    for (const article of articles) {
      try {
        const heroUrl = article.hero_url || getHeroUrl(article.category);

        await pool.query(`
          INSERT INTO articles (
            slug, title, meta_description, og_title, og_description,
            category, tags, hero_url, image_alt, reading_time, author,
            body, tldr, faq, cta_primary, word_count,
            opener_type, conclusion_type, status, featured,
            published_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16, $17, $18, $19, $20,
            NOW() - (random() * interval '90 days'), NOW()
          )
          ON CONFLICT (slug) DO UPDATE SET
            title            = EXCLUDED.title,
            meta_description = EXCLUDED.meta_description,
            hero_url         = EXCLUDED.hero_url,
            body             = EXCLUDED.body,
            tldr             = EXCLUDED.tldr,
            faq              = EXCLUDED.faq,
            updated_at       = NOW()
          RETURNING id
        `, [
          article.slug,
          article.title,
          article.meta_description || '',
          article.og_title || article.title,
          article.og_description || article.meta_description || '',
          article.category,
          article.tags || [],
          heroUrl,
          article.image_alt || article.title,
          article.reading_time || 8,
          article.author || 'The Oracle Lover',
          article.body,
          article.tldr || '',
          JSON.stringify(article.faq || []),
          article.cta_primary || '/assessments/religious-trauma-assessment',
          article.word_count || 1000,
          article.opener_type || 'standard',
          article.conclusion_type || 'standard',
          'published',
          article.featured || false,
        ]);

        inserted++;
        process.stdout.write('.');
      } catch (err) {
        console.error(`\n❌ Error inserting ${article.slug}:`, err.message);
        skipped++;
      }
    }

    console.log(`\n✅ Seed complete: ${inserted} inserted/updated, ${skipped} skipped`);

    // Mark first 5 as featured
    await pool.query(`
      UPDATE articles SET featured = true
      WHERE id IN (
        SELECT id FROM articles WHERE status = 'published'
        ORDER BY published_at DESC LIMIT 5
      )
    `);
    console.log('✅ Featured articles set');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// ─── Fallback articles ────────────────────────────────────────────────────────
function getFallbackArticles() {
  return [
    {
      slug: 'what-is-religious-trauma-syndrome',
      title: 'What Is Religious Trauma Syndrome? The Clinical Definition',
      meta_description: 'Religious Trauma Syndrome (RTS) is a real, clinically-recognized pattern of symptoms. Learn the definition, symptoms, and what the research says about recovery.',
      og_title: 'What Is Religious Trauma Syndrome?',
      og_description: 'Religious Trauma Syndrome is a real pattern of symptoms. Learn what the research says.',
      category: 'religious-trauma',
      tags: ['religious-trauma', 'clinical', 'definition'],
      image_alt: 'A person sitting alone contemplating their faith journey',
      reading_time: 9,
      author: 'The Oracle Lover',
      tldr: 'Religious Trauma Syndrome (RTS) was coined by psychologist Marlene Winell to describe the specific cluster of symptoms that emerge from harmful religious experiences.',
      body: `## What Religious Trauma Syndrome Actually Is\n\nIn 2011, psychologist and former fundamentalist Christian Marlene Winell published a series of articles introducing the term "Religious Trauma Syndrome." She was describing something she had been seeing in her clinical practice for years: a specific, recognizable pattern of psychological harm that emerged from involvement in authoritarian, high-control religious environments.\n\nReligious Trauma Syndrome is not simply the grief of losing your faith. It is a specific cluster of symptoms that emerge when a person's psychological development has been significantly constrained or damaged by religious involvement.\n\n## The Symptoms\n\nPeople with RTS often report difficulty thinking critically or independently, intrusive religious thoughts, pervasive shame and guilt, fear of divine punishment, anger, grief, depression, and social isolation.\n\n## Recovery\n\nRecovery from RTS is real and possible. It typically involves finding a trauma-informed therapist, community with others who have had similar experiences, and body-based approaches to healing.`,
      faq: [
        { question: 'Is Religious Trauma Syndrome a real diagnosis?', answer: 'RTS is not currently in the DSM, but it is a clinically recognized pattern of symptoms documented by researchers and clinicians.' },
        { question: 'Who coined the term Religious Trauma Syndrome?', answer: 'Psychologist Marlene Winell coined the term in 2011 based on her clinical work with people leaving fundamentalist religious environments.' },
      ],
      cta_primary: '/assessments/religious-trauma-assessment',
      word_count: 800,
      featured: true,
    },
  ];
}

seed().catch(console.error);
