import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

export function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <span className="tag" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>About This Site</span>
          <h1 className="about-title">The Faith Wound</h1>
          <p className="about-lead">
            For everyone who left a faith tradition and is sorting out what was real, what was harmful, and who they are now that the framework is gone.
          </p>
        </div>
        <div className="about-hero-visual">
          <div className="about-visual-inner">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="58" stroke="var(--color-accent)" strokeWidth="2" fill="none" opacity="0.3"/>
              <circle cx="60" cy="60" r="45" stroke="var(--color-accent)" strokeWidth="1" fill="none" opacity="0.2"/>
              <path d="M60 20 C60 20, 42 38 42 56 C42 65.9 50.1 74 60 74 C69.9 74 78 65.9 78 56 C78 38 60 20 60 20Z" fill="var(--color-accent)" opacity="0.6"/>
              <path d="M60 32 L60 74" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M51 52 L60 43 L69 52" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>What This Site Is</h2>
          <p>
            The Faith Wound is a resource hub for people navigating religious trauma, faith deconstruction, and the aftermath of leaving high-control religious environments. It exists because the experience of leaving a faith tradition is one of the most disorienting things a person can go through — and most of the internet either dismisses it or makes it worse.
          </p>
          <p>
            Every article here is written with clinical awareness, research backing, and the kind of directness that people in this situation actually need. No toxic positivity. No "just pray about it." No judgment about where you land.
          </p>
        </section>

        <section className="about-section about-author-section">
          <div className="author-card">
            <div className="author-card-avatar">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="rgba(122, 96, 64, 0.15)"/>
                <circle cx="40" cy="28" r="14" fill="rgba(122, 96, 64, 0.5)"/>
                <path d="M10 72 C10 56 24 44 40 44 C56 44 70 56 70 72" fill="rgba(122, 96, 64, 0.35)"/>
              </svg>
            </div>
            <div className="author-card-content">
              <h2>The Oracle Lover</h2>
              <p className="author-card-title">Intuitive Educator & Oracle Guide</p>
              <p>
                The Oracle Lover is a no-BS oracle reader with a science degree who writes about religious trauma, faith transitions, and the messy, real work of building a self that isn't borrowed from someone else's belief system.
              </p>
              <p>
                With a background in both empirical research and intuitive practice, The Oracle Lover brings a rare combination of clinical rigor and lived experience to the subject of religious trauma. The writing here is informed by the work of researchers like Marlene Winell (who coined the term "Religious Trauma Syndrome"), Judith Herman's trauma framework, and the growing body of clinical literature on high-control religious groups.
              </p>
              <a
                href="https://theoraclelover.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ marginTop: 'var(--space-4)', display: 'inline-flex' }}
              >
                Visit theoraclelover.com
              </a>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Editorial Standards</h2>
          <p>
            Every article on The Faith Wound is written to meet the following standards:
          </p>
          <div className="standards-grid">
            {[
              { icon: '◈', title: 'Research-Backed', desc: 'Claims are grounded in peer-reviewed research, clinical literature, and credible sources. We cite our sources.' },
              { icon: '◉', title: 'Clinically Aware', desc: 'Content is informed by the clinical literature on trauma, religious trauma syndrome, and evidence-based treatment.' },
              { icon: '◆', title: 'No Agenda', desc: 'We don\'t advocate for or against any religious position. We describe what the research shows and what people experience.' },
              { icon: '◎', title: 'Regularly Updated', desc: 'Articles are refreshed quarterly to reflect new research and updated clinical understanding.' },
            ].map(s => (
              <div key={s.title} className="standard-card">
                <span className="standard-icon">{s.icon}</span>
                <h3 className="standard-title">{s.title}</h3>
                <p className="standard-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Affiliate Disclosure</h2>
          <p>
            The Faith Wound participates in the Amazon Associates program. Some links to books and resources are affiliate links, which means we earn a small commission if you purchase through them — at no extra cost to you. We only recommend books and resources we believe are genuinely useful. Affiliate income helps keep this site free and ad-light.
          </p>
        </section>

        <section className="about-section">
          <h2>Medical Disclaimer</h2>
          <p>
            This site provides information and education, not clinical treatment or medical advice. If you are experiencing significant distress, please reach out to a qualified mental health professional. If you are in crisis, please contact{' '}
            <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer">
              SAMHSA's National Helpline
            </a>{' '}
            at 1-800-662-4357 (free, confidential, 24/7).
          </p>
          <p>
            For therapists who specialize in religious trauma, the{' '}
            <a href="https://www.religioustraumainstitute.com" target="_blank" rel="noopener noreferrer">
              Religious Trauma Institute
            </a>{' '}
            maintains a directory of trained clinicians.
          </p>
        </section>

        <div className="about-cta">
          <Link to="/articles" className="btn btn-primary">Read the Articles</Link>
          <Link to="/assessments" className="btn btn-outline">Take an Assessment</Link>
        </div>
      </div>

      <Footer />

      <style>{`
        .about-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-8);
          padding: var(--space-8) 0 var(--space-12);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-10);
        }

        .about-title {
          font-size: var(--font-size-4xl);
          font-weight: var(--font-weight-extrabold);
          color: var(--color-heading);
          letter-spacing: -0.03em;
          margin-bottom: var(--space-4);
        }

        .about-lead {
          font-size: var(--font-size-xl);
          color: var(--color-muted);
          line-height: 1.6;
          max-width: 560px;
        }

        .about-visual-inner {
          opacity: 0.6;
        }

        .about-content {
          max-width: var(--content-max-width);
          margin: 0 auto;
        }

        .about-section {
          margin-bottom: var(--space-12);
          padding-bottom: var(--space-10);
          border-bottom: 1px solid var(--color-border);
        }

        .about-section:last-of-type {
          border-bottom: none;
        }

        .about-section h2 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-5);
        }

        .about-section p {
          font-size: var(--font-size-base);
          color: var(--color-text);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--space-4);
        }

        .about-section a {
          color: var(--color-accent);
          text-decoration: underline;
        }

        .author-card {
          display: flex;
          gap: var(--space-8);
          align-items: flex-start;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
        }

        .author-card-avatar {
          flex-shrink: 0;
        }

        .author-card-content h2 {
          margin-bottom: var(--space-1);
        }

        .author-card-title {
          font-size: var(--font-size-sm);
          color: var(--color-accent);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-4) !important;
        }

        .standards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-5);
          margin-top: var(--space-5);
        }

        .standard-card {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
        }

        .standard-icon {
          display: block;
          font-size: 1.5rem;
          color: var(--color-accent);
          margin-bottom: var(--space-3);
        }

        .standard-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-bold);
          color: var(--color-heading);
          margin-bottom: var(--space-2);
        }

        .standard-desc {
          font-size: var(--font-size-sm);
          color: var(--color-muted);
          line-height: 1.6;
          margin: 0 !important;
        }

        .about-cta {
          display: flex;
          gap: var(--space-3);
          margin: var(--space-10) 0;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .about-hero { flex-direction: column; }
          .about-visual-inner { display: none; }
          .author-card { flex-direction: column; }
          .standards-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
