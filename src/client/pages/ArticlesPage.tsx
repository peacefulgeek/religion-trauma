import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
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

interface Category {
  category: string;
  count: number;
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

export function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (activeCategory) params.set('category', activeCategory);
    fetch(`/api/articles?${params}`)
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles || []);
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const filtered = search
    ? articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.meta_description || '').toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  return (
    <div className="articles-page">
      <div className="articles-page-header">
        <h1 className="page-title">All Articles</h1>
        <p className="page-subtitle">
          Research-backed writing on religious trauma, faith deconstruction, and the path forward.
        </p>
      </div>

      {/* Search + View Toggle */}
      <div className="articles-toolbar">
        <div className="search-wrap">
          <span className="search-icon">◎</span>
          <input
            type="search"
            className="search-input"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search articles"
          />
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${view === 'grid' ? 'view-btn--active' : ''}`}
            onClick={() => setView('grid')}
            aria-label="Grid view"
            title="Grid view"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${view === 'list' ? 'view-btn--active' : ''}`}
            onClick={() => setView('list')}
            aria-label="List view"
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={`filter-btn ${!activeCategory ? 'filter-btn--active' : ''}`}
          onClick={() => setSearchParams({})}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.category}
            className={`filter-btn ${activeCategory === cat.category ? 'filter-btn--active' : ''}`}
            onClick={() => setSearchParams({ category: cat.category })}
          >
            {CATEGORY_LABELS[cat.category] || cat.category}
            <span className="filter-count">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="results-count">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          {activeCategory ? ` in ${CATEGORY_LABELS[activeCategory] || activeCategory}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}

      {/* Articles */}
      {loading ? (
        <div className={view === 'grid' ? 'articles-grid' : 'articles-list'}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="loading-card">
              <div className="loading-image" />
              <div className="loading-body">
                <div className="loading-line loading-line--short" />
                <div className="loading-line" />
                <div className="loading-line loading-line--medium" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className={view === 'grid' ? 'articles-grid' : 'articles-list'}>
          {filtered.map(article => (
            <ArticleCard key={article.slug} article={article} view={view} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No articles found{search ? ` for "${search}"` : ''}.</p>
          <button className="btn btn-outline" onClick={() => { setSearch(''); setSearchParams({}); }}>
            Clear filters
          </button>
        </div>
      )}

      <Footer />

      <style>{`
        .articles-page-header {
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-8);
          border-bottom: 1px solid var(--color-border);
        }

        .page-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-heading);
          margin-bottom: var(--space-3);
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-muted);
          max-width: 600px;
        }

        .articles-toolbar {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-5);
        }

        .search-wrap {
          flex: 1;
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-muted);
          pointer-events: none;
          font-size: 0.9rem;
        }

        .search-input {
          width: 100%;
          padding: var(--space-3) var(--space-3) var(--space-3) var(--space-8);
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          color: var(--color-text);
          font-family: var(--font-family);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .search-input:focus {
          border-color: var(--color-accent);
        }

        .view-toggle {
          display: flex;
          gap: var(--space-1);
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 3px;
        }

        .view-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          color: var(--color-muted);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        .view-btn--active {
          background: var(--color-accent);
          color: white;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
        }

        .filter-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-4);
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          color: var(--color-text);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-family);
        }

        .filter-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .filter-btn--active {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: white;
        }

        .filter-count {
          background: rgba(255,255,255,0.25);
          padding: 1px 5px;
          border-radius: var(--radius-full);
          font-size: 10px;
        }

        .filter-btn:not(.filter-btn--active) .filter-count {
          background: var(--color-sidebar);
          color: var(--color-muted);
        }

        .results-count {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          margin-bottom: var(--space-5);
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
          margin-bottom: var(--space-12);
        }

        .articles-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
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

        /* Loading */
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
        .loading-line--medium { width: 70%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 900px) {
          .articles-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .articles-grid { grid-template-columns: 1fr; }
          .category-filter { gap: var(--space-1); }
          .filter-btn { font-size: 10px; padding: var(--space-1) var(--space-3); }
        }
      `}</style>
    </div>
  );
}
