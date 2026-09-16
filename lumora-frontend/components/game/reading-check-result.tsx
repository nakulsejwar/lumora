"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Gauge, CheckCircle2, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReadingFeedback } from "@/lib/reading-word-matcher";

interface ReadingCheckResultProps {
  wpm: number;
  wordAccuracy: number;
  matchedCount: number;
  expectedCount: number;
  elapsedSeconds: number;
  onContinue: () => void;
  buttonText?: string;
}

export const ReadingCheckResult: React.FC<ReadingCheckResultProps> = ({
  wpm,
  wordAccuracy,
  matchedCount,
  expectedCount,
  elapsedSeconds,
  onContinue,
  buttonText = "Continue to Story Quiz",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const durationText = `${mins > 0 ? `${mins}m ` : ""}${secs}s`;

  const feedback = getReadingFeedback(wpm, wordAccuracy);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-[#070235]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#c8c5d0]/50 shadow-2xl relative my-auto overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#fe932c] via-[#0091cf] to-[#070235]" />

        <div className="flex flex-col items-center text-center gap-2 mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#070235] text-[#fe932c] flex items-center justify-center shadow-md mb-2">
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0091cf]">
            LUMORA READING RHYTHM
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#070235]">
            Reading Check Complete!
          </h2>
          <p className="text-xs text-[#47464f] max-w-sm">
            Here is your reading rhythm summary for this passage.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Pace / WPM */}
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#c8c5d0]/60 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-[#0091cf]/15 text-[#0091cf] flex items-center justify-center mb-1">
              <Gauge className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-extrabold uppercase text-[#47464f]">
              READING PACE
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#070235] mt-0.5">
              {wpm > 0 ? `${wpm} WPM` : durationText}
            </span>
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#c8c5d0]/60 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-[#fe932c]/15 text-[#904d00] flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#fe932c]" />
            </div>
            <span className="text-[11px] font-mono font-extrabold uppercase text-[#47464f]">
              WORD ACCURACY
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#070235] mt-0.5">
              {wordAccuracy}%
            </span>
          </div>
        </div>

        {/* Words Read Detail */}
        <div className="p-4 rounded-2xl bg-[#eaedff]/60 border border-[#0091cf]/30 mb-6 flex items-center justify-between text-xs text-[#070235]">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen className="w-4 h-4 text-[#0091cf]" />
            <span>Words Read:</span>
          </div>
          <span className="font-mono font-extrabold text-sm">
            {matchedCount} / {expectedCount}
          </span>
        </div>

        {/* Encouraging Feedback Message */}
        <div className="p-4 rounded-2xl bg-[#fe932c]/10 border border-[#fe932c]/30 text-center mb-6">
          <p className="text-xs sm:text-sm font-bold text-[#904d00]">
            &quot;{feedback}&quot;
          </p>
        </div>

        {/* Continue Action Button */}
        <Button
          type="button"
          variant="theme"
          size="lg"
          onClick={onContinue}
          className="w-full py-6 text-sm font-extrabold tracking-wider uppercase shadow-lg rounded-2xl flex items-center justify-center gap-2"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
};
