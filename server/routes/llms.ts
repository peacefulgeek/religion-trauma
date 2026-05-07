import express from 'express';
import { buildLlmsTxt, buildLlmsFullTxt, buildAiTxt } from '../../src/lib/aeo.mjs';

export const llmsRouter = express.Router();

llmsRouter.get('/llms.txt', async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.type('text/markdown').send(await buildLlmsTxt());
});

llmsRouter.get('/llms-full.txt', async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.type('text/plain').send(await buildLlmsFullTxt());
});

llmsRouter.get('/ai.txt', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.type('text/plain').send(buildAiTxt());
});
