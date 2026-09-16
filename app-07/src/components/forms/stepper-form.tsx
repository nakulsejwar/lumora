"use client";

import React from "react";
import { cn } from "@/lib/utils";
import CourseCreationForm from "./course-creation-form";
import { Button } from "../ui/button";
import { ArrowLeft, Sparkles, FileText, Layers, BookOpen, Compass, ArrowRight } from "lucide-react";
import BulkCourseCreationForm from "./bulk-course-creation-form";
import { CreateBlogForm } from "./create-blog-form";
import CreateCourseFromTextForm from "./create-course-from-text-form";

const cardOptions = [
  {
    id: 1,
    title: "Create a Course from Scratch",
    description:
      "Build a structured interactive reading course from the ground up. Define topics, modules, and game scenarios.",
    icon: Sparkles,
    badgeBg: "bg-[#fe932c]/15",
    iconColor: "text-[#904d00]",
  },
  {
    id: 2,
    title: "Transform Article or Book Content",
    description:
      "Import text from articles or books to automatically extract key concepts and construct engaging modules.",
    icon: FileText,
    badgeBg: "bg-[#0091cf]/15",
    iconColor: "text-[#0091cf]",
  },
  {
    id: 3,
    title: "Queue Bulk Course Creation",
    description:
      "Batch process and create multiple course outlines with games in parallel for rapid content creation.",
    icon: Layers,
    badgeBg: "bg-[#059669]/15",
    iconColor: "text-[#059669]",
  },
  {
    id: 4,
    title: "Publish Library Book",
    description: "Write and format rich digital books and story passages with embedded quizzes.",
    icon: BookOpen,
    badgeBg: "bg-[#a166ab]/15",
    iconColor: "text-[#a166ab]",
  },
];

export default function CreateSingleCourseForm() {
  const [chosenOption, setChosenOption] = React.useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {!chosenOption && (
        <div>
          {/* Header Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070235] text-[#89ceff] text-xs font-mono font-extrabold uppercase tracking-widest shadow-xs mb-3 border border-[#0091cf]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#fe932c]" />
              <span>AI COURSE STUDIO • STORY GAME CREATOR</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#070235]">
              CREATE & SOLVE THE STORY<span className="text-[#fe932c]">.</span>
            </h1>
            <p className="mt-2 text-sm text-[#47464f] max-w-lg mx-auto font-medium">
              Select how you would like to construct your next course or story-driven mystery:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cardOptions.map((cardContent) => (
              <div
                key={cardContent.id}
                className="cursor-pointer"
                onClick={() => setChosenOption(cardContent.id)}
              >
                <OptionCard cardContent={cardContent} />
              </div>
            ))}
          </div>
        </div>
      )}

      {chosenOption && (
        <div className="mb-6">
          <Button
            variant="outline"
            className="mb-6 border-[#c8c5d0]/70 text-[#070235]"
            onClick={() => setChosenOption(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2 text-[#fe932c]" /> Back to Options
          </Button>

          {chosenOption === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c8c5d0]/70 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#c8c5d0]/50">
                <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-[#fe932c]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#070235]">Create Course from Scratch</h2>
                  <p className="text-xs text-[#47464f]">Define topic and module count to generate a complete course.</p>
                </div>
              </div>
              <CourseCreationForm path="/create-course" />
            </div>
          )}

          {chosenOption === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c8c5d0]/70 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#c8c5d0]/50">
                <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white">
                  <FileText className="w-5 h-5 text-[#0091cf]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#070235]">Transform Article or Book</h2>
                  <p className="text-xs text-[#47464f]">Paste text to convert story content into structured learning.</p>
                </div>
              </div>
              <CreateCourseFromTextForm path="/create-course" />
            </div>
          )}

          {chosenOption === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c8c5d0]/70 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#c8c5d0]/50">
                <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white">
                  <Layers className="w-5 h-5 text-[#059669]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#070235]">Create Bulk Courses</h2>
                  <p className="text-xs text-[#47464f]">Queue multiple courses for parallel generation.</p>
                </div>
              </div>
              <BulkCourseCreationForm />
            </div>
          )}

          {chosenOption === 4 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c8c5d0]/70 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#c8c5d0]/50">
                <div className="w-10 h-10 rounded-xl bg-[#070235] flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5 text-[#a166ab]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#070235]">Create Blog</h2>
                  <p className="text-xs text-[#47464f]">Publish educational articles and blog updates.</p>
                </div>
              </div>
              <CreateBlogForm />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

//======================================
export const OptionCard = ({ cardContent }: { cardContent: any }) => {
  const CardIcon = cardContent.icon || Sparkles;

  return (
    <div className="h-full bg-white p-6 rounded-2xl border border-[#c8c5d0]/60 shadow-sm hover:shadow-md hover:border-[#0091cf]/50 hover:scale-[1.01] transition-all group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", cardContent.badgeBg)}>
            <CardIcon className={cn("w-5 h-5", cardContent.iconColor)} />
          </div>
          <ArrowRight className="w-4 h-4 text-[#c8c5d0] group-hover:text-[#070235] group-hover:translate-x-0.5 transition-all" />
        </div>
        <h3 className="text-base font-extrabold text-[#070235] mb-1.5 group-hover:text-[#0091cf] transition-colors">
          {cardContent.title}
        </h3>
        <p className="text-xs text-[#47464f] leading-relaxed font-normal">
          {cardContent.description}
        </p>
      </div>
    </div>
  );
};

