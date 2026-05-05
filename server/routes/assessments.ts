import express from 'express';

export const assessmentsRouter = express.Router();

assessmentsRouter.get('/', async (req, res) => {
  try {
    const { query } = await import('../../src/lib/db.mjs');
    const { rows } = await query(
      `SELECT id, slug, title, description, status FROM assessments WHERE status = 'published' ORDER BY id`
    );
    res.json({ assessments: rows });
  } catch (err: any) {
    console.error('[assessments] GET / error:', err.message);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

assessmentsRouter.get('/:slug', async (req, res) => {
  try {
    const { query } = await import('../../src/lib/db.mjs');
    const { rows } = await query(
      `SELECT * FROM assessments WHERE slug = $1 AND status = 'published'`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Assessment not found' });
    res.json(rows[0]);
  } catch (err: any) {
    console.error('[assessments] GET /:slug error:', err.message);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

assessmentsRouter.post('/:id/respond', async (req, res) => {
  try {
    const { query } = await import('../../src/lib/db.mjs');
    const { answers, result_key } = req.body;
    await query(
      `INSERT INTO assessment_responses (assessment_id, answers, result_key) VALUES ($1, $2, $3)`,
      [req.params.id, JSON.stringify(answers), result_key]
    );
    res.json({ success: true });
  } catch (err: any) {
    console.error('[assessments] POST /:id/respond error:', err.message);
    res.status(500).json({ error: 'Failed to save response' });
  }
});
