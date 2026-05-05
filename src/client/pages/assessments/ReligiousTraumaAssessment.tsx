import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  category: string;
  options: { value: number; label: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: 'I experience intrusive thoughts related to religious content (e.g., fear of hell, sin, divine punishment) that I don\'t want.',
    category: 'intrusive-thoughts',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 2,
    text: 'I feel a pervasive sense of shame that seems to be connected to my religious upbringing.',
    category: 'shame',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 3,
    text: 'I find it difficult to trust my own thoughts, feelings, or perceptions.',
    category: 'self-trust',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 4,
    text: 'I experience anxiety, panic, or dread when I encounter religious content, symbols, or environments.',
    category: 'anxiety',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 5,
    text: 'I have experienced significant loss of community, relationships, or family as a result of leaving or questioning my faith.',
    category: 'social-loss',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Minimal loss' },
      { value: 2, label: 'Moderate loss' },
      { value: 3, label: 'Significant loss' },
      { value: 4, label: 'Devastating loss' },
    ],
  },
  {
    id: 6,
    text: 'I struggle to make decisions without an external authority telling me what to do.',
    category: 'autonomy',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 7,
    text: 'I feel a sense of grief, mourning, or profound loss related to my faith transition.',
    category: 'grief',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 8,
    text: 'I experience difficulty with sexual expression or body image that seems connected to religious teachings.',
    category: 'body-shame',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 9,
    text: 'I feel angry — at religious leaders, institutions, family members, or God — related to my religious experience.',
    category: 'anger',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 10,
    text: 'I have difficulty experiencing joy, pleasure, or positive emotions without guilt.',
    category: 'anhedonia',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 11,
    text: 'I struggle with black-and-white thinking — seeing things as all good or all bad, with no middle ground.',
    category: 'cognitive',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 12,
    text: 'I feel a persistent sense of existential emptiness or meaninglessness since leaving my faith.',
    category: 'existential',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 13,
    text: 'I experience hypervigilance — a persistent state of alertness or feeling "on guard" — that I connect to my religious upbringing.',
    category: 'hypervigilance',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 14,
    text: 'I have difficulty forming or maintaining close relationships since leaving my faith.',
    category: 'relationships',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 15,
    text: 'I feel a confused or fragmented sense of identity — unsure of who I am outside of my religious role.',
    category: 'identity',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 16,
    text: 'I have experienced sleep disruption (difficulty falling asleep, staying asleep, or restful sleep) that I connect to anxiety or intrusive thoughts.',
    category: 'sleep',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 17,
    text: 'I find it difficult to tolerate uncertainty or ambiguity — I feel a strong need for definitive answers.',
    category: 'uncertainty',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very often' },
    ],
  },
  {
    id: 18,
    text: 'I have experienced or currently experience depression that I connect to my faith transition.',
    category: 'depression',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 19,
    text: 'I feel a sense of betrayal — by religious leaders, communities, or the belief system itself.',
    category: 'betrayal',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
  {
    id: 20,
    text: 'Overall, how much has your religious experience impacted your mental health and wellbeing?',
    category: 'overall',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Significantly' },
      { value: 4, label: 'Profoundly' },
    ],
  },
];

interface ResultProfile {
  level: string;
  title: string;
  description: string;
  color: string;
  recommendations: string[];
  articles: { title: string; slug: string }[];
}

