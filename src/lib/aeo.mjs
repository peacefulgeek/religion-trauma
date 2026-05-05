const SITE_NAME = 'The Faith Wound';
const SITE_DESCRIPTION = 'For everyone who left a faith tradition and is sorting out what was real, what was harmful, and who they are now that the framework is gone.';
const AUTHOR_NAME = 'The Oracle Lover';
const AUTHOR_URL = 'https://theoraclelover.com';

/**
 * Build canonical URL — always apex, never www
 */
export function buildCanonical(req, path) {
  const host = (req?.headers?.host || 'thefaithwound.com').replace(/^www\./, '');
  const proto = (req?.headers?.['x-forwarded-proto']) || 'https';
  const cleanPath = path || req?.path || '/';
  return `${proto}://${host}${cleanPath}`;
}

/**
 * Build robots.txt
 */
export function buildRobotsTxt(req) {
  const host = (req?.headers?.host || 'thefaithwound.com').replace(/^www\./, '');
  const proto = (req?.headers?.['x-forwarded-proto']) || 'https';
  return `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

Disallow: /api/
Disallow: /health

Sitemap: ${proto}://${host}/sitemap.xml
`;
}

/**
 * Build /llms.txt — AI-readable site index
 */
export async function buildLlmsTxt() {
  let content = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## About

${SITE_NAME} is a resource hub for people navigating religious trauma, faith deconstruction, and life after leaving a faith tradition. Written by ${AUTHOR_NAME} — an intuitive educator and oracle guide.

Author: ${AUTHOR_NAME}
Author site: ${AUTHOR_URL}

## Articles

`;

  try {
    const { query } = await import('./db.mjs');
    const { rows } = await query(
      `SELECT slug, title, meta_description FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 100`
    );
    for (const a of rows) {
      content += `- [${a.title}](/articles/${a.slug}): ${a.meta_description || ''}\n`;
    }
  } catch (e) {
    content += '(Articles loading...)\n';
  }

  content += `\n## Assessments\n\n`;
  content += `- [Religious Trauma Assessment](/assessments/religious-trauma-assessment): Identify signs of religious trauma\n`;
  content += `- [Deconstruction Stage Finder](/assessments/deconstruction-stage-finder): Where are you in your faith transition?\n`;
  content += `- [Post-Faith Identity Quiz](/assessments/post-faith-identity-quiz): Who are you now that the framework is gone?\n`;

  return content;
}

/**
 * Build /llms-full.txt — complete article text for AI indexing
 */
export async function buildLlmsFullTxt() {
  let content = `# ${SITE_NAME} — Full Content Index\n\n`;

  try {
    const { query } = await import('./db.mjs');
    const { rows } = await query(
      `SELECT slug, title, body, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 50`
    );
    for (const a of rows) {
      const stripped = a.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      content += `## ${a.title}\nURL: /articles/${a.slug}\nDate: ${a.published_at}\n\n${stripped.slice(0, 3000)}\n\n---\n\n`;
    }
  } catch (e) {
    content += '(Content loading...)\n';
  }

  return content;
}

export { SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_URL };
