"use client";
import React, { useEffect, useState } from "react";
import { Sparkles, Brain, BookOpen, Gamepad2, CheckCircle2, Loader2 } from "lucide-react";

type Props = {
  title?: string;
  topic?: string;
};

const STEPS = [
  { icon: Brain, label: "Analyzing course topic & learning goals..." },
  { icon: BookOpen, label: "Building story passages & adaptive modules..." },
  { icon: Gamepad2, label: "Crafting interactive game scenarios & quizzes..." },
  { icon: Sparkles, label: "Finalizing AI course structure & metadata..." },
];

const LOADING_FACTS = [
  "Lumora adaptive courses adjust reading difficulty based on student comprehension.",
  "Interactive story games increase reading engagement by over 40%.",
  "AI reasoning prompts encourage deeper critical thinking and passage mastery.",
  "Preparing interactive reading challenges and vocabulary boosters...",
];

const LoadingQuestions = ({ title, topic }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Progress increment timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        const diff = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + diff, 92);
      });
    }, 600);

    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);

    // Tip cycling
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % LOADING_FACTS.length);
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearInterval(factInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 flex flex-col items-center text-center animate-in fade-in duration-300">
      {/* Animated Glowing Centerpiece */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer glowing pulsing rings */}
        <div className="absolute w-28 h-28 rounded-full bg-[#fe932c]/20 animate-ping duration-1000" />
        <div className="absolute w-24 h-24 rounded-full bg-[#0091cf]/30 animate-pulse" />
        <div className="absolute w-20 h-20 rounded-full bg-[#070235]/60 blur-md" />

        {/* Central Logo Box */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#070235] border-2 border-[#fe932c]/60 shadow-xl flex items-center justify-center text-white">
          <Sparkles className="w-8 h-8 text-[#fe932c] animate-bounce" />
        </div>
      </div>

      {/* Main Title & Description */}
      <h3 className="text-xl font-extrabold text-[#070235] tracking-tight mb-1">
        {title || "Generating AI Course Structure"}
      </h3>
      {topic ? (
        <p className="text-xs font-mono font-bold text-[#904d00] bg-[#fe932c]/15 px-3.5 py-1 rounded-full uppercase tracking-wider mb-6 border border-[#fe932c]/30">
          Topic: {topic}
        </p>
      ) : (
        <p className="text-xs text-[#47464f] font-medium mb-6 max-w-md">
          We are assembling a personalized story-driven curriculum. This will take just a few seconds.
        </p>
      )}

      {/* Progress Bar Container */}
      <div className="w-full bg-[#e0dede] h-3 rounded-full overflow-hidden shadow-inner mb-2 p-0.5 border border-[#c8c5d0]/50">
        <div
          className="h-full bg-gradient-to-r from-[#070235] via-[#0091cf] to-[#fe932c] rounded-full transition-all duration-500 ease-out shadow-xs"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="w-full flex justify-between text-[11px] font-mono font-extrabold text-[#47464f] mb-6">
        <span>GENERATING CONTENT</span>
        <span className="text-[#904d00]">{progress}%</span>
      </div>

      {/* Steps List */}
      <div className="w-full bg-[#faf8ff] p-4.5 rounded-2xl border border-[#c8c5d0]/60 space-y-3 mb-6 text-left shadow-xs">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isCurrent
                  ? "text-[#070235] font-bold"
                  : isDone
                  ? "text-[#059669] opacity-90 font-medium"
                  : "text-[#80757a] opacity-50 font-normal"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? "bg-[#070235] text-[#fe932c] shadow-xs"
                    : isDone
                    ? "bg-[#059669]/15 text-[#059669]"
                    : "bg-[#e0dede] text-[#80757a]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#fe932c]" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs sm:text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Did You Know / Tip Footer */}
      <div className="w-full p-3 rounded-xl bg-[#070235]/5 border border-[#070235]/10 flex items-center gap-2.5 text-xs text-[#070235]">
        <Sparkles className="w-4 h-4 text-[#fe932c] shrink-0" />
        <p className="italic text-left text-[11px] font-medium text-[#47464f] transition-opacity duration-300">
          &quot;{LOADING_FACTS[factIndex]}&quot;
        </p>
      </div>
    </div>
  );
};

export default LoadingQuestions;
