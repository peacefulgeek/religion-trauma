import { query } from '../lib/db.mjs';
import { generateArticle } from '../lib/deepseek-generate.mjs';
import { runQualityGate } from '../lib/article-quality-gate.mjs';

export async function refreshQuarterly() {
  console.log('[refresh-quarterly] Starting quarterly content refresh (20 articles)');

  const { rows } = await query(
    `SELECT id, slug, title, category, tags FROM articles
     WHERE status = 'published'
     AND (last_refreshed_at IS NULL OR last_refreshed_at < NOW() - INTERVAL '90 days')
     ORDER BY published_at ASC LIMIT 20`
  );

  let refreshed = 0;
  for (const article of rows) {
    try {
      const refreshed_article = await generateArticle({
        title: article.title + ' — Updated with New Research',
        category: article.category,
        tags: article.tags || [],
      });

      const gate = runQualityGate(refreshed_article.body);
      if (!gate.passed) {
        console.warn(`[refresh-quarterly] ${article.slug} failed gate, keeping original`);
        await query(`UPDATE articles SET last_refreshed_at = NOW() WHERE id = $1`, [article.id]);
        continue;
      }

      await query(
        `UPDATE articles SET body = $2, last_refreshed_at = NOW(), updated_at = NOW() WHERE id = $1`,
        [article.id, refreshed_article.body]
      );
      refreshed++;
      console.log(`[refresh-quarterly] Refreshed: ${article.slug}`);
    } catch (err) {
      console.error(`[refresh-quarterly] Error refreshing ${article.slug}:`, err.message);
    }
  }

  console.log(`[refresh-quarterly] Complete. Refreshed ${refreshed}/${rows.length} articles`);
  return { refreshed, total: rows.length };
}
