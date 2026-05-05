import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Footer } from '../components/Footer';

interface Article {
  slug: string;
  title: string;
  meta_description?: string;
  category: string;
  tags?: string[];
  hero_url?: string;
  image_alt?: string;
  reading_time?: number;
  published_at?: string;
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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'religious-trauma': 'Understanding religious trauma syndrome, its symptoms, causes, and the path to recovery.',
  'deconstruction': 'What faith deconstruction actually is, what it isn\'t, and how to navigate it.',
  'purity-culture': 'The psychological and relational damage of purity culture — and how to heal.',
  'leaving-church': 'The specific challenges of leaving evangelical, Catholic, and other faith traditions.',
  'high-control-groups': 'Understanding high-control religious groups, cults, and the recovery process.',
  'relationships': 'How leaving faith affects family, friendships, and romantic relationships.',
  'body-healing': 'Reconnecting with your body after religious shame and trauma.',
  'ocd-scrupulosity': 'The intersection of OCD, scrupulosity, and religious practice.',
  'trauma-healing': 'Evidence-based approaches to healing from religious trauma.',
  'therapy': 'Finding therapists who understand religious trauma and faith transitions.',
  'grief': 'The grief of leaving — what you\'re mourning and how to move through it.',
  'secular-community': 'Building community and belonging outside of religion.',
  'secular-spirituality': 'What spirituality looks like without religious frameworks.',
  'atheism-agnosticism': 'Navigating atheism, agnosticism, and the space between.',
  'parenting': 'Raising children after you\'ve left a faith tradition.',
  'anger': 'What to do with the anger that comes after leaving.',
  'identity': 'Rebuilding your identity after the framework is gone.',
  'resources': 'Books, tools, and resources for faith transition.',
};

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`/api/articles?category=${category}&limit=50`)
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const label = CATEGORY_LABELS[category || ''] || category || '';
  const description = CATEGORY_DESCRIPTIONS[category || ''] || '';

  return (
    <div className="category-page">
      <Breadcrumbs crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Articles', href: '/articles' },
        { label: label },
      ]} />

      <div className="category-header">
        <span className="tag" style={{ marginBottom: 'var(--space-3)', display: 'inline-flex' }}>Category</span>
        <h1 className="category-title">{label}</h1>
        {description && <p className="category-description">{description}</p>}
        <p className="category-count">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="articles-grid">
          {[1,2,3].map(i => (
            <div key={i} className="loading-card">
              <div className="loading-image" />
              <div className="loading-body">
                <div className="loading-line loading-line--short" />
                <div className="loading-line" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="articles-grid">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} view="grid" />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No articles in this category yet.</p>
          <Link to="/articles" className="btn btn-outline">Browse All Articles</Link>
        </div>
      )}

      <Footer />

      <style>{`
        .category-header {
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-8);
          border-bottom: 1px solid var(--color-border);
        }

        .category-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-heading);
          margin-bottom: var(--space-3);
          letter-spacing: -0.02em;
        }

        .category-description {
          font-size: var(--font-size-lg);
          color: var(--color-muted);
          max-width: 600px;
          margin-bottom: var(--space-3);
        }

        .category-count {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
          margin-bottom: var(--space-12);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-16);
          color: var(--color-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
        }

        .loading-card {
          background: var(--color-card);
          border-radius: var(--card-radius);
          overflow: hidden;
          border: 1px solid var(--color-border);
        }

        .loading-image {
          aspect-ratio: 16/9;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-sidebar) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .loading-body {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .loading-line {
          height: 14px;
          background: linear-gradient(90deg, var(--color-border) 25%, var(--color-sidebar) 50%, var(--color-border) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-sm);
          width: 100%;
        }

        .loading-line--short { width: 40%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 900px) {
          .articles-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .articles-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