function getResult(score: number): ResultProfile {
  const pct = (score / 80) * 100;
  
  if (pct <= 20) {
    return {
      level: 'Minimal',
      title: 'Minimal Religious Trauma Indicators',
      description: 'Your responses suggest minimal indicators of religious trauma. You may have had a generally positive or neutral religious experience, or you may be in an early stage of processing. This doesn\'t mean your experience wasn\'t real or significant — it means the specific trauma symptoms are not strongly present right now.',
      color: '#22c55e',
      recommendations: [
        'Continue exploring your faith transition at your own pace',
        'Connect with others who have had similar experiences',
        'Explore resources on faith deconstruction and post-faith identity',
      ],
      articles: [
        { title: 'What Is Faith Deconstruction?', slug: 'what-is-faith-deconstruction' },
        { title: 'Post-Faith Identity: Who Are You Now?', slug: 'post-faith-identity-who-are-you-now' },
      ],
    };
  } else if (pct <= 40) {
    return {
      level: 'Mild',
      title: 'Mild Religious Trauma Indicators',
      description: 'Your responses suggest mild indicators of religious trauma. You are likely experiencing some of the common challenges of faith transition — grief, identity disruption, relationship strain — but these are not severely impacting your daily functioning. This is a normal part of the deconstruction process.',
      color: '#84cc16',
      recommendations: [
        'Consider connecting with a therapist who understands religious trauma',
        'Find community with others who have had similar experiences',
        'Explore self-help resources on religious trauma recovery',
        'Practice self-compassion and allow yourself time to grieve',
      ],
      articles: [
        { title: 'The Grief of Losing Your Faith', slug: 'grief-of-losing-faith' },
        { title: 'Finding Community After Leaving Religion', slug: 'finding-community-after-leaving-religion' },
      ],
    };
  } else if (pct <= 60) {
    return {
      level: 'Moderate',
      title: 'Moderate Religious Trauma Indicators',
      description: 'Your responses suggest moderate indicators of religious trauma. You are likely experiencing significant challenges that are impacting your daily life — intrusive thoughts, shame, relationship difficulties, or identity confusion. These are real symptoms that deserve real support.',
      color: '#f59e0b',
      recommendations: [
        'Working with a trauma-informed therapist is strongly recommended',
        'Look for therapists with experience in religious trauma specifically',
        'Connect with the ex-religious community for peer support',
        'Consider body-based approaches alongside talk therapy',
        'Be patient with yourself — this level of impact takes time to heal',
      ],
      articles: [
        { title: 'Finding a Religious Trauma Therapist', slug: 'finding-religious-trauma-therapist' },
        { title: 'EMDR for Religious Trauma', slug: 'emdr-for-religious-trauma' },
        { title: 'Religious Trauma and Sleep', slug: 'religious-trauma-and-sleep' },
      ],
    };
  } else if (pct <= 80) {
    return {
      level: 'Significant',
      title: 'Significant Religious Trauma Indicators',
      description: 'Your responses suggest significant indicators of religious trauma. You are experiencing substantial impact across multiple areas of your life. This level of impact is serious and deserves serious support. You are not alone, and healing is possible — but it will likely require professional help.',
      color: '#f97316',
      recommendations: [
        'Please seek professional support from a trauma-informed therapist',
        'Look specifically for therapists trained in EMDR, somatic therapy, or IFS',
        'The Religious Trauma Institute can provide referrals',
        'Consider whether you have adequate social support',
        'If you are experiencing thoughts of self-harm, please reach out to a crisis line',
      ],
      articles: [
        { title: 'What Is Religious Trauma Syndrome?', slug: 'what-is-religious-trauma-syndrome' },
        { title: 'Somatic Experiencing for Religious Trauma', slug: 'somatic-experiencing-for-religious-trauma' },
        { title: 'The Faith Wound: What Actually Heals It', slug: 'the-faith-wound-what-heals-it' },
      ],
    };
  } else {
    return {
      level: 'Severe',
      title: 'Severe Religious Trauma Indicators',
      description: 'Your responses suggest severe indicators of religious trauma. You are experiencing profound impact across many areas of your life. Please know that this level of suffering is real, it is not your fault, and it is treatable. You deserve support, and healing is possible.',
      color: '#ef4444',
      recommendations: [
        'Please reach out to a mental health professional as soon as possible',
        'If you are in crisis, please contact the 988 Suicide and Crisis Lifeline (call or text 988)',
        'The Religious Trauma Institute specializes in exactly this level of harm',
        'You do not have to navigate this alone',
        'Healing from this level of trauma is possible — many people have done it',
      ],
      articles: [
        { title: 'What Is Religious Trauma Syndrome?', slug: 'what-is-religious-trauma-syndrome' },
        { title: 'The Faith Wound: What Actually Heals It', slug: 'the-faith-wound-what-heals-it' },
        { title: 'EMDR for Religious Trauma', slug: 'emdr-for-religious-trauma' },
      ],
    };
  }
}

