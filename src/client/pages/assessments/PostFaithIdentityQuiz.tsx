import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  options: { value: string; label: string; type: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: 'When you think about meaning and purpose, what resonates most?',
    options: [
      { value: 'a', label: 'Meaning comes from human connection, contribution, and the natural world', type: 'humanist' },
      { value: 'b', label: 'I sense something larger than myself, but I don\'t call it God', type: 'spiritual' },
      { value: 'c', label: 'I genuinely don\'t know — and I\'m okay sitting with that uncertainty', type: 'agnostic' },
      { value: 'd', label: 'I\'m exploring whether there\'s a form of faith that could work for me', type: 'reconstructing' },
    ],
  },
  {
    id: 2,
    text: 'How do you relate to practices like meditation, ritual, or contemplation?',
    options: [
      { value: 'a', label: 'I appreciate them as psychological tools, without spiritual framing', type: 'humanist' },
      { value: 'b', label: 'They feel genuinely meaningful — I experience something real in them', type: 'spiritual' },
      { value: 'c', label: 'I\'m curious but cautious — I don\'t want to replace one belief system with another', type: 'agnostic' },
      { value: 'd', label: 'I\'m drawn to certain practices from my tradition or others', type: 'reconstructing' },
    ],
  },
  {
    id: 3,
    text: 'When you think about death and what happens after, you feel:',
    options: [
      { value: 'a', label: 'At peace with uncertainty — this life is what matters', type: 'humanist' },
      { value: 'b', label: 'Open to the possibility of something, though I\'m not sure what', type: 'spiritual' },
      { value: 'c', label: 'Genuinely uncertain and sometimes anxious about it', type: 'agnostic' },
      { value: 'd', label: 'Still working through what I believe — it\'s a live question for me', type: 'reconstructing' },
    ],
  },
  {
    id: 4,
    text: 'What role does community play in your life right now?',
    options: [
      { value: 'a', label: 'I find community in secular spaces — friends, interests, causes', type: 'humanist' },
      { value: 'b', label: 'I\'m drawn to communities with a spiritual dimension, even if not religious', type: 'spiritual' },
      { value: 'c', label: 'I\'m still figuring out where I belong', type: 'agnostic' },
      { value: 'd', label: 'I\'m exploring whether a different religious community might work for me', type: 'reconstructing' },
    ],
  },
  {
    id: 5,
    text: 'How do you relate to the concept of the sacred?',
    options: [
      { value: 'a', label: 'I find the sacred in human experience, art, nature — without supernatural framing', type: 'humanist' },
      { value: 'b', label: 'I experience something genuinely sacred, though I can\'t fully define it', type: 'spiritual' },
      { value: 'c', label: 'I\'m skeptical of the concept but I don\'t want to dismiss it entirely', type: 'agnostic' },
      { value: 'd', label: 'I\'m exploring what the sacred means outside my tradition', type: 'reconstructing' },
    ],
  },
  {
    id: 6,
    text: 'When you encounter nature, art, or music that moves you, you interpret that experience as:',
    options: [
      { value: 'a', label: 'A profound human experience — beautiful and meaningful without being supernatural', type: 'humanist' },
      { value: 'b', label: 'A connection to something larger — I sense a presence or energy', type: 'spiritual' },
      { value: 'c', label: 'I\'m not sure what to make of it — I just notice it', type: 'agnostic' },
      { value: 'd', label: 'Possibly a form of genuine spiritual experience I\'m still exploring', type: 'reconstructing' },
    ],
  },
  {
    id: 7,
    text: 'How do you relate to ethics and moral values?',
    options: [
      { value: 'a', label: 'Ethics are grounded in human wellbeing and reason, not divine command', type: 'humanist' },
      { value: 'b', label: 'I sense a moral dimension to reality that goes beyond human construction', type: 'spiritual' },
      { value: 'c', label: 'I\'m working out my ethics without a fixed framework', type: 'agnostic' },
      { value: 'd', label: 'I\'m exploring whether religious ethics can be separated from the harmful parts', type: 'reconstructing' },
    ],
  },
  {
    id: 8,
    text: 'What is your relationship with the religious texts from your background?',
    options: [
      { value: 'a', label: 'I can appreciate them as human literature without treating them as authoritative', type: 'humanist' },
      { value: 'b', label: 'I find genuine wisdom in them, even if I don\'t accept them as literally true', type: 'spiritual' },
      { value: 'c', label: 'I\'m still processing my relationship with them', type: 'agnostic' },
      { value: 'd', label: 'I\'m exploring how to engage with them on my own terms', type: 'reconstructing' },
    ],
  },
  {
    id: 9,
    text: 'How do you think about prayer or communication with a higher power?',
    options: [
      { value: 'a', label: 'I don\'t pray, but I find value in reflection, journaling, or meditation', type: 'humanist' },
      { value: 'b', label: 'I sometimes speak to something — I\'m not sure what — and it feels meaningful', type: 'spiritual' },
      { value: 'c', label: 'I\'m genuinely uncertain whether prayer has any meaning', type: 'agnostic' },
      { value: 'd', label: 'I\'m exploring what prayer or spiritual communication means to me now', type: 'reconstructing' },
    ],
  },
  {
    id: 10,
    text: 'What does your ideal post-faith life look like?',
    options: [
      { value: 'a', label: 'Grounded in human relationships, meaningful work, and secular community', type: 'humanist' },
      { value: 'b', label: 'Including some form of spiritual practice, even if not traditionally religious', type: 'spiritual' },
      { value: 'c', label: 'I\'m not sure yet — I\'m still figuring it out', type: 'agnostic' },
      { value: 'd', label: 'Possibly including a different form of religious community or practice', type: 'reconstructing' },
    ],
  },
  {
    id: 11,
    text: 'How do you feel about the label "atheist" or "agnostic"?',
    options: [
      { value: 'a', label: 'I\'m comfortable with "atheist" or "secular humanist" — it fits', type: 'humanist' },
      { value: 'b', label: 'Neither quite fits — I\'m spiritual but not religious', type: 'spiritual' },
      { value: 'c', label: '"Agnostic" feels most accurate — I genuinely don\'t know', type: 'agnostic' },
      { value: 'd', label: 'I\'m not sure — I might still be religious in some form', type: 'reconstructing' },
    ],
  },
  {
    id: 12,
    text: 'What is the most important thing you\'ve gained from your faith transition?',
    options: [
      { value: 'a', label: 'Intellectual freedom and the ability to think for myself', type: 'humanist' },
      { value: 'b', label: 'A more authentic spiritual life, on my own terms', type: 'spiritual' },
      { value: 'c', label: 'The courage to sit with uncertainty rather than demanding answers', type: 'agnostic' },
      { value: 'd', label: 'A clearer sense of what I actually believe, separate from what I was taught', type: 'reconstructing' },
    ],
  },
];

