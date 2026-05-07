// HARDCODE per site. DO NOT move these to env vars.
// Bunny CDN: religion-trauma storage zone, New York region
const BUNNY_STORAGE_ZONE = 'religion-trauma';
const BUNNY_API_KEY      = 'd5f7f3e5-28cc-4ed9-bd1223ed3866-e676-467e';
const BUNNY_PULL_ZONE    = 'https://religion-trauma.b-cdn.net';
const BUNNY_HOSTNAME     = 'ny.storage.bunnycdn.com';

// Category → existing CDN image mapping (for cron-generated articles)
const CATEGORY_IMAGES = {
  'religious-trauma':     `${BUNNY_PULL_ZONE}/images/article-rts.webp`,
  'deconstruction':       `${BUNNY_PULL_ZONE}/images/article-deconstruction.webp`,
  'purity-culture':       `${BUNNY_PULL_ZONE}/images/article-shame.webp`,
  'leaving-church':       `${BUNNY_PULL_ZONE}/images/article-community.webp`,
  'high-control-groups':  `${BUNNY_PULL_ZONE}/images/article-rts.webp`,
  'relationships':        `${BUNNY_PULL_ZONE}/images/article-trust.webp`,
  'body-healing':         `${BUNNY_PULL_ZONE}/images/article-somatic.webp`,
  'ocd-scrupulosity':     `${BUNNY_PULL_ZONE}/images/article-therapy.webp`,
  'trauma-healing':       `${BUNNY_PULL_ZONE}/images/article-healing.webp`,
  'therapy':              `${BUNNY_PULL_ZONE}/images/article-therapy.webp`,
  'grief':                `${BUNNY_PULL_ZONE}/images/article-grief.webp`,
  'secular-community':    `${BUNNY_PULL_ZONE}/images/article-community.webp`,
  'secular-spirituality': `${BUNNY_PULL_ZONE}/images/article-identity.webp`,
  'atheism-agnosticism':  `${BUNNY_PULL_ZONE}/images/article-identity.webp`,
  'parenting':            `${BUNNY_PULL_ZONE}/images/article-healing.webp`,
  'anger':                `${BUNNY_PULL_ZONE}/images/article-grief.webp`,
  'identity':             `${BUNNY_PULL_ZONE}/images/article-identity.webp`,
  'resources':            `${BUNNY_PULL_ZONE}/images/article-therapy.webp`,
  'lgbtq':                `${BUNNY_PULL_ZONE}/images/article-lgbtq.webp`,
  'sleep':                `${BUNNY_PULL_ZONE}/images/article-sleep.webp`,
  'somatic':              `${BUNNY_PULL_ZONE}/images/article-somatic.webp`,
  'general':              `${BUNNY_PULL_ZONE}/images/hero-main.webp`,
};

/**
 * Assign a hero image for a cron-generated article.
 * Uses category-matched CDN image. Falls back to hero-main.webp.
 * For future expansion: can upload a generated image to /images/{slug}.webp
 */
export async function assignHeroImage(slug, category) {
  // Return category-matched image from the existing CDN library
  const categoryImage = CATEGORY_IMAGES[category] || `${BUNNY_PULL_ZONE}/images/hero-main.webp`;
  return categoryImage;
}

/**
 * Upload an arbitrary WebP buffer to a target path under the storage zone.
 */
export async function uploadWebP(targetPath, buffer) {
  const url = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${targetPath.replace(/^\//, '')}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { AccessKey: BUNNY_API_KEY, 'Content-Type': 'image/webp' },
    body: buffer,
  });
  if (!res.ok) throw new Error(`bunny upload ${res.status} for ${targetPath}`);
  return `${BUNNY_PULL_ZONE}/${targetPath.replace(/^\//, '')}`;
}

export { BUNNY_PULL_ZONE };
