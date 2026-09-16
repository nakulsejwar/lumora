"use client";

import React, { useEffect } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { WordClueData } from "@/lib/vocab-dictionary";

interface WordCluePopoverProps {
  clueData: WordClueData;
  onClose: () => void;
}

export const WordCluePopover: React.FC<WordCluePopoverProps> = ({
  clueData,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Modal Card */}
      <div
        className="w-full max-w-md bg-[#070235] text-white rounded-3xl border border-[#fe932c]/50 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background blur ring */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#fe932c]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header Badge & Close Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#fe932c]/20 border border-[#fe932c]/50 text-[#fe932c] text-[11px] font-mono font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WORD CLUE</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close word clue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Word Display Title */}
        <div className="mb-4 border-b border-white/15 pb-3">
          <h3 className="text-2xl font-black text-white tracking-tight uppercase">
            {clueData.displayWord}
          </h3>
        </div>

        {/* Definition Section */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#fe932c]">
              SIMPLE DEFINITION
            </span>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed mt-0.5 font-medium">
              {clueData.definition}
            </p>
          </div>

          {/* Story Context Snippet */}
          {clueData.storyContext && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mt-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#89ceff] flex items-center gap-1.5 mb-1">
                <Search className="w-3 h-3 text-[#89ceff]" />
                <span>IN THIS STORY</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                &quot;{clueData.storyContext}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#fe932c] hover:bg-[#e07d19] text-[#070235] font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
