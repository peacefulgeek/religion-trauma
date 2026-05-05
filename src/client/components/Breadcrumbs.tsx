import React from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list" itemScope itemType="https://schema.org/BreadcrumbList">
        {crumbs.map((crumb, i) => (
          <li
            key={i}
            className="breadcrumb-item"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {crumb.href && i < crumbs.length - 1 ? (
              <Link to={crumb.href} className="breadcrumb-link" itemProp="item">
                <span itemProp="name">{crumb.label}</span>
              </Link>
            ) : (
              <span className="breadcrumb-current" itemProp="name" aria-current="page">
                {crumb.label}
              </span>
            )}
            <meta itemProp="position" content={String(i + 1)} />
            {i < crumbs.length - 1 && (
              <span className="breadcrumb-sep" aria-hidden="true">›</span>
            )}
          </li>
        ))}
      </ol>

      <style>{`
        .breadcrumbs {
          margin-bottom: var(--space-6);
        }

        .breadcrumb-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-1);
          list-style: none;
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .breadcrumb-link {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: color var(--transition-fast);
        }

        .breadcrumb-link:hover {
          color: var(--color-accent-dark);
          text-decoration: underline;
        }

        .breadcrumb-current {
          color: var(--color-muted);
          font-weight: var(--font-weight-normal);
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .breadcrumb-sep {
          color: var(--color-muted-light);
          font-size: 0.9em;
        }
      `}</style>
    </nav>
  );
}
