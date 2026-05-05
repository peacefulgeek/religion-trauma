import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">◎</div>
        <h1>Page Not Found</h1>
        <p>
          The page you're looking for doesn't exist. It may have been moved or the URL might be incorrect.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/articles" className="btn btn-outline">Browse Articles</Link>
        </div>
      </div>

      <style>{`
        .not-found-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .not-found-content {
          text-align: center;
          max-width: 480px;
        }

        .not-found-icon {
          font-size: 4rem;
          color: var(--color-muted-light);
          margin-bottom: var(--space-6);
        }

        .not-found-content h1 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-4);
        }

        .not-found-content p {
          font-size: var(--font-size-base);
          color: var(--color-muted);
          line-height: 1.6;
          margin-bottom: var(--space-8);
        }

        .not-found-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
