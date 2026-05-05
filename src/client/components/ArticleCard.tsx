import React from 'react';
import { Link } from 'react-router-dom';

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
  author?: string;
}

interface Props {
  article: Article;
  view?: 'grid' | 'list';
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
  'general': 'General',
};

// Placeholder gradient images by category
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

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ArticleCard({ article, view = 'grid' }: Props) {
  const gradient = CATEGORY_GRADIENTS[article.category] || CATEGORY_GRADIENTS['general'] || 'linear-gradient(135deg, #3D2B1F, #7A6040)';
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  if (view === 'list') {
    return (
      <article className="article-card article-card--list">
        <Link to={`/articles/${article.slug}`} className="card-list-link">
          <div className="card-list-image">
            {article.hero_url ? (
              <img src={article.hero_url} alt={article.image_alt || article.title} loading="lazy" />
            ) : (
              <div className="card-image-placeholder" style={{ background: gradient }} />
            )}
          </div>
          <div className="card-list-content">
            <div className="card-meta">
              <span className="tag">{categoryLabel}</span>
              <span className="card-date">{formatDate(article.published_at)}</span>
            </div>
            <h3 className="card-title">{article.title}</h3>
            {article.meta_description && (
              <p className="card-excerpt">{article.meta_description}</p>
            )}
            <div className="card-footer">
              <span className="card-reading-time">{article.reading_time || 7} min read</span>
              <span className="card-read-more">Read article →</span>
            </div>
          </div>
        </Link>

        <style>{cardStyles}</style>
      </article>
    );
  }

  return (
    <article className="article-card">
      <Link to={`/articles/${article.slug}`} className="card-link">
        <div className="card-image-wrap">
          {article.hero_url ? (
            <img
              src={article.hero_url}
              alt={article.image_alt || article.title}
              className="card-image"
              loading="lazy"
            />
          ) : (
            <div className="card-image-placeholder" style={{ background: gradient }}>
              <div className="card-image-overlay">
                <span className="card-category-icon">◈</span>
              </div>
            </div>
          )}
          <div className="card-category-badge">
            <span className="tag">{categoryLabel}</span>
          </div>
        </div>

        <div className="card-body">
          <div className="card-meta">
            <span className="card-date">{formatDate(article.published_at)}</span>
            <span className="card-reading-time">{article.reading_time || 7} min read</span>
          </div>
          <h3 className="card-title">{article.title}</h3>
          {article.meta_description && (
            <p className="card-excerpt">{article.meta_description}</p>
          )}
          <div className="card-footer">
            <span className="card-author">The Oracle Lover</span>
            <span className="card-arrow">→</span>
          </div>
        </div>
      </Link>

      <style>{cardStyles}</style>
    </article>
  );
}

const cardStyles = `
  .article-card {
    background: var(--color-card);
    border-radius: var(--card-radius);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    transition: transform var(--transition-base), box-shadow var(--transition-base);
    border: 1px solid var(--color-border);
  }

  .article-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }

  .card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  .card-image-wrap {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  .article-card:hover .card-image {
    transform: scale(1.03);
  }

  .card-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .card-image-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.15);
  }

  .card-category-icon {
    font-size: 2.5rem;
    opacity: 0.4;
    color: white;
  }

  .card-category-badge {
    position: absolute;
    top: var(--space-3);
    left: var(--space-3);
  }

  .card-body {
    padding: var(--space-5);
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
    flex-wrap: wrap;
  }

  .card-date {
    font-size: var(--font-size-xs);
    color: var(--color-muted);
  }

  .card-reading-time {
    font-size: var(--font-size-xs);
    color: var(--color-muted);
  }

  .card-title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    color: var(--color-heading);
    line-height: var(--line-height-tight);
    margin-bottom: var(--space-3);
    letter-spacing: -0.01em;
  }

  .article-card:hover .card-title {
    color: var(--color-accent);
  }

  .card-excerpt {
    font-size: var(--font-size-sm);
    color: var(--color-muted);
    line-height: 1.5;
    margin-bottom: var(--space-4);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  .card-author {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
  }

  .card-arrow {
    color: var(--color-accent);
    font-size: var(--font-size-sm);
    transition: transform var(--transition-fast);
  }

  .article-card:hover .card-arrow {
    transform: translateX(4px);
  }

  /* List view */
  .article-card--list {
    border-radius: var(--radius-md);
  }

  .card-list-link {
    display: flex;
    gap: var(--space-4);
    text-decoration: none;
    color: inherit;
    padding: var(--space-4);
    align-items: flex-start;
  }

  .card-list-image {
    width: 120px;
    height: 80px;
    flex-shrink: 0;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .card-list-image img,
  .card-list-image .card-image-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-list-content {
    flex: 1;
    min-width: 0;
  }

  .card-list-content .card-title {
    font-size: var(--font-size-base);
    margin-bottom: var(--space-2);
  }

  .card-list-content .card-excerpt {
    -webkit-line-clamp: 1;
    margin-bottom: var(--space-2);
  }

  .card-read-more {
    font-size: var(--font-size-xs);
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
  }
`;