const identityProfiles: Record<string, { title: string; subtitle: string; description: string; color: string; icon: string; strengths: string[]; challenges: string[]; resources: string[]; articles: { title: string; slug: string }[] }> = {
  humanist: {
    title: 'Secular Humanist',
    subtitle: 'Grounded in Human Experience',
    description: 'Your post-faith identity is oriented toward secular humanism — a worldview that finds meaning, ethics, and community in human experience, reason, and connection, without supernatural framing. You are likely comfortable with the labels "atheist," "agnostic," or "secular," and you find the natural world and human relationships to be sufficient sources of meaning and purpose.',
    color: '#3b82f6',
    icon: '🌍',
    strengths: [
      'Intellectual clarity and freedom from supernatural thinking',
      'Strong grounding in human relationships and community',
      'Evidence-based approach to ethics and meaning',
      'Comfort with the natural world as a source of wonder',
    ],
    challenges: [
      'Finding community that provides the depth of connection religion once offered',
      'Navigating relationships with religious family and friends',
      'Developing rituals and practices that provide structure without religious framing',
    ],
    resources: [
      'The American Humanist Association (americanhumanist.org)',
      'Sunday Assembly — secular community gatherings',
      'The Humanist Community at Harvard',
    ],
    articles: [
      { title: 'Finding Community After Leaving Religion', slug: 'finding-community-after-leaving-religion' },
      { title: 'Secular Spirituality: What It Is and What It Isn\'t', slug: 'secular-spirituality-what-it-is' },
    ],
  },
  spiritual: {
    title: 'Spiritual-but-not-Religious',
    subtitle: 'Beyond Dogma, Into Experience',
    description: 'Your post-faith identity is oriented toward a spirituality that is genuine but non-dogmatic — you experience something real in contemplative practice, in nature, in connection, but you don\'t want to package it in a religious system. You are drawn to the experiential dimension of spirituality without the institutional or doctrinal constraints.',
    color: '#8b5cf6',
    icon: '✨',
    strengths: [
      'Openness to genuine spiritual experience without dogmatic constraint',
      'Ability to draw from multiple traditions selectively',
      'Comfort with mystery and the limits of rational explanation',
      'Rich inner life and contemplative capacity',
    ],
    challenges: [
      'Finding community that shares your orientation',
      'Navigating the tension between spiritual openness and critical thinking',
      'Avoiding the trap of replacing one belief system with another',
    ],
    resources: [
      'Tara Brach\'s work on secular Buddhism and mindfulness',
      'The Center for Contemplative Mind in Society',
      'Unitarian Universalist communities',
    ],
    articles: [
      { title: 'Secular Spirituality: What It Is and What It Isn\'t', slug: 'secular-spirituality-what-it-is' },
      { title: 'Intuitive Healing After Religious Trauma', slug: 'the-oracle-and-religious-trauma-intuitive-healing' },
    ],
  },
  agnostic: {
    title: 'Agnostic Explorer',
    subtitle: 'Comfortable with the Unknown',
    description: 'Your post-faith identity is characterized by genuine intellectual humility — you don\'t know what you believe, and you\'re okay with that. You are in the process of exploring, and you\'re not in a hurry to arrive at a destination. This is a valid and often undervalued orientation: the courage to sit with uncertainty rather than demanding premature resolution.',
    color: '#06b6d4',
    icon: '🔭',
    strengths: [
      'Genuine intellectual humility and openness',
      'Freedom from premature closure on difficult questions',
      'Ability to hold multiple perspectives simultaneously',
      'Resistance to dogmatism in any form',
    ],
    challenges: [
      'The discomfort of sustained uncertainty',
      'Finding community when your orientation is inherently provisional',
      'Navigating existential anxiety without a fixed framework',
    ],
    resources: [
      'The work of philosopher Alain de Botton on secular meaning',
      'ACT-based approaches to tolerating uncertainty',
      'Philosophy reading groups and discussion communities',
    ],
    articles: [
      { title: 'Deconstruction and Mental Health', slug: 'deconstruction-and-mental-health' },
      { title: 'ACT for Religious Trauma', slug: 'acceptance-commitment-therapy-religious-trauma' },
    ],
  },
  reconstructing: {
    title: 'Reconstructing Believer',
    subtitle: 'Building a Faith That Fits',
    description: 'Your post-faith identity is oriented toward reconstruction — you\'re not done with faith, but you\'re done with the version of faith that caused harm. You are exploring whether there is a form of religious or spiritual belief that is honest, non-harmful, and genuinely yours. This is a legitimate and often deeply meaningful path.',
    color: '#f59e0b',
    icon: '🏗️',
    strengths: [
      'Openness to the genuine goods that religious tradition can offer',
      'Ability to engage critically with tradition without wholesale rejection',
      'Potential for a faith that is more honest and more yours than what you left',
      'Connection to community and tradition that is meaningful',
    ],
    challenges: [
      'Navigating the tension between reconstruction and the harm that caused you to leave',
      'Finding communities that are genuinely progressive and non-harmful',
      'Avoiding the trap of returning to the harmful patterns under a new name',
    ],
    resources: [
      'Progressive religious communities (UCC, Episcopal, UU)',
      'The work of Richard Rohr on contemplative Christianity',
      'Interfaith communities and dialogue groups',
    ],
    articles: [
      { title: 'What Is Faith Deconstruction?', slug: 'what-is-faith-deconstruction' },
      { title: 'Rebuilding Trust After Religious Betrayal', slug: 'rebuilding-trust-after-religious-betrayal' },
    ],
  },
};

