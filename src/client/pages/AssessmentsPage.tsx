import React from 'react';
import { Link } from 'react-router-dom';

const BUNNY = 'https://religion-trauma.b-cdn.net/images';

const assessments = [
  {
    slug: 'religious-trauma-assessment',
    title: 'Religious Trauma Assessment',
    subtitle: 'Understand Your Wound',
    description: 'A 20-question evidence-informed assessment that helps you identify the presence and severity of religious trauma symptoms. Based on clinical frameworks from Marlene Winell, Janja Lalich, and the Religious Trauma Institute.',
    questions: 20,
    time: '8–10 min',
    color: '#7A6040',
    gradient: 'linear-gradient(135deg, #7A6040 0%, #9A7A50 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    tags: ['Trauma Symptoms', 'Severity Scale', 'Clinical Framework'],
    badge: 'Most Taken',
  },
  {
    slug: 'deconstruction-stage-finder',
    title: 'Deconstruction Stage Finder',
    subtitle: 'Where Are You in the Journey?',
    description: 'A 15-question reflective assessment that identifies which stage of faith deconstruction you are currently in — from initial doubt through reconstruction. Helps you understand what support is most relevant right now.',
    questions: 15,
    time: '6–8 min',
    color: '#5B7A6A',
    gradient: 'linear-gradient(135deg, #5B7A6A 0%, #7A9A8A 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    tags: ['Deconstruction Stages', 'Current Phase', 'Next Steps'],
    badge: null,
  },
  {
    slug: 'post-faith-identity-quiz',
    title: 'Post-Faith Identity Quiz',
    subtitle: 'Who Are You Becoming?',
    description: 'A 12-question exploration of your emerging post-faith identity. Identifies your dominant orientation and offers tailored resources for where you are right now.',
    questions: 12,
    time: '5–7 min',
    color: '#6B5B8A',
    gradient: 'linear-gradient(135deg, #6B5B8A 0%, #8B7BAA 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    tags: ['Identity', 'Post-Faith', 'Orientation Type'],
    badge: null,
  },
  {
    slug: 'spiritual-abuse-screening',
    title: 'Spiritual Abuse Screening',
    subtitle: 'Name What Happened',
    description: 'A 16-question screening tool to help you identify whether what you experienced in a religious context meets the clinical definition of spiritual abuse. Clear language. No minimizing.',
    questions: 16,
    time: '7–9 min',
    color: '#8A4A4A',
    gradient: 'linear-gradient(135deg, #8A4A4A 0%, #AA6A6A 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    tags: ['Spiritual Abuse', 'Screening', 'Naming'],
    badge: 'Important',
  },
  {
    slug: 'purity-culture-impact',
    title: 'Purity Culture Impact Assessment',
    subtitle: 'The Body Keeps the Score',
    description: 'An 18-question assessment examining how purity culture teachings have affected your relationship with your body, sexuality, and sense of worth. Affirming. Evidence-based. No shame.',
    questions: 18,
    time: '8–10 min',
    color: '#7A5A6A',
    gradient: 'linear-gradient(135deg, #7A5A6A 0%, #9A7A8A 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    tags: ['Purity Culture', 'Body Image', 'Sexuality'],
    badge: null,
  },
  {
    slug: 'faith-grief-inventory',
    title: 'Faith Grief Inventory',
    subtitle: 'Your Loss Is Real',
    description: 'A 14-question inventory to help you understand the layers of grief you are carrying from your faith transition. Identifies which losses are most active and what kind of support addresses each.',
    questions: 14,
    time: '6–8 min',
    color: '#4A6A7A',
    gradient: 'linear-gradient(135deg, #4A6A7A 0%, #6A8A9A 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    tags: ['Grief', 'Loss Layers', 'Support Needs'],
    badge: null,
  },
  {
    slug: 'identity-after-faith',
    title: 'Identity After Faith',
    subtitle: 'Rebuild From Here',
    description: 'A 13-question exploration of how your sense of self has shifted since leaving your faith tradition. Identifies your current identity anchors and the areas where reconstruction is most needed.',
    questions: 13,
    time: '6–7 min',
    color: '#5A7A5A',
    gradient: 'linear-gradient(135deg, #5A7A5A 0%, #7A9A7A 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    tags: ['Identity', 'Values', 'Reconstruction'],
    badge: null,
  },
  {
    slug: 'community-loss-scale',
    title: 'Community Loss Scale',
    subtitle: 'The Belonging Wound',
    description: 'A 12-question scale measuring the social and community losses from leaving your faith tradition. Identifies the depth of belonging loss and maps pathways toward secular community.',
    questions: 12,
    time: '5–6 min',
    color: '#6A5A4A',
    gradient: 'linear-gradient(135deg, #6A5A4A 0%, #8A7A6A 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    tags: ['Community', 'Belonging', 'Social Loss'],
    badge: null,
  },
  {
    slug: 'body-shame-inventory',
    title: 'Body Shame Inventory',
    subtitle: 'Reclaim Your Body',
    description: 'A 15-question inventory examining body shame rooted in religious upbringing. Identifies specific shame patterns and points toward somatic and therapeutic approaches that actually help.',
    questions: 15,
    time: '6–8 min',
    color: '#7A4A6A',
    gradient: 'linear-gradient(135deg, #7A4A6A 0%, #9A6A8A 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
        <path d="M12 8v4M12 16h.01"/>
      </svg>
    ),
    tags: ['Body Shame', 'Somatic', 'Religious Upbringing'],
    badge: null,
  },
];

