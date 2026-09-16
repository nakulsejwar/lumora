"use client";

import React from "react";
import { Mic, MicOff, CheckCircle2, Gauge, Clock, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReadingCheckHeaderProps {
  isListening: boolean;
  matchedCount: number;
  expectedCount: number;
  wordAccuracy: number;
  wpm: number;
  elapsedSeconds: number;
  onFinishReading: () => void;
  onStopListening?: () => void;
}

export const ReadingCheckHeader: React.FC<ReadingCheckHeaderProps> = ({
  isListening,
  matchedCount,
  expectedCount,
  wordAccuracy,
  wpm,
  elapsedSeconds,
  onFinishReading,
  onStopListening,
}) => {
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

  return (
    <div className="w-full bg-[#070235] text-white p-4 sm:p-5 rounded-2xl border border-[#0091cf]/40 shadow-lg mb-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status & Mic Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold transition-all ${
              isListening
                ? "bg-[#fe932c] text-[#070235] shadow-md shadow-[#fe932c]/30 animate-pulse"
                : "bg-white/10 text-white"
            }`}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-gray-300" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#89ceff]">
                READING CHECK
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  isListening
                    ? "bg-[#fe932c]/20 text-[#fe932c] border border-[#fe932c]/40"
                    : "bg-gray-700/50 text-gray-300"
                }`}
              >
                {isListening ? "Listening..." : "Paused"}
              </span>
            </div>
            <p className="text-xs text-[#eaedff]/90 mt-0.5 font-medium">
              {isListening ? "Read the passage aloud — Lumora is listening" : "Press Finish Reading when done"}
            </p>
          </div>
        </div>

        {/* Real-time Metrics Badges */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Word Count */}
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-mono text-[#89ceff] block">Words</span>
            <span className="text-sm font-extrabold font-mono">
              {matchedCount} <span className="text-xs font-normal text-gray-300">/ {expectedCount}</span>
            </span>
          </div>

          {/* Word Accuracy */}
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-mono text-[#89ceff] block flex items-center gap-1 justify-center">
              <CheckCircle2 className="w-3 h-3 text-[#fe932c]" /> Accuracy
            </span>
            <span className="text-sm font-extrabold text-[#fe932c] font-mono">{wordAccuracy}%</span>
          </div>

          {/* Elapsed Time / WPM */}
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-mono text-[#89ceff] block flex items-center gap-1 justify-center">
              <Gauge className="w-3 h-3 text-cyan-300" /> Pace
            </span>
            <span className="text-sm font-extrabold text-cyan-200 font-mono">
              {wpm > 0 ? `${wpm} WPM` : timeFormatted}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {isListening && onStopListening && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onStopListening}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 px-3.5"
              >
                <Square className="w-3.5 h-3.5 mr-1.5 text-[#fe932c]" /> Stop Listening
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              onClick={onFinishReading}
              className="bg-[#fe932c] hover:bg-[#e07f20] text-[#070235] font-extrabold text-xs rounded-xl px-4 shadow-sm"
            >
              Finish Reading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
