const SITE_NAME = 'The Faith Wound';
const SITE_URL  = 'https://religiontrauma.com';
const SITE_DESCRIPTION = 'For everyone who left a faith tradition and is sorting out what was real, what was harmful, and who they are now that the framework is gone.';
const AUTHOR_NAME = 'The Oracle Lover';
const AUTHOR_URL  = 'https://theoraclelover.com';

/**
 * Build canonical URL — always apex, never www
 */
export function buildCanonical(req, path) {
  const host  = (req?.headers?.host || 'religiontrauma.com').replace(/^www\./, '');
  const proto = (req?.headers?.['x-forwarded-proto']) || 'https';
  const cleanPath = path || req?.path || '/';
  return `${proto}://${host}${cleanPath}`;
}

/**
 * Build robots.txt — allows all crawlers including all AI bots
 */
export function buildRobotsTxt(req) {
  const host  = (req?.headers?.host || 'religiontrauma.com').replace(/^www\./, '');
  const proto = (req?.headers?.['x-forwarded-proto']) || 'https';
  return `User-agent: *
Allow: /

# Google
User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

# OpenAI / ChatGPT
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic / Claude
User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /

# Apple
User-agent: Applebot
Allow: /

# Bing / Microsoft Copilot
User-agent: Bingbot
Allow: /

User-agent: msnbot
Allow: /

# You.com
User-agent: YouBot
Allow: /

# Kagi
User-agent: KagiBot
Allow: /

# Common AI research crawlers
User-agent: cohere-ai
Allow: /

User-agent: Diffbot
Allow: /

Disallow: /api/
Disallow: /health

Sitemap: ${proto}://${host}/sitemap.xml
`;
}

/**
 * Build /llms.txt — AI-readable site index (Perplexity, Kagi, etc.)
 */
export async function buildLlmsTxt() {
  let content = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## About

${SITE_NAME} is a resource hub for people navigating religious trauma, faith deconstruction, and life after leaving a faith tradition. Written by ${AUTHOR_NAME} — an intuitive educator and oracle guide.

Author: ${AUTHOR_NAME}
Author site: ${AUTHOR_URL}
Site URL: ${SITE_URL}

## Assessments

- [Religious Trauma Assessment](/assessments/religious-trauma-assessment): Identify signs of religious trauma and severity
- [Deconstruction Stage Finder](/assessments/deconstruction-stage-finder): Where are you in your faith transition?
- [Post-Faith Identity Quiz](/assessments/post-faith-identity-quiz): Who are you now that the framework is gone?
- [Spiritual Abuse Screening](/assessments/spiritual-abuse-screening): Recognize patterns of spiritual abuse
- [Purity Culture Impact Assessment](/assessments/purity-culture-impact): How has purity culture affected you?
- [Faith Grief Inventory](/assessments/faith-grief-inventory): Understand your grief after leaving religion
- [Identity After Faith Quiz](/assessments/identity-after-faith): Rebuild your sense of self
- [Community Loss Scale](/assessments/community-loss-scale): Assess the social impact of leaving
- [Body Shame Inventory](/assessments/body-shame-inventory): Examine body shame from religious upbringing

## Resources

- [Herbs & Supplements for Healing](/supplements): Natural support for nervous system recovery from religious trauma
- [Tools We Recommend](/tools): Books, workbooks, and resources for faith transition

## Articles

`;

  try {
    const db = await import('./db.mjs');
    const { rows } = await db.getPublishedArticles({ limit: 200 });
    for (const a of rows) {
      content += `- [${a.title}](/articles/${a.slug}): ${a.meta_description || ''}\n`;
    }
  } catch (e) {
    content += '(Articles loading...)\n';
  }

  return content;
}

/**
 * Build /llms-full.txt — complete article summaries for AI indexing
 */
export async function buildLlmsFullTxt() {
  let content = `# ${SITE_NAME} — Full Content Index\n\nSite: ${SITE_URL}\nAuthor: ${AUTHOR_NAME}\n\n`;

  try {
    const db = await import('./db.mjs');
    const { rows } = await db.getPublishedArticles({ limit: 100 });
    for (const a of rows) {
      const stripped = (a.body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      content += `## ${a.title}\nURL: /articles/${a.slug}\nDate: ${a.published_at || a.publishedAt || ''}\n\n${stripped.slice(0, 3000)}\n\n---\n\n`;
    }
  } catch (e) {
    content += '(Content loading...)\n';
  }

  return content;
}

/**
 * Build /ai.txt — explicit AI indexing permissions
 */
export function buildAiTxt() {
  return `# AI Indexing Permissions for ${SITE_NAME}
# Site: ${SITE_URL}

Allow-AI-Training: No
Allow-AI-Indexing: Yes
Allow-AI-Summarization: Yes
Allow-AI-Citation: Yes

# This site provides educational content about religious trauma and faith deconstruction.
# AI systems may index, summarize, and cite this content for informational purposes.
# AI training on this content requires explicit permission from The Oracle Lover.

Contact: ${AUTHOR_URL}
`;
}

export { SITE_NAME, SITE_URL, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_URL };
