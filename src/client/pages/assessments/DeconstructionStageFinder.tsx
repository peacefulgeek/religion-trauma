import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  options: { value: string; label: string; stage: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: 'When you think about your religious beliefs right now, which best describes your experience?',
    options: [
      { value: 'a', label: 'I still hold my beliefs but I\'m starting to have questions I can\'t ignore', stage: 'doubt' },
      { value: 'b', label: 'I\'m actively questioning and researching — everything feels uncertain', stage: 'questioning' },
      { value: 'c', label: 'I\'ve largely left my faith but I\'m in the middle of a painful transition', stage: 'transition' },
      { value: 'd', label: 'I\'ve moved beyond my faith and I\'m figuring out who I am now', stage: 'rebuilding' },
      { value: 'e', label: 'I feel settled in my post-faith identity, though I still process things sometimes', stage: 'integration' },
    ],
  },
  {
    id: 2,
    text: 'How do you feel when you encounter the religion you grew up in or left?',
    options: [
      { value: 'a', label: 'Mostly comfortable, with some growing discomfort', stage: 'doubt' },
      { value: 'b', label: 'Anxious, confused, or intellectually challenged', stage: 'questioning' },
      { value: 'c', label: 'Grief, anger, or significant emotional activation', stage: 'transition' },
      { value: 'd', label: 'Mostly neutral with occasional difficult feelings', stage: 'rebuilding' },
      { value: 'e', label: 'Generally neutral or curious, with minimal distress', stage: 'integration' },
    ],
  },
  {
    id: 3,
    text: 'How would you describe your current relationship with your religious community?',
    options: [
      { value: 'a', label: 'Still involved, but feeling increasingly like an outsider', stage: 'doubt' },
      { value: 'b', label: 'Pulling away or recently left, still navigating the change', stage: 'questioning' },
      { value: 'c', label: 'I\'ve left and I\'m grieving the loss of community', stage: 'transition' },
      { value: 'd', label: 'I\'ve found some new community but it\'s still forming', stage: 'rebuilding' },
      { value: 'e', label: 'I have a stable community that supports who I am now', stage: 'integration' },
    ],
  },
  {
    id: 4,
    text: 'How would you describe your sense of personal identity right now?',
    options: [
      { value: 'a', label: 'Mostly stable, but I\'m starting to question some things', stage: 'doubt' },
      { value: 'b', label: 'Uncertain and shifting — I\'m not sure who I am without my faith', stage: 'questioning' },
      { value: 'c', label: 'Fragmented or in crisis — I feel like I\'ve lost myself', stage: 'transition' },
      { value: 'd', label: 'Emerging — I\'m actively building a new sense of who I am', stage: 'rebuilding' },
      { value: 'e', label: 'Relatively stable and authentic — I feel like myself', stage: 'integration' },
    ],
  },
  {
    id: 5,
    text: 'How do you relate to the idea of God or a higher power right now?',
    options: [
      { value: 'a', label: 'I still believe, but I\'m questioning some aspects of my tradition', stage: 'doubt' },
      { value: 'b', label: 'I\'m genuinely uncertain — I don\'t know what I believe', stage: 'questioning' },
      { value: 'c', label: 'I\'ve largely let go of my previous beliefs but haven\'t found new ones', stage: 'transition' },
      { value: 'd', label: 'I\'m exploring new frameworks — secular, spiritual, or something else', stage: 'rebuilding' },
      { value: 'e', label: 'I have a settled relationship with these questions, whatever my conclusions', stage: 'integration' },
    ],
  },
  {
    id: 6,
    text: 'What is your primary emotional experience right now in relation to your faith journey?',
    options: [
      { value: 'a', label: 'Curiosity mixed with anxiety or guilt', stage: 'doubt' },
      { value: 'b', label: 'Confusion, overwhelm, or intellectual vertigo', stage: 'questioning' },
      { value: 'c', label: 'Grief, anger, or a sense of profound loss', stage: 'transition' },
      { value: 'd', label: 'Cautious hope, curiosity, and occasional grief', stage: 'rebuilding' },
      { value: 'e', label: 'Relative peace, with occasional processing', stage: 'integration' },
    ],
  },
  {
    id: 7,
    text: 'How do you relate to your family\'s religious practice?',
    options: [
      { value: 'a', label: 'I participate but feel increasingly disconnected', stage: 'doubt' },
      { value: 'b', label: 'I\'m starting to pull back and it\'s creating tension', stage: 'questioning' },
      { value: 'c', label: 'There is significant conflict or distance in my family relationships', stage: 'transition' },
      { value: 'd', label: 'I\'ve found a way to maintain relationships while being honest about my beliefs', stage: 'rebuilding' },
      { value: 'e', label: 'I have a stable, if sometimes complicated, relationship with my family around religion', stage: 'integration' },
    ],
  },
  {
    id: 8,
    text: 'What kind of support would be most helpful to you right now?',
    options: [
      { value: 'a', label: 'A safe space to ask questions without judgment', stage: 'doubt' },
      { value: 'b', label: 'Information, resources, and people who understand what I\'m going through', stage: 'questioning' },
      { value: 'c', label: 'Emotional support, grief processing, and help with the immediate pain', stage: 'transition' },
      { value: 'd', label: 'Help building a new identity, community, and sense of meaning', stage: 'rebuilding' },
      { value: 'e', label: 'Continued growth, integration, and occasional processing support', stage: 'integration' },
    ],
  },
  {
    id: 9,
    text: 'How long have you been in active deconstruction or faith transition?',
    options: [
      { value: 'a', label: 'I\'m just beginning — weeks or a few months', stage: 'doubt' },
      { value: 'b', label: 'Several months to a year', stage: 'questioning' },
      { value: 'c', label: 'One to two years', stage: 'transition' },
      { value: 'd', label: 'Two to four years', stage: 'rebuilding' },
      { value: 'e', label: 'More than four years', stage: 'integration' },
    ],
  },
  {
    id: 10,
    text: 'How do you feel about the future right now?',
    options: [
      { value: 'a', label: 'Uncertain but mostly hopeful, with some anxiety', stage: 'doubt' },
      { value: 'b', label: 'Anxious and uncertain — the future feels unclear', stage: 'questioning' },
      { value: 'c', label: 'Frightening or overwhelming — I\'m not sure how to move forward', stage: 'transition' },
      { value: 'd', label: 'Cautiously optimistic — I\'m building something new', stage: 'rebuilding' },
      { value: 'e', label: 'Generally hopeful and engaged with my life', stage: 'integration' },
    ],
  },
  {
    id: 11,
    text: 'How do you relate to the religious texts, practices, or symbols from your background?',
    options: [
      { value: 'a', label: 'Still meaningful, but I\'m starting to question their authority', stage: 'doubt' },
      { value: 'b', label: 'Actively re-examining them — some feel problematic', stage: 'questioning' },
      { value: 'c', label: 'Painful or triggering — I often avoid them', stage: 'transition' },
      { value: 'd', label: 'I can engage with them selectively, taking what\'s useful', stage: 'rebuilding' },
      { value: 'e', label: 'I have a nuanced, settled relationship with them', stage: 'integration' },
    ],
  },
  {
    id: 12,
    text: 'How would you describe your experience of meaning and purpose right now?',
    options: [
      { value: 'a', label: 'Still primarily religious, but starting to expand', stage: 'doubt' },
      { value: 'b', label: 'Uncertain — the old sources of meaning feel hollow', stage: 'questioning' },
      { value: 'c', label: 'I feel a significant loss of meaning and purpose', stage: 'transition' },
      { value: 'd', label: 'I\'m actively building new sources of meaning', stage: 'rebuilding' },
      { value: 'e', label: 'I have a stable, self-generated sense of meaning and purpose', stage: 'integration' },
    ],
  },
  {
    id: 13,
    text: 'Have you sought professional support (therapy, counseling) for your faith transition?',
    options: [
      { value: 'a', label: 'No, I don\'t feel I need it yet', stage: 'doubt' },
      { value: 'b', label: 'I\'m considering it but haven\'t started', stage: 'questioning' },
      { value: 'c', label: 'Yes, and it has been essential', stage: 'transition' },
      { value: 'd', label: 'I\'ve had some therapy and found it helpful', stage: 'rebuilding' },
      { value: 'e', label: 'I\'ve had therapy and feel relatively stable now', stage: 'integration' },
    ],
  },
  {
    id: 14,
    text: 'How do you feel about the religious tradition you grew up in or left?',
    options: [
      { value: 'a', label: 'Mostly positive, with growing questions', stage: 'doubt' },
      { value: 'b', label: 'Mixed — I can see both good and harm', stage: 'questioning' },
      { value: 'c', label: 'Primarily angry, hurt, or betrayed', stage: 'transition' },
      { value: 'd', label: 'More nuanced — I can hold both the harm and the good', stage: 'rebuilding' },
      { value: 'e', label: 'Settled — I can acknowledge the harm without being defined by it', stage: 'integration' },
    ],
  },
  {
    id: 15,
    text: 'What best describes your current spiritual or philosophical orientation?',
    options: [
      { value: 'a', label: 'Still within my tradition, but questioning', stage: 'doubt' },
      { value: 'b', label: 'Agnostic or uncertain — I don\'t know what I believe', stage: 'questioning' },
      { value: 'c', label: 'Post-religious — I\'ve left but haven\'t found a new framework', stage: 'transition' },
      { value: 'd', label: 'Exploring — secular, spiritual, or something I\'m building', stage: 'rebuilding' },
      { value: 'e', label: 'Settled in a framework that feels authentically mine', stage: 'integration' },
    ],
  },
];