export default function ReligiousTraumaAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);

  const progress = (currentQuestion / questions.length) * 100;
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const result = showResult ? getResult(totalScore) : null;

  const handleOptionSelect = (value: number) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
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
            <div className="assessment-intro-icon">🔍</div>
            <span className="assessment-intro-eyebrow">Self-Assessment Tool</span>
            <h1 className="assessment-intro-title">Religious Trauma Assessment</h1>
            <p className="assessment-intro-subtitle">Understand Your Wound</p>
            <p className="assessment-intro-description">
              This 20-question assessment is designed to help you understand the presence and severity of religious trauma symptoms in your life. It is based on clinical frameworks developed by Dr. Marlene Winell, the Religious Trauma Institute, and research on spiritual abuse and high-control group recovery.
            </p>
            <div className="assessment-intro-meta">
              <div className="meta-item">
                <span className="meta-icon">📝</span>
                <span>20 questions</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>8–10 minutes</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🔒</span>
                <span>Private & anonymous</span>
              </div>
            </div>
            <div className="assessment-disclaimer-box">
              <strong>Important:</strong> This assessment is an educational tool, not a clinical diagnosis. It is designed to help you understand your experience and identify relevant resources. If you are experiencing significant distress, please reach out to a qualified mental health professional.
            </div>
            <button className="assessment-start-btn" onClick={() => setStarted(true)}>
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

  if (showResult && result) {
    return (
        <div className="assessment-container">
          <div className="assessment-result">
            <div className="result-header" style={{ borderTopColor: result.color }}>
              <div className="result-level-badge" style={{ background: `${result.color}20`, color: result.color }}>
                {result.level} Impact
              </div>
              <h1 className="result-title">{result.title}</h1>
              <div className="result-score-display">
                <div className="score-circle" style={{ borderColor: result.color }}>
                  <span className="score-number" style={{ color: result.color }}>{totalScore}</span>
                  <span className="score-max">/80</span>
                </div>
              </div>
            </div>
            
            <div className="result-description">
              <p>{result.description}</p>
            </div>

            <div className="result-section">
              <h2 className="result-section-title">Recommendations for You</h2>
              <ul className="result-recommendations">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="result-recommendation">
                    <span className="rec-check" style={{ color: result.color }}>✓</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="result-section">
              <h2 className="result-section-title">Relevant Articles</h2>
              <div className="result-articles">
                {result.articles.map((article) => (
                  <Link key={article.slug} to={`/articles/${article.slug}`} className="result-article-link">
                    <span className="result-article-title">{article.title}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="result-crisis-note">
              <strong>If you are in crisis:</strong> Please contact the 988 Suicide and Crisis Lifeline by calling or texting <strong>988</strong>. You can also reach the Crisis Text Line by texting HOME to 741741.
            </div>

            <div className="result-actions">
              <button className="result-restart-btn" onClick={handleRestart}>
                Retake Assessment
              </button>
              <Link to="/assessments" className="result-other-btn">
                Try Other Assessments
              </Link>
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
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="quiz-progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <div className="quiz-question-card">
            <div className="question-category">{question.category.replace(/-/g, ' ')}</div>
            <h2 className="question-text">{question.text}</h2>
            
            <div className="question-options">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  className={`question-option ${selectedOption === option.value ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  <span className="option-indicator" />
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              className="quiz-nav-btn prev"
              onClick={handlePrev}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            <button
              className="quiz-nav-btn next"
              onClick={handleNext}
              disabled={selectedOption === null}
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
  );
}
