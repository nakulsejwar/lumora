"use client";
import React, { useState } from "react";
import { Sparkles, Search, ShieldCheck, Info } from "lucide-react";
import { SkillTag, SKILL_INFO } from "@/lib/skill-info";
import { StoryReferenceModal } from "@/components/modals/story-reference-modal";

interface NarrativeHeaderProps {
  missionTitle: string;
  currentClue: number;
  totalClues: number;
  targetSkill?: string;
  currentSkillTag?: string;
  passageText?: string;
  onOpenClue?: () => void;
}

export const NarrativeHeader: React.FC<NarrativeHeaderProps> = ({
  missionTitle,
  currentClue,
  totalClues,
  targetSkill,
  currentSkillTag,
  passageText,
  onOpenClue,
}) => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const targetSkillInfo = targetSkill ? SKILL_INFO[targetSkill as SkillTag] : null;
  const currentSkillInfo = currentSkillTag ? SKILL_INFO[currentSkillTag as SkillTag] : null;

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-[#070235] text-white shadow-xl border border-[#0091cf]/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0091cf]/20 border border-[#89ceff]/40 flex items-center justify-center shrink-0 shadow-sm">
              <Search className="w-5 h-5 text-[#89ceff]" />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#89ceff]">
                <Sparkles className="w-3.5 h-3.5 text-[#fe932c]" />
                <span>Lumora Investigation</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {missionTitle}
                </h2>
                {passageText && (
                  <button
                    onClick={() => setIsStoryModalOpen(true)}
                    className="w-7 h-7 rounded-full bg-[#0091cf]/20 hover:bg-[#0091cf]/40 border border-[#89ceff]/40 text-[#89ceff] hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    aria-label="Story Reference"
                    title="Story Reference"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {targetSkillInfo && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#eaedff]/10 border border-[#89ceff]/30 text-[#89ceff]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#fe932c]" />
                {targetSkillInfo.label}
              </span>
            )}

            {onOpenClue ? (
              <button
                onClick={onOpenClue}
                className="text-xs font-mono font-extrabold px-3.5 py-1.5 rounded-xl bg-[#fe932c] hover:bg-[#ffa94d] text-[#070235] flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Click to view Clue Hint"
              >
                <Search className="w-3.5 h-3.5 text-[#070235]" />
                <span className="uppercase tracking-wider">🔎 Need a Clue?</span>
              </button>
            ) : (
              <div className="text-xs font-mono font-extrabold px-3.5 py-1.5 rounded-xl bg-[#fe932c] text-[#070235] flex items-center gap-1.5 shadow-sm">
                <span className="uppercase tracking-wider">Clue</span>
                <span className="font-extrabold text-sm text-[#070235]">
                  {currentClue}
                </span>
                <span className="text-[#070235]/70">/ {totalClues}</span>
              </div>
            )}
          </div>
        </div>

        {currentSkillInfo && (
          <div className="mt-3 pt-2.5 border-t border-[#c8c5d0]/20 flex items-center justify-between text-xs text-[#eaedff]">
            <span className="font-medium text-[#c8c5d0]">Current Skill Challenge:</span>
            <span className="font-bold text-[#89ceff] bg-[#0091cf]/20 px-2.5 py-0.5 rounded-md border border-[#0091cf]/30">
              {currentSkillInfo.label}
            </span>
          </div>
        )}
      </div>

      <StoryReferenceModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        missionTitle={missionTitle}
        passageText={passageText || ""}
      />
    </>
  );
};