const stageProfiles: Record<string, { title: string; description: string; color: string; icon: string; support: string[]; articles: { title: string; slug: string }[] }> = {
  doubt: {
    title: 'Stage 1: The Doubt Stage',
    description: 'You are in the early stages of questioning — still within or close to your tradition, but experiencing doubts and questions that you can\'t ignore. This is a tender and often lonely place. The questions are real, and they deserve to be taken seriously. You are not losing your faith — you are growing into a more honest relationship with it.',
    color: '#6366f1',
    icon: '🌱',
    support: [
      'Find a safe space to ask questions without judgment',
      'Connect with others who have navigated similar questions',
      'Give yourself permission to sit with uncertainty',
      'You don\'t have to have answers — you just have to be honest about the questions',
    ],
    articles: [
      { title: 'What Is Faith Deconstruction?', slug: 'what-is-faith-deconstruction' },
      { title: 'Is It Normal to Have Doubts?', slug: 'is-it-normal-to-have-doubts' },
    ],
  },
  questioning: {
    title: 'Stage 2: The Questioning Stage',
    description: 'You are in active deconstruction — researching, questioning, and re-examining everything. This stage is often characterized by intellectual vertigo: the framework that organized your understanding of reality is dissolving, and you haven\'t yet found a new one. This is disorienting and often painful, but it is also a sign of genuine intellectual and spiritual courage.',
    color: '#8b5cf6',
    icon: '🔍',
    support: [
      'Access good information — books, podcasts, communities',
      'Connect with others who understand the questioning process',
      'Be patient with yourself — this stage takes time',
      'Consider finding a therapist who understands religious transition',
    ],
    articles: [
      { title: 'What Is Religious Trauma Syndrome?', slug: 'what-is-religious-trauma-syndrome' },
      { title: 'Deconstruction and Mental Health', slug: 'deconstruction-and-mental-health' },
    ],
  },
  transition: {
    title: 'Stage 3: The Transition Stage',
    description: 'You are in the most acute phase of the faith transition — you\'ve largely left your tradition, and you are in the middle of the grief, anger, and disorientation that this involves. This is often the hardest stage. The losses are real and significant. The pain is appropriate. You are not broken — you are grieving.',
    color: '#ec4899',
    icon: '🌊',
    support: [
      'Emotional support and grief processing are the priority right now',
      'Therapy with a trauma-informed clinician is strongly recommended',
      'Community with others who have been through similar experiences is essential',
      'Be gentle with yourself — this is genuinely hard',
    ],
    articles: [
      { title: 'The Grief of Losing Your Faith', slug: 'grief-of-losing-faith' },
      { title: 'Religious Trauma and Sleep', slug: 'religious-trauma-and-sleep' },
      { title: 'The Faith Wound: What Actually Heals It', slug: 'the-faith-wound-what-heals-it' },
    ],
  },
  rebuilding: {
    title: 'Stage 4: The Rebuilding Stage',
    description: 'You are in the rebuilding stage — the acute pain has lessened, and you are actively constructing a new identity, community, and sense of meaning. This stage is characterized by cautious hope and genuine creativity. You are figuring out who you are outside of the religious framework, and the answer is emerging.',
    color: '#f59e0b',
    icon: '🏗️',
    support: [
      'Focus on identity exploration and values clarification',
      'Build new community intentionally',
      'Explore what meaning and purpose look like outside religion',
      'Continue therapy if it has been helpful',
    ],
    articles: [
      { title: 'Post-Faith Identity: Who Are You Now?', slug: 'post-faith-identity-who-are-you-now' },
      { title: 'Finding Community After Leaving Religion', slug: 'finding-community-after-leaving-religion' },
      { title: 'Secular Spirituality: What It Is and What It Isn\'t', slug: 'secular-spirituality-what-it-is' },
    ],
  },
  integration: {
    title: 'Stage 5: The Integration Stage',
    description: 'You are in the integration stage — you have a relatively stable post-faith identity, a sense of meaning and purpose that is genuinely yours, and a community that supports who you are now. The journey is not over — there will be moments of grief, processing, and growth — but the acute crisis is behind you. You have done hard work, and it shows.',
    color: '#22c55e',
    icon: '🌟',
    support: [
      'Continue to grow and deepen your post-faith identity',
      'Consider how your experience can be of service to others',
      'Maintain the practices and community that support your wellbeing',
      'Be patient with the occasional difficult moments — they are normal',
    ],
    articles: [
      { title: 'The Faith Wound: What Actually Heals It', slug: 'the-faith-wound-what-heals-it' },
      { title: 'Intuitive Healing After Religious Trauma', slug: 'the-oracle-and-religious-trauma-intuitive-healing' },
      { title: 'Rebuilding Trust After Religious Betrayal', slug: 'rebuilding-trust-after-religious-betrayal' },
    ],
  },
};

