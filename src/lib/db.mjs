import pg from 'pg';

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    pool.on('error', (err) => {
      console.error('[db] Unexpected pool error:', err);
    });
  }
  return pool;
}

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await getPool().query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`[db] Slow query (${duration}ms):`, text.slice(0, 80));
    }
    return res;
  } catch (err) {
    console.error('[db] Query error:', err.message, '\nQuery:', text.slice(0, 120));
    throw err;
  }
}

export async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS articles (
      id              SERIAL PRIMARY KEY,
      slug            TEXT UNIQUE NOT NULL,
      title           TEXT NOT NULL,
      meta_description TEXT,
      og_title        TEXT,
      og_description  TEXT,
      category        TEXT NOT NULL DEFAULT 'general',
      tags            TEXT[] DEFAULT '{}',
      body            TEXT NOT NULL,
      tldr            TEXT,
      hero_url        TEXT,
      image_alt       TEXT,
      reading_time    INT DEFAULT 5,
      author          TEXT DEFAULT 'The Oracle Lover',
      cta_primary     TEXT,
      faq             JSONB DEFAULT '[]',
      status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','queued','published')),
      published_at    TIMESTAMPTZ,
      queued_at       TIMESTAMPTZ,
      last_refreshed_at TIMESTAMPTZ,
      asins_used      TEXT[] DEFAULT '{}',
      word_count      INT DEFAULT 0,
      opener_type     TEXT,
      conclusion_type TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS assessments (
      id          SERIAL PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      questions   JSONB NOT NULL DEFAULT '[]',
      results     JSONB NOT NULL DEFAULT '[]',
      status      TEXT DEFAULT 'published',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS assessment_responses (
      id            SERIAL PRIMARY KEY,
      assessment_id INT REFERENCES assessments(id),
      answers       JSONB NOT NULL,
      result_key    TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  console.log('[db] Schema initialized');
}

export async function getPublishedArticles({ limit = 20, offset = 0, category } = {}) {
  let q = `SELECT id, slug, title, meta_description, category, tags, hero_url, image_alt, reading_time, author, published_at, word_count
           FROM articles WHERE status = 'published'`;
  const params = [];
  if (category) {
    params.push(category);
    q += ` AND category = $${params.length}`;
  }
  q += ` ORDER BY published_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);
  return query(q, params);
}

export async function getArticleBySlug(slug) {
  return query(`SELECT * FROM articles WHERE slug = $1 AND status = 'published'`, [slug]);
}

export async function getCategories() {
  return query(`
    SELECT category, COUNT(*) as count
    FROM articles WHERE status = 'published'
    GROUP BY category ORDER BY count DESC
  `);
}

export async function getPopularArticles(limit = 5) {
  return query(`
    SELECT id, slug, title, hero_url, reading_time, published_at
    FROM articles WHERE status = 'published'
    ORDER BY published_at DESC LIMIT $1
  `, [limit]);
}

export async function getRecentArticles(limit = 5) {
  return query(`
    SELECT id, slug, title, hero_url, reading_time, published_at
    FROM articles WHERE status = 'published'
    ORDER BY published_at DESC LIMIT $1
  `, [limit]);
}
