"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/store/userContext";
import { SpanBridge } from "igniteui-react-core";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const QuizComponent = ({ quiz }: { quiz: any }) => {
  const { authUser } = useAuthUserStore();
  const [showSignUpPopup, setShowSignUpPopup] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isselectedAnswerCorrect, setSelectedAnswerCorrect] =
    useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { questions } = quiz;
  const { question, options: answers } = questions[activeQuestion];
  const correctAnswer =
    questions[activeQuestion].options[
      questions[activeQuestion].correctOption[0] - 1
    ].option;

  //   Select and check answer
  const onAnswerSelected = (answer: string, idx: number) => {
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setSelectedAnswerCorrect(true);
    } else {
      setSelectedAnswerCorrect(false);
    }
  };

  // Calculate score and increment to next question
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

  useEffect(() => {
    if (
      authUser &&
      Object.keys(authUser).length === 0 &&
      activeQuestion === 2
    ) {
      setShowSignUpPopup(true);
    }
  }, [authUser, activeQuestion]);

  return (
    <div className="px-2 md:px-5 max-w-2xl mx-auto">
      <div>
        {!showResult ? (
          <div className="quiz-container">
            <h3 className={cn(showSignUpPopup ? "hidden" : "font-semibold")}>
              {questions[activeQuestion].question}
            </h3>
            {showSignUpPopup ? (
              <div className="w-full flex flex-col items-center space-y-2 py-3">
                <p>
                  Like the game so far?{" "}
                  <Link
                    className="font-semiblod text-black underline underline-offset-4"
                    href="/register"
                  >
                    Sign up to save you score.
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
              <div className="w-full flex flex-col text-start space-y-2">
                {answers.map((answer: any, idx: number) => (
                  <button
                    key={idx}
                    disabled={!!selectedAnswerIndex}
                    className={cn(
                      "flex items-center justify-start text-wrap text-start p-2 shadow-sm rounded-sm bg-gray-200 ",
                      !selectedAnswerIndex &&
                        "hover:bg-gradient-to-br hover:scale-[1.03] transition-all duration-100 from-cyan-300 via-blue-400 to-cyan-400",
                      selectedAnswer &&
                        answer.option === correctAnswer &&
                        "bg-[#8cd457]  text-white font-semibold transition-all duration-100 scale-[1.02]",
                      selectedAnswerIndex! - 1 === idx
                        ? isselectedAnswerCorrect
                          ? "bg-[#8cd457] text-white font-semibold"
                          : "bg-red-500 text-white font-semibold animate-wiggle "
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
                    <p className="text-[#8cd457] flex items-center gap-3 text-xl font-semibold pt-3">
                      {" "}
                      <CheckIcon className="w-10 h-10 stroke-[4px]  " /> Correct
                    </p>
                  ) : (
                    <p className="text-red-500 flex items-center gap-3  text-xl font-semibold pt-3  ">
                      {" "}
                      <XIcon className="w-10 h-10 stroke-[4px]  " /> Wrong
                    </p>
                  )}

                  <div className="text-sm md:text-base ">
                    {questions[activeQuestion].reason}
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex items-center justify-center  w-full pt-5">
              {selectedAnswer && (
                <Button
                  onClick={nextQuestion}
                  variant="theme"
                  className="w-full"
                >
                  {activeQuestion === question.length - 1 ? "Finish" : "Next"}
                </Button>
              )}
            </div>

            <span>
              {activeQuestion + 1}
              <span>/{questions.length}</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center ">
            {/* <h3>Overall {(result.score / 25) * 100}%</h3>
            <p>
              Total Questions: <span>{questions.length}</span>
            </p> */}
            <p className="font-bold text-xl">
              Your score:{" "}
              <span className="text-customThemePrimary font-semibold">
                {result.correctAnswers}
              </span>
              / <span>{questions.length}</span>
            </p>

            <Button
              variant="theme"
              className="w-full max-w-xs my-5"
              onClick={handleReset}
            >
              Play Again
            </Button>
            {authUser && Object.keys(authUser).length === 0 && (
              <Link
                href={`/register`}
                className={cn(
                  buttonVariants({ variant: "theme" }),
                  "w-full max-w-xs "
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
