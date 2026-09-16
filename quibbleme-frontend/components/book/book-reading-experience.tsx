"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Volume2, VolumeX, Mic, BookOpen, Pause, Play, CheckCircle2, Clock, Sparkles, AlertCircle, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractivePassageText } from "@/components/game/interactive-passage-text";
import { tokenizePassage } from "@/lib/passage-tokenizer";
import { matchTranscriptToTokens, MatcherResult } from "@/lib/reading-word-matcher";
import { useReadingCheck } from "@/lib/hooks/use-reading-check";
import { useTextToSpeech } from "@/lib/hooks/use-text-to-speech";
import { ReadingCheckHeader } from "@/components/game/reading-check-header";
import { ReadingCheckResult } from "@/components/game/reading-check-result";

export type ReadingMode = "listen" | "reading-check" | "read-myself";

interface BookReadingExperienceProps {
  passageContent: string;
  hasQuiz?: boolean;
  onScrollToQuiz?: () => void;
}

export function extractPlainText(htmlOrText?: string | null): string {
  if (!htmlOrText) return "";
  return htmlOrText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export const BookReadingExperience: React.FC<BookReadingExperienceProps> = ({
  passageContent,
  hasQuiz = false,
  onScrollToQuiz,
}) => {
  const plainText = useMemo(() => extractPlainText(passageContent), [passageContent]);

  const passageTokens = useMemo(() => {
    return tokenizePassage(plainText).tokens;
  }, [plainText]);

  const [activeMode, setActiveMode] = useState<ReadingMode>("read-myself");
  const [readingCheckActive, setReadingCheckActive] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  // Timer state
  const [readingTimerActive, setReadingTimerActive] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Hooks
  const speechCheck = useReadingCheck();
  const tts = useTextToSpeech();

  // Matcher state
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

  // Timer Effect
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

  // Update Word Matcher on transcript updates
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

  // Switch Mode logic with safe cleanup
  const handleSelectMode = (newMode: ReadingMode) => {
    // 1. Stop all active audio & speech recognition
    tts.stop();
    speechCheck.stopListening();
    setReadingCheckActive(false);
    setReadingTimerActive(false);
    setElapsedSeconds(0);

    setActiveMode(newMode);

    if (newMode === "listen") {
      tts.speak(plainText);
    } else if (newMode === "reading-check") {
      if (speechCheck.isSupported) {
        setReadingCheckActive(true);
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
      }
    } else if (newMode === "read-myself") {
      setReadingTimerActive(true);
    }
  };

  const handleFinishReadingCheck = () => {
    speechCheck.stopListening();
    setReadingCheckActive(false);

    const finalRes = matchTranscriptToTokens(
      passageTokens,
      speechCheck.transcript,
      elapsedSeconds,
      matchResult
    );
    setMatchResult(finalRes);
    setShowResultModal(true);
  };

  const handleFinishReadingGeneral = () => {
    if (activeMode === "listen") {
      tts.stop();
    } else if (activeMode === "read-myself") {
      setReadingTimerActive(false);
    }

    if (hasQuiz && onScrollToQuiz) {
      onScrollToQuiz();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* READING MODES SELECTOR HEADER */}
      <div className="bg-[#faf8ff] p-5 sm:p-6 rounded-3xl border border-[#c8c5d0]/60 shadow-xs">
        <div className="mb-4">
          <span className="text-[11px] font-mono font-extrabold text-[#0091cf] uppercase tracking-widest block mb-0.5">
            LUMORA READING MODES
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#070235]">
            Choose How You Want to Experience This Book
          </h3>
          <p className="text-xs text-[#47464f] mt-1">
            Select a mode below to listen, read aloud with voice tracking, or read at your own pace.
          </p>
        </div>

        {/* THREE READING MODE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* MODE 1: LISTEN */}
          <button
            type="button"
            onClick={() => handleSelectMode("listen")}
            className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
              activeMode === "listen"
                ? "bg-white border-[#fe932c] shadow-md ring-2 ring-[#fe932c]/30"
                : "bg-white/80 border-[#c8c5d0]/50 hover:border-[#0091cf]/60 hover:bg-white"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#fe932c]/15 text-[#904d00] flex items-center justify-center font-bold">
                  <Volume2 className="w-5 h-5 text-[#fe932c]" />
                </div>
                {activeMode === "listen" && (
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#fe932c] text-[#070235]">
                    ACTIVE
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-[#070235] text-base">🔊 Listen</h4>
              <p className="text-xs text-[#47464f] mt-1 leading-relaxed">
                Hear Lumora read the story aloud using Text-To-Speech. Great for following along.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between">
              <span className="text-xs font-bold text-[#904d00]">Audio Narration</span>
              <span className="text-xs font-extrabold text-[#070235] underline">
                {activeMode === "listen" ? "Listening" : "Select"} →
              </span>
            </div>
          </button>

          {/* MODE 2: READING CHECK */}
          <button
            type="button"
            onClick={() => handleSelectMode("reading-check")}
            className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
              activeMode === "reading-check"
                ? "bg-white border-[#070235] shadow-md ring-2 ring-[#070235]/20"
                : "bg-white/80 border-[#c8c5d0]/50 hover:border-[#070235]/60 hover:bg-white"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#070235] text-[#fe932c] flex items-center justify-center font-bold">
                  <Mic className="w-5 h-5" />
                </div>
                {activeMode === "reading-check" && (
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#070235] text-[#fe932c]">
                    ACTIVE
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-[#070235] text-base">🎙 Reading Check</h4>
              <p className="text-xs text-[#47464f] mt-1 leading-relaxed">
                Read aloud while Lumora listens, tracks spoken words, and measures your reading rhythm.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between">
              <span className="text-xs font-bold text-[#070235]">Voice Tracked</span>
              <span className="text-xs font-extrabold text-[#070235] underline">
                {activeMode === "reading-check" ? "Tracking" : "Select"} →
              </span>
            </div>
          </button>

          {/* MODE 3: READ MYSELF */}
          <button
            type="button"
            onClick={() => handleSelectMode("read-myself")}
            className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
              activeMode === "read-myself"
                ? "bg-white border-[#0091cf] shadow-md ring-2 ring-[#0091cf]/30"
                : "bg-white/80 border-[#c8c5d0]/50 hover:border-[#0091cf]/60 hover:bg-white"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#0091cf]/15 text-[#0091cf] flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                {activeMode === "read-myself" && (
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0091cf] text-white">
                    ACTIVE
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-[#070235] text-base">📖 Read Myself</h4>
              <p className="text-xs text-[#47464f] mt-1 leading-relaxed">
                Read silently or independently at your own pace without microphone audio.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaedff] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0091cf]">Self-Paced</span>
              <span className="text-xs font-extrabold text-[#070235] underline">
                {activeMode === "read-myself" ? "Reading" : "Select"} →
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ACTIVE MODE CONTROL BANNERS */}
      {/* 1. LISTEN CONTROLS */}
      {activeMode === "listen" && (
        <div className="bg-white p-4 rounded-2xl border border-[#fe932c]/50 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fe932c]/15 text-[#fe932c] flex items-center justify-center font-bold">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-extrabold uppercase text-[#070235] block">
                AUDIO NARRATION MODE
              </span>
              <p className="text-xs text-[#47464f]">
                {tts.isSpeaking
                  ? tts.isPaused
                    ? "Audio narration paused."
                    : "Lumora is reading the story aloud..."
                  : "Audio narration ready."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!tts.isSpeaking ? (
              <Button
                type="button"
                size="sm"
                onClick={() => tts.speak(plainText)}
                className="bg-[#fe932c] hover:bg-[#e07f20] text-[#070235] font-extrabold text-xs rounded-xl"
              >
                <Play className="w-3.5 h-3.5 mr-1" /> Play Audio
              </Button>
            ) : (
              <>
                {tts.isPaused ? (
                  <Button type="button" size="sm" variant="outline" onClick={tts.resume} className="text-xs rounded-xl">
                    <Play className="w-3.5 h-3.5 mr-1" /> Resume
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" onClick={tts.pause} className="text-xs rounded-xl">
                    <Pause className="w-3.5 h-3.5 mr-1" /> Pause
                  </Button>
                )}
                <Button type="button" size="sm" variant="destructive" onClick={tts.stop} className="text-xs rounded-xl">
                  <VolumeX className="w-3.5 h-3.5 mr-1" /> Stop Audio
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. READING CHECK CONTROLS */}
      {activeMode === "reading-check" && (
        <div>
          {!speechCheck.isSupported ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
              <span>Reading Check isn&apos;t supported in this browser. Switching to Read Myself.</span>
              <Button size="sm" onClick={() => handleSelectMode("read-myself")} className="bg-amber-800 text-white text-xs">
                Switch to Read Myself
              </Button>
            </div>
          ) : speechCheck.permissionDenied ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Microphone access is needed for Reading Check.</span>
              </div>
              <Button size="sm" variant="outline" onClick={speechCheck.startListening} className="text-xs border-red-300">
                Try Again
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* 3. READ MYSELF CONTROLS */}
      {activeMode === "read-myself" && (
        <div className="bg-white p-4 rounded-2xl border border-[#0091cf]/40 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0091cf]/15 text-[#0091cf] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-extrabold uppercase text-[#070235] block">
                SELF-PACED READING TIMER
              </span>
              <p className="text-xs text-[#47464f]">
                Reading time: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
              </p>
            </div>
          </div>

          {hasQuiz && (
            <Button
              type="button"
              size="sm"
              onClick={handleFinishReadingGeneral}
              className="bg-[#070235] text-white text-xs font-bold rounded-xl"
            >
              Finish Reading →
            </Button>
          )}
        </div>
      )}

      {/* PASSAGE TEXT DISPLAY */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#c8c5d0]/50 shadow-sm leading-relaxed text-lg sm:text-xl font-serif text-[#131b2e]">
        <InteractivePassageText
          passageText={plainText}
          readingCheckActive={activeMode === "reading-check" && readingCheckActive}
          activeTokenIndex={matchResult.currentIndex}
          readTokenIndices={matchResult.readIndices}
        />
      </div>

      {/* FINISH READING TO QUIZ BUTTON */}
      {hasQuiz && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="theme"
            size="lg"
            onClick={handleFinishReadingGeneral}
            className="px-8 py-6 text-sm font-extrabold tracking-wider uppercase rounded-2xl shadow-md flex items-center gap-2"
          >
            <span>Proceed to Story Quiz</span>
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* RESULT MODAL FOR READING CHECK */}
      {showResultModal && (
        <ReadingCheckResult
          wpm={matchResult.wpm}
          wordAccuracy={matchResult.wordAccuracy}
          matchedCount={matchResult.matchedCount}
          expectedCount={matchResult.expectedCount}
          elapsedSeconds={elapsedSeconds}
          buttonText={hasQuiz ? "Proceed to Story Quiz" : "Complete Book Reading"}
          onContinue={() => {
            setShowResultModal(false);
            if (hasQuiz && onScrollToQuiz) {
              onScrollToQuiz();
            }
          }}
        />
      )}
    </div>
  );
};