function getStageFromAnswers(answers: Record<number, string>): string {
  const stageCounts: Record<string, number> = { doubt: 0, questioning: 0, transition: 0, rebuilding: 0, integration: 0 };
  
  for (const [qId, value] of Object.entries(answers)) {
    const question = questions.find(q => q.id === parseInt(qId));
    if (question) {
      const option = question.options.find(o => o.value === value);
      if (option) {
        stageCounts[option.stage]++;
      }
    }
  }
  
  return Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0][0];
}

export default function DeconstructionStageFinder() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);

  const progress = (currentQuestion / questions.length) * 100;
  const dominantStage = showResult ? getStageFromAnswers(answers) : null;
  const result = dominantStage ? stageProfiles[dominantStage] : null;

  const handleOptionSelect = (value: string) => setSelectedOption(value);

  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1]?.id] ?? null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
    setShowResult(false);
    setStarted(false);
  };

  if (!started) {
    return (
        <div className="assessment-container">
          <div className="assessment-intro">
            <div className="assessment-intro-icon">🗺️</div>
            <span className="assessment-intro-eyebrow">Stage Finder</span>
            <h1 className="assessment-intro-title">Deconstruction Stage Finder</h1>
            <p className="assessment-intro-subtitle">Where Are You in the Journey?</p>
            <p className="assessment-intro-description">
              This 15-question assessment identifies which stage of faith deconstruction you are currently in — from initial doubt through integration. Understanding your stage helps you identify what kind of support is most relevant right now.
            </p>
            <div className="assessment-intro-meta">
              <div className="meta-item"><span className="meta-icon">📝</span><span>15 questions</span></div>
              <div className="meta-item"><span className="meta-icon">⏱️</span><span>6–8 minutes</span></div>
              <div className="meta-item"><span className="meta-icon">🔒</span><span>Private & anonymous</span></div>
            </div>
            <button className="assessment-start-btn" style={{ background: '#8b5cf6' }} onClick={() => setStarted(true)}>
              Begin Assessment
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <Link to="/assessments" className="assessment-back-link">← Back to all assessments</Link>
          </div>
        </div>
    );
  }

  if (showResult && result && dominantStage) {
    return (
        <div className="assessment-container">
          <div className="assessment-result">
            <div className="result-header" style={{ borderTopColor: result.color }}>
              <div className="result-stage-icon">{result.icon}</div>
              <div className="result-level-badge" style={{ background: `${result.color}20`, color: result.color }}>
                Your Stage
              </div>
              <h1 className="result-title">{result.title}</h1>
            </div>
            <div className="result-description"><p>{result.description}</p></div>
            <div className="result-section">
              <h2 className="result-section-title">What Helps at This Stage</h2>
              <ul className="result-recommendations">
                {result.support.map((s, i) => (
                  <li key={i} className="result-recommendation">
                    <span className="rec-check" style={{ color: result.color }}>✓</span>{s}
                  </li>
                ))}
              </ul>
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
              <button className="result-restart-btn" onClick={handleRestart}>Retake Assessment</button>
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
                  onClick={() => handleOptionSelect(option.value)}
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