export default function AssessmentsPage() {
  return (
    <div className="assessments-page">
      {/* Hero */}
      <div className="assessments-hero">
        <img
          src={`${BUNNY}/assessments-hero.webp`}
          alt="Person at a crossroads at golden hour, beginning a new path"
          className="assessments-hero-img"
          loading="eager"
        />
        <div className="assessments-hero-overlay">
          <span className="page-eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>Self-Discovery Tools</span>
          <h1 className="assessments-hero-title">Know Where You Are</h1>
          <p className="assessments-hero-subtitle">
            Nine evidence-informed assessments to help you understand your experience,
            locate yourself in the healing journey, and find the support that actually fits.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="assessments-disclaimer">
        <div className="disclaimer-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p>
          These are educational tools, not clinical diagnoses. They help you understand your experience and identify relevant resources.
          If you are in significant distress, please reach out to a qualified mental health professional. You deserve real support.
        </p>
      </div>

      {/* Grid */}
      <div className="assessments-grid assessments-grid-9">
        {assessments.map((a) => (
          <div key={a.slug} className="assessment-card-v2">
            {a.badge && (
              <div className="assessment-badge" style={{ background: a.color }}>
                {a.badge}
              </div>
            )}
            <div className="assessment-card-v2-top" style={{ background: a.gradient }}>
              <div className="assessment-icon-v2">{a.icon}</div>
              <div className="assessment-meta-v2">
                <span>{a.questions} questions</span>
                <span>{a.time}</span>
              </div>
            </div>
            <div className="assessment-card-v2-body">
              <span className="assessment-subtitle-v2">{a.subtitle}</span>
              <h2 className="assessment-title-v2">{a.title}</h2>
              <p className="assessment-desc-v2">{a.description}</p>
              <div className="assessment-tags-v2">
                {a.tags.map((tag) => (
                  <span key={tag} className="assessment-tag-v2" style={{ borderColor: `${a.color}50`, color: a.color }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="assessment-card-v2-footer">
              <Link
                to={`/assessments/${a.slug}`}
                className="assessment-cta-v2"
                style={{ background: a.gradient }}
              >
                Begin Assessment
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* About section */}
      <div className="assessments-about">
        <div className="assessments-about-inner">
          <h3>About These Assessments</h3>
          <p>
            These tools are informed by clinical research on religious trauma, faith deconstruction, and post-religious identity development.
            They draw on the work of Dr. Marlene Winell (Religious Trauma Syndrome), Dr. Janja Lalich (bounded choice and high-control groups),
            Dr. Steven Hassan (BITE model), and the growing body of research on spiritual abuse and recovery.
          </p>
          <p>
            These tools are designed to be affirming and non-pathologizing. Your experience is valid.
            Your healing is possible. These assessments are here to help you understand where you are and what might help.
          </p>
          <div className="assessments-about-cta">
            <Link to="/articles" className="btn-secondary">Read the Articles</Link>
            <Link to="/supplements" className="btn-secondary">Natural Support Tools</Link>
          </div>
        </div>
      </div>

      <style>{`
        .assessments-hero {
          position: relative;
          height: 380px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .assessments-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .assessments-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(26,18,8,0.85) 0%, rgba(26,18,8,0.3) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem;
        }
        .assessments-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 4vw, 3rem);
          color: #fff;
          margin: 0.5rem 0;
          line-height: 1.1;
        }
        .assessments-hero-subtitle {
          color: rgba(255,255,255,0.85);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0;
          line-height: 1.6;
        }
        .assessments-disclaimer {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          background: #FFF8F0;
          border: 1px solid var(--border-warm);
          border-left: 4px solid var(--accent-primary);
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .disclaimer-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .assessments-grid-9 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.75rem;
          margin-bottom: 3rem;
        }
        .assessment-card-v2 {
          background: var(--bg-card);
          border: 1px solid var(--border-warm);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .assessment-card-v2:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(122,96,64,0.15);
        }
        .assessment-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          z-index: 2;
        }
        .assessment-card-v2-top {
          padding: 1.75rem 1.5rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: #fff;
        }
        .assessment-icon-v2 {
          opacity: 0.95;
        }
        .assessment-meta-v2 {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          font-size: 0.8rem;
          opacity: 0.9;
          font-weight: 500;
        }
        .assessment-card-v2-body {
          padding: 1.5rem;
          flex: 1;
        }
        .assessment-subtitle-v2 {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }
        .assessment-title-v2 {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--text-primary);
          margin: 0 0 0.75rem;
          line-height: 1.3;
        }
        .assessment-desc-v2 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0 0 1rem;
        }
        .assessment-tags-v2 {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .assessment-tag-v2 {
          font-size: 0.72rem;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid;
          background: transparent;
        }
        .assessment-card-v2-footer {
          padding: 0 1.5rem 1.5rem;
        }
        .assessment-cta-v2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.85rem 1.5rem;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: opacity 0.2s ease, transform 0.15s ease;
        }
        .assessment-cta-v2:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .assessments-about {
          background: var(--bg-card);
          border: 1px solid var(--border-warm);
          border-radius: 16px;
          padding: 2.5rem;
          margin-top: 1rem;
        }
        .assessments-about h3 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-primary);
          margin: 0 0 1rem;
        }
        .assessments-about p {
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .assessments-about-cta {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .btn-secondary {
          display: inline-block;
          padding: 0.65rem 1.5rem;
          border: 2px solid var(--accent-primary);
          border-radius: 8px;
          color: var(--accent-primary);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          background: var(--accent-primary);
          color: #fff;
        }
        @media (max-width: 640px) {
          .assessments-hero { height: 280px; }
          .assessments-hero-overlay { padding: 1.5rem; }
          .assessments-grid-9 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
