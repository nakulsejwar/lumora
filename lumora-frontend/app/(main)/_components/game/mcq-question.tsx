import { Question } from "@/types/game.types";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  question: Question;
  handleNext: () => void;
  selectedOptions: number[];
  handleOptionChange: (option: number, isMultiCorrect: boolean) => void;
};

export default function McqQuestion({
  question,
  handleNext,
  selectedOptions,
  handleOptionChange,
}: Props) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto",
        question.options[0].image && question.options[0].image !== "None"
          ? "grid grid-cols-2 md:grid-cols-4 place-content-center place-items-center gap-4"
          : "flex flex-col items-center gap-3.5"
      )}
    >
      {question.options
        .filter((option) => option.option !== "None" && option.option !== "")
        .map((option, index) => {
          const isSelected = selectedOptions.includes(index + 1);
          return (
            <div
              key={`${option.option}${index}`}
              className="w-full cursor-pointer transition-all duration-200"
              onClick={() =>
                handleOptionChange(index + 1, question.isMultiCorrect)
              }
            >
              <motion.div
                id={`cardDrivenWrapper-${index}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full rounded-2xl p-4 sm:p-5 flex items-center justify-between text-left transition-all shadow-sm select-none border",
                  isSelected
                    ? "bg-[#eaedff] border-2 border-[#fe932c] shadow-md"
                    : "bg-white border-[#c8c5d0]/60 hover:border-[#070235]/40 hover:bg-[#faf8ff]"
                )}
              >
                {option.image && option.image !== "None" && (
                  <div id="illustration" className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 mr-4">
                    <Image
                      priority
                      className="w-full h-full object-cover rounded-xl border border-[#c8c5d0]"
                      src={
                        option.image === "None"
                          ? "/images/image-not-found.jpg"
                          : option.image
                      }
                      width={200}
                      height={200}
                      alt=""
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors",
                      isSelected
                        ? "bg-[#fe932c] text-[#070235] border-[#fe932c]"
                        : "bg-[#eaedff] text-[#070235] border-[#c8c5d0]"
                    )}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#070235]" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <p
                    id="affirmation"
                    className="text-base sm:text-lg font-medium text-[#131b2e] leading-snug"
                  >
                    {option.option}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      {question.isMultiCorrect && (
        <p className="text-xs font-mono text-[#47464f] mt-1 italic">
          ( Select all correct evidence statements )
        </p>
      )}
    </div>
  );
}

