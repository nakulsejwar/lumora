"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, BookOpen, Timer, ShieldCheck, FileText, Volume2, VolumeX, Pause, Play, Mic, AlertCircle } from "lucide-react";

import { user as initialUser } from "@/app/api/user.api";
import { useUserContext } from "@/store/userContext";
import { Button } from "@/components/ui/button";
import { SkillTag, SKILL_INFO } from "@/lib/skill-info";
import { InteractivePassageText } from "@/components/game/interactive-passage-text";
import { tokenizePassage } from "@/lib/passage-tokenizer";
import { matchTranscriptToTokens, MatcherResult } from "@/lib/reading-word-matcher";
import { useReadingCheck } from "@/lib/hooks/use-reading-check";
import { useTextToSpeech } from "@/lib/hooks/use-text-to-speech";
import { ReadingCheckHeader } from "@/components/game/reading-check-header";
import { ReadingCheckResult } from "@/components/game/reading-check-result";

const GRADE_LABELS: Record<string | number, string> = {
  3: "Grade 3 Reading Mission",
  4: "Grade 4 Reading Mission",
  5: "Grade 5 Reading Mission",
  6: "Grade 6 Reading Mission",
  7: "Grade 7 Reading Mission",
};

interface PassageScreenProps {
  game: any;
  onStart: () => void;
}

