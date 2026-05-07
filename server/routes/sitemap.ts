import express from 'express';

export const sitemapRouter = express.Router();

sitemapRouter.get('/', async (req, res) => {
  try {
    const host = (req.headers.host || 'religiontrauma.com').replace(/^www\./, '');
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
    const base = `${proto}://${host}`;

    const db = await import('../../src/lib/db.mjs' as any);
    const articles = await db.getAllArticlesForSitemap();

    const staticPages = [
      { url: '/',           priority: '1.0', changefreq: 'daily'   },
      { url: '/articles',   priority: '0.9', changefreq: 'daily'   },
      { url: '/about',      priority: '0.7', changefreq: 'monthly' },
      { url: '/tools',      priority: '0.8', changefreq: 'weekly'  },
      { url: '/supplements',priority: '0.8', changefreq: 'weekly'  },
      { url: '/privacy',    priority: '0.3', changefreq: 'yearly'  },
      { url: '/assessments',priority: '0.9', changefreq: 'monthly' },
      { url: '/assessments/religious-trauma-assessment',  priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/deconstruction-stage-finder',  priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/post-faith-identity-quiz',     priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/spiritual-abuse-screening',    priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/purity-culture-impact',        priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/faith-grief-inventory',        priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/identity-after-faith',         priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/community-loss-scale',         priority: '0.8', changefreq: 'monthly' },
      { url: '/assessments/body-shame-inventory',         priority: '0.8', changefreq: 'monthly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${base}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    for (const article of articles) {
      const lastmod = (article.updated_at || new Date()).toString().slice(0, 10);
      const heroUrl = article.hero_url || '';
      const imageAlt = (article.image_alt || article.slug || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

      xml += `
  <url>
    <loc>${base}/articles/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${heroUrl ? `
    <image:image>
      <image:loc>${heroUrl}</image:loc>
      <image:caption>${imageAlt}</image:caption>
    </image:image>` : ''}
  </url>`;
    }

    xml += `\n</urlset>`;

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.type('application/xml').send(xml);
  } catch (err: any) {
    console.error('[sitemap] error:', err.message);
    res.status(500).send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});
