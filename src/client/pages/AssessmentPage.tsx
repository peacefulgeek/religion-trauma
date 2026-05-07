import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReligiousTraumaAssessment from './assessments/ReligiousTraumaAssessment';
import DeconstructionStageFinder from './assessments/DeconstructionStageFinder';
import PostFaithIdentityQuiz from './assessments/PostFaithIdentityQuiz';

// Generic assessment component for the 6 additional assessments
function GenericAssessment({ config }: { config: AssessmentConfig }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  function answer(val: number) {
    const next = [...answers, val];
    setAnswers(next);
    if (current + 1 < config.questions.length) {
      setCurrent(current + 1);
    } else {
      const total = next.reduce((a, b) => a + b, 0);
      const max = config.questions.length * 4;
      const pct = total / max;
      const r = config.results.find(r => pct <= r.threshold) || config.results[config.results.length - 1];
      setResult(r);
    }
  }

  if (result) {
    return (
      <div className="assessment-result">
        <div className="result-header" style={{ background: config.gradient }}>
          <h2>{result.title}</h2>
          <p className="result-subtitle">{result.subtitle}</p>
        </div>
        <div className="result-body">
          <p className="result-description">{result.description}</p>
          <div className="result-recommendations">
            <h3>What Helps Right Now</h3>
            <ul>
              {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <div className="result-actions">
            <Link to="/assessments" className="btn-primary">Take Another Assessment</Link>
            <Link to="/articles" className="btn-secondary-link">Read Related Articles</Link>
          </div>
        </div>
        <style>{genericStyles}</style>
      </div>
    );
  }

  const q = config.questions[current];
  const progress = ((current) / config.questions.length) * 100;

  return (
    <div className="generic-assessment">
      <div className="ga-header" style={{ background: config.gradient }}>
        <h1>{config.title}</h1>
        <p>{config.subtitle}</p>
      </div>
      <div className="ga-progress-bar">
        <div className="ga-progress-fill" style={{ width: `${progress}%`, background: config.color }} />
      </div>
      <div className="ga-counter">{current + 1} of {config.questions.length}</div>
      <div className="ga-question">
        <h2>{q.text}</h2>
        <div className="ga-options">
          {['Not at all', 'A little', 'Somewhat', 'Quite a bit', 'Very much'].map((label, i) => (
            <button key={i} className="ga-option" onClick={() => answer(i)} style={{ borderColor: config.color }}>
              <span className="ga-option-num">{i}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{genericStyles}</style>
    </div>
  );
}

const genericStyles = `
  .generic-assessment { max-width: 680px; margin: 0 auto; }
  .ga-header { padding: 2.5rem; border-radius: 16px 16px 0 0; color: #fff; }
  .ga-header h1 { font-family: var(--font-serif); font-size: 1.8rem; margin: 0 0 0.5rem; }
  .ga-header p { opacity: 0.9; margin: 0; }
  .ga-progress-bar { height: 6px; background: var(--border-warm); }
  .ga-progress-fill { height: 100%; transition: width 0.4s ease; }
  .ga-counter { text-align: right; padding: 0.75rem 1.5rem; font-size: 0.85rem; color: var(--text-muted); }
  .ga-question { padding: 1.5rem; }
  .ga-question h2 { font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 1.5rem; color: var(--text-primary); }
  .ga-options { display: flex; flex-direction: column; gap: 0.75rem; }
  .ga-option { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border: 2px solid; border-radius: 10px; background: var(--bg-card); cursor: pointer; text-align: left; font-size: 1rem; color: var(--text-primary); transition: all 0.15s ease; }
  .ga-option:hover { background: #FFF8F0; transform: translateX(4px); }
  .ga-option-num { width: 28px; height: 28px; border-radius: 50%; background: var(--bg-page); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; flex-shrink: 0; }
  .assessment-result { max-width: 680px; margin: 0 auto; }
  .result-header { padding: 2.5rem; border-radius: 16px 16px 0 0; color: #fff; }
  .result-header h2 { font-family: var(--font-serif); font-size: 2rem; margin: 0 0 0.5rem; }
  .result-subtitle { opacity: 0.9; margin: 0; font-size: 1.1rem; }
  .result-body { padding: 2rem; background: var(--bg-card); border: 1px solid var(--border-warm); border-top: none; border-radius: 0 0 16px 16px; }
  .result-description { font-size: 1.05rem; line-height: 1.7; color: var(--text-primary); margin-bottom: 1.5rem; }
  .result-recommendations h3 { font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 0.75rem; }
  .result-recommendations ul { padding-left: 1.25rem; }
  .result-recommendations li { margin-bottom: 0.5rem; color: var(--text-secondary); line-height: 1.6; }
  .result-actions { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
  .btn-primary { padding: 0.75rem 1.75rem; background: var(--accent-primary); color: #fff; border-radius: 8px; font-weight: 600; text-decoration: none; }
  .btn-secondary-link { padding: 0.75rem 1.75rem; border: 2px solid var(--accent-primary); color: var(--accent-primary); border-radius: 8px; font-weight: 600; text-decoration: none; }
`;

interface AssessmentQuestion { text: string; }
interface AssessmentResult {
  threshold: number;
  title: string;
  subtitle: string;
  description: string;
  recommendations: string[];
}
interface AssessmentConfig {
  title: string;
  subtitle: string;
  color: string;
  gradient: string;
  questions: AssessmentQuestion[];
  results: AssessmentResult[];
}

const ASSESSMENT_CONFIGS: Record<string, AssessmentConfig> = {
  'spiritual-abuse-screening': {
    title: 'Spiritual Abuse Screening',
    subtitle: 'Name what happened. You deserve clarity.',
    color: '#8A4A4A',
    gradient: 'linear-gradient(135deg, #8A4A4A 0%, #AA6A6A 100%)',
    questions: [
      { text: 'I was told that questioning leadership was sinful or dangerous.' },
      { text: 'I felt afraid to leave or express doubts.' },
      { text: 'My personal boundaries were regularly overridden in the name of faith.' },
      { text: 'I was shamed publicly or privately for not conforming.' },
      { text: 'I was discouraged from seeking outside help or therapy.' },
      { text: 'My financial decisions were controlled or heavily influenced by religious leaders.' },
      { text: 'I experienced or witnessed sexual misconduct covered up by the community.' },
      { text: 'I was told my mental health struggles were a spiritual failing.' },
      { text: 'I was isolated from family or friends who were not part of the group.' },
      { text: 'I felt I could never do enough to earn approval or salvation.' },
      { text: 'My identity outside the group felt non-existent or forbidden.' },
      { text: 'I was threatened with spiritual consequences for leaving.' },
      { text: 'Information about the outside world was controlled or filtered.' },
      { text: 'I witnessed or experienced emotional manipulation in the name of God.' },
      { text: 'I still feel fear, guilt, or shame when I think about leaving.' },
      { text: 'My physical health needs were minimized in favor of prayer or faith.' },
    ],
    results: [
      { threshold: 0.25, title: 'Low Indicators', subtitle: 'Some concerning patterns, but limited', description: 'Your responses suggest a few concerning patterns but not a high level of spiritual abuse. This doesn\'t mean your experience wasn\'t harmful. Even low-level spiritual coercion leaves marks. Trust what you felt.', recommendations: ['Read about the spectrum of spiritual harm', 'Consider what boundaries felt violated', 'Journaling about specific incidents can help clarify your experience', 'You don\'t need a high score for your pain to be real'] },
      { threshold: 0.5, title: 'Moderate Indicators', subtitle: 'Real harm occurred here', description: 'Your responses indicate a moderate level of spiritual abuse patterns. What you experienced was real. The confusion you feel is a normal response to having your reality distorted by people who claimed authority over you.', recommendations: ['A therapist familiar with spiritual abuse can help you process this', 'The book "Healing Spiritual Abuse" by Ken Blue is a good starting point', 'Online communities like r/ExChristian offer peer support', 'Give yourself permission to be angry about what happened'] },
      { threshold: 0.75, title: 'Significant Indicators', subtitle: 'This was serious harm', description: 'Your responses indicate significant spiritual abuse. What you experienced was serious. The effects on your nervous system, identity, and relationships are real clinical phenomena, not weakness or overreaction.', recommendations: ['Trauma-informed therapy is strongly recommended', 'EMDR has shown effectiveness for spiritual abuse trauma', 'The Religious Trauma Institute has a therapist directory', 'Recovery takes time. Be patient with yourself.'] },
      { threshold: 1.0, title: 'Severe Indicators', subtitle: 'You survived something serious', description: 'Your responses indicate severe spiritual abuse. You survived something that caused real harm. The symptoms you\'re experiencing, whether anxiety, hypervigilance, difficulty trusting, or identity confusion, are appropriate responses to what happened to you.', recommendations: ['Please seek trauma-informed therapy as soon as possible', 'SNAP (Survivors Network of Those Abused by Priests) offers support', 'The Freedom of Mind Resource Center specializes in cult recovery', 'You are not alone. Recovery is possible.'] },
    ],
  },
  'purity-culture-impact': {
    title: 'Purity Culture Impact Assessment',
    subtitle: 'Your body deserves to come home.',
    color: '#7A5A6A',
    gradient: 'linear-gradient(135deg, #7A5A6A 0%, #9A7A8A 100%)',
    questions: [
      { text: 'I grew up with explicit teachings that sex before marriage was sinful.' },
      { text: 'I was taught that my body was a source of temptation for others.' },
      { text: 'I feel shame or discomfort about my body or sexuality.' },
      { text: 'I struggle with intimacy or sexual connection in relationships.' },
      { text: 'I was taught that my worth was tied to my sexual purity.' },
      { text: 'I feel guilt about sexual thoughts or desires.' },
      { text: 'I was given modesty rules that made me responsible for others\' thoughts.' },
      { text: 'I have difficulty experiencing pleasure without guilt.' },
      { text: 'I was taught that masturbation was sinful.' },
      { text: 'I feel disconnected from my body or physical sensations.' },
      { text: 'I was told that sexual abuse or assault was partly my fault.' },
      { text: 'I struggle with eating or body image in ways I connect to religious messages.' },
      { text: 'I have difficulty setting sexual boundaries because of religious conditioning.' },
      { text: 'I feel shame about my sexual history or past choices.' },
      { text: 'I was not given accurate sex education because of religious restrictions.' },
      { text: 'I still hear internal religious voices when I engage in sexual activity.' },
      { text: 'I have experienced sexual dysfunction I believe is connected to purity culture.' },
      { text: 'I feel anger when I think about the messages I received about my body.' },
    ],
    results: [
      { threshold: 0.25, title: 'Mild Impact', subtitle: 'Some residue, manageable', description: 'Your responses suggest mild purity culture impact. Some messages got in, but they haven\'t deeply disrupted your relationship with your body or sexuality. That said, even mild conditioning is worth examining.', recommendations: ['Reading "Pure" by Linda Kay Klein can help name what happened', 'Somatic awareness practices can help you reconnect with your body', 'Therapy isn\'t required but can accelerate healing'] },
      { threshold: 0.5, title: 'Moderate Impact', subtitle: 'Real disruption to body and sexuality', description: 'Your responses indicate moderate purity culture impact. The messages you received have created real disruption in your relationship with your body, sexuality, and sense of worth. This is healable.', recommendations: ['Sex-positive therapy can help address specific sexual concerns', '"Damaged Goods" by Dianna Anderson is an excellent resource', 'Somatic experiencing can help reconnect you with your body', 'Give yourself permission to grieve what purity culture took from you'] },
      { threshold: 0.75, title: 'Significant Impact', subtitle: 'Deep conditioning that needs attention', description: 'Your responses indicate significant purity culture impact. The conditioning you received has deeply affected your relationship with your body, your sexuality, and your sense of worth. You deserve support in healing this.', recommendations: ['A therapist specializing in purity culture recovery is strongly recommended', 'Somatic sex education can help reclaim your relationship with your body', '"The Great Sex Rescue" by Sheila Wray Gregoire addresses this directly', 'Recovery is possible. Your body is not the enemy.'] },
      { threshold: 1.0, title: 'Severe Impact', subtitle: 'You deserve deep healing here', description: 'Your responses indicate severe purity culture impact. What was done to your relationship with your body and sexuality was a profound harm. You did not deserve it. Healing is possible and you deserve it.', recommendations: ['Trauma-informed sex therapy is strongly recommended', 'EMDR can address the traumatic aspects of purity culture conditioning', 'The Secular Therapy Project can help find a non-religious therapist', 'Be patient with yourself. This healing takes time.'] },
    ],
  },
  'faith-grief-inventory': {
    title: 'Faith Grief Inventory',
    subtitle: 'Your loss is real. All of it.',
    color: '#4A6A7A',
    gradient: 'linear-gradient(135deg, #4A6A7A 0%, #6A8A9A 100%)',
    questions: [
      { text: 'I grieve the loss of certainty that my faith provided.' },
      { text: 'I miss the sense of community I had in my religious group.' },
      { text: 'I feel the loss of a clear moral framework.' },
      { text: 'I grieve the loss of the God I believed in.' },
      { text: 'I miss the rituals and practices that gave my life structure.' },
      { text: 'I feel grief about the relationships I lost when I left.' },
      { text: 'I grieve the loss of a clear sense of purpose or calling.' },
      { text: 'I miss having answers to the big questions of life.' },
      { text: 'I feel grief about the years I spent in a belief system I no longer hold.' },
      { text: 'I miss the comfort of prayer or spiritual practice.' },
      { text: 'I grieve the loss of a shared language and culture.' },
      { text: 'I feel grief about the impact of my leaving on my family.' },
      { text: 'I miss the hope that my faith gave me about death and afterlife.' },
      { text: 'I feel grief about the person I was before I left.' },
    ],
    results: [
      { threshold: 0.25, title: 'Mild Grief', subtitle: 'Some losses, mostly integrated', description: 'Your grief responses suggest you\'ve integrated most of your faith losses, with some areas still tender. This is normal. Grief isn\'t linear and some losses resurface unexpectedly.', recommendations: ['Journaling about specific losses can help complete the grief process', 'Secular grief rituals can help mark what you\'ve lost', 'Stay curious about what still feels unresolved'] },
      { threshold: 0.5, title: 'Active Grief', subtitle: 'Real losses that need acknowledgment', description: 'Your responses indicate active, real grief about your faith losses. This grief is appropriate. You lost a complete cosmology, a community, a language, and often a family system. That is a profound loss.', recommendations: ['Grief groups for people leaving religion can provide peer support', '"The Grief of Leaving" by Marlene Winell addresses this directly', 'A therapist familiar with disenfranchised grief can help', 'Allow yourself to grieve without rushing toward resolution'] },
      { threshold: 0.75, title: 'Significant Grief', subtitle: 'Grief that needs active support', description: 'Your responses indicate significant, active grief that is affecting your daily life. This is not weakness. You lost something enormous. The grief is proportionate to the loss.', recommendations: ['Grief-focused therapy is strongly recommended', 'The concept of disenfranchised grief can help you understand why others don\'t validate your loss', 'Online communities of people who have left religion can provide peer support', 'Be patient with yourself. This grief has its own timeline.'] },
      { threshold: 1.0, title: 'Profound Grief', subtitle: 'You are carrying a lot right now', description: 'Your responses indicate profound grief that is significantly impacting your life. You are carrying a lot. The losses you\'ve experienced are real and deserve real support.', recommendations: ['Please seek grief-focused therapy or counseling', 'The Secular Therapy Project can help find a non-religious therapist', 'Grief support groups for faith transitions exist online and in person', 'You don\'t have to carry this alone.'] },
    ],
  },
  'identity-after-faith': {
    title: 'Identity After Faith',
    subtitle: 'Who you are is still being written.',
    color: '#5A7A5A',
    gradient: 'linear-gradient(135deg, #5A7A5A 0%, #7A9A7A 100%)',
    questions: [
      { text: 'I know what I value, independent of my religious upbringing.' },
      { text: 'I have a clear sense of who I am outside of my former faith identity.' },
      { text: 'I can make ethical decisions without relying on religious rules.' },
      { text: 'I feel comfortable with uncertainty about big questions.' },
      { text: 'I have found new sources of meaning and purpose.' },
      { text: 'I have rebuilt or am rebuilding my sense of community.' },
      { text: 'I feel at home in my body and in the world.' },
      { text: 'I can engage with my former faith without significant distress.' },
      { text: 'I have a stable sense of self that doesn\'t depend on external validation.' },
      { text: 'I feel excited about who I am becoming.' },
      { text: 'I have integrated my past faith experience into my story without being defined by it.' },
      { text: 'I feel free to explore ideas, practices, and communities without fear.' },
      { text: 'I trust my own judgment and intuition.' },
    ],
    results: [
      { threshold: 0.35, title: 'Early Reconstruction', subtitle: 'The foundation is still being laid', description: 'Your responses suggest you are in the early stages of identity reconstruction. This is normal. Identity rebuilding after leaving religion takes time. You are not behind. You are exactly where you need to be.', recommendations: ['Focus on small, concrete steps toward self-knowledge', 'Journaling about your values can help clarify who you are becoming', 'Therapy can accelerate the identity reconstruction process', 'Be patient with the uncertainty. It won\'t last forever.'] },
      { threshold: 0.6, title: 'Active Reconstruction', subtitle: 'Building something real', description: 'Your responses suggest you are actively rebuilding your identity. You have some anchors but are still finding your footing in many areas. This is the work. It\'s not comfortable, but it\'s productive.', recommendations: ['Continue exploring what you value and what brings meaning', 'Secular communities can provide new identity anchors', 'Consider what from your former faith you want to keep, release, or transform', 'The book "Leaving the Fold" by Marlene Winell is a useful guide'] },
      { threshold: 0.8, title: 'Consolidating Identity', subtitle: 'The pieces are coming together', description: 'Your responses suggest you are consolidating a post-faith identity. You have significant anchors and are integrating your experience. There are still tender spots, but you have a foundation.', recommendations: ['Continue deepening your self-knowledge', 'Consider how you want to contribute to the world from your new identity', 'Mentoring others in earlier stages of the journey can be meaningful', 'Celebrate how far you\'ve come'] },
      { threshold: 1.0, title: 'Integrated Identity', subtitle: 'You\'ve done significant work', description: 'Your responses suggest a well-integrated post-faith identity. You have done significant work. You know who you are, what you value, and where you are going. This is not the end of growth, but a solid foundation.', recommendations: ['Continue deepening your self-knowledge and expanding your world', 'Your story and recovery can be a resource for others', 'Consider what you want to build from here', 'You are a whole person. Act like it.'] },
    ],
  },
  'community-loss-scale': {
    title: 'Community Loss Scale',
    subtitle: 'The belonging wound is real.',
    color: '#6A5A4A',
    gradient: 'linear-gradient(135deg, #6A5A4A 0%, #8A7A6A 100%)',
    questions: [
      { text: 'I lost significant friendships when I left my faith community.' },
      { text: 'I feel isolated or lonely since leaving.' },
      { text: 'I miss having a built-in social network.' },
      { text: 'I struggle to find community that feels as close as my religious community did.' },
      { text: 'I miss the shared rituals and celebrations of my former community.' },
      { text: 'I feel like an outsider in secular social settings.' },
      { text: 'I lost family relationships when I left.' },
      { text: 'I miss having people who shared my worldview and language.' },
      { text: 'I struggle with the lack of structure that religious community provided.' },
      { text: 'I feel grief about the community I lost.' },
      { text: 'I have not yet found a new community that meets my belonging needs.' },
      { text: 'I feel envious of people who have strong community connections.' },
    ],
    results: [
      { threshold: 0.3, title: 'Mild Community Loss', subtitle: 'Some gaps, mostly filled', description: 'Your responses suggest mild community loss. You\'ve maintained or rebuilt most of your social connections. Some gaps remain, but you have a foundation of belonging.', recommendations: ['Continue investing in the relationships you have', 'Explore communities aligned with your current values', 'Volunteering is a reliable path to community'] },
      { threshold: 0.55, title: 'Moderate Community Loss', subtitle: 'Real gaps that need attention', description: 'Your responses indicate moderate community loss. The social infrastructure of your former faith community is hard to replace. This is a real challenge, not a personal failing.', recommendations: ['Sunday Assembly and secular congregations offer community without theology', 'Meetup.com groups around shared interests can build new connections', 'Humanist communities often welcome people in faith transition', 'Be patient. Building community takes time.'] },
      { threshold: 0.8, title: 'Significant Community Loss', subtitle: 'Isolation that needs active response', description: 'Your responses indicate significant community loss and isolation. This is one of the hardest parts of leaving religion. The belonging you lost was real and the gap is real. It can be rebuilt.', recommendations: ['Actively seek out communities of people who have left religion', 'The Recovering from Religion Foundation has local groups', 'Online communities can bridge the gap while you build in-person connections', 'A therapist can help you process the grief of community loss'] },
      { threshold: 1.0, title: 'Profound Community Loss', subtitle: 'You are carrying significant isolation', description: 'Your responses indicate profound community loss and isolation. You are carrying a lot. The belonging you lost was a significant part of your life, and the gap is significant. You deserve support in rebuilding.', recommendations: ['Please reach out to online communities of people who have left religion', 'The Secular Therapy Project can help find a therapist who understands this', 'Recovery from Religion has a helpline: 1-844-368-6748', 'You are not alone, even when it feels that way.'] },
    ],
  },
  'body-shame-inventory': {
    title: 'Body Shame Inventory',
    subtitle: 'Your body was never the problem.',
    color: '#7A4A6A',
    gradient: 'linear-gradient(135deg, #7A4A6A 0%, #9A6A8A 100%)',
    questions: [
      { text: 'I feel shame about my body or its appearance.' },
      { text: 'I was taught that my body was inherently sinful or fallen.' },
      { text: 'I struggle to feel at home in my body.' },
      { text: 'I feel shame about physical desires or appetites.' },
      { text: 'I was taught that physical pleasure was suspect or dangerous.' },
      { text: 'I feel disconnected from physical sensations.' },
      { text: 'I have difficulty accepting my body as it is.' },
      { text: 'I was taught that the body was less important than the spirit.' },
      { text: 'I feel shame about my body\'s natural functions.' },
      { text: 'I have used religious practices to control or punish my body.' },
      { text: 'I feel uncomfortable with physical touch or affection.' },
      { text: 'I still hear religious messages when I look at my body.' },
      { text: 'I feel shame about aging, illness, or physical limitations.' },
      { text: 'I have difficulty accepting pleasure without guilt.' },
      { text: 'I feel that my body has betrayed me or let me down.' },
    ],
    results: [
      { threshold: 0.25, title: 'Mild Body Shame', subtitle: 'Some residue, mostly manageable', description: 'Your responses suggest mild body shame from religious upbringing. Some messages got in, but they haven\'t deeply disrupted your relationship with your body. Awareness is the first step.', recommendations: ['Somatic awareness practices can help deepen your connection to your body', 'Yoga or movement practices can help reclaim embodiment', 'Reading about the body-faith connection can help name what happened'] },
      { threshold: 0.5, title: 'Moderate Body Shame', subtitle: 'Real disconnection that needs attention', description: 'Your responses indicate moderate body shame that is creating real disconnection from your physical self. Your body was never the enemy. The messages you received were wrong.', recommendations: ['Somatic experiencing therapy can help reconnect you with your body', '"The Body Keeps the Score" by Bessel van der Kolk is essential reading', 'Movement practices that emphasize sensation over performance can help', 'Be gentle with yourself as you reclaim your body'] },
      { threshold: 0.75, title: 'Significant Body Shame', subtitle: 'Deep conditioning that needs support', description: 'Your responses indicate significant body shame that is deeply affecting your relationship with your physical self. This is a real clinical phenomenon with real solutions. You deserve to feel at home in your body.', recommendations: ['Somatic therapy is strongly recommended', 'EMDR can address traumatic body shame', 'Mindful movement practices can help rebuild body trust', 'A therapist specializing in body image and religious trauma can help'] },
      { threshold: 1.0, title: 'Severe Body Shame', subtitle: 'You deserve to come home to your body', description: 'Your responses indicate severe body shame that is significantly affecting your quality of life. What was done to your relationship with your body was a profound harm. Healing is possible. Your body is not the enemy.', recommendations: ['Please seek somatic or body-focused therapy', 'The Secular Therapy Project can help find a non-religious therapist', 'Somatic experiencing and EMDR have strong evidence for body shame', 'Your body has been waiting for you to come home to it.'] },
    ],
  },
};

export function AssessmentPage() {
  const { slug } = useParams<{ slug: string }>();

  switch (slug) {
    case 'religious-trauma-assessment':
      return <ReligiousTraumaAssessment />;
    case 'deconstruction-stage-finder':
      return <DeconstructionStageFinder />;
    case 'post-faith-identity-quiz':
      return <PostFaithIdentityQuiz />;
    case 'spiritual-abuse-screening':
    case 'purity-culture-impact':
    case 'faith-grief-inventory':
    case 'identity-after-faith':
    case 'community-loss-scale':
    case 'body-shame-inventory':
      return <GenericAssessment config={ASSESSMENT_CONFIGS[slug!]} />;
    default:
      return <Navigate to="/assessments" replace />;
  }
}
