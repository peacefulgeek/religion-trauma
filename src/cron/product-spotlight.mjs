import { query } from '../lib/db.mjs';
import { generateArticle } from '../lib/deepseek-generate.mjs';
import { runQualityGate } from '../lib/article-quality-gate.mjs';
import { assignHeroImage } from '../lib/bunny.mjs';

export async function generateProductSpotlight() {
  console.log('[product-spotlight] Starting Saturday product spotlight generation');

  const topic = {
    title: 'Faith Transition Library: Books That Actually Help',
    category: 'resources',
    tags: ['books', 'resources', 'faith-transition', 'recovery', 'recommended'],
  };

  try {
    const article = await generateArticle({ ...topic });
    const gate = runQualityGate(article.body);

    if (!gate.passed) {
      console.warn('[product-spotlight] Quality gate failed:', gate.failures);
      return { stored: false, reason: 'quality-gate-failed' };
    }

    const slug = `faith-transition-library-${new Date().toISOString().slice(0, 7)}`;
    const heroUrl = await assignHeroImage(slug);

    await query(
      `INSERT INTO articles (slug, title, meta_description, category, tags, body, hero_url, status, published_at, word_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'published',NOW(),$8)
       ON CONFLICT (slug) DO NOTHING`,
      [slug, article.title, article.metaDescription, topic.category, topic.tags, article.body, heroUrl, article.wordCount || 1500]
    );

    return { stored: true, slug };
  } catch (err) {
    console.error('[product-spotlight] Error:', err.message);
    return { stored: false, error: err.message };
  }
}
