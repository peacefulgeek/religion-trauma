const SITE_NAME = 'The Faith Wound';
const AUTHOR_NAME = 'The Oracle Lover';
const AUTHOR_URL = 'https://theoraclelover.com';

export function buildArticleJsonLd({ article, canonicalUrl, siteUrl }) {
  const base = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.meta_description || '',
    'url': canonicalUrl,
    'datePublished': article.published_at,
    'dateModified': article.last_refreshed_at || article.published_at,
    'author': {
      '@type': 'Person',
      'name': AUTHOR_NAME,
      'url': AUTHOR_URL
    },
    'publisher': {
      '@type': 'Organization',
      'name': SITE_NAME,
      'url': siteUrl
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['[data-tldr="ai-overview"]']
    }
  };

  if (article.hero_url) {
    base['image'] = {
      '@type': 'ImageObject',
      'url': article.hero_url,
      'contentUrl': article.hero_url,
      'description': article.image_alt || article.title,
      'creditText': AUTHOR_NAME,
      'creator': { '@type': 'Person', 'name': AUTHOR_NAME },
      'license': 'https://creativecommons.org/licenses/by/4.0/'
    };
  }

  const schemas = [base];

  // Breadcrumb
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteUrl },
      { '@type': 'ListItem', 'position': 2, 'name': article.category, 'item': `${siteUrl}/category/${article.category}` },
      { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': canonicalUrl }
    ]
  });

  // FAQ schema if article has FAQs
  if (article.faq && article.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': article.faq.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    });
  }

  return schemas.map(s => JSON.stringify(s)).join('\n');
}

export function buildHomePageJsonLd({ siteUrl }) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': SITE_NAME,
    'url': siteUrl,
    'description': 'A resource hub for people navigating religious trauma, faith deconstruction, and life after leaving a faith tradition.',
    'author': {
      '@type': 'Person',
      'name': AUTHOR_NAME,
      'url': AUTHOR_URL
    }
  });
}