function getIdentityFromAnswers(answers: Record<number, string>): string {
  const typeCounts: Record<string, number> = { humanist: 0, spiritual: 0, agnostic: 0, reconstructing: 0 };
  for (const [qId, value] of Object.entries(answers)) {
    const question = questions.find(q => q.id === parseInt(qId));
    if (question) {
      const option = question.options.find(o => o.value === value);
      if (option) typeCounts[option.type]++;
    }
  }
  return Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];
}

export default function PostFaithIdentityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);

  const progress = (currentQuestion / questions.length) * 100;
  const dominantType = showResult ? getIdentityFromAnswers(answers) : null;
  const result = dominantType ? identityProfiles[dominantType] : null;

  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else setShowResult(true);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1]?.id] ?? null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0); setAnswers({}); setSelectedOption(null); setShowResult(false); setStarted(false);
  };

  if (!started) {
    return (
        <div className="assessment-container">
          <div className="assessment-intro">
            <div className="assessment-intro-icon">✨</div>
            <span className="assessment-intro-eyebrow">Identity Explorer</span>
            <h1 className="assessment-intro-title">Post-Faith Identity Quiz</h1>
            <p className="assessment-intro-subtitle">Who Are You Becoming?</p>
            <p className="assessment-intro-description">
              This 12-question exploration helps you identify your emerging post-faith identity orientation — whether you are moving toward secular humanism, spiritual-but-not-religious, agnostic exploration, or faith reconstruction. There are no wrong answers.
            </p>
            <div className="assessment-intro-meta">
              <div className="meta-item"><span className="meta-icon">📝</span><span>12 questions</span></div>
              <div className="meta-item"><span className="meta-icon">⏱️</span><span>5–7 minutes</span></div>
              <div className="meta-item"><span className="meta-icon">🔒</span><span>Private & anonymous</span></div>
            </div>
            <button className="assessment-start-btn" style={{ background: '#8b5cf6' }} onClick={() => setStarted(true)}>
              Begin Quiz
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <Link to="/assessments" className="assessment-back-link">← Back to all assessments</Link>
          </div>
        </div>
    );
  }

  if (showResult && result) {
    return (
        <div className="assessment-container">
          <div className="assessment-result">
            <div className="result-header" style={{ borderTopColor: result.color }}>
              <div className="result-stage-icon" style={{ fontSize: '3rem' }}>{result.icon}</div>
              <div className="result-level-badge" style={{ background: `${result.color}20`, color: result.color }}>Your Identity Orientation</div>
              <h1 className="result-title">{result.title}</h1>
              <p className="result-subtitle-text">{result.subtitle}</p>
            </div>
            <div className="result-description"><p>{result.description}</p></div>
            <div className="result-two-col">
              <div className="result-section">
                <h2 className="result-section-title">Your Strengths</h2>
                <ul className="result-recommendations">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="result-recommendation">
                      <span className="rec-check" style={{ color: result.color }}>✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="result-section">
                <h2 className="result-section-title">Common Challenges</h2>
                <ul className="result-recommendations">
                  {result.challenges.map((c, i) => (
                    <li key={i} className="result-recommendation">
                      <span className="rec-check" style={{ color: result.color }}>→</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="result-section">
              <h2 className="result-section-title">Relevant Articles</h2>
              <div className="result-articles">
                {result.articles.map((a) => (
                  <Link key={a.slug} to={`/articles/${a.slug}`} className="result-article-link">
                    <span className="result-article-title">{a.title}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
            <div className="result-actions">
              <button className="result-restart-btn" onClick={handleRestart}>Retake Quiz</button>
              <Link to="/assessments" className="result-other-btn">Try Other Assessments</Link>
            </div>
          </div>
        </div>
    );
  }

  const question = questions[currentQuestion];
  return (
      <div className="assessment-container">
        <div className="assessment-quiz">
          <div className="quiz-header">
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%`, background: '#8b5cf6' }} />
            </div>
            <div className="quiz-progress-text">Question {currentQuestion + 1} of {questions.length}</div>
          </div>
          <div className="quiz-question-card">
            <h2 className="question-text">{question.text}</h2>
            <div className="question-options">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  className={`question-option ${selectedOption === option.value ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(option.value)}
                  style={selectedOption === option.value ? { borderColor: '#8b5cf6', background: '#8b5cf610' } : {}}
                >
                  <span className="option-indicator" style={selectedOption === option.value ? { background: '#8b5cf6', borderColor: '#8b5cf6' } : {}} />
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="quiz-navigation">
            <button className="quiz-nav-btn prev" onClick={handlePrev} disabled={currentQuestion === 0}>← Previous</button>
            <button className="quiz-nav-btn next" onClick={handleNext} disabled={!selectedOption} style={{ background: '#8b5cf6' }}>
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
  );
}
