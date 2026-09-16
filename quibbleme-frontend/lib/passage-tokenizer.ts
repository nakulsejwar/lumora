export interface PassageToken {
  index: number;
  text: string;
  cleanWord: string;
  normalized: string;
  paragraphIndex: number;
  tokenIndexInParagraph: number;
}

export interface PassageStructure {
  tokens: PassageToken[];
  paragraphs: PassageToken[][];
}

/**
 * Clean and normalize a word string for speech comparison.
 * - Lowercases the text
 * - Normalizes smart/curly apostrophes to standard single quote
 * - Strips leading/trailing punctuation and non-alphanumeric chars
 */
export function normalizeWord(raw: string): string {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/^[^\w']+|[^\w']+$|[^\w'\s]/g, "")
    .trim();
}

/**
 * Tokenize passage string into paragraphs and individual word tokens.
 * Preserves original display text while computing normalized forms for matching.
 */
export function tokenizePassage(passageText?: string | null): PassageStructure {
  if (!passageText || !passageText.trim()) {
    return { tokens: [], paragraphs: [] };
  }

  const rawParagraphs = passageText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const tokens: PassageToken[] = [];
  const paragraphs: PassageToken[][] = [];

  let overallIndex = 0;

  rawParagraphs.forEach((pText, pIdx) => {
    // Match word chunks while preserving punctuation attached to words
    const rawWords = pText.match(/\S+/g) || [];
    const paragraphTokens: PassageToken[] = [];

    rawWords.forEach((wordText, wIdx) => {
      const normalized = normalizeWord(wordText);
      const cleanWord = wordText.replace(/[^\w']/g, "");

      const token: PassageToken = {
        index: overallIndex,
        text: wordText,
        cleanWord,
        normalized,
        paragraphIndex: pIdx,
        tokenIndexInParagraph: wIdx,
      };

      tokens.push(token);
      paragraphTokens.push(token);
      overallIndex++;
    });

    paragraphs.push(paragraphTokens);
  });

  return { tokens, paragraphs };
}
