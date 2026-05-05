import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: Props) {
  return (
    <header className="mobile-header" aria-label="Mobile navigation">
      <button
        className="menu-toggle"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <Link to="/" className="mobile-logo">
        <span className="mobile-logo-text">The Faith Wound</span>
      </Link>

      <Link to="/assessments" className="mobile-cta">
        Take Assessment
      </Link>

      <style>{`
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: var(--color-sidebar);
          border-bottom: 1px solid var(--color-border);
          z-index: var(--z-header);
          align-items: center;
          padding: 0 var(--space-4);
          gap: var(--space-3);
        }

        .menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text);
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background var(--transition-fast);
        }

        .menu-toggle:hover {
          background: var(--color-bg);
        }

        .mobile-logo {
          flex: 1;
          text-decoration: none;
        }

        .mobile-logo-text {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          letter-spacing: -0.01em;
        }

        .mobile-cta {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          color: white;
          background: var(--color-accent);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background var(--transition-fast);
        }

        .mobile-cta:hover {
          background: var(--color-accent-dark);
          color: white;
        }

        @media (max-width: 1024px) {
          .mobile-header {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
