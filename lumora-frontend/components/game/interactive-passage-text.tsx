"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { getPassageVocabWords, getWordClueData, WordClueData } from "@/lib/vocab-dictionary";
import { WordCluePopover } from "@/components/modals/word-clue-popover";
import { PassageStructure, tokenizePassage } from "@/lib/passage-tokenizer";

interface InteractivePassageTextProps {
  passageText?: string | null;
  className?: string;
  readingCheckActive?: boolean;
  activeTokenIndex?: number | null;
  readTokenIndices?: Set<number>;
}

export const InteractivePassageText: React.FC<InteractivePassageTextProps> = ({
  passageText,
  className = "",
  readingCheckActive = false,
  activeTokenIndex = null,
  readTokenIndices = new Set(),
}) => {
  const [activeClueData, setActiveClueData] = useState<WordClueData | null>(null);
  const activeTokenRef = useRef<HTMLSpanElement | null>(null);

  const text = passageText || "";

  // Identify top vocabulary terms for Word Clues
  const targetWords = useMemo(() => {
    return getPassageVocabWords(text);
  }, [text]);

  const passageStructure: PassageStructure = useMemo(() => {
    return tokenizePassage(text);
  }, [text]);

  const handleWordClick = (matchedWord: string) => {
    const data = getWordClueData(matchedWord);
    if (data) {
      setActiveClueData(data);
    }
  };

  // Auto-scroll active word into view smoothly during Reading Check
  useEffect(() => {
    if (readingCheckActive && activeTokenIndex !== null && activeTokenIndex !== undefined) {
      const activeElement = document.getElementById(`passage-token-${activeTokenIndex}`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, [readingCheckActive, activeTokenIndex]);

  const renderPassageToken = (token: any) => {
    const isTargetVocab = targetWords.includes(token.cleanWord.toLowerCase());
    const isActive = readingCheckActive && token.index === activeTokenIndex;
    const isRead = readingCheckActive && readTokenIndices.has(token.index) && !isActive;

    // Base typography & interactive clues styling
    let tokenStyle = "inline-block transition-all duration-200 mx-[2px] my-[1px] ";

    if (isActive) {
      tokenStyle += "bg-[#fe932c]/25 text-[#070235] font-extrabold px-1 py-0.5 rounded-md shadow-xs ring-2 ring-[#fe932c]/60 scale-[1.03]";
    } else if (isRead) {
      tokenStyle += "bg-[#eaedff]/70 text-[#070235] rounded-xs px-0.5 font-medium";
    } else if (isTargetVocab) {
      tokenStyle += "font-semibold text-[#070235] border-b-2 border-dashed border-[#fe932c]/80 hover:border-[#fe932c] hover:bg-[#fe932c]/10 rounded-xs px-0.5 cursor-pointer";
    } else {
      tokenStyle += "text-[#131b2e]";
    }

    if (isTargetVocab) {
      return (
        <button
          key={token.index}
          id={`passage-token-${token.index}`}
          type="button"
          onClick={() => handleWordClick(token.text)}
          className={tokenStyle}
          title="Tap for Word Clue"
        >
          {token.text}
        </button>
      );
    }

    return (
      <span
        key={token.index}
        id={`passage-token-${token.index}`}
        className={tokenStyle}
      >
        {token.text}
      </span>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {passageStructure.paragraphs.length > 0 ? (
        passageStructure.paragraphs.map((paragraphTokens, pIdx) => (
          <p key={pIdx} className="mb-4 last:mb-0 leading-relaxed">
            {paragraphTokens.map((token) => renderPassageToken(token))}
          </p>
        ))
      ) : (
        <p className="text-gray-400 italic">No passage text provided.</p>
      )}

      {activeClueData && (
        <WordCluePopover
          clueData={activeClueData}
          onClose={() => setActiveClueData(null)}
        />
      )}
    </div>
  );
};
