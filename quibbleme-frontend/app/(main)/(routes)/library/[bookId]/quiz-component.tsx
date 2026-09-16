"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const QuizComponent = ({ quiz }: { quiz: any }) => {
  const { authUser } = useAuthUserStore();
  const [showSignUpPopup, setShowSignUpPopup] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isselectedAnswerCorrect, setSelectedAnswerCorrect] = useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  useEffect(() => {
    if (
      authUser &&
      Object.keys(authUser).length === 0 &&
      activeQuestion === 2
    ) {
      setShowSignUpPopup(true);
    }
  }, [authUser, activeQuestion]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const { questions } = quiz;
  const currentQ = questions[activeQuestion];
  if (!currentQ) return null;

  const answers = currentQ.options || [];
  const correctAnswer =
    currentQ.options?.[
      (currentQ.correctOption?.[0] || 1) - 1
    ]?.option;

  const onAnswerSelected = (answer: string, idx: number) => {
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setSelectedAnswerCorrect(true);
    } else {
      setSelectedAnswerCorrect(false);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    setSelectedAnswer(null);
    setResult((prev) =>
      isselectedAnswerCorrect
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setShowResult(false);
    setActiveQuestion(0);
    setSelectedAnswerIndex(null);
    setSelectedAnswer(null);
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
  };


  return (
    <div className="px-2 md:px-5 max-w-2xl mx-auto">
      <div>
        {!showResult ? (
          <div className="quiz-container">
            <h3 className={cn(showSignUpPopup ? "hidden" : "font-semibold")}>
              {currentQ.question}
            </h3>
            {showSignUpPopup ? (
              <div className="w-full flex flex-col items-center space-y-2 py-3">
                <p>
                  Like the game so far?{" "}
                  <Link
                    className="font-semibold text-black underline underline-offset-4"
                    href="/register"
                  >
                    Sign up to save your score.
                  </Link>
                </p>
                <Button
                  className=""
                  variant="theme"
                  onClick={() => setShowSignUpPopup(false)}
                >
                  Continue Playing
                </Button>
              </div>
            ) : (
              <div className="w-full flex flex-col text-start space-y-2 mt-3">
                {answers.map((answer: any, idx: number) => (
                  <button
                    key={idx}
                    disabled={!!selectedAnswerIndex}
                    className={cn(
                      "flex items-center justify-start text-wrap text-start p-3 shadow-xs rounded-xl bg-slate-100 text-[#070235] font-medium border border-slate-200",
                      !selectedAnswerIndex &&
                        "hover:bg-[#070235] hover:text-white transition-all duration-150",
                      selectedAnswer &&
                        answer.option === correctAnswer &&
                        "bg-[#8cd457] text-white font-semibold transition-all border-[#8cd457]",
                      selectedAnswerIndex! - 1 === idx
                        ? isselectedAnswerCorrect
                          ? "bg-[#8cd457] text-white font-semibold"
                          : "bg-red-500 text-white font-semibold animate-wiggle"
                        : ""
                    )}
                    onClick={() => onAnswerSelected(answer.option, idx + 1)}
                  >
                    {answer.option}
                  </button>
                ))}
              </div>
            )}

            <div className=" ">
              {selectedAnswer ? (
                <>
                  {isselectedAnswerCorrect ? (
                    <p className="text-[#8cd457] flex items-center gap-2 text-lg font-bold pt-3">
                      <CheckIcon className="w-6 h-6 stroke-[3px]" /> Correct!
                    </p>
                  ) : (
                    <p className="text-red-500 flex items-center gap-2 text-lg font-bold pt-3">
                      <XIcon className="w-6 h-6 stroke-[3px]" /> Not quite
                    </p>
                  )}

                  <div className="text-sm mt-1 text-[#47464f]">
                    {currentQ.reason}
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-center w-full pt-4">
              {selectedAnswer && (
                <Button
                  onClick={nextQuestion}
                  variant="theme"
                  className="w-full bg-[#070235] text-white hover:bg-[#fe932c] hover:text-[#070235] transition-colors"
                >
                  {activeQuestion === questions.length - 1 ? "Finish" : "Next Question"}
                </Button>
              )}
            </div>

            <div className="text-xs text-[#47464f] mt-3 font-mono font-bold text-center">
              Question {activeQuestion + 1} of {questions.length}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="font-bold text-xl text-[#070235]">
              Your Score:{" "}
              <span className="text-[#fe932c] font-extrabold">
                {result.correctAnswers}
              </span>
              / {questions.length}
            </p>

            <Button
              variant="theme"
              className="w-full max-w-xs my-5 bg-[#070235] text-white"
              onClick={handleReset}
            >
              Try Again
            </Button>
            {authUser && Object.keys(authUser).length === 0 && (
              <Link
                href={`/register`}
                className={cn(
                  buttonVariants({ variant: "theme" }),
                  "w-full max-w-xs"
                )}
              >
                Sign up
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
