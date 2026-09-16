"use client";
import React, { useEffect, useState } from "react";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardSwipeDirection,
  IsDragOffBoundary,
  Question,
} from "@/types/game.types";
import McqQuestion from "./mcq-question";
import SwipeQuestion from "./swipe-question";
import { showValidationToast } from "@/lib/hooks/use-validation-toast";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { isReasoningQuestion } from "@/lib/clue-helper";
import ReasoningPrompt from "./reasoning-prompt";

const QuestionWrapper = ({
  question,
  handleNext,
  selectedOptions,
  handleOptionChange,
  isDragging,
  setIsDragging,
  cardDrivenProps,
  setCardDrivenProps,
  direction,
  setDirection,
  userId,
  gameId,
}: {
  question: Question;
  handleNext: () => void;
  selectedOptions: number[];
  handleOptionChange: (option: number, isMultiCorrect: boolean) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  cardDrivenProps: any;
  setCardDrivenProps: React.Dispatch<React.SetStateAction<any>>;
  direction: CardSwipeDirection | "";
  setDirection: React.Dispatch<React.SetStateAction<CardSwipeDirection | "">>;
  userId?: string;
  gameId?: string;
}) => {
  const { updatedGameData } = useGameDataStore();
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);

  useEffect(() => {
    if (["left", "right"].includes(direction)) {
      handleNext();
    }

    //eslint-disable-next-line
  }, [direction]);

  const tileId = question.tileid || question.qid || "";

  return (
    <div className="gap-5 w-full max-w-4xl mx-auto mt-6">
      {question.type.toLowerCase() === "mcq" ? (
        <McqQuestion
          handleNext={handleNext}
          selectedOptions={selectedOptions}
          handleOptionChange={handleOptionChange}
          question={question}
        />
      ) : (
        <SwipeQuestion
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          cardDrivenProps={cardDrivenProps}
          setCardDrivenProps={setCardDrivenProps}
          question={question}
          direction={direction}
          setDirection={setDirection}
        />
      )}

      {question.type.toLowerCase() === "mcq" &&
        selectedOptions.length > 0 &&
        isReasoningQuestion(question) &&
        gameId && (
          <ReasoningPrompt
            userId={userId}
            gameId={gameId}
            tileId={tileId}
            question={question}
          />
        )}

      <div className="flex items-center justify-center w-full mt-6">
        {question.type.toLowerCase() === "mcq" && (
          <Button
            variant="theme"
            className="px-8 py-6 text-base font-bold rounded-xl  hover:bg-[#1e1b4b] text-white shadow-lg border border-[#89ceff]/30 transition-all flex items-center gap-2"
            size="lg"
            onClick={() => {
              if (selectedOptions.length === 0) {
                showValidationToast(
                  "warning",
                  "Choose an answer",
                  "Select one option before continuing."
                );
              } else {
                handleNext();
              }
            }}
          >
            <span>{updatedGameData?.questions?.length === 1 ? "Submit Evidence" : "Continue Investigation"}</span>
            <ChevronRight className="w-5 h-5 text-[#fe932c]" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionWrapper;

