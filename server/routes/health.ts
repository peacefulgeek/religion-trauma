import express from 'express';

export const healthRouter = express.Router();

healthRouter.get('/', async (req, res) => {
  try {
    // Try DB ping if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      const { query } = await import('../../src/lib/db.mjs');
      await query('SELECT 1');
    }
    res.json({
      status: 'ok',
      site: 'the-faith-wound',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: process.env.NODE_ENV,
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});
