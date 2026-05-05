import { query } from '../lib/db.mjs';
import { generateArticle } from '../lib/deepseek-generate.mjs';
import { runQualityGate } from '../lib/article-quality-gate.mjs';
import { assignHeroImage } from '../lib/bunny.mjs';

const MAX_ATTEMPTS = 4;

// Article topics queue for The Faith Wound
const ARTICLE_TOPICS = [
  { title: 'What Is Religious Trauma? The Clinical Definition', category: 'religious-trauma', tags: ['religious-trauma', 'clinical', 'definition', 'marlene-winell'] },
  { title: "Marlene Winell's Religious Trauma Syndrome: The Symptoms", category: 'religious-trauma', tags: ['religious-trauma', 'symptoms', 'marlene-winell', 'rts'] },
  { title: 'The Difference Between Religious Trauma and Normal Faith Doubt', category: 'religious-trauma', tags: ['religious-trauma', 'faith-doubt', 'deconstruction'] },
  { title: 'What Deconstruction Actually Is (And What It Isn\'t)', category: 'deconstruction', tags: ['deconstruction', 'faith', 'leaving-religion'] },
  { title: 'The Grief of Leaving: What You\'re Actually Mourning', category: 'grief', tags: ['grief', 'leaving-religion', 'loss', 'community'] },
  { title: 'Religious Trauma and Shame: The Entanglement', category: 'religious-trauma', tags: ['shame', 'religious-trauma', 'healing', 'body'] },
  { title: 'Purity Culture Wounds: What the Research Shows', category: 'purity-culture', tags: ['purity-culture', 'shame', 'sexuality', 'research'] },
  { title: 'Leaving Evangelical Christianity: The Specific Challenges', category: 'leaving-church', tags: ['evangelical', 'leaving-church', 'deconstruction', 'identity'] },
  { title: 'Leaving Catholicism: Confession, Guilt, and Identity', category: 'leaving-church', tags: ['catholicism', 'guilt', 'identity', 'leaving-church'] },
  { title: 'Leaving High-Control Religious Groups: The Cult Spectrum', category: 'high-control-groups', tags: ['cults', 'high-control', 'leaving-religion', 'recovery'] },
  { title: 'When Your Family Is Still In: How to Navigate It', category: 'relationships', tags: ['family', 'relationships', 'leaving-religion', 'boundaries'] },
  { title: 'Religious Trauma and Your Relationship With Your Body', category: 'body-healing', tags: ['body', 'religious-trauma', 'healing', 'somatic'] },
  { title: 'Sex, Shame, and the Body After Purity Culture', category: 'purity-culture', tags: ['sexuality', 'shame', 'purity-culture', 'body', 'healing'] },
  { title: 'The Scrupulosity Pattern: OCD and Religious Practice', category: 'ocd-scrupulosity', tags: ['ocd', 'scrupulosity', 'religious-trauma', 'anxiety'] },
  { title: 'Religious Trauma and PTSD: The Clinical Overlap', category: 'trauma-healing', tags: ['ptsd', 'religious-trauma', 'clinical', 'overlap'] },
  { title: 'Finding a Therapist Who Understands Religious Trauma', category: 'therapy', tags: ['therapy', 'religious-trauma', 'finding-help', 'treatment'] },
  { title: 'What Helps in Religious Trauma Recovery: The Evidence', category: 'trauma-healing', tags: ['recovery', 'religious-trauma', 'evidence', 'treatment'] },
  { title: 'The Anger Stage: What to Do With Rage After Leaving', category: 'anger', tags: ['anger', 'leaving-religion', 'healing', 'stages'] },
  { title: 'Secular Rituals: What Purpose They Serve and How to Build Them', category: 'secular-community', tags: ['ritual', 'secular', 'meaning', 'community', 'post-faith'] },
  { title: 'Spirituality Without Religion: What That Actually Looks Like', category: 'secular-spirituality', tags: ['secular-spirituality', 'post-faith', 'meaning', 'practice'] },
  { title: 'The Deconstruction Community: What It Offers and Its Limits', category: 'deconstruction', tags: ['deconstruction', 'community', 'support', 'limits'] },
  { title: "Brian McLaren's Approach: Faith After Doubt, Not Faith vs. Doubt", category: 'deconstruction', tags: ['brian-mclaren', 'faith-doubt', 'deconstruction', 'approach'] },
  { title: 'Atheism, Agnosticism, and the Space Between', category: 'atheism-agnosticism', tags: ['atheism', 'agnosticism', 'post-faith', 'identity'] },
  { title: 'Raising Children After You\'ve Left: The Hard Questions', category: 'parenting', tags: ['parenting', 'children', 'leaving-religion', 'secular'] },
  { title: 'The Recovery from Christian Purity Culture', category: 'purity-culture', tags: ['purity-culture', 'christianity', 'recovery', 'healing'] },
  { title: 'Religious Trauma and Relationships: Who Understands, Who Doesn\'t', category: 'relationships', tags: ['relationships', 'religious-trauma', 'understanding', 'community'] },
  { title: 'Anger at God After Leaving: What to Do With It', category: 'anger', tags: ['anger', 'god', 'leaving-religion', 'healing', 'spirituality'] },
  { title: 'Grief Groups for People Leaving Religion: How to Find Them', category: 'grief', tags: ['grief', 'community', 'support-groups', 'leaving-religion'] },
  { title: 'The Belonging Problem: Rebuilding Community After Faith', category: 'secular-community', tags: ['belonging', 'community', 'post-faith', 'rebuilding'] },
  { title: 'Integration: Who Are You Now That the Framework Is Gone?', category: 'identity', tags: ['identity', 'integration', 'post-faith', 'self-discovery'] },
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function storeAsPublished(article) {
  const faq = Array.isArray(article.faq) ? article.faq : [];
  await query(
    `INSERT INTO articles (
      slug, title, meta_description, og_title, og_description,
      category, tags, body, tldr, hero_url, image_alt,
      reading_time, author, cta_primary, faq, status,
      published_at, word_count, opener_type, conclusion_type
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'published',NOW(),$16,$17,$18)
    ON CONFLICT (slug) DO UPDATE SET
      body = EXCLUDED.body,
      status = 'published',
      published_at = COALESCE(articles.published_at, NOW()),
      updated_at = NOW()`,
    [
      article.slug,
      article.title,
      article.metaDescription || article.meta_description,
      article.ogTitle || article.og_title || article.title,
      article.ogDescription || article.og_description || article.metaDescription,
      article.category,
      article.tags || [],
      article.body,
      article.tldr || '',
      article.hero_url || article.heroUrl || null,
      article.imageAlt || article.image_alt || article.title,
      article.readingTime || article.reading_time || 7,
      'The Oracle Lover',
      article.ctaPrimary || article.cta_primary || null,
      JSON.stringify(faq),
      article.wordCount || article.word_count || 0,
      article.openerType || article.opener_type || null,
      article.conclusionType || article.conclusion_type || null,
    ]
  );
}

export async function generateOrReleaseArticle({ allowedPhase }) {
  // 1. Phase guard
  const { rows: [{ count }] } = await query(
    `SELECT count(*)::int FROM articles WHERE status = 'published'`
  );
  const currentPhase = count < 60 ? 1 : 2;
  if (currentPhase !== allowedPhase) return { skipped: true, currentPhase, allowedPhase };

  // 2. Try the queue first
  const { rows: queued } = await query(
    `SELECT id, slug, body, category, tags, asins_used, queued_at
     FROM articles WHERE status = 'queued'
     ORDER BY queued_at ASC LIMIT 1`
  );

  if (queued.length > 0) {
    const a = queued[0];
    const gate = runQualityGate(a.body);
    if (gate.passed) {
      const heroUrl = await assignHeroImage(a.slug);
      await query(
        `UPDATE articles SET status='published', published_at=NOW(), hero_url=$2 WHERE id=$1`,
        [a.id, heroUrl]
      );
      return { released: true, slug: a.slug };
    } else {
      console.warn(`[publish] queued article ${a.slug} failed gate; regenerating`);
    }
  }

  // 3. Generate fresh
  // Find a topic not yet published
  const { rows: existing } = await query(
    `SELECT slug FROM articles WHERE status IN ('published', 'queued')`
  );
  const existingSlugs = new Set(existing.map(r => r.slug));
  const available = ARTICLE_TOPICS.filter(t => !existingSlugs.has(slugify(t.title)));

  if (available.length === 0) {
    console.log('[publish] All topics published. Generating new topic...');
    return { skipped: true, reason: 'all-topics-published' };
  }

  const topic = available[Math.floor(Math.random() * available.length)];
  let article = null;
  let gate = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      article = await generateArticle({ ...topic, attempt });
      gate = runQualityGate(article.body);
      if (gate.passed) break;
      console.warn(`[publish] attempt ${attempt} failed gate:`, gate.failures);
    } catch (e) {
      console.error(`[publish] attempt ${attempt} generation error:`, e.message);
    }
  }

  if (!gate || !gate.passed) {
    console.error('[publish] abandoned after MAX_ATTEMPTS — NOT storing');
    return { stored: false, reason: 'quality-gate-exhausted', failures: gate?.failures };
  }

  const slug = slugify(article.title || topic.title);
  const heroUrl = await assignHeroImage(slug);
  await storeAsPublished({ ...article, slug, hero_url: heroUrl, category: topic.category, tags: topic.tags });
  return { stored: true, slug };
}
