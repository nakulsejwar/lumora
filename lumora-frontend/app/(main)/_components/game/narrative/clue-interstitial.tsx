"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, ArrowRight, X, Lightbulb } from "lucide-react";
import { SKILL_INFO, SkillTag } from "@/lib/skill-info";
import { Question } from "@/types/game.types";
import { getQuestionClue } from "@/lib/clue-helper";

interface ClueInterstitialProps {
  clueNumber: number;
  totalClues: number;
  question?: Question;
  skillTag?: string;
  onContinue: () => void;
}

export const ClueInterstitial: React.FC<ClueInterstitialProps> = ({
  clueNumber,
  totalClues,
  question,
  skillTag,
  onContinue,
}) => {
  const activeSkillTag = question?.skill_tag || skillTag;
  const clueDesc = getQuestionClue(question, clueNumber);

  const skillInfo = activeSkillTag
    ? SKILL_INFO[activeSkillTag.toLowerCase().replace(/-/g, "_") as SkillTag] ||
      SKILL_INFO[activeSkillTag as SkillTag]
    : null;

  return (
    <div className="fixed inset-0 z-[65] bg-[#070235]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#faf8ff] border-2 border-[#fe932c] p-6 sm:p-8 shadow-2xl text-center text-[#131b2e] relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#fe932c]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#0091cf]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onContinue}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#070235] transition-colors shadow-sm"
          title="Close Clue"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fe932c]/20 border border-[#fe932c]/50 text-[#fe932c] mb-4 shadow-md">
          <Search className="w-8 h-8 text-[#fe932c]" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-extrabold uppercase tracking-widest text-[#904d00] mb-1">
          <Sparkles className="w-4 h-4 text-[#fe932c]" />
          <span>STORY CLUE HINT</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#070235] tracking-tight mb-2">
          Clue #{clueNumber} Hint
        </h3>

        {skillInfo && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0091cf]/15 border border-[#0091cf]/30 text-[#0091cf] text-xs font-extrabold uppercase tracking-wider mb-4">
            <Lightbulb className="w-4 h-4 text-[#0091cf]" />
            <span>Skill Focus: {skillInfo.label}</span>
          </div>
        )}

        <p className="text-sm sm:text-base text-[#131b2e] font-medium mb-6 leading-relaxed bg-[#eaedff] p-4 sm:p-5 rounded-2xl border border-[#c8c5d0]/70 shadow-inner text-left">
          {clueDesc}
        </p>

        <Button
          variant="theme"
          className="w-full bg-[#070235] hover:bg-[#1e1b4b] text-white font-bold py-6 text-base rounded-xl shadow-lg border border-[#89ceff]/30 flex items-center justify-center gap-2"
          onClick={onContinue}
        >
          <span>Return to Investigation</span>
          <ArrowRight className="w-5 h-5 text-[#fe932c]" />
        </Button>
      </div>
    </div>
  );
};


