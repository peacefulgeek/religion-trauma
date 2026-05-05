import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-col--brand">
            <div className="footer-logo">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
                <path d="M16 6 C16 6, 10 12, 10 18 C10 21.3 12.7 24 16 24 C19.3 24 22 21.3 22 18 C22 12 16 6 16 6Z" fill="currentColor" opacity="0.7"/>
                <path d="M16 10 L16 24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>The Faith Wound</span>
            </div>
            <p className="footer-tagline">
              For everyone who left a faith tradition and is sorting out what was real, what was harmful, and who they are now.
            </p>
            <p className="footer-affiliate">
              As an Amazon Associate I earn from qualifying purchases.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/articles">All Articles</Link></li>
              <li><Link to="/assessments">Assessments</Link></li>
              <li><Link to="/tools">Recommended</Link></li>
              <li><Link to="/category/religious-trauma">Religious Trauma</Link></li>
              <li><Link to="/category/deconstruction">Deconstruction</Link></li>
              <li><Link to="/category/purity-culture">Purity Culture</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="https://www.religioustraumainstitute.com" target="_blank" rel="noopener noreferrer">
                  Religious Trauma Institute
                </a>
              </li>
              <li>
                <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer">
                  SAMHSA Helpline
                </a>
              </li>
              <li>
                <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer">
                  Find a Therapist
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Connect</h4>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li>
                <a href="https://theoraclelover.com" target="_blank" rel="noopener noreferrer">
                  The Oracle Lover
                </a>
              </li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
            <div className="footer-niche-tag">
              Religious Trauma Recovery
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} The Faith Wound. Written by{' '}
            <a href="https://theoraclelover.com" target="_blank" rel="noopener noreferrer">
              The Oracle Lover
            </a>.
          </p>
          <p className="footer-disclaimer">
            This site is for informational purposes only and does not constitute medical or psychological advice.
            If you're in crisis, please contact{' '}
            <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer">
              SAMHSA's National Helpline
            </a>{' '}
            at 1-800-662-4357.
          </p>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--color-sidebar);
          border-top: 1px solid var(--color-border);
          margin-top: var(--space-16);
          padding: var(--space-12) 0 var(--space-8);
        }

        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 var(--space-8);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: var(--space-8);
          margin-bottom: var(--space-8);
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-accent);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-3);
        }

        .footer-tagline {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          line-height: 1.6;
          margin-bottom: var(--space-3);
        }

        .footer-affiliate {
          font-size: var(--font-size-xs);
          color: var(--color-muted-light);
          font-style: italic;
        }

        .footer-col-title {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-3);
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer-links a {
          font-size: var(--font-size-sm);
          color: var(--color-text);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer-links a:hover {
          color: var(--color-accent);
        }

        .footer-niche-tag {
          margin-top: var(--space-4);
          font-size: var(--font-size-xs);
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
          padding: var(--space-1) var(--space-3);
          background: rgba(122, 96, 64, 0.1);
          border-radius: var(--radius-full);
          display: inline-block;
          border: 1px solid rgba(122, 96, 64, 0.2);
        }

        .footer-bottom {
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer-copyright {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }

        .footer-copyright a {
          color: var(--color-accent);
          text-decoration: none;
        }

        .footer-disclaimer {
          font-size: var(--font-size-xs);
          color: var(--color-muted-light);
          line-height: 1.5;
        }

        .footer-disclaimer a {
          color: var(--color-accent);
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-6);
          }
        }

        @media (max-width: 640px) {
          .footer-inner {
            padding: 0 var(--space-4);
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--space-5);
          }
        }
      `}</style>
    </footer>
  );
}
