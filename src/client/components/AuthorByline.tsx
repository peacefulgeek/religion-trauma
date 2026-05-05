import React from 'react';

interface Props {
  publishedAt?: string;
  readingTime?: number;
  updatedAt?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function AuthorByline({ publishedAt, readingTime, updatedAt }: Props) {
  return (
    <div className="author-byline" itemScope itemType="https://schema.org/Person">
      <div className="byline-avatar">
        <div className="byline-avatar-inner">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="var(--color-accent)" opacity="0.15"/>
            <circle cx="18" cy="13" r="6" fill="var(--color-accent)" opacity="0.6"/>
            <path d="M5 32 C5 25 11 20 18 20 C25 20 31 25 31 32" fill="var(--color-accent)" opacity="0.4"/>
          </svg>
        </div>
      </div>
      <div className="byline-info">
        <div className="byline-name-row">
          <a
            href="https://theoraclelover.com"
            target="_blank"
            rel="noopener noreferrer"
            className="byline-name"
            itemProp="name"
          >
            The Oracle Lover
          </a>
          <span className="byline-title">Intuitive Educator & Oracle Guide</span>
        </div>
        <div className="byline-meta">
          {publishedAt && (
            <time dateTime={publishedAt} className="byline-date">
              {formatDate(publishedAt)}
            </time>
          )}
          {readingTime && (
            <span className="byline-reading-time">{readingTime} min read</span>
          )}
          {updatedAt && updatedAt !== publishedAt && (
            <span className="byline-updated">Updated {formatDate(updatedAt)}</span>
          )}
        </div>
      </div>

      <style>{`
        .author-byline {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-6);
        }

        .byline-avatar-inner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          flex-shrink: 0;
        }

        .byline-info {
          flex: 1;
        }

        .byline-name-row {
          display: flex;
          align-items: baseline;
          gap: var(--space-2);
          flex-wrap: wrap;
          margin-bottom: 4px;
        }

        .byline-name {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          color: var(--color-accent);
          text-decoration: none;
        }

        .byline-name:hover {
          text-decoration: underline;
        }

        .byline-title {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }

        .byline-meta {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .byline-date,
        .byline-reading-time,
        .byline-updated {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }

        .byline-meta > * + *::before {
          content: '·';
          margin-right: var(--space-3);
        }
      `}</style>
    </div>
  );
}
