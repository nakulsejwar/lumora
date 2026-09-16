import { PassageToken, normalizeWord } from "./passage-tokenizer";

export interface MatcherResult {
  currentIndex: number;
  matchedIndices: Set<number>;
  readIndices: Set<number>;
  matchedCount: number;
  expectedCount: number;
  wordAccuracy: number;
  wpm: number;
  isCompleted: boolean;
}

const LOOKAHEAD_WINDOW = 5;

/**
 * Match a recognized speech transcript against passage tokens.
 * Performs incremental, deterministic forward-matching with a lookahead window
 * to tolerate speech pauses, stumbles, repeated words, and minor recognition gaps.
 */
export function matchTranscriptToTokens(
  tokens: PassageToken[],
  rawTranscript: string,
  elapsedSeconds: number = 0,
  prevResult?: MatcherResult
): MatcherResult {
  const expectedCount = tokens.length;

  if (expectedCount === 0) {
    return {
      currentIndex: 0,
      matchedIndices: new Set(),
      readIndices: new Set(),
      matchedCount: 0,
      expectedCount: 0,
      wordAccuracy: 100,
      wpm: 0,
      isCompleted: true,
    };
  }

  // Split raw transcript into normalized word tokens
  const spokenWords = rawTranscript
    .trim()
    .split(/\s+/)
    .map(normalizeWord)
    .filter((w) => w.length > 0);

  const matchedIndices = new Set<number>(prevResult?.matchedIndices || []);
  let lastMatchedIndex = prevResult ? Math.max(-1, ...Array.from(prevResult.matchedIndices)) : -1;

  for (const spokenWord of spokenWords) {
    if (!spokenWord) continue;

    const startSearch = lastMatchedIndex + 1;
    const endSearch = Math.min(expectedCount, startSearch + LOOKAHEAD_WINDOW);

    for (let i = startSearch; i < endSearch; i++) {
      const token = tokens[i];
      if (!token || !token.normalized) continue;

      if (
        token.normalized === spokenWord ||
        (token.normalized.length >= 4 && spokenWord.length >= 4 && (token.normalized.includes(spokenWord) || spokenWord.includes(token.normalized)))
      ) {
        matchedIndices.add(token.index);
        lastMatchedIndex = token.index;
        break;
      }
    }
  }

  const currentIndex = Math.max(0, Math.min(expectedCount - 1, lastMatchedIndex >= 0 ? lastMatchedIndex : 0));

  // Determine all tokens prior to or at lastMatchedIndex as "read"
  const readIndices = new Set<number>();
  for (let i = 0; i <= lastMatchedIndex; i++) {
    readIndices.add(i);
  }

  const matchedCount = matchedIndices.size;
  const wordsAttempted = Math.max(lastMatchedIndex + 1, matchedCount);
  const wordAccuracy = wordsAttempted > 0 ? Math.min(100, Math.round((matchedCount / wordsAttempted) * 100)) : 100;

  // WPM calculation: only show meaningful WPM after at least 3 seconds
  let wpm = 0;
  if (elapsedSeconds >= 3 && matchedCount > 0) {
    const readingMinutes = elapsedSeconds / 60;
    wpm = Math.round(matchedCount / readingMinutes);
  }

  const isCompleted = lastMatchedIndex >= expectedCount - 1;

  return {
    currentIndex,
    matchedIndices,
    readIndices,
    matchedCount,
    expectedCount,
    wordAccuracy,
    wpm,
    isCompleted,
  };
}

/**
 * Generate a friendly, encouraging interpretation string based on accuracy and WPM.
 */
export function getReadingFeedback(wpm: number, accuracy: number): string {
  if (accuracy >= 90) {
    if (wpm > 120) {
      return "Fantastic reading rhythm! Excellent speed and high accuracy.";
    }
    return "Nice steady reading! You stayed very close to the story text.";
  } else if (accuracy >= 75) {
    return "Great effort! You maintained a clear reading pace through the passage.";
  } else {
    return "Good practice! Slowing down slightly around tricky words can boost your accuracy.";
  }
}
