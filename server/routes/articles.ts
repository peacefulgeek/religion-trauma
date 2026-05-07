import express from 'express';

export const articlesRouter = express.Router();

articlesRouter.get('/', async (req, res) => {
  try {
    const db = await import('../../src/lib/db.mjs' as any);
    const limit = Math.min(parseInt(req.query.limit as string || '20'), 100);
    const offset = parseInt(req.query.offset as string || '0');
    const category = req.query.category as string | undefined;

    const [articles, categories, total] = await Promise.all([
      db.getPublishedArticles({ limit, offset, category }),
      db.getCategories(),
      db.getTotalArticleCount(),
    ]);

    res.json({
      articles: articles.rows,
      categories: categories.rows,
      pagination: { limit, offset, total },
    });
  } catch (err: any) {
    console.error('[articles] GET / error:', err.message);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

articlesRouter.get('/:slug', async (req, res) => {
  try {
    const db = await import('../../src/lib/db.mjs' as any);
    const { rows } = await db.getArticleBySlug(req.params.slug);

    if (!rows.length) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(rows[0]);
  } catch (err: any) {
    console.error('[articles] GET /:slug error:', err.message);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});
