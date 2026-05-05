import { query } from '../lib/db.mjs';
import { generateArticle } from '../lib/deepseek-generate.mjs';
import { runQualityGate } from '../lib/article-quality-gate.mjs';

export async function refreshMonthly() {
  console.log('[refresh-monthly] Starting monthly content refresh (25 articles)');

  const { rows } = await query(
    `SELECT id, slug, title, category, tags FROM articles
     WHERE status = 'published'
     AND (last_refreshed_at IS NULL OR last_refreshed_at < NOW() - INTERVAL '30 days')
     ORDER BY published_at ASC LIMIT 25`
  );

  let refreshed = 0;
  for (const article of rows) {
    try {
      const refreshed_article = await generateArticle({
        title: article.title,
        category: article.category,
        tags: article.tags || [],
      });

      const gate = runQualityGate(refreshed_article.body);
      if (!gate.passed) {
        console.warn(`[refresh-monthly] ${article.slug} failed gate, keeping original`);
        await query(`UPDATE articles SET last_refreshed_at = NOW() WHERE id = $1`, [article.id]);
        continue;
      }

      await query(
        `UPDATE articles SET body = $2, last_refreshed_at = NOW(), updated_at = NOW() WHERE id = $1`,
        [article.id, refreshed_article.body]
      );
      refreshed++;
      console.log(`[refresh-monthly] Refreshed: ${article.slug}`);
    } catch (err) {
      console.error(`[refresh-monthly] Error refreshing ${article.slug}:`, err.message);
    }
  }

  console.log(`[refresh-monthly] Complete. Refreshed ${refreshed}/${rows.length} articles`);
  return { refreshed, total: rows.length };
}
