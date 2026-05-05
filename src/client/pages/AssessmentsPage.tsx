import React from 'react';
import { Link } from 'react-router-dom';

const assessments = [
  {
    slug: 'religious-trauma-assessment',
    title: 'Religious Trauma Assessment',
    subtitle: 'Understand Your Wound',
    description: 'A 20-question evidence-informed assessment that helps you identify the presence and severity of religious trauma symptoms. Based on clinical frameworks from Marlene Winell, Janja Lalich, and the Religious Trauma Institute.',
    questions: 20,
    time: '8–10 min',
    icon: '🔍',
    color: 'var(--accent-primary)',
    tags: ['Trauma Symptoms', 'Severity', 'Clinical Framework'],
  },
  {
    slug: 'deconstruction-stage-finder',
    title: 'Deconstruction Stage Finder',
    subtitle: 'Where Are You in the Journey?',
    description: 'A 15-question reflective assessment that identifies which stage of faith deconstruction you are currently in — from initial doubt through reconstruction. Helps you understand what support is most relevant right now.',
    questions: 15,
    time: '6–8 min',
    icon: '🗺️',
    color: 'var(--accent-secondary)',
    tags: ['Deconstruction', 'Stage', 'Support Needs'],
  },
  {
    slug: 'post-faith-identity-quiz',
    title: 'Post-Faith Identity Quiz',
    subtitle: 'Who Are You Becoming?',
    description: 'A 12-question exploration of your emerging post-faith identity. Identifies your dominant orientation — Secular Humanist, Spiritual-but-not-Religious, Agnostic Explorer, or Reconstructing Believer — and offers tailored resources.',
    questions: 12,
    time: '5–7 min',
    icon: '✨',
    color: '#8b5cf6',
    tags: ['Identity', 'Post-Faith', 'Orientation'],
  },
];

export default function AssessmentsPage() {
  return (
      <div className="assessments-page">
        <div className="page-header">
          <div className="page-header-inner">
            <span className="page-eyebrow">Self-Discovery Tools</span>
            <h1 className="page-title">Assessments</h1>
            <p className="page-subtitle">
              Evidence-informed tools to help you understand your experience, locate yourself in the healing journey, and identify the support most relevant to where you are right now.
            </p>
          </div>
        </div>

        <div className="assessments-disclaimer">
          <div className="disclaimer-icon">ℹ️</div>
          <p>
            These assessments are educational tools, not clinical diagnoses. They are designed to help you understand your experience and identify relevant resources. If you are experiencing significant distress, please reach out to a qualified mental health professional.
          </p>
        </div>

        <div className="assessments-grid">
          {assessments.map((assessment) => (
            <div key={assessment.slug} className="assessment-card">
              <div className="assessment-card-header" style={{ borderTopColor: assessment.color }}>
                <div className="assessment-icon" style={{ background: `${assessment.color}20`, color: assessment.color }}>
                  {assessment.icon}
                </div>
                <div className="assessment-meta">
                  <span className="assessment-questions">{assessment.questions} questions</span>
                  <span className="assessment-time">{assessment.time}</span>
                </div>
              </div>
              <div className="assessment-card-body">
                <span className="assessment-subtitle">{assessment.subtitle}</span>
                <h2 className="assessment-title">{assessment.title}</h2>
                <p className="assessment-description">{assessment.description}</p>
                <div className="assessment-tags">
                  {assessment.tags.map((tag) => (
                    <span key={tag} className="assessment-tag" style={{ borderColor: `${assessment.color}40`, color: assessment.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="assessment-card-footer">
                <Link
                  to={`/assessments/${assessment.slug}`}
                  className="assessment-cta"
                  style={{ background: assessment.color }}
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

        <div className="assessments-note">
          <h3>About These Assessments</h3>
          <p>
            The assessments on this site are informed by clinical research on religious trauma, faith deconstruction, and post-religious identity development. They draw on the work of Dr. Marlene Winell (Religious Trauma Syndrome), Dr. Janja Lalich (bounded choice and high-control groups), Dr. Steven Hassan (BITE model), and the growing body of research on spiritual abuse and recovery.
          </p>
          <p>
            These tools are designed to be affirming and non-pathologizing. Your experience is valid. Your healing is possible. These assessments are here to help you understand where you are and what might help.
          </p>
        </div>
      </div>
  );
}
