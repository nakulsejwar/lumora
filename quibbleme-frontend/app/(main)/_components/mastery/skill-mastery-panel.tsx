"use client";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/hooks/use-game";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { getSkillMastery } from "@/actions/get-skill-mastery";
import { generateNextLesson } from "@/actions/generate-next-lesson";
import {
  LOCKED_SKILL_TAGS,
  SKILL_INFO,
  SkillMasteryRow,
  pickFocusSkill,
  SkillTag,
} from "@/lib/skill-info";
import { Sparkles, Target, ArrowDown, TrendingUp, TrendingDown, Minus, CheckCircle2, Award, Brain, ArrowRight } from "lucide-react";

const SkillBar = ({
  row,
  isFocus,
}: {
  row: SkillMasteryRow | undefined;
  isFocus: boolean;
}) => {
  const tag = row?.skill_tag;
  const label = tag ? SKILL_INFO[tag].label : "";
  const notAssessed = !row || row.attempts === 0;

  return (
    <div
      className={`flex items-center gap-3 py-2.5 px-3 rounded-2xl transition-all ${
        isFocus ? "bg-[#eaedff] border-2 border-[#fe932c] shadow-sm" : "hover:bg-[#f2f3ff]"
      }`}
    >
      <span className="w-32 sm:w-40 shrink-0 text-sm font-bold text-[#070235] flex items-center gap-2">
        {isFocus && <Target className="w-4 h-4 text-[#fe932c] shrink-0 animate-pulse" />}
        {label}
      </span>

      <div className="flex-1 h-3.5 rounded-full bg-white border border-[#c8c5d0]/50 overflow-hidden relative shadow-inner">
        {!notAssessed && (
          <motion.div
            className={`h-full rounded-full ${
              isFocus
                ? "bg-gradient-to-r from-[#070235] via-[#0091cf] to-[#89ceff] shadow-md"
                : "bg-[#5b598c]"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${row!.accuracy}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </div>

      <span className="w-20 sm:w-24 shrink-0 text-right text-xs sm:text-sm font-mono font-extrabold text-[#070235]">
        {notAssessed ? (
          <span className="text-[#787680] font-normal italic text-xs">Unassessed</span>
        ) : (
          `${row!.accuracy}%`
        )}
      </span>

      {isFocus && !notAssessed && (
        <span className="hidden sm:inline-flex text-[10px] font-mono font-extrabold text-[#070235] bg-[#fe932c] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
          FOCUS
        </span>
      )}
    </div>
  );
};

const SkillMasteryPanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { game } = useGameStore();
  const { authUser } = useAuthUserStore();
  const userId = authUser?.user_id;

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationFailed, setGenerationFailed] = React.useState(false);

  const { data: mastery, isLoading } = useQuery({
    queryKey: ["skillMastery", userId],
    queryFn: () => getSkillMastery(userId!),
    enabled: !!userId,
  });

  const beforeSkill = searchParams.get("beforeSkill");
  const beforeAccuracyParam = searchParams.get("beforeAccuracy");
  const showBeforeAfter =
    !!game.target_skill &&
    beforeSkill === game.target_skill &&
    beforeAccuracyParam !== null;

  const handleBuildNextLesson = async () => {
    if (isGenerating || !userId) return;
    setIsGenerating(true);
    setGenerationFailed(false);

    const focusSkill = mastery ? pickFocusSkill(mastery) : null;
    const beforeRow = mastery?.find((r) => r.skill_tag === focusSkill);

    const result = await generateNextLesson({
      userId,
      level_id: game.LevelId || "",
      grade: game.grade_band || "3",
      difficulty: game.difficulty || "explicit",
    });

    if (!result.success) {
      setGenerationFailed(true);
      setIsGenerating(false);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["skillMastery", userId] });

    const params = new URLSearchParams();
    if (beforeRow) {
      params.set("beforeSkill", result.game.target_skill);
      params.set("beforeAccuracy", String(beforeRow.accuracy));
    }
    setIsGenerating(false);
    router.push(`/${result.game.gameid}${params.toString() ? `?${params}` : ""}`);
  };

  if (showBeforeAfter) {
    return <BeforeAfterResult beforeAccuracy={Number(beforeAccuracyParam)} />;
  }

  if (isLoading || !mastery) {
    return null;
  }

  const focusSkill = pickFocusSkill(mastery);
  const rowsByTag = Object.fromEntries(mastery.map((r) => [r.skill_tag, r]));

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 rounded-3xl border border-[#c8c5d0]/70 bg-[#faf8ff] shadow-xl p-6 sm:p-8 text-[#131b2e]">
      {/* Header Ribbon */}
      <div className="flex items-center justify-between mb-6 border-b border-[#c8c5d0]/50 pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold text-[#0091cf] block">
            ADAPTIVE INTELLIGENCE REPORT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#070235] tracking-tight">
            YOUR READING PROFILE
          </h2>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#0091cf]/10 border border-[#0091cf]/30 flex items-center justify-center text-[#0091cf] shadow-sm">
          <Brain className="w-5 h-5 text-[#0091cf]" />
        </div>
      </div>

      {/* Six Canonical Skill Bars */}
      <div className="space-y-1.5 mb-6">
        {LOCKED_SKILL_TAGS.map((tag) => (
          <SkillBar
            key={tag}
            row={rowsByTag[tag]}
            isFocus={tag === focusSkill}
          />
        ))}
      </div>

      {/* Focus Skill Card */}
      {focusSkill && (
        <div className="mb-6 rounded-2xl bg-[#070235] text-white p-5 border border-[#0091cf]/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-[#fe932c] text-[#070235] uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              PRIMARY FOCUS SKILL
            </span>
          </div>
          <p className="text-xl font-extrabold text-white">
            🎯 {SKILL_INFO[focusSkill].label}
          </p>
          <p className="text-xs sm:text-sm text-[#eaedff]/90 mt-1 leading-relaxed">
            Lumora AI detected that <strong className="text-[#89ceff]">{SKILL_INFO[focusSkill].label.toLowerCase()}</strong> is currently your biggest growth opportunity.
          </p>
        </div>
      )}

      {/* Action CTA / Generating Transition State */}
      <div className="flex flex-col items-center mt-6">
        {isGenerating ? (
          <div className="w-full text-center p-8 rounded-3xl bg-[#070235] text-white shadow-2xl space-y-4 border-2 border-[#0091cf] animate-pulse relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0091cf]/20 border border-[#89ceff] text-[#89ceff] shadow-md">
              <Target className="w-7 h-7 animate-spin" />
            </div>
            <p className="text-lg font-extrabold text-[#89ceff] tracking-tight">
              LUMORA IS CREATING A TARGETED CHALLENGE FOR YOU
            </p>
            {focusSkill && (
              <p className="text-xs sm:text-sm text-[#eaedff] max-w-md mx-auto italic leading-relaxed">
                &quot;Today&apos;s mission is designed to help you {SKILL_INFO[focusSkill].description}.&quot;
              </p>
            )}
            <div className="pt-4 text-xs font-mono text-[#89ceff] flex flex-wrap justify-center gap-4 border-t border-[#0091cf]/30">
              <span className="flex items-center gap-1">🔍 Analyzing profile</span>
              <span className="flex items-center gap-1">📖 Writing mystery</span>
              <span className="flex items-center gap-1">🧩 Building clues</span>
            </div>
          </div>
        ) : generationFailed ? (
          <div className="text-center space-y-3 bg-[#ffdad6] p-4 rounded-2xl border border-[#ba1a1a]/30">
            <p className="text-sm font-bold text-[#93000a]">
              Unable to generate next adaptive lesson.
            </p>
            <p className="text-xs text-[#47464f]">Your mastery data is saved safely.</p>
            <Button
              variant="theme"
              onClick={handleBuildNextLesson}
              className="bg-[#070235] text-white px-6 py-2 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <Button
            variant="theme"
            size="lg"
            disabled={!userId}
            onClick={handleBuildNextLesson}
            className="w-full sm:w-auto px-10 py-6 text-base font-extrabold shadow-xl bg-[#070235] hover:bg-[#1e1b4b] text-white rounded-xl border border-[#89ceff]/30 transform hover:scale-[1.02] transition-all flex items-center gap-3"
          >
            <span>Build Targeted Adaptive Lesson</span>
            <ArrowRight className="w-5 h-5 text-[#fe932c]" />
          </Button>
        )}
      </div>
    </div>
  );
};

const BeforeAfterResult = ({ beforeAccuracy }: { beforeAccuracy: number }) => {
  const { game } = useGameStore();
  const { authUser } = useAuthUserStore();
  const userId = authUser?.user_id;
  const targetSkill = game.target_skill as SkillTag | undefined;

  const { data: mastery, isLoading } = useQuery({
    queryKey: ["skillMastery", userId],
    queryFn: () => getSkillMastery(userId!),
    enabled: !!userId,
  });

  if (isLoading || !mastery || !targetSkill) return null;

  const afterRow = mastery.find((r) => r.skill_tag === targetSkill);
  const afterAccuracy = afterRow?.accuracy ?? beforeAccuracy;
  const delta = afterAccuracy - beforeAccuracy;
  const improved = delta > 0;
  const declined = delta < 0;

  const skillInfo = SKILL_INFO[targetSkill];
  const rowsByTag = Object.fromEntries(mastery.map((r) => [r.skill_tag, r]));

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 rounded-3xl border border-[#c8c5d0]/70 bg-[#faf8ff] shadow-2xl p-6 sm:p-8 text-center text-[#131b2e]">
      {/* Achievement Banner */}
      <div className="mb-6">
        {improved ? (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#059669]/10 border border-[#059669]/30 text-[#059669] text-sm font-extrabold shadow-sm">
            <TrendingUp className="w-5 h-5 text-[#059669]" />
            <span>🧠 {skillInfo.label.toUpperCase()} MASTERY IMPROVED</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#eaedff] border border-[#c8c5d0] text-[#070235] text-sm font-extrabold shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-[#0091cf]" />
            <span>🎯 TARGETED PRACTICE COMPLETED</span>
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#070235] tracking-tight mt-3">
          {improved
            ? `You got stronger at ${skillInfo.label}!`
            : `Practicing ${skillInfo.label}`}
        </h2>
      </div>

      {/* Dramatic BEFORE → AFTER Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#c8c5d0]/70 shadow-sm mb-6 space-y-5">
        {/* BEFORE STATE */}
        <div className="text-left bg-[#faf8ff] p-4 rounded-xl border border-[#c8c5d0]/50 shadow-xs">
          <div className="flex justify-between items-center text-xs font-mono font-extrabold text-[#787680] uppercase tracking-wider mb-2">
            <span>BEFORE TARGETED LESSON</span>
            <span className="text-sm font-bold text-[#070235]">{beforeAccuracy}%</span>
          </div>
          <div className="h-4 rounded-full bg-[#eaedff] overflow-hidden border border-[#c8c5d0]/40">
            <div
              className="h-full rounded-full bg-[#5b598c]"
              style={{ width: `${beforeAccuracy}%` }}
            />
          </div>
        </div>

        {/* TARGETED PRACTICE INTERSTITIAL */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold text-[#0091cf] uppercase tracking-widest py-1">
          <ArrowDown className="w-4 h-4 animate-bounce text-[#fe932c]" />
          <span>Targeted Practice Mission Completed</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#fe932c]" />
        </div>

        {/* AFTER STATE */}
        <div className="text-left bg-[#eaedff] p-4 rounded-xl border-2 border-[#0091cf] shadow-md">
          <div className="flex justify-between items-center text-xs font-mono font-extrabold text-[#070235] uppercase tracking-wider mb-2">
            <span>AFTER TARGETED LESSON</span>
            <span className="text-base font-extrabold text-[#0091cf]">{afterAccuracy}%</span>
          </div>
          <div className="h-4.5 rounded-full bg-white overflow-hidden border border-[#0091cf]/40 shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#070235] via-[#0091cf] to-[#059669]"
              initial={{ width: `${beforeAccuracy}%` }}
              animate={{ width: `${afterAccuracy}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* DELTA DISPLAY */}
        <div className="pt-2">
          {improved ? (
            <div className="inline-flex items-center gap-2 text-base font-extrabold text-[#059669] bg-[#059669]/10 px-5 py-2 rounded-full border border-[#059669]/30">
              <TrendingUp className="w-5 h-5" />
              <span>+{delta} percentage points</span>
            </div>
          ) : declined ? (
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#904d00] bg-[#fe932c]/15 px-5 py-2 rounded-full border border-[#fe932c]/30">
              <TrendingDown className="w-4 h-4" />
              <span>{delta} percentage points</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#47464f] bg-[#eaedff] px-5 py-2 rounded-full border border-[#c8c5d0]">
              <Minus className="w-4 h-4" />
              <span>0 percentage points</span>
            </div>
          )}
        </div>
      </div>

      {/* WHAT CHANGED? Section */}
      <div className="text-left bg-[#eaedff] p-5 rounded-2xl border border-[#0091cf]/30 mb-6">
        <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#070235] mb-1.5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#fe932c]" />
          WHAT CHANGED?
        </h3>
        <p className="text-sm text-[#131b2e] leading-relaxed font-medium">
          {improved
            ? `Your evidence-backed accuracy increased as you practiced ${skillInfo.description.toLowerCase()}.`
            : `You're continuing to build your ${skillInfo.label.toLowerCase()} skill set. Continue practicing to strengthen textual evidence extraction.`}
        </p>
      </div>

      {/* FULL SKILL PROFILE OVERVIEW */}
      <div className="text-left pt-4 border-t border-[#c8c5d0]/50">
        <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#787680] mb-3">
          Updated Master Skill Profile
        </h4>
        <div className="space-y-1.5">
          {LOCKED_SKILL_TAGS.map((tag) => (
            <SkillBar
              key={tag}
              row={rowsByTag[tag]}
              isFocus={tag === targetSkill}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillMasteryPanel;

