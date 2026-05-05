import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { healthRouter } from './routes/health.js';
import { articlesRouter } from './routes/articles.js';
import { sitemapRouter } from './routes/sitemap.js';
import { robotsRouter } from './routes/robots.js';
import { llmsRouter } from './routes/llms.js';
import { assessmentsRouter } from './routes/assessments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function createServer() {
  const app = express();

  // Trust proxy (DigitalOcean App Platform)
  app.set('trust proxy', 1);

  // WWW → non-www 301 redirect (runs first)
  app.use((req, res, next) => {
    const host = (req.headers.host || '').toLowerCase();
    if (host.startsWith('www.')) {
      const apex = host.slice(4);
      const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
      return res.redirect(301, `${proto}://${apex}${req.originalUrl}`);
    }
    next();
  });

  // Compression
  app.use(compression());

  // Parse JSON
  app.use(express.json());

  // Cache-control headers for AI crawlers
  app.use('/articles', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
  });

  // API Routes
  app.use('/health', healthRouter);
  app.use('/api/articles', articlesRouter);
  app.use('/api/assessments', assessmentsRouter);
  app.use('/sitemap.xml', sitemapRouter);
  app.use('/robots.txt', robotsRouter);
  app.use('/', llmsRouter);

  if (isDev) {
    // Dev: use Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, getIndexHtml());
        const { render } = await vite.ssrLoadModule('/src/client/entry-server.tsx');
        const { html: appHtml, head } = await render(url);
        const finalHtml = template
          .replace('<!--app-head-->', head || '')
          .replace('<!--app-html-->', appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production: serve built assets
    const distPath = path.resolve(__dirname, '../dist/client');
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      index: false,
    }));

    app.use('*', async (req, res, next) => {
      try {
        const { render } = await import('../dist/server/entry-server.js' as any);
        const url = req.originalUrl;
        const { html: appHtml, head } = await render(url);

        const fs = await import('fs');
        const template = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
        const finalHtml = template
          .replace('<!--app-head-->', head || '')
          .replace('<!--app-html-->', appHtml);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`[server] The Faith Wound running on port ${PORT} (${isDev ? 'dev' : 'production'})`);
  });
}

function getIndexHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--app-head-->
</head>
<body>
  <div id="root"><!--app-html--></div>
  <script type="module" src="/src/client/entry-client.tsx"></script>
</body>
</html>`;
}

createServer().catch(console.error);
