import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Footer } from '../components/Footer';
import SEOHead from '../components/SEOHead';

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

const ASSESSMENTS = [
  {
    slug: 'religious-trauma-assessment',
    title: 'Do You Have Religious Trauma?',
    description: 'A clinical-informed self-assessment to identify signs of religious trauma syndrome.',
    icon: '◉',
    time: '5 min',
    color: '#7A6040',
    bg: 'rgba(122, 96, 64, 0.08)',
  },
  {
    slug: 'deconstruction-stage-finder',
    title: 'Where Are You in Deconstruction?',
    description: 'Find out which stage of faith transition you\'re in — and what typically comes next.',
    icon: '◈',
    time: '4 min',
    color: '#4A6741',
    bg: 'rgba(74, 103, 65, 0.08)',
  },
  {
    slug: 'post-faith-identity-quiz',
    title: 'Who Are You Now?',
    description: 'A post-faith identity assessment to help you understand your values and worldview.',
    icon: '◎',
    time: '6 min',
    color: '#5C4830',
    bg: 'rgba(92, 72, 48, 0.08)',
  },
];

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'The Faith Wound — Religious Trauma Recovery & Faith Deconstruction',
  description: 'Evidence-informed resources for religious trauma recovery, faith deconstruction, and post-faith identity. You are not alone. Healing is possible.',
  url: 'https://thefaithwound.com',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.hero-title', '.hero-subtitle'],
  },
};

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles?limit=9')
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <SEOHead
        title="Religious Trauma Recovery & Faith Deconstruction Resources"
        description="Evidence-informed resources for religious trauma recovery, faith deconstruction, and post-faith identity. 30+ research-backed articles, 3 free assessments. You are not alone."
        ogType="website"
        canonicalUrl="/"
        ogImage="/images/hero-main.jpg"
        jsonLd={HOME_JSON_LD}
        keywords={['religious trauma recovery', 'faith deconstruction resources', 'religious trauma syndrome', 'leaving religion help', 'spiritual abuse recovery']}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Religious Trauma Recovery</span>
          </div>
          <h1 className="hero-title">
            You Left. Now What?
          </h1>
          <p className="hero-subtitle">
            Leaving a faith tradition is one of the most disorienting things a person can do. This is the resource hub for sorting out what was real, what was harmful, and who you are now that the framework is gone.
          </p>
          <div className="hero-actions">
            <Link to="/articles" className="btn btn-primary hero-btn">
              Read the Articles
            </Link>
            <Link to="/assessments" className="btn btn-outline hero-btn">
              Take an Assessment
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">30+</span>
              <span className="stat-label">Research-backed articles</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Free assessments</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Judgment</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src="/images/hero-main.jpg"
              alt="A person standing on a mountain at golden hour with arms outstretched, symbolizing liberation and the journey of faith deconstruction"
              className="hero-img"
              loading="eager"
              decoding="async"
            />
            <div className="hero-image-overlay">
              <div className="hero-quote">
                <p>"Your grief about this is appropriate. You lost a complete cosmology."</p>
                <cite>— The Oracle Lover</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessments Section */}
      <section className="assessments-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Where Are You Right Now?</h2>
            <p className="section-subtitle">
              These assessments are starting points. Not diagnoses. Not labels. Just clarity.
            </p>
          </div>
          <Link to="/assessments" className="section-link">All assessments →</Link>
        </div>
        <div className="assessments-grid">
          {ASSESSMENTS.map(assessment => (
            <Link
              key={assessment.slug}
              to={`/assessments/${assessment.slug}`}
              className="assessment-card"
              style={{ '--card-accent': assessment.color, '--card-bg': assessment.bg } as React.CSSProperties}
            >
              <div className="assessment-icon" style={{ color: assessment.color }}>
                {assessment.icon}
              </div>
              <div className="assessment-content">
                <h3 className="assessment-title">{assessment.title}</h3>
                <p className="assessment-description">{assessment.description}</p>
                <div className="assessment-meta">
                  <span className="assessment-time">⏱ {assessment.time}</span>
                  <span className="assessment-cta">Start →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="articles-section">
        <div className="section-header">
          <h2 className="section-title">Recent Articles</h2>
          <Link to="/articles" className="section-link">View all articles →</Link>
        </div>

        {loading ? (
          <div className="articles-loading">
            <div className="articles-grid">
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
          </div>
        ) : articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map(article => (
              <ArticleCard key={article.slug} article={article} view="grid" />
            ))}
          </div>
        ) : (
          <div className="articles-empty">
            <p>Articles are being prepared. Check back soon.</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="articles-cta">
            <Link to="/articles" className="btn btn-outline">
              Browse All Articles
            </Link>
          </div>
        )}
      </section>

      {/* Oracle Lover Banner */}
      <section className="oracle-banner">
        <div className="oracle-banner-content">
          <div className="oracle-avatar-wrap">
            <img
              src="/images/author-avatar.jpg"
              alt="The Oracle Lover — author and researcher specializing in religious trauma recovery"
              className="oracle-avatar-img"
              loading="lazy"
            />
          </div>
          <div className="oracle-banner-text">
            <div className="oracle-eyebrow">About the Author</div>
            <h2>The Oracle Lover</h2>
            <p>
              No-BS oracle reader with a science degree. The Oracle Lover writes about religious trauma, faith transitions, and the messy, real work of building a self that isn't borrowed from someone else's belief system.
            </p>
            <div className="oracle-actions">
              <Link to="/about" className="btn btn-ghost-white">
                Read the Full Bio
              </Link>
              <a
                href="https://theoraclelover.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-white"
              >
                Visit theoraclelover.com ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer-section">
        <div className="disclaimer-content">
          <strong>Mental Health Resources:</strong> If you're in crisis, please reach out to{' '}
          <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer">
            SAMHSA's National Helpline
          </a>{' '}
          (1-800-662-4357) or the{' '}
          <a href="https://www.religioustraumainstitute.com" target="_blank" rel="noopener noreferrer">
            Religious Trauma Institute
          </a>.
          This site provides information, not clinical treatment.
        </div>
      </section>

      <Footer />

      <style>{`
        .home-page {
          min-height: 100vh;
        }

        /* ─── Hero ─── */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
          align-items: center;
          padding: var(--space-12) 0 var(--space-16);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-12);
        }

        .hero-badge {
          display: inline-flex;
          margin-bottom: var(--space-4);
        }

        .hero-badge span {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: var(--space-1) var(--space-3);
          background: rgba(122, 96, 64, 0.1);
          border-radius: var(--radius-full);
          border: 1px solid rgba(122, 96, 64, 0.2);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-heading);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: var(--space-5);
        }

        .hero-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-muted);
          line-height: 1.7;
          margin-bottom: var(--space-8);
          max-width: 520px;
        }

        .hero-actions {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          margin-bottom: var(--space-10);
        }

        .hero-btn {
          padding: var(--space-4) var(--space-8);
          font-size: var(--font-size-base);
        }

        .hero-stats {
          display: flex;
          gap: var(--space-8);
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-number {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-accent);
          line-height: 1;
        }

        .stat-label {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image-frame {
          width: 100%;
          max-width: 520px;
          aspect-ratio: 4/3;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          position: relative;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }

        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(20, 12, 6, 0.82) 0%, transparent 55%);
          display: flex;
          align-items: flex-end;
          padding: var(--space-8);
        }

        .hero-quote {
          color: white;
        }

        .hero-quote p {
          font-size: var(--font-size-lg);
          font-style: italic;
          line-height: 1.5;
          margin-bottom: var(--space-2);
          font-weight: var(--font-weight-medium);
        }

        .hero-quote cite {
          font-size: var(--font-size-sm);
          color: rgba(255,255,255,0.7);
          font-style: normal;
        }

        /* ─── Assessments ─── */
        .assessments-section {
          margin-bottom: var(--space-16);
        }

        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .section-title {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
        }

        .section-subtitle {
          font-size: var(--font-size-base);
          color: var(--color-muted);
          margin-top: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .section-link {
          font-size: var(--font-size-sm);
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
          text-decoration: none;
          white-space: nowrap;
        }

        .section-link:hover {
          text-decoration: underline;
        }

        .assessments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }

        .assessment-card {
          display: block;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          text-decoration: none;
          color: inherit;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
          border-top: 3px solid var(--card-accent, var(--color-accent));
        }

        .assessment-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          background: var(--card-bg, rgba(122,96,64,0.05));
        }

        .assessment-icon {
          font-size: 2rem;
          margin-bottom: var(--space-4);
          display: block;
        }

        .assessment-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-2);
          line-height: 1.3;
        }

        .assessment-description {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          line-height: 1.6;
          margin-bottom: var(--space-4);
        }

        .assessment-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .assessment-time {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }

        .assessment-cta {
          font-size: var(--font-size-sm);
          color: var(--color-accent);
          font-weight: var(--font-weight-semibold);
          transition: transform var(--transition-fast);
        }

        .assessment-card:hover .assessment-cta {
          transform: translateX(4px);
        }

        /* ─── Articles ─── */
        .articles-section {
          margin-bottom: var(--space-16);
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
          margin-bottom: var(--space-8);
        }

        .articles-cta {
          text-align: center;
        }

        .articles-empty {
          text-align: center;
          padding: var(--space-12);
          color: var(--color-muted);
          background: var(--color-card);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--color-border);
        }

        /* Loading skeleton */
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

        /* ─── Oracle Banner ─── */
        .oracle-banner {
          background: linear-gradient(135deg, #1C1008 0%, #3D2410 40%, #6B4020 70%, #8B5A30 100%);
          border-radius: var(--radius-xl);
          padding: var(--space-10) var(--space-12);
          margin-bottom: var(--space-12);
          overflow: hidden;
          position: relative;
        }

        .oracle-banner::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(196, 149, 106, 0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        .oracle-banner-content {
          display: flex;
          align-items: center;
          gap: var(--space-10);
          position: relative;
          z-index: 1;
        }

        .oracle-avatar-wrap {
          flex-shrink: 0;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(196, 149, 106, 0.5);
          box-shadow: 0 0 0 6px rgba(196, 149, 106, 0.15);
        }

        .oracle-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        .oracle-banner-text {
          flex: 1;
        }

        .oracle-eyebrow {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          color: rgba(196, 149, 106, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--space-2);
        }

        .oracle-banner-text h2 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: white;
          margin-bottom: var(--space-3);
        }

        .oracle-banner-text p {
          font-size: var(--font-size-base);
          color: rgba(255,255,255,0.8);
          line-height: 1.7;
          margin-bottom: var(--space-6);
          max-width: 520px;
        }

        .oracle-actions {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .btn-ghost-white {
          display: inline-flex;
          align-items: center;
          padding: var(--space-3) var(--space-5);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: var(--radius-md);
          color: rgba(255,255,255,0.9);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          text-decoration: none;
          transition: all var(--transition-base);
          background: rgba(255,255,255,0.08);
        }

        .btn-ghost-white:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.5);
          color: white;
        }

        /* ─── Disclaimer ─── */
        .disclaimer-section {
          margin-bottom: var(--space-8);
        }

        .disclaimer-content {
          background: rgba(122, 96, 64, 0.06);
          border: 1px solid rgba(122, 96, 64, 0.15);
          border-radius: var(--radius-md);
          padding: var(--space-4) var(--space-6);
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          line-height: 1.6;
        }

        .disclaimer-content a {
          color: var(--color-accent);
          text-decoration: underline;
        }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }

          .hero-visual {
            order: -1;
          }

          .hero-image-frame {
            max-width: 100%;
            aspect-ratio: 16/7;
          }

          .assessments-grid {
            grid-template-columns: 1fr;
          }

          .articles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .hero-stats {
            gap: var(--space-5);
          }

          .articles-grid {
            grid-template-columns: 1fr;
          }

          .oracle-banner {
            padding: var(--space-8) var(--space-6);
          }

          .oracle-banner-content {
            flex-direction: column;
            text-align: center;
          }

          .oracle-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
