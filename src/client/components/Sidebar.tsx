import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Category {
  category: string;
  count: number;
}

interface Article {
  slug: string;
  title: string;
  reading_time: number;
  published_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
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

export function Sidebar({ isOpen, onClose }: Props) {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles?limit=5')
      .then(r => r.json())
      .then(data => {
        setCategories(data.categories || []);
        setRecentArticles(data.articles || []);
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: '⌂' },
    { href: '/articles', label: 'All Articles', icon: '◈' },
    { href: '/assessments', label: 'Assessments', icon: '◉' },
    { href: '/supplements', label: 'Supplements', icon: '◇' },
    { href: '/tools', label: 'Recommended', icon: '◆' },
    { href: '/about', label: 'About', icon: '◎' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} aria-label="Site navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/" className="logo-link" onClick={onClose}>
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
              <path d="M16 6 C16 6, 10 12, 10 18 C10 21.3 12.7 24 16 24 C19.3 24 22 21.3 22 18 C22 12 16 6 16 6Z" fill="currentColor" opacity="0.7"/>
              <path d="M16 10 L16 24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 16 L16 13 L19 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">The Faith Wound</span>
            <span className="logo-tagline">Healing. Clarity. Freedom.</span>
          </div>
        </Link>
      </div>

      {/* Author Bio */}
      <div className="sidebar-author">
        <div className="author-avatar">
          <img
            src="https://religion-trauma.b-cdn.net/author-avatar.webp"
            alt="The Oracle Lover"
            className="author-avatar-img"
            loading="lazy"
            width="56"
            height="56"
          />
        </div>
        <div className="author-info">
          <h3 className="author-name">The Oracle Lover</h3>
          <p className="author-title">Intuitive Educator & Oracle Guide</p>
          <p className="author-bio">
            No-BS oracle reader with a science degree. Demystifying religious trauma, faith transitions, and the path to a self you actually recognize.
          </p>
          <a
            href="https://theoraclelover.com"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            theoraclelover.com →
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        <ul className="nav-list">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`nav-link ${location.pathname === link.href ? 'nav-link--active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Browse by Topic</h4>
          <ul className="category-list">
            {categories.map(cat => (
              <li key={cat.category}>
                <Link
                  to={`/category/${cat.category}`}
                  className={`category-link ${location.pathname === `/category/${cat.category}` ? 'category-link--active' : ''}`}
                  onClick={onClose}
                >
                  <span className="category-label">
                    {CATEGORY_LABELS[cat.category] || cat.category}
                  </span>
                  <span className="category-count">{cat.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Recent Articles</h4>
          <ul className="recent-list">
            {recentArticles.slice(0, 5).map(article => (
              <li key={article.slug}>
                <Link
                  to={`/articles/${article.slug}`}
                  className="recent-link"
                  onClick={onClose}
                >
                  <span className="recent-title">{article.title}</span>
                  <span className="recent-meta">{article.reading_time} min read</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Health Disclaimer */}
      <div className="sidebar-disclaimer">
        <p>
          <strong>Mental Health Resources:</strong>{' '}
          <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer">
            SAMHSA Helpline
          </a>{' '}
          •{' '}
          <a href="https://www.religioustraumainstitute.com" target="_blank" rel="noopener noreferrer">
            Religious Trauma Institute
          </a>
        </p>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--color-sidebar);
          border-right: 1px solid var(--color-border);
          overflow-y: auto;
          overflow-x: hidden;
          z-index: var(--z-sidebar);
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform var(--transition-base);
        }

        .sidebar-logo {
          padding: var(--space-5) var(--space-5) var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          color: var(--color-heading);
        }

        .logo-icon {
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .logo-title {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .logo-tagline {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--color-muted);
          font-weight: var(--font-weight-normal);
          margin-top: 2px;
        }

        .sidebar-author {
          padding: var(--space-5);
          border-bottom: 1px solid var(--color-border);
        }

        .author-avatar {
          margin-bottom: var(--space-3);
        }

        .author-avatar-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-accent);
          display: block;
        }

        .author-name {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: 2px;
        }

        .author-title {
          font-size: var(--font-size-xs);
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-2);
        }

        .author-bio {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
          line-height: 1.5;
          margin-bottom: var(--space-2);
        }

        .author-link {
          font-size: var(--font-size-xs);
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
          text-decoration: none;
        }

        .author-link:hover {
          color: var(--color-accent-dark);
          text-decoration: underline;
        }

        .sidebar-nav {
          padding: var(--space-4) var(--space-3);
          border-bottom: 1px solid var(--color-border);
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-text);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          background: var(--color-bg);
          color: var(--color-accent);
        }

        .nav-link--active {
          background: var(--color-accent);
          color: white;
        }

        .nav-link--active:hover {
          background: var(--color-accent-dark);
          color: white;
        }

        .nav-icon {
          font-size: 1rem;
          opacity: 0.7;
        }

        .sidebar-section {
          padding: var(--space-4) var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }

        .sidebar-section-title {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-3);
        }

        .category-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .category-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          color: var(--color-text);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .category-link:hover {
          background: var(--color-bg);
          color: var(--color-accent);
        }

        .category-link--active {
          background: rgba(122, 96, 64, 0.1);
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
        }

        .category-count {
          background: var(--color-bg);
          color: var(--color-muted);
          font-size: 10px;
          font-weight: var(--font-weight-semibold);
          padding: 1px 6px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          min-width: 22px;
          text-align: center;
        }

        .recent-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .recent-link {
          display: block;
          text-decoration: none;
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }

        .recent-link:hover {
          background: var(--color-bg);
        }

        .recent-title {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--color-text);
          line-height: 1.4;
          margin-bottom: 2px;
          font-weight: var(--font-weight-medium);
        }

        .recent-link:hover .recent-title {
          color: var(--color-accent);
        }

        .recent-meta {
          font-size: 10px;
          color: var(--color-muted);
        }

        .sidebar-disclaimer {
          padding: var(--space-4);
          margin-top: auto;
        }

        .sidebar-disclaimer p {
          font-size: 10px;
          color: var(--color-muted);
          line-height: 1.5;
        }

        .sidebar-disclaimer a {
          color: var(--color-accent);
          text-decoration: underline;
        }

        /* Mobile: hidden by default, slides in */
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
            width: 280px;
          }

          .sidebar--open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}
