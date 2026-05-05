import React from 'react';

interface Product {
  asin: string;
  name: string;
  category: string;
  tags: string[];
  description?: string;
}

interface Props {
  articleTitle: string;
  articleTags: string[];
  articleCategory: string;
  catalog: Product[];
  sectionTitle?: string;
}

const AMAZON_TAG = 'spankyspinola-20';

const SOFT_INTROS = [
  'One option that many people like is',
  'A tool that often helps with this is',
  'Something worth considering might be',
  'For those looking for a simple solution, this works well:',
  'You could also try',
  'A popular choice for situations like this is',
];

function buildAmazonUrl(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

function matchProducts(articleTitle: string, articleTags: string[], articleCategory: string, catalog: Product[], max = 4): Product[] {
  const scored = catalog.map(p => {
    let score = 0;
    if (p.category === articleCategory) score += 10;
    for (const tag of articleTags) if (p.tags.includes(tag)) score += 3;
    const titleWords = articleTitle.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const name = p.name.toLowerCase();
    for (const w of titleWords) if (name.includes(w)) score += 2;
    return { product: p, score };
  }).sort((a, b) => b.score - a.score);

  return scored.slice(0, max).map(s => s.product);
}

export function AutoAffiliates({ articleTitle, articleTags, articleCategory, catalog, sectionTitle = 'Faith Transition Library' }: Props) {
  const products = matchProducts(articleTitle, articleTags, articleCategory, catalog, 4);

  if (products.length === 0) return null;

  return (
    <section className="auto-affiliates" aria-label={sectionTitle}>
      <div className="affiliates-header">
        <h3 className="affiliates-title">{sectionTitle}</h3>
        <p className="affiliates-intro">
          These are books and tools that people in faith transitions have found genuinely useful.
        </p>
      </div>

      <ul className="affiliates-list">
        {products.map((p, i) => (
          <li key={p.asin} className="affiliate-item">
            <div className="affiliate-intro-text">
              {SOFT_INTROS[i % SOFT_INTROS.length]}
            </div>
            <a
              href={buildAmazonUrl(p.asin)}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="affiliate-link"
            >
              <span className="affiliate-book-icon">◆</span>
              <span className="affiliate-name">{p.name}</span>
              <span className="affiliate-external">↗</span>
            </a>
            {p.description && (
              <p className="affiliate-description">{p.description}</p>
            )}
            <span className="affiliate-disclosure">(paid link)</span>
          </li>
        ))}
      </ul>

      <p className="affiliate-footer-disclosure">
        As an Amazon Associate, I earn from qualifying purchases. This doesn't change the price you pay.
      </p>

      <style>{`
        .auto-affiliates {
          background: var(--color-sidebar);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6) var(--space-8);
          margin: var(--space-10) 0;
        }

        .affiliates-header {
          margin-bottom: var(--space-5);
        }

        .affiliates-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-2);
        }

        .affiliates-intro {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          margin: 0;
        }

        .affiliates-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .affiliate-item {
          padding-bottom: var(--space-5);
          border-bottom: 1px solid var(--color-border);
        }

        .affiliate-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .affiliate-intro-text {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          margin-bottom: var(--space-2);
          font-style: italic;
        }

        .affiliate-link {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          text-decoration: none;
          color: var(--color-accent);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-sm);
          line-height: 1.4;
          margin-bottom: var(--space-2);
          transition: color var(--transition-fast);
        }

        .affiliate-link:hover {
          color: var(--color-accent-dark);
          text-decoration: underline;
        }

        .affiliate-book-icon {
          flex-shrink: 0;
          margin-top: 2px;
          font-size: 0.8em;
        }

        .affiliate-name {
          flex: 1;
        }

        .affiliate-external {
          flex-shrink: 0;
          font-size: 0.8em;
          opacity: 0.6;
        }

        .affiliate-description {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
          margin: 0 0 var(--space-1);
          line-height: 1.5;
        }

        .affiliate-disclosure {
          font-size: 10px;
          color: var(--color-muted-light);
          font-style: italic;
        }

        .affiliate-footer-disclosure {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
          margin-top: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
