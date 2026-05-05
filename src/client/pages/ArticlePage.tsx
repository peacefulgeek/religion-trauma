import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AuthorByline } from '../components/AuthorByline';
import { TLDR } from '../components/TLDR';
import { Footer } from '../components/Footer';
import SEOHead from '../components/SEOHead';

interface Article {
  slug: string;
  title: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  category: string;
  tags?: string[];
  hero_url?: string;
  image_alt?: string;
  reading_time?: number;
  published_at?: string;
  updated_at?: string;
  last_refreshed_at?: string;
  author?: string;
  body: string;
  tldr?: string;
  faq?: Array<{ question: string; answer: string }>;
  cta_primary?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'religious-trauma': 'Religious Trauma',
  'deconstruction': 'Deconstruction',
  'purity-culture': 'Purity Culture',
  'leaving-church': 'Leaving Church',
  'high-control-groups': 'High-Control Groups',
  'relationships': 'Relationships',
  'body-healing': 'Body & Healing',
  'ocd-scrupulosity': 'OCD & Scrupulosity',
  'trauma-healing': 'Trauma Recovery',
  'therapy': 'Finding Help',
  'grief': 'Grief & Loss',
  'secular-community': 'Secular Community',
  'secular-spirituality': 'Secular Spirituality',
  'atheism-agnosticism': 'Atheism & Agnosticism',
  'parenting': 'Parenting After Faith',
  'anger': 'Anger & Forgiveness',
  'identity': 'Identity',
  'resources': 'Resources',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  'religious-trauma': 'linear-gradient(135deg, #3D2B1F 0%, #7A4F3A 50%, #B8860B 100%)',
  'deconstruction': 'linear-gradient(135deg, #2C3E50 0%, #4A6741 50%, #8B7355 100%)',
  'purity-culture': 'linear-gradient(135deg, #4A2545 0%, #7B4F6A 50%, #C4956A 100%)',
  'leaving-church': 'linear-gradient(135deg, #2E4057 0%, #5C7A8A 50%, #9BA8A3 100%)',
  'high-control-groups': 'linear-gradient(135deg, #3D1A1A 0%, #7A3535 50%, #B87A50 100%)',
  'relationships': 'linear-gradient(135deg, #2D4A3E 0%, #5C7A6A 50%, #A8B89A 100%)',
  'body-healing': 'linear-gradient(135deg, #3D3520 0%, #7A6040 50%, #C4A882 100%)',
  'ocd-scrupulosity': 'linear-gradient(135deg, #2A2A3D 0%, #4A4A7A 50%, #8A7AB8 100%)',
  'trauma-healing': 'linear-gradient(135deg, #2D3A2D 0%, #4A6A4A 50%, #8A9A7A 100%)',
  'therapy': 'linear-gradient(135deg, #2D3D4A 0%, #4A6A7A 50%, #8AAAB8 100%)',
  'grief': 'linear-gradient(135deg, #2A2A2A 0%, #4A4040 50%, #7A6A60 100%)',
  'secular-community': 'linear-gradient(135deg, #2D3D2D 0%, #5A6A4A 50%, #9AAA7A 100%)',
  'secular-spirituality': 'linear-gradient(135deg, #3D2D2D 0%, #6A4A3A 50%, #B89A7A 100%)',
  'atheism-agnosticism': 'linear-gradient(135deg, #1A1A2D 0%, #3A3A5A 50%, #6A6A8A 100%)',
  'parenting': 'linear-gradient(135deg, #2D3A2D 0%, #5A7A4A 50%, #9AB87A 100%)',
  'anger': 'linear-gradient(135deg, #3D1A1A 0%, #7A3020 50%, #B85A30 100%)',
  'identity': 'linear-gradient(135deg, #2D2A3D 0%, #5A4A6A 50%, #9A8AB8 100%)',
  'resources': 'linear-gradient(135deg, #2D3A3D 0%, #4A6A6A 50%, #8AAAA8 100%)',
};

