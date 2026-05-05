import { BANNED_WORDS, BANNED_PHRASES } from './deepseek-generate.mjs';

const MIN_WORDS = 1200;
const MAX_WORDS = 2500;

/**
 * Run all quality checks on an article body.
 * Returns { passed: boolean, failures: string[] }
 */
export function runQualityGate(body) {
  const failures = [];

  if (!body || typeof body !== 'string') {
    return { passed: false, failures: ['body is empty or not a string'] };
  }

  // 1. Word count check
  const wordCount = countWords(body);
  if (wordCount < MIN_WORDS) {
    failures.push(`word count too low: ${wordCount} (min ${MIN_WORDS})`);
  }
  if (wordCount > MAX_WORDS) {
    failures.push(`word count too high: ${wordCount} (max ${MAX_WORDS})`);
  }

  // 2. Em-dash check (zero tolerance)
  const emDashCount = (body.match(/\u2014/g) || []).length;
  if (emDashCount > 0) {
    failures.push(`em-dash found: ${emDashCount} occurrences (must be 0)`);
  }

  // 3. Banned words check
  const lowerBody = body.toLowerCase();
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'g');
    const matches = lowerBody.match(regex);
    if (matches && matches.length > 0) {
      failures.push(`banned word "${word}" found ${matches.length} time(s)`);
    }
  }

  // 4. Banned phrases check
  for (const phrase of BANNED_PHRASES) {
    if (lowerBody.includes(phrase.toLowerCase())) {
      failures.push(`banned phrase found: "${phrase}"`);
    }
  }

  // 5. Check for raw HTML anchor tags (should be rendered links)
  // Allow <a href> but not broken/raw text links
  const rawLinkPattern = /https?:\/\/[^\s<>"]+(?=\s|$)/g;
  // This is informational only, not a hard fail

  // 6. Check minimum content structure
  if (!body.includes('<h2') && !body.includes('<H2')) {
    failures.push('no H2 headings found — article lacks structure');
  }

  return {
    passed: failures.length === 0,
    failures,
    wordCount
  };
}

function countWords(text) {
  // Strip HTML tags and count words
  const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped.split(' ').filter(w => w.length > 0).length;
}

export { countWords };