export const PassageScreen: React.FC<PassageScreenProps> = ({
  game,
  onStart,
}) => {
  const router = useRouter();
  const [user, setUser] = useUserContext();

  // Passage Tokenization
  const passageTokens = useMemo(() => {
    return tokenizePassage(game?.passage_text).tokens;
  }, [game?.passage_text]);

  // Mode States
  const [readingCheckActive, setReadingCheckActive] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Timer States
  const [readingTimerActive, setReadingTimerActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalReadingPace, setFinalReadingPace] = useState<string | null>(null);

  // Hooks
  const speechCheck = useReadingCheck();
  const tts = useTextToSpeech();

  // Matching Result State
  const [matchResult, setMatchResult] = useState<MatcherResult>({
    currentIndex: 0,
    matchedIndices: new Set(),
    readIndices: new Set(),
    matchedCount: 0,
    expectedCount: passageTokens.length,
    wordAccuracy: 100,
    wpm: 0,
    isCompleted: false,
  });

  // Elapsed Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (readingTimerActive || readingCheckActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [readingTimerActive, readingCheckActive]);

  // Update Word Matcher on Speech Transcript changes
  useEffect(() => {
    if (readingCheckActive && speechCheck.transcript) {
      setMatchResult((prev) =>
        matchTranscriptToTokens(
          passageTokens,
          speechCheck.transcript,
          elapsedSeconds,
          prev
        )
      );
    }
  }, [speechCheck.transcript, readingCheckActive, passageTokens, elapsedSeconds]);

  // Handle Start Reading Check
  const handleStartReadingCheck = () => {
    if (tts.isSpeaking) {
      tts.stop();
    }

    if (!speechCheck.isSupported) {
      return;
    }

    setElapsedSeconds(0);
    setReadingCheckActive(true);
    setReadingTimerActive(false);
    speechCheck.resetTranscript();
    speechCheck.startListening();

    setMatchResult({
      currentIndex: 0,
      matchedIndices: new Set(),
      readIndices: new Set(),
      matchedCount: 0,
      expectedCount: passageTokens.length,
      wordAccuracy: 100,
      wpm: 0,
      isCompleted: false,
    });
  };

  // Handle Stop / Finish Reading Check
  const handleFinishReadingCheck = () => {
    speechCheck.stopListening();
    setReadingCheckActive(false);

    // Calculate final metrics snapshot
    const finalRes = matchTranscriptToTokens(
      passageTokens,
      speechCheck.transcript,
      elapsedSeconds,
      matchResult
    );

    setMatchResult(finalRes);
    setShowResultModal(true);
  };

  // Handle Standard Timer Start
  const handleStartReadingTimer = () => {
    if (tts.isSpeaking) tts.stop();
    if (readingCheckActive) handleFinishReadingCheck();

    setElapsedSeconds(0);
    setReadingTimerActive(true);
  };

  // Standard Start Mission Transition
  const handleStartMission = () => {
    if (tts.isSpeaking) tts.stop();
    if (speechCheck.isListening) speechCheck.stopListening();

    setReadingTimerActive(false);
    setReadingCheckActive(false);

    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    setFinalReadingPace(`${mins}m ${secs < 10 ? "0" : ""}${secs}s`);

    onStart();
  };

  const gradeLabel = game.grade_band
    ? GRADE_LABELS[game.grade_band] ?? `Grade ${game.grade_band} Reading Mission`
    : null;

  const isNarrativeMission = !!game.passage_text;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4 sm:p-8 bg-[#faf8ff] text-[#131b2e] rounded-3xl border border-[#c8c5d0]/60 shadow-xl relative overflow-hidden">
      {/* Dossier Header Ribbon */}
      <div className="flex items-center justify-between border-b border-[#c8c5d0]/50 pb-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-md bg-[#070235] text-[#fe932c] text-xs font-mono font-extrabold uppercase tracking-widest shadow-sm">
            READING MISSION #{game.GameId ? String(game.GameId) : "LUM-1"}
          </span>
          {gradeLabel && (
            <span className="text-xs font-bold uppercase tracking-wider text-[#070235] bg-[#eaedff] px-2.5 py-1 rounded-md">
              {gradeLabel}
            </span>
          )}
        </div>

        <button
          id="close"
          onClick={() => {
            if (tts.isSpeaking) tts.stop();
            if (speechCheck.isListening) speechCheck.stopListening();
            setUser(initialUser);
            router.push(`/courses`);
          }}
          className="w-9 h-9 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#070235] flex items-center justify-center transition-colors shadow-sm"
          title="Exit Reading Mission"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mission Title Section */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        {isNarrativeMission && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fe932c]/15 border border-[#fe932c]/40 text-[#904d00] text-xs font-extrabold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#fe932c]" />
            <span>ENGLISH READING GAME — GRADES 3–7</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#070235] leading-tight max-w-2xl mt-1">
          {game.Title || game.Name}
        </h1>
      </div>

      {/* Focus Skill Banner (Targeted Practice Indicator) */}
      {game.target_skill && SKILL_INFO[game.target_skill as SkillTag] && (
        <div className="max-w-3xl mx-auto mb-6 rounded-2xl bg-[#070235] text-white p-5 border border-[#0091cf]/40 shadow-lg flex items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0091cf]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-[#0091cf]/20 border border-[#89ceff]/40 text-[#89ceff] flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#89ceff]">
                TARGETED COMPREHENSION SKILL
              </span>
              <span className="text-xs bg-[#fe932c] text-[#070235] font-bold px-2 py-0.5 rounded-full uppercase">
                Lumora Adaptive
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Focus Skill: {SKILL_INFO[game.target_skill as SkillTag].label}
            </h3>
            <p className="text-xs sm:text-sm text-[#eaedff]/90 leading-relaxed mt-0.5">
              &quot;Today&apos;s mission focuses on helping you {SKILL_INFO[game.target_skill as SkillTag].description.toLowerCase()}.&quot;
            </p>
          </div>
        </div>
      )}

      {/* AUDIO TTS & READING CHECK CONTROL BAR */}
      <div className="max-w-3xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-[#c8c5d0]/60 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* TEXT-TO-SPEECH (Listen to Story) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#fe932c]/15 text-[#904d00] flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5 text-[#fe932c]" />
          </div>
          <div>
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#070235] block">
              LISTEN TO STORY (AUDIO)
            </span>
            <p className="text-xs text-[#47464f]">
              {tts.isSpeaking
                ? tts.isPaused
                  ? "Audio story narration paused."
                  : "Listening to story narration..."
                : "Hear the passage read aloud using Text-To-Speech."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!tts.isSpeaking ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => tts.speak(game.passage_text)}
              disabled={!game.passage_text}
              className="border-[#070235]/20 text-[#070235] font-bold text-xs rounded-xl hover:bg-[#eaedff]"
            >
              <Volume2 className="w-3.5 h-3.5 mr-1.5 text-[#fe932c]" /> Listen to Story
            </Button>
          ) : (
            <>
              {tts.isPaused ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={tts.resume}
                  className="text-xs rounded-xl"
                >
                  <Play className="w-3.5 h-3.5 mr-1" /> Resume
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={tts.pause}
                  className="text-xs rounded-xl"
                >
                  <Pause className="w-3.5 h-3.5 mr-1" /> Pause
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={tts.stop}
                className="text-xs rounded-xl"
              >
                <VolumeX className="w-3.5 h-3.5 mr-1" /> Stop Audio
              </Button>
            </>
          )}
        </div>
      </div>

      {/* READING CHECK OR PACE TIMER BANNER */}
      {!readingCheckActive ? (
        <div className="max-w-3xl mx-auto mb-6 bg-[#eaedff] p-4 rounded-2xl border border-[#0091cf]/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0091cf]/15 text-[#0091cf] flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#070235] block">
                READING CHECK — SPEECH-TRACKED FLUENCY
              </span>
              <p className="text-xs text-[#47464f]">
                {speechCheck.isSupported
                  ? "Read aloud and Lumora will track your spoken words and rhythm."
                  : "Reading Check isn't supported in this browser. You can still use Reading Rhythm."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {speechCheck.isSupported ? (
              <Button
                type="button"
                onClick={handleStartReadingCheck}
                className="bg-[#070235] hover:bg-[#1e1b4b] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Mic className="w-3.5 h-3.5 mr-1.5 text-[#fe932c]" /> Start Reading Check
              </Button>
            ) : null}

            {!readingTimerActive && !finalReadingPace && (
              <button
                type="button"
                onClick={handleStartReadingTimer}
                className="px-3.5 py-1.5 bg-white text-[#070235] text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-xs border border-[#c8c5d0]/60"
              >
                Start Pace Timer
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* PERMISSION ERROR ALERT */}
      {speechCheck.permissionDenied && (
        <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Microphone access is needed for Reading Check.</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={speechCheck.startListening}
            className="border-red-300 text-red-800 hover:bg-red-100 text-xs"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* LIVE READING CHECK HEADER CONTROL */}
      {readingCheckActive && (
        <div className="max-w-3xl mx-auto">
          <ReadingCheckHeader
            isListening={speechCheck.isListening}
            matchedCount={matchResult.matchedCount}
            expectedCount={matchResult.expectedCount}
            wordAccuracy={matchResult.wordAccuracy}
            wpm={matchResult.wpm}
            elapsedSeconds={elapsedSeconds}
            onFinishReading={handleFinishReadingCheck}
            onStopListening={speechCheck.stopListening}
          />
        </div>
      )}

      {/* Reading Passage Content */}
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#c8c5d0]/50 shadow-sm mb-8">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#070235] uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#fe932c]" />
            <span>Story Passage</span>
          </div>
          <span className="text-xs font-mono text-[#47464f] flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Tap underlined words for Word Clues
          </span>
        </div>
        <div className="text-lg sm:text-xl leading-relaxed text-[#131b2e] font-serif tracking-wide">
          <InteractivePassageText
            passageText={game.passage_text}
            readingCheckActive={readingCheckActive}
            activeTokenIndex={matchResult.currentIndex}
            readTokenIndices={matchResult.readIndices}
          />
        </div>
      </div>

      {/* Mission Action Button */}
      <div className="flex flex-col items-center justify-center gap-3">
        <Button
          variant="theme"
          size="lg"
          onClick={handleStartMission}
          className="px-8 py-6 text-base font-extrabold tracking-wide uppercase shadow-lg rounded-2xl"
        >
          START READING MISSION
        </Button>
        <p className="text-xs text-[#47464f] font-mono">
          Ready to answer comprehension questions based on this story
        </p>
      </div>

      {/* RESULT SUMMARY MODAL */}
      {showResultModal && (
        <ReadingCheckResult
          wpm={matchResult.wpm}
          wordAccuracy={matchResult.wordAccuracy}
          matchedCount={matchResult.matchedCount}
          expectedCount={matchResult.expectedCount}
          elapsedSeconds={elapsedSeconds}
          onContinue={() => {
            setShowResultModal(false);
            onStart();
          }}
        />
      )}
    </div>
  );
};

export default PassageScreen;
