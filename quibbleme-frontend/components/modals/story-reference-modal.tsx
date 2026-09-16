"use client";

import React, { useEffect } from "react";
import { X, BookOpen, FileText } from "lucide-react";
import { InteractivePassageText } from "@/components/game/interactive-passage-text";

interface StoryReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle?: string;
  missionTitle?: string;
  passageText?: string;
}

export const StoryReferenceModal: React.FC<StoryReferenceModalProps> = ({
  isOpen,
  onClose,
  storyTitle,
  missionTitle,
  passageText = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayTitle = storyTitle || missionTitle || "Story Reference";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className="w-full max-w-3xl bg-[#faf8ff] rounded-3xl border border-[#c8c5d0] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#c8c5d0]/50 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#070235] text-[#fe932c] flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#47464f]">
                STORY REFERENCE
              </span>
              <h2 className="text-lg font-extrabold text-[#070235] line-clamp-1">
                {displayTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#070235] flex items-center justify-center transition-colors shadow-xs"
            aria-label="Close story reference"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passage Content Body */}
        <div className="p-6 overflow-y-auto grow space-y-4 bg-[#faf8ff]">
          <div className="flex items-center justify-between border-b border-[#eaedff] pb-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#070235] uppercase tracking-wider">
              <FileText className="w-4 h-4 text-[#fe932c]" />
              <span>Full Story Text</span>
            </div>
            <span className="text-[11px] font-mono text-[#47464f]">
              Tap underlined words for Word Clues
            </span>
          </div>

          <div className="text-base sm:text-lg leading-relaxed text-[#131b2e] font-serif tracking-wide">
            <InteractivePassageText passageText={passageText} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c8c5d0]/50 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#070235] hover:bg-[#1e1b4b] text-white text-xs font-bold transition-colors shadow-sm"
          >
            Return to Question
          </button>
        </div>
      </div>
    </div>
  );
};
