/**
 * JSON File Database — zero external dependencies.
 * All data lives in data/articles.json and data/assessments.json
 * on the server filesystem. No Postgres. No MySQL. No TiDB.
 *
 * Thread-safety note: Node.js is single-threaded, so synchronous
 * reads + atomic writes are safe for this workload.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Data directory: <project-root>/data/
const DATA_DIR = join(__dirname, '..', '..', 'data');

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

// ─── Generic JSON helpers ─────────────────────────────────────────────────────

function readJSON(file) {
  ensureDataDir();
  const path = join(DATA_DIR, file);
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  ensureDataDir();
  const path = join(DATA_DIR, file);
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Schema init (no-op for JSON — just ensures files exist) ─────────────────

export async function initSchema() {
  ensureDataDir();
  if (!existsSync(join(DATA_DIR, 'articles.json'))) {
    writeJSON('articles.json', []);
  }
  if (!existsSync(join(DATA_DIR, 'assessments.json'))) {
    writeJSON('assessments.json', []);
  }
  console.log('[db] JSON data layer ready — data dir:', DATA_DIR);
}

// ─── Article helpers ──────────────────────────────────────────────────────────

function nextId(arr) {
  return arr.length === 0 ? 1 : Math.max(...arr.map(a => a.id || 0)) + 1;
}

export async function upsertArticle(article) {
  const articles = readJSON('articles.json');
  const today = new Date().toISOString().slice(0, 10);
  const existing = articles.findIndex(a => a.slug === article.slug);

  if (existing >= 0) {
    articles[existing] = {
      ...articles[existing],
      ...article,
      updated_at: new Date().toISOString(),
      dateModified: today,
    };
  } else {
    articles.push({
      id: nextId(articles),
      ...article,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      dateModified: today,
    });
  }
  writeJSON('articles.json', articles);
  return article.slug;
}

export async function getPublishedArticles({ limit = 20, offset = 0, category } = {}) {
  const today = new Date().toISOString().slice(0, 10);
  let articles = readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today)
    .sort((a, b) => new Date(b.published_at || b.publishedAt || 0) - new Date(a.published_at || a.publishedAt || 0));

  if (category) {
    articles = articles.filter(a => a.category === category);
  }
  return { rows: articles.slice(offset, offset + limit) };
}

export async function getArticleBySlug(slug) {
  const today = new Date().toISOString().slice(0, 10);
  const articles = readJSON('articles.json');
  const article = articles.find(
    a => a.slug === slug &&
         a.status === 'published' &&
         (!a.publishedAt || a.publishedAt <= today)
  );
  return { rows: article ? [article] : [] };
}

export async function getCategories() {
  const today = new Date().toISOString().slice(0, 10);
  const articles = readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today);

  const counts = {};
  for (const a of articles) {
    counts[a.category] = (counts[a.category] || 0) + 1;
  }
  return {
    rows: Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }))
  };
}

export async function getPopularArticles(limit = 5) {
  const today = new Date().toISOString().slice(0, 10);
  const articles = readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today)
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, limit);
  return { rows: articles };
}

export async function getRecentArticles(limit = 5) {
  const today = new Date().toISOString().slice(0, 10);
  const articles = readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today)
    .sort((a, b) => new Date(b.published_at || b.publishedAt || 0) - new Date(a.published_at || a.publishedAt || 0))
    .slice(0, limit);
  return { rows: articles };
}

export async function getAllArticlesForSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  return readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today)
    .map(a => ({
      slug: a.slug,
      updated_at: a.updated_at || a.published_at,
      hero_url: a.hero_url,
      image_alt: a.image_alt || a.title,
    }));
}

export async function getTotalArticleCount() {
  const today = new Date().toISOString().slice(0, 10);
  return readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today)
    .length;
}

export async function getQueuedArticles(limit = 1) {
  const today = new Date().toISOString().slice(0, 10);
  return readJSON('articles.json')
    .filter(a => a.status === 'queued' || (a.status === 'published' && a.publishedAt > today))
    .sort((a, b) => new Date(a.publishedAt || a.published_at) - new Date(b.publishedAt || b.published_at))
    .slice(0, limit);
}

export async function getArticlesForRefresh(olderThanDays = 30, limit = 25) {
  const cutoff = new Date(Date.now() - olderThanDays * 86400000).toISOString();
  const today = new Date().toISOString().slice(0, 10);
  return readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today)
    .filter(a => !a.last_refreshed_at || a.last_refreshed_at < cutoff)
    .sort((a, b) => new Date(a.published_at || 0) - new Date(b.published_at || 0))
    .slice(0, limit);
}

export async function updateArticleBody(slug, body) {
  const articles = readJSON('articles.json');
  const today = new Date().toISOString().slice(0, 10);
  const idx = articles.findIndex(a => a.slug === slug);
  if (idx >= 0) {
    articles[idx].body = body;
    articles[idx].last_refreshed_at = new Date().toISOString();
    articles[idx].updated_at = new Date().toISOString();
    articles[idx].dateModified = today;
    writeJSON('articles.json', articles);
  }
}

export async function getPublishedSlugs() {
  const today = new Date().toISOString().slice(0, 10);
  return readJSON('articles.json')
    .filter(a => a.status === 'published')
    .filter(a => !a.publishedAt || a.publishedAt <= today)
    .map(a => a.slug);
}

// Legacy compat — used by old routes
export async function query(text, params) {
  console.warn('[db] Legacy query() called — migrate to named helpers:', text.slice(0, 60));
  return { rows: [] };
}

// ─── Assessment helpers ───────────────────────────────────────────────────────

export async function getAssessments() {
  return { rows: readJSON('assessments.json') };
}

export async function getAssessmentBySlug(slug) {
  const assessments = readJSON('assessments.json');
  const a = assessments.find(a => a.slug === slug);
  return { rows: a ? [a] : [] };
}

export async function upsertAssessment(assessment) {
  const assessments = readJSON('assessments.json');
  const existing = assessments.findIndex(a => a.slug === assessment.slug);
  if (existing >= 0) {
    assessments[existing] = { ...assessments[existing], ...assessment };
  } else {
    assessments.push({ id: nextId(assessments), ...assessment });
  }
  writeJSON('assessments.json', assessments);
}
