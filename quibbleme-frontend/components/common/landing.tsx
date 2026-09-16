"use client";
import React from "react";
import Link from "next/link";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { Sparkles, Search, ShieldCheck, Target, ArrowRight, BookOpen, Brain, TrendingUp, Compass, CheckCircle2, Zap, Award, Timer } from "lucide-react";
import { LOCKED_SKILL_TAGS, SKILL_INFO, SkillTag } from "@/lib/skill-info";

export default function Landing() {
  const { authUser } = useAuthUserStore();

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col justify-between font-sans antialiased w-full selection:bg-[#fe932c]/30">
      {/* Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#c8c5d0]/50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#070235] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-[#89ceff]/30">
            <Search className="w-5 h-5 text-[#fe932c]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-[#070235] leading-none">
              Lumora<span className="text-[#fe932c]">.</span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#0091cf]">
              AI Reading Coach
            </span>
          </div>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#070235] hover:text-[#0091cf] uppercase tracking-wider transition"
          >
            <span>Reading Missions</span>
            <BookOpen className="w-4 h-4 text-[#fe932c]" />
          </Link>
          {!authUser || Object.keys(authUser).length === 0 ? (
            <Link href="/login">
              <button className="px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#070235] hover:bg-[#1e1b4b] active:scale-95 rounded-xl shadow-md transition-all border border-[#89ceff]/30">
                Sign In
              </button>
            </Link>
          ) : (
            <Link href="/courses">
              <button className="px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#070235] hover:bg-[#1e1b4b] active:scale-95 rounded-xl shadow-md transition-all border border-[#89ceff]/30">
                Start Mission
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero & Content */}
      <main className="w-full max-w-5xl mx-auto px-6 py-10 sm:py-14 flex flex-col items-center text-center flex-grow justify-center">
        {/* Hackathon Alignment Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#070235] text-[#89ceff] text-xs font-mono font-extrabold uppercase tracking-widest shadow-md mb-6 border border-[#0091cf]/40">
          <Sparkles className="w-4 h-4 text-[#fe932c]" />
          <span>ENGLISH READING GAME • GRADES 3–7</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#070235] max-w-4xl leading-[1.12]">
          READ SMARTER. THINK DEEPER. <br />
          <span className="bg-gradient-to-r from-[#070235] via-[#0091cf] to-[#fe932c] bg-clip-text text-transparent">
            SOLVE THE STORY.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-xl text-[#47464f] max-w-2xl leading-relaxed font-medium">
          Lumora is an AI-adaptive English reading game where learners solve story-based mysteries while Lumora evaluates reading comprehension, coaches reasoning, detects weaknesses, and generates targeted practice to prove improvement.
        </p>

        {/* Primary CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/courses">
            <button className="px-8 py-4 text-base font-extrabold text-white bg-[#070235] hover:bg-[#1e1b4b] rounded-xl shadow-xl transition-all border border-[#89ceff]/30 flex items-center gap-3">
              <Compass className="w-5 h-5 text-[#fe932c]" />
              <span>START YOUR READING MISSION</span>
              <ArrowRight className="w-5 h-5 text-[#fe932c]" />
            </button>
          </Link>
        </div>

        {/* Three Core Literacy Pillars */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white p-6 rounded-2xl border border-[#c8c5d0]/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#0091cf]/15 text-[#0091cf] flex items-center justify-center font-bold mb-3">
              <Timer className="w-5 h-5 text-[#0091cf]" />
            </div>
            <h3 className="text-base font-extrabold text-[#070235] mb-1">
              1. Read Fluently
            </h3>
            <p className="text-xs text-[#47464f] leading-relaxed">
              Build confident reading habits, punctuation rhythm, and smooth reading pace across Grade 3–7 mystery stories.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c8c5d0]/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#fe932c]/15 text-[#fe932c] flex items-center justify-center font-bold mb-3">
              <BookOpen className="w-5 h-5 text-[#fe932c]" />
            </div>
            <h3 className="text-base font-extrabold text-[#070235] mb-1">
              2. Understand Deeply
            </h3>
            <p className="text-xs text-[#47464f] leading-relaxed">
              Master the six core comprehension skills (Main Idea, Vocabulary, Inference, Cause & Effect, Sequence, Evidence).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c8c5d0]/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#059669]/15 text-[#059669] flex items-center justify-center font-bold mb-3">
              <TrendingUp className="w-5 h-5 text-[#059669]" />
            </div>
            <h3 className="text-base font-extrabold text-[#070235] mb-1">
              3. Adapt & Improve
            </h3>
            <p className="text-xs text-[#47464f] leading-relaxed">
              Lumora AI detects your weakest skill, generates a targeted reading lesson, and proves measurable accuracy growth.
            </p>
          </div>
        </div>

        {/* Visual Proof of Adaptation Card */}
        <div className="mt-12 w-full bg-white p-6 rounded-3xl border border-[#c8c5d0]/70 shadow-lg text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-extrabold uppercase text-[#0091cf]">
              AI ADAPTATION PIPELINE IN ACTION
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs font-bold">
            <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#c8c5d0]/50 text-[#070235]">
              🔍 1. WEAKNESS DETECTED
              <span className="block font-sans text-[11px] text-[#47464f] font-normal mt-1">Inference accuracy: 33%</span>
            </div>
            <div className="p-3 bg-[#eaedff] rounded-xl border border-[#0091cf]/30 text-[#0091cf]">
              ⚙️ 2. LUMORA ADAPTS
              <span className="block font-sans text-[11px] text-[#070235] font-normal mt-1">Generates custom mission</span>
            </div>
            <div className="p-3 bg-[#fe932c]/10 rounded-xl border border-[#fe932c]/30 text-[#904d00]">
              🧩 3. TARGETED PRACTICE
              <span className="block font-sans text-[11px] text-[#131b2e] font-normal mt-1">Inference evidence tiles</span>
            </div>
            <div className="p-3 bg-[#059669]/10 rounded-xl border border-[#059669]/30 text-[#059669]">
              📈 4. PROVEN IMPROVEMENT
              <span className="block font-sans text-[11px] text-[#059669] font-bold mt-1">Inference: 67% (+34%)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#c8c5d0]/50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#787680] gap-4">
        <p>© 2026 Lumora AI Reading Coach. Built for the Nerdy AI Hackathon.</p>
        <div className="flex items-center gap-6 font-mono text-[11px] uppercase font-bold">
          <Link href="/courses" className="hover:text-[#070235] transition">
            Reading Missions
          </Link>
          <Link href="/privacy-policy" className="hover:text-[#070235] transition">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

