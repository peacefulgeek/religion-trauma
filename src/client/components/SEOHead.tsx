import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  noIndex?: boolean;
  jsonLd?: object | object[];
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  keywords?: string[];
  breadcrumbs?: { name: string; url: string }[];
}

const SITE_NAME = 'The Faith Wound';
const SITE_URL = process.env.SITE_URL || 'https://religiontrauma.com';
export const CDN_BASE = 'https://religion-trauma.b-cdn.net';
const DEFAULT_OG_IMAGE = `${CDN_BASE}/images/hero-main.webp`;
const LOGO_URL = `${CDN_BASE}/images/hero-main.webp`;
const DEFAULT_DESCRIPTION = 'Evidence-informed resources for religious trauma recovery, faith deconstruction, and post-faith identity. You are not alone. Healing is possible.';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  jsonLd,
  publishedAt,
  updatedAt,
  author = 'The Oracle Lover',
  keywords = [],
  breadcrumbs,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Religious Trauma Recovery & Faith Deconstruction`;
  const fullOgTitle = ogTitle || title || SITE_NAME;
  const fullOgDescription = ogDescription || description;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
  const fullCanonical = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_URL}${canonicalUrl}`) : undefined;

  // Build JSON-LD array
  const jsonLdItems: object[] = [];

  // Organization schema
  jsonLdItems.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  });

  // WebSite schema with SearchAction
  jsonLdItems.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/articles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  });

  // Breadcrumb schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLdItems.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        ...breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 2,
          name: crumb.name,
          item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
        })),
      ],
    });
  }

  // Article schema
  if (ogType === 'article' && publishedAt) {
    jsonLdItems.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: fullOgTitle,
      description: fullOgDescription,
      image: fullOgImage,
      datePublished: publishedAt,
      dateModified: updatedAt || publishedAt,
      author: {
        '@type': 'Person',
        name: author,
        url: `${SITE_URL}/about`,
        description: 'Writer and researcher specializing in religious trauma recovery, faith deconstruction, and post-faith identity development.',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullCanonical || SITE_URL,
      },
    });
  }

  // Additional JSON-LD from props
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      jsonLdItems.push(...jsonLd);
    } else {
      jsonLdItems.push(jsonLd);
    }
  }

  const defaultKeywords = [
    'religious trauma', 'faith deconstruction', 'religious trauma syndrome',
    'leaving religion', 'spiritual abuse', 'high control groups',
    'religious trauma recovery', 'post faith identity', 'exvangelical',
    'deconstruction', 'cult recovery', 'faith transition',
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="author" content={author} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullOgTitle} />
      <meta property="og:description" content={fullOgDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {updatedAt && <meta property="article:modified_time" content={updatedAt} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullOgTitle} />
      <meta name="twitter:description" content={fullOgDescription} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* JSON-LD */}
      {jsonLdItems.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Helmet>
  );
}