function renderMarkdown(body: string): string {
  // Basic markdown-to-HTML conversion
  let html = body
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold/italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Wrap in p tags
    .replace(/^(?!<[h1-6|li|blockquote|ul|ol])(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return match;
    });

  // Wrap consecutive li items in ul
  html = html.replace(/(<li>.*<\/li>(\n<li>.*<\/li>)*)/gs, '<ul>$1</ul>');

  // Wrap in paragraphs
  const lines = html.split('\n');
  const result: string[] = [];
  let inParagraph = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      continue;
    }
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') ||
        trimmed.startsWith('<blockquote') || trimmed.startsWith('<li')) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push(trimmed);
    } else if (!trimmed.startsWith('<')) {
      if (!inParagraph) {
        result.push('<p>');
        inParagraph = true;
      }
      result.push(trimmed);
    } else {
      result.push(trimmed);
    }
  }

  if (inParagraph) result.push('</p>');

  return result.join('\n');
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    fetch(`/api/articles/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="article-loading">
        <div className="loading-hero" />
        <div className="loading-content">
          <div className="loading-line loading-line--short" />
          <div className="loading-line loading-line--title" />
          <div className="loading-line loading-line--medium" />
          <div className="loading-line" />
          <div className="loading-line loading-line--medium" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-error">
        <h1>Article Not Found</h1>
        <p>This article doesn't exist or may have been moved.</p>
        <Link to="/articles" className="btn btn-primary">Browse All Articles</Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const gradient = CATEGORY_GRADIENTS[article.category] || 'linear-gradient(135deg, #3D2B1F, #7A6040)';
  const faq = Array.isArray(article.faq) ? article.faq : [];

  // Build FAQ JSON-LD
  const faqJsonLd = faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : undefined;

  return (
    <article
      className="article-page"
      itemScope
      itemType="https://schema.org/Article"
    >
      <SEOHead
        title={article.og_title || article.title}
        description={article.og_description || article.meta_description}
        ogTitle={article.og_title || article.title}
        ogDescription={article.og_description || article.meta_description}
        ogImage={article.hero_url || '/images/hero-main.jpg'}
        ogType="article"
        canonicalUrl={`/articles/${article.slug}`}
        publishedAt={article.published_at}
        updatedAt={article.last_refreshed_at || article.updated_at}
        author={article.author || 'The Oracle Lover'}
        keywords={article.tags || []}
        breadcrumbs={[
          { name: 'Articles', url: '/articles' },
          { name: CATEGORY_LABELS[article.category] || article.category, url: `/category/${article.category}` },
          { name: article.title, url: `/articles/${article.slug}` },
        ]}
        jsonLd={faqJsonLd}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Articles', href: '/articles' },
        { label: categoryLabel, href: `/category/${article.category}` },
        { label: article.title },
      ]} />

      {/* Hero Image */}
      <div className="article-hero">
        {article.hero_url ? (
          <img
            src={article.hero_url}
            alt={article.image_alt || article.title}
            className="article-hero-img"
            itemProp="image"
          />
        ) : (
          <div className="article-hero-placeholder" style={{ background: gradient }}>
            <div className="article-hero-overlay">
              <span className="hero-category-badge tag">{categoryLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Article Header */}
      <header className="article-header">
        <div className="article-tags">
          <Link to={`/category/${article.category}`} className="tag">
            {categoryLabel}
          </Link>
          {(article.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <h1 className="article-title" itemProp="headline">{article.title}</h1>

        {article.meta_description && (
          <p className="article-deck" itemProp="description">{article.meta_description}</p>
        )}

        <AuthorByline
          publishedAt={article.published_at}
          readingTime={article.reading_time}
          updatedAt={article.last_refreshed_at || article.updated_at}
        />
      </header>

      {/* TLDR Block */}
      {article.tldr && <TLDR tldr={article.tldr} />}

      {/* Article Body */}
      <div
        className="article-body"
        itemProp="articleBody"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}
      />

      {/* FAQ Section */}
      {faq.length > 0 && (
        <section
          className="faq-section"
          aria-label="Frequently Asked Questions"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faq.map((item, i) => (
              <div
                key={i}
                className="faq-item"
                itemScope
                itemType="https://schema.org/Question"
              >
                <h3 className="faq-question" itemProp="name">{item.question}</h3>
                <div
                  className="faq-answer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="article-cta">
        <div className="cta-inner">
          <h3>Understand Your Experience</h3>
          <p>Take one of our free assessments to get clarity on where you are in your faith transition.</p>
          <div className="cta-buttons">
            <Link to="/assessments/religious-trauma-assessment" className="btn btn-primary">
              Religious Trauma Assessment
            </Link>
            <Link to="/assessments/deconstruction-stage-finder" className="btn btn-outline">
              Deconstruction Stage Finder
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Articles */}
      <div className="article-back">
        <Link to="/articles" className="back-link">← Back to all articles</Link>
      </div>

      <Footer />

      <style>{`
        .article-page {
          max-width: var(--content-max-width);
          margin: 0 auto;
        }

        .article-hero {
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: var(--space-8);
          aspect-ratio: 21/9;
          box-shadow: var(--shadow-lg);
        }

        .article-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-hero-placeholder {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: var(--space-6);
        }

        .article-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(34,20,10,0.6) 0%, transparent 60%);
          display: flex;
          align-items: flex-end;
          padding: var(--space-6);
        }

        .hero-category-badge {
          background: rgba(255,255,255,0.15);
          color: white;
          border-color: rgba(255,255,255,0.3);
          backdrop-filter: blur(4px);
        }

        .article-header {
          margin-bottom: var(--space-8);
        }

        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .article-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-heading);
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-4);
        }

        .article-deck {
          font-size: var(--font-size-lg);
          color: var(--color-muted);
          line-height: 1.6;
          margin-bottom: var(--space-5);
          font-weight: var(--font-weight-normal);
        }

        /* FAQ */
        .faq-section {
          margin: var(--space-12) 0;
          border-top: 2px solid var(--color-border);
          padding-top: var(--space-8);
        }

        .faq-title {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-6);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .faq-item {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5) var(--space-6);
        }

        .faq-question {
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--color-heading);
          margin-bottom: var(--space-3);
        }

        .faq-answer p {
          font-size: var(--font-size-base);
          color: var(--color-text);
          line-height: var(--line-height-relaxed);
          margin: 0;
        }

        /* CTA */
        .article-cta {
          margin: var(--space-12) 0;
          background: linear-gradient(135deg, #2C1810 0%, #5C3A20 50%, #8B6040 100%);
          border-radius: var(--radius-xl);
          padding: var(--space-10) var(--space-8);
          text-align: center;
        }

        .cta-inner h3 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: white;
          margin-bottom: var(--space-3);
        }

        .cta-inner p {
          font-size: var(--font-size-base);
          color: rgba(255,255,255,0.8);
          margin-bottom: var(--space-6);
        }

        .cta-buttons {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-buttons .btn-outline {
          color: white;
          border-color: rgba(255,255,255,0.5);
        }

        .cta-buttons .btn-outline:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }

        .article-back {
          margin: var(--space-8) 0;
        }

        .back-link {
          font-size: var(--font-size-sm);
          color: var(--color-accent);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--color-accent-dark);
          text-decoration: underline;
        }

        /* Loading */
        .article-loading {
          max-width: var(--content-max-width);
          margin: 0 auto;
        }

        .loading-hero {
          aspect-ratio: 21/9;
          border-radius: var(--radius-xl);
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-sidebar) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: var(--space-8);
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .loading-line {
          height: 16px;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-sidebar) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-sm);
          width: 100%;
        }

        .loading-line--short { width: 30%; height: 12px; }
        .loading-line--medium { width: 70%; }
        .loading-line--title { height: 40px; width: 90%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Error */
        .article-error {
          text-align: center;
          padding: var(--space-16);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
        }

        @media (max-width: 640px) {
          .article-hero {
            aspect-ratio: 16/9;
            border-radius: var(--radius-lg);
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </article>
  );
}
