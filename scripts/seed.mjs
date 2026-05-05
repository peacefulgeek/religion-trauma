#!/usr/bin/env node
/**
 * Seed script: inserts all 30 articles into the database.
 * Run with: node scripts/seed.mjs
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
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
  // .env not found, use existing env
}

// Import all articles
async function loadArticles() {
  // We'll use dynamic import with a transpiler or just inline the data
  // For simplicity, we'll use a JSON approach
  const articles = [];
  
  // Article 1-10 from seed-articles.ts (compiled)
  // We'll use the compiled JS if available, otherwise use inline data
  try {
    const { SEED_ARTICLES } = await import('../dist/data/seed-articles.js').catch(() => 
      import('../src/data/seed-articles-compiled.mjs')
    );
    articles.push(...SEED_ARTICLES);
  } catch {
    console.log('Using inline article data...');
  }
  
  return articles;
}

// Database connection
async function getDb() {
  const { default: pg } = await import('pg');
  const { Pool } = pg;
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  return new Pool({ connectionString });
}

async function seed() {
  console.log('🌱 Starting seed process...');
  
  let pool;
  try {
    pool = await getDb();
    
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connected');
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        meta_description TEXT,
        og_title TEXT,
        og_description TEXT,
        category VARCHAR(100) NOT NULL,
        tags TEXT[],
        hero_url TEXT,
        image_alt TEXT,
        reading_time INTEGER DEFAULT 8,
        published_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_refreshed_at TIMESTAMP,
        author VARCHAR(255) DEFAULT 'The Oracle Lover',
        body TEXT NOT NULL,
        tldr TEXT,
        faq JSONB DEFAULT '[]',
        cta_primary VARCHAR(500),
        word_count INTEGER,
        opener_type VARCHAR(50),
        conclusion_type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'published',
        featured BOOLEAN DEFAULT false,
        view_count INTEGER DEFAULT 0
      )
    `);
    
    console.log('✅ Articles table ready');
    
    // Load articles from JSON file if it exists
    let articles = [];
    try {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      const data = readFileSync(join(__dirname, '..', 'src', 'data', 'articles.json'), 'utf8');
      articles = JSON.parse(data);
    } catch {
      console.log('No articles.json found, using hardcoded seed data...');
      articles = getHardcodedArticles();
    }
    
    console.log(`📝 Seeding ${articles.length} articles...`);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const article of articles) {
      try {
        const result = await pool.query(`
          INSERT INTO articles (
            slug, title, meta_description, og_title, og_description,
            category, tags, image_alt, reading_time, author,
            body, tldr, faq, cta_primary, word_count,
            opener_type, conclusion_type, status, featured,
            published_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            meta_description = EXCLUDED.meta_description,
            body = EXCLUDED.body,
            tldr = EXCLUDED.tldr,
            faq = EXCLUDED.faq,
            updated_at = NOW()
          RETURNING id
        `, [
          article.slug,
          article.title,
          article.meta_description || '',
          article.og_title || article.title,
          article.og_description || article.meta_description || '',
          article.category,
          article.tags || [],
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
        
        if (result.rows[0]) {
          inserted++;
          process.stdout.write('.');
        }
      } catch (err) {
        console.error(`\n❌ Error inserting ${article.slug}:`, err.message);
        skipped++;
      }
    }
    
    console.log(`\n✅ Seed complete: ${inserted} articles inserted/updated, ${skipped} skipped`);
    
    // Mark first 5 as featured
    await pool.query(`
      UPDATE articles SET featured = true 
      WHERE id IN (SELECT id FROM articles ORDER BY published_at DESC LIMIT 5)
    `);
    
    console.log('✅ Featured articles set');
    
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    if (pool) await pool.end();
  }
}

function getHardcodedArticles() {
  // Minimal fallback - just a few articles to verify the system works
  return [
    {
      slug: 'what-is-religious-trauma-syndrome',
      title: 'What Is Religious Trauma Syndrome? The Clinical Definition',
      meta_description: 'Religious Trauma Syndrome (RTS) is a real, clinically-recognized pattern of symptoms.',
      category: 'religious-trauma',
      tags: ['religious-trauma', 'clinical', 'definition'],
      reading_time: 9,
      author: 'The Oracle Lover',
      tldr: 'Religious Trauma Syndrome was coined by psychologist Marlene Winell to describe the specific cluster of symptoms that emerge from harmful religious experiences.',
      body: `## What Religious Trauma Syndrome Actually Is\n\nIn 2011, psychologist and former fundamentalist Christian Marlene Winell published a series of articles introducing the term "Religious Trauma Syndrome." She was describing something she had been seeing in her clinical practice for years: a specific, recognizable pattern of psychological harm that emerged from involvement in authoritarian, high-control religious environments.\n\nReligious Trauma Syndrome is not simply the grief of losing your faith. It is a specific cluster of symptoms that emerge when a person's psychological development has been significantly constrained or damaged by religious involvement.\n\n## The Symptoms\n\nPeople with RTS often report difficulty thinking critically or independently, intrusive religious thoughts, pervasive shame and guilt, fear of divine punishment, anger, grief, depression, and social isolation.\n\n## Recovery\n\nRecovery from RTS is real and possible. It typically involves finding a trauma-informed therapist, community with others who have had similar experiences, and body-based approaches to healing.`,
      faq: [
        { question: 'Is Religious Trauma Syndrome a real diagnosis?', answer: 'RTS is not currently in the DSM, but it is a clinically recognized pattern of symptoms.' }
      ],
      cta_primary: '/assessments/religious-trauma-assessment',
      word_count: 800,
      featured: true,
    },
  ];
}

seed().catch(console.error);
