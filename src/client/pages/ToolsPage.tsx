import React from 'react';
import { Footer } from '../components/Footer';

const AMAZON_TAG = 'spankyspinola-20';

const BOOKS = [
  {
    asin: '0062641794',
    title: 'Leaving the Witness',
    author: 'Amber Scorah',
    category: 'Memoir',
    description: 'A former Jehovah\'s Witness describes her journey out of the organization and the identity crisis that followed. Beautifully written and deeply honest.',
    tags: ['memoir', 'jehovahs-witness', 'leaving-religion'],
  },
  {
    asin: '0807014273',
    title: 'Trauma and Recovery',
    author: 'Judith Herman',
    category: 'Clinical',
    description: 'The foundational text on trauma recovery. Herman\'s framework is directly applicable to religious trauma and is cited by virtually every clinician in the field.',
    tags: ['trauma', 'clinical', 'recovery', 'essential'],
  },
  {
    asin: '1400205549',
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    category: 'Clinical',
    description: 'How trauma lives in the body — essential reading for anyone whose religious experience involved shame, physical control, or emotional suppression.',
    tags: ['trauma', 'body', 'somatic', 'clinical'],
  },
  {
    asin: '0062300253',
    title: 'Faith After Doubt',
    author: 'Brian McLaren',
    category: 'Deconstruction',
    description: 'McLaren\'s framework for understanding faith stages is genuinely useful for people in deconstruction who aren\'t sure what they\'re moving toward.',
    tags: ['deconstruction', 'faith', 'stages', 'brian-mclaren'],
  },
  {
    asin: '1572245530',
    title: 'The Mindfulness and Acceptance Workbook for Anxiety',
    author: 'John P. Forsyth & Georg H. Eifert',
    category: 'Workbook',
    description: 'ACT-based workbook that\'s particularly useful for the anxiety patterns that often accompany religious trauma and scrupulosity.',
    tags: ['anxiety', 'act', 'workbook', 'ocd'],
  },
  {
    asin: '1626258406',
    title: 'The Body Is Not an Apology',
    author: 'Sonya Renee Taylor',
    category: 'Body Healing',
    description: 'Radical self-love as a framework for healing from body shame — directly applicable to purity culture survivors.',
    tags: ['body', 'shame', 'purity-culture', 'healing'],
  },
  {
    asin: '0062885308',
    title: 'Educated',
    author: 'Tara Westover',
    category: 'Memoir',
    description: 'A memoir about growing up in a survivalist family and the process of building an education and identity outside of that world.',
    tags: ['memoir', 'high-control', 'identity', 'education'],
  },
  {
    asin: '1572244259',
    title: 'Self-Compassion: The Proven Power of Being Kind to Yourself',
    author: 'Kristin Neff',
    category: 'Self-Help',
    description: 'The research on self-compassion is directly relevant to religious trauma recovery, where self-criticism and shame are often deeply entrenched.',
    tags: ['self-compassion', 'shame', 'healing', 'research'],
  },
];

function buildUrl(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

export function ToolsPage() {
  return (
    <div className="tools-page">
      <div className="tools-header">
        <span className="tag" style={{ marginBottom: 'var(--space-3)', display: 'inline-flex' }}>Recommended Resources</span>
        <h1 className="page-title">Faith Transition Library</h1>
        <p className="page-subtitle">
          Books and tools that people navigating religious trauma and faith transitions have found genuinely useful. Curated with clinical awareness.
        </p>
        <p className="affiliate-notice">
          As an Amazon Associate, I earn from qualifying purchases. This doesn't change the price you pay.
        </p>
      </div>

      <div className="books-grid">
        {BOOKS.map(book => (
          <div key={book.asin} className="book-card">
            <div className="book-cover">
              <div className="book-cover-placeholder">
                <span className="book-icon">◆</span>
              </div>
            </div>
            <div className="book-content">
              <span className="book-category tag">{book.category}</span>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <p className="book-description">{book.description}</p>
              <a
                href={buildUrl(book.asin)}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="book-link btn btn-primary"
              >
                View on Amazon ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="tools-disclaimer">
        <h3>How These Are Selected</h3>
        <p>
          Every book listed here has been evaluated for clinical relevance, accuracy, and usefulness for people in faith transitions. We prioritize books that are grounded in research, written by credible authors, and that people in this community have found genuinely helpful.
        </p>
        <p>
          We do not accept payment for placement. Affiliate commissions are earned only when you purchase through our links, and they help support this site.
        </p>
      </div>

      <Footer />

      <style>{`
        .tools-header {
          margin-bottom: var(--space-10);
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
          margin-bottom: var(--space-3);
        }

        .affiliate-notice {
          font-size: var(--font-size-xs);
          color: var(--color-muted-light);
          font-style: italic;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-12);
        }

        .book-card {
          display: flex;
          gap: var(--space-5);
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          transition: all var(--transition-base);
        }

        .book-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }

        .book-cover {
          flex-shrink: 0;
          width: 80px;
        }

        .book-cover-placeholder {
          width: 80px;
          height: 110px;
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 3px 3px 8px rgba(0,0,0,0.2);
        }

        .book-icon {
          color: rgba(255,255,255,0.6);
          font-size: 1.5rem;
        }

        .book-content {
          flex: 1;
          min-width: 0;
        }

        .book-category {
          margin-bottom: var(--space-2);
          display: inline-flex;
        }

        .book-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-1);
          line-height: 1.3;
        }

        .book-author {
          font-size: var(--font-size-xs);
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-3);
        }

        .book-description {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          line-height: 1.6;
          margin-bottom: var(--space-4);
        }

        .book-link {
          font-size: var(--font-size-xs);
          padding: var(--space-2) var(--space-4);
        }

        .tools-disclaimer {
          background: var(--color-sidebar);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6) var(--space-8);
          margin-bottom: var(--space-8);
        }

        .tools-disclaimer h3 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-3);
        }

        .tools-disclaimer p {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          line-height: 1.7;
          margin-bottom: var(--space-3);
        }

        @media (max-width: 768px) {
          .books-grid { grid-template-columns: 1fr; }
          .book-card { flex-direction: column; }
          .book-cover { width: 100%; }
          .book-cover-placeholder { width: 80px; height: 110px; }
        }
      `}</style>
    </div>
  );
}
