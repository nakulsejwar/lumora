"use client";

import DateComponent from "@/components/date-component";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import QuizComponent from "./quiz-component";
import AdBanner from "@/components/google-ads-banner";
import { BookOpen, ChevronLeft, Sparkles, Target } from "lucide-react";
import { BookReadingExperience } from "@/components/book/book-reading-experience";

export default function BookPage({ book }: { book: any }) {
  const quizRef = useRef<HTMLDivElement | null>(null);

  if (!book) {
    return (
      <div className="py-20 text-center">
        <BookOpen className="w-12 h-12 text-[#c8c5d0] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#070235]">Book Not Found</h2>
        <p className="text-sm text-[#47464f] mt-1">This book may have been moved or removed from the library.</p>
        <Link href="/library" className="mt-4 inline-block text-xs font-bold text-[#fe932c] hover:underline">
          Return to Library
        </Link>
      </div>
    );
  }

  const hasQuizQuestions = Boolean(
    book?.quiz?.questions &&
      Array.isArray(book.quiz.questions) &&
      book.quiz.questions.length > 0
  );

  const scrollToQuiz = () => {
    if (quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="py-4 sm:py-6 px-4 flex flex-col items-center max-w-4xl mx-auto">
      {/* BREADCRUMB NAV */}
      <div className="w-full flex items-center justify-between mb-6">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#47464f] hover:text-[#070235] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#fe932c]" />
          <span>Back to Library</span>
        </Link>
        {book.category && (
          <span className="text-xs font-mono font-bold text-[#070235] bg-[#eaedff] px-2.5 py-1 rounded-md border border-[#c8c5d0]/50">
            {book.category}
          </span>
        )}
      </div>

      {/* BOOK TITLE & METADATA */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#070235] text-left w-full tracking-tight mb-3">
        {book.title}
      </h1>
      
      <div className="flex items-center justify-between w-full text-xs text-[#47464f] pb-6 border-b border-[#c8c5d0]/40 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#fe932c]" />
          <span>Lumora Book</span>
        </div>
        <DateComponent datetime={book.created_at} type="date" />
      </div>

      {/* COVER IMAGE */}
      {book.ImgUrl && (
        <div className="w-full relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-sm border border-[#c8c5d0]/50 bg-slate-100">
          <Image
            src={book.ImgUrl}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* INTEGRATED READING MODES & PASSAGE EXPERIENCE */}
      <div className="w-full mb-8">
        <BookReadingExperience
          passageContent={book.content}
          hasQuiz={hasQuizQuestions}
          onScrollToQuiz={scrollToQuiz}
        />
      </div>

      {/* INTERACTIVE QUIZ / MODULE ONLY IF QUESTIONS ARE AVAILABLE */}
      {hasQuizQuestions && (
        <div
          ref={quizRef}
          className="py-6 w-full max-w-2xl bg-[#faf8ff] rounded-2xl p-6 border border-[#c8c5d0]/60 mb-8 shadow-xs"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#fe932c]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#070235]">
              Interactive Story Quiz
            </h3>
          </div>
          <QuizComponent quiz={book.quiz} />
        </div>
      )}

      {/* ADS BANNER */}
      <div className="my-4 max-w-fit md:hidden">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="9824239573"
        />
      </div>

      <div className="hidden md:block my-4 max-w-fit">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="9763927184"
          style={{ width: "1200px", height: "150px" }}
        />
      </div>

      {/* RELATED READING MISSION CALL TO ACTION */}
      {book.metadata?.courseId && (
        <div className="my-8 w-full bg-[#070235] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-[#fe932c]/30">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#fe932c]" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#fe932c]">
                Practice Reading Mission
              </span>
            </div>
            <h4 className="text-xl font-bold">Deepen Your Comprehension</h4>
            <p className="text-xs text-[#c8c5d0] max-w-md">
              Apply what you read in an interactive reading mission with skill tracking and adaptive learning.
            </p>
          </div>

          <Link
            href={`/courses/${book.metadata.courseId}`}
            scroll={true}
            className="px-6 py-3 rounded-xl bg-[#fe932c] hover:bg-[#d97c1e] text-[#070235] font-bold text-xs uppercase tracking-wider transition-all shadow-sm whitespace-nowrap"
          >
            Start Mission
          </Link>
        </div>
      )}
    </div>
  );
}
