import express from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

export const healthRouter = express.Router();

healthRouter.get('/', (req, res) => {
  try {
    // Count articles in JSON file DB
    const articlesDir = join(process.cwd(), 'src', 'data', 'articles');
    let articleCount = 0;
    try {
      articleCount = readdirSync(articlesDir).filter(f => f.endsWith('.json')).length;
    } catch {
      // articles dir not accessible in some deploy configs — non-fatal
    }

    res.json({
      status: 'ok',
      site: 'religion-trauma',
      url: 'https://religiontrauma.com',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      env: process.env.NODE_ENV || 'development',
      articles: articleCount,
      db: 'json-files',
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});
