"use client";
import React from "react";
import { useGameStore } from "@/lib/hooks/use-game";
import { useGameDataStore } from "@/lib/hooks/use-game-data";

import { user as initialUser } from "@/app/api/user.api";
import { Progress } from "@/components/ui/progress";
import { motion, MotionValue } from "framer-motion";
import QuestionWrapper from "./question-wrapper";
import { themeColors } from "@/lib/theme";
import { useGameTipModal } from "@/lib/hooks/use-game-tip-modal";
import { sendGTMEvent } from "@next/third-parties/google";
import Link from "next/link";
import { X } from "lucide-react";
import { useUserContext } from "@/store/userContext";
import { CardSwipeDirection } from "@/types/game.types";
import useNutrientsStore from "@/lib/hooks/use-nutrients-store";
import { useLoadingModal } from "@/lib/hooks/use-loading-modal";
import { GameTipModal } from "@/components/modals/game-tip-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { handleScore } from "@/lib/handleScore";
import { useQuestionTipModal } from "@/lib/hooks/use-question-tip-modal";
import { QuestionTipModal } from "@/components/modals/question-tip-modal";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";
import AdBanner from "@/components/google-ads-banner";
import { useAuthUserStore } from "@/lib/hooks/use-auth-user";
import { recordQuestionAnswer } from "@/actions/record-question-answer";
import ReasoningPrompt from "./reasoning-prompt";
import { NarrativeHeader } from "./narrative/narrative-header";
import { ClueInterstitial } from "./narrative/clue-interstitial";

type Props = {
  gameData: any;
};

const initialDrivenProps = {
  cardWrapperX: 0,
  buttonScaleBadAnswer: 1,
  buttonScaleGoodAnswer: 1,
  mainBgColor: themeColors.gameSwipe.neutral,
};

const GameScreen = () => {
  const router = useRouter();
  const [user, setUser] = useUserContext();
  const { game, setGame } = useGameStore();
  const { authUser } = useAuthUserStore();
  const { courseId } = useCourseIdStore();
  const { gamedata, updatedGameData, setUpdatedGameData } = useGameDataStore();
  const loadingModal = useLoadingModal();
  const clearStorage = useNutrientsStore((state) => state.clearLocalStorage);
  const questionTipModal = useQuestionTipModal();
  const updateNutrientsData = useNutrientsStore(
    (state) => state.updateNutrientsData
  );

  const [selectedOptions, setSelectedOptions] = React.useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = React.useState(0);

  const [direction, setDirection] = React.useState<CardSwipeDirection | "">("");
  const [cardDrivenProps, setCardDrivenProps] =
    React.useState(initialDrivenProps);
  const [isDragging, setIsDragging] = React.useState(false);

  const [showClueInterstitial, setShowClueInterstitial] = React.useState(false);
  const [lastCompletedClue, setLastCompletedClue] = React.useState<number>(0);
  const [lastCompletedSkill, setLastCompletedSkill] = React.useState<string | undefined>(undefined);

  const currentQuestion = React.useMemo(() => {
    loadingModal.onOpen();
    const question = gamedata?.questions?.[questionIndex];
    setTimeout(() => {
      loadingModal.onClose();
    }, 500);
    return question;
    //eslint-disable-next-line
  }, [questionIndex, gamedata]);

  const [reasoningPromptedTiles, setReasoningPromptedTiles] = React.useState<
    Set<string>
  >(new Set());
  const [showReasoningPrompt, setShowReasoningPrompt] = React.useState(false);

  const finishProceedToNext = () => {
    // Phase 2 (measurement): fire-and-forget per-question tracking. Uses the
    // existing score calculation's own inputs (currentQuestion, selectedOptions)
    // so this never changes what handleScore already does -- it's a parallel,
    // best-effort read of the same answer, not a replacement for it. Never
    // awaited: a slow/failed mastery call must not delay the question
    // transition the learner is already looking at.
    if (currentQuestion?.tileid && authUser?.user_id && game?.GameId) {
      recordQuestionAnswer({
        userId: authUser.user_id,
        gameId: game.GameId,
        tileId: currentQuestion.tileid,
        selectedOptions,
      }).catch((err) => console.error("recordQuestionAnswer call failed:", err));
    }

    setUpdatedGameData({
      ...updatedGameData,

      questions: updatedGameData.questions.slice(0, -1),
    });
    setUser({
      score: handleScore({
        direction,
        score: user.score,
        type: currentQuestion.type,
        selectedOptions,
        question: currentQuestion,
        updateNutrientsData,
      }),
      previousScore: user.score,
    });
    setCardDrivenProps({
      ...cardDrivenProps,
      mainBgColor: themeColors.gameSwipe.neutral,
    });
    setDirection("");
    setSelectedOptions([]);

    if (questionIndex === gamedata?.questions?.length - 1) {
      return;
    }
    setQuestionIndex((questionIndex) => questionIndex + 1);

    //eslint-disable-next-line
  };

  const handleOpenClue = () => {
    setLastCompletedClue(questionIndex + 1);
    setLastCompletedSkill(currentQuestion?.skill_tag ?? undefined);
    setShowClueInterstitial(true);
  };

  const proceedToNext = () => {
    finishProceedToNext();
  };

  const handleClueInterstitialContinue = () => {
    setShowClueInterstitial(false);
  };

  // Stretch feature: "Why do you think so?" gate. Only intercepts the
  // has_reasoning_prompt (1-2 per lesson, set server-side) -- everything
  // else calls proceedToNext exactly as before, unchanged. QuestionWrapper
  // still only ever calls a single `handleNext` prop, so the question
  // engine itself needed zero changes.
  const handleNext = () => {
    finishProceedToNext();
  };

  const handleOptionChange = (option: number, isMultiCorrect: boolean) => {
    if (isMultiCorrect) {
      // If multiple correct options are allowed, toggle the selection
      setSelectedOptions((prevSelectedOptions) => {
        if (prevSelectedOptions.includes(option)) {
          return prevSelectedOptions.filter(
            (selectedOption) => selectedOption !== option
          );
        } else {
          return [...prevSelectedOptions, option];
        }
      });
    } else {
      // For single correct option, replace the selection with the new option
      setSelectedOptions([option]);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  const isNarrativeMission = !!game?.passage_text;

  return (
    <>
      {showClueInterstitial && (
        <ClueInterstitial
          clueNumber={lastCompletedClue}
          totalClues={gamedata?.questions?.length || 1}
          question={currentQuestion}
          skillTag={lastCompletedSkill}
          onContinue={handleClueInterstitialContinue}
        />
      )}

      {isNarrativeMission && (
        <NarrativeHeader
          missionTitle={game.Title || game.Name || "Reading Detective Mission"}
          currentClue={questionIndex + 1}
          totalClues={gamedata?.questions?.length || 1}
          targetSkill={game.target_skill ?? undefined}
          currentSkillTag={currentQuestion?.skill_tag ?? undefined}
          passageText={game?.passage_text || ""}
          onOpenClue={handleOpenClue}
        />
      )}

    <div
      className={`gap-5 w-full max-w-5xl mx-auto mt-2 
        rounded-2xl p-6 bg-white 
        border border-transparent bg-clip-padding relative shadow-2xl

        /* Main animated gradient border */
        before:absolute before:inset-0 before:rounded-2xl
        before:p-[3px] before:bg-gradient-to-r 
        before:from-blue-600 before:via-cyan-400 before:to-cyan-500
        before:bg-[length:200%_200%]
        before:animate-[gradientFlow_4s_linear_infinite]
        before:-z-10

        /* Outer glow layer */
        after:absolute after:inset-0 after:rounded-2xl
        after:blur-xl after:bg-gradient-to-r
        after:from-blue-600/40 after:via-cyan-400/40 after:to-cyan-500/40
        after:-z-20 after:opacity-60
        after:animate-[pulse_3s_ease-in-out_infinite]

        ${isDragging ? "cursor-grabbing" : ""}
      `}

      style={{
        backgroundColor:
          currentQuestion.type === "swipe" ? cardDrivenProps?.mainBgColor : "",
      }}
    >
      <button
        // href="/courses"
        id="close"
        onClick={() => {
          setUser(initialUser);
          clearStorage();
          router.push(courseId ? `/courses/${courseId}` : `/courses`);
        }}
        className="absolute top-[12px] right-[12px] w-[30px] h-auto z-50 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="text-gray-500 hover:text-gray-900 w-full h-full" />
      </button>
      <div className="flex flex-row justify-center mb-4">
        <h2 className="flex flex-col items-center text-lg md:text-2xl font-bold text-gray-900">
          {/* topic */}
          <motion.button
            onClick={() => {
              if (game.inGameTip === "None") {
                return;
              }
              questionTipModal.onOpen(currentQuestion.tileid!);
              sendGTMEvent({
                event: "game_tip_click",
                gameId: game.GameId,
                gameTitle: game.Title,
              });
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: 0 }}
          >
            {currentQuestion?.question}
          </motion.button>
        </h2>
      </div>

      <div
        id="metrics"
        className=" w-full max-w-80 mx-auto -top-10 md:-top-10 flex  items-center gap-2 justify-between "
      >
        <div className="flex items-end text-gray-500 font-semibold">
          <span className="text-xl  leading-none">{questionIndex + 1}</span>
          <span className="flex text-xs  ml-1">
            /<span className="ml-[2px]"> {gamedata?.questions?.length}</span>
          </span>
        </div>
        <Progress value={((questionIndex + 1) / (gamedata?.questions?.length || 1)) * 100} className="shadow-sm" />
        <div id="score" className="flex relative">
          <div className="text-xl font-bold text-gray-500 leading-none relative">
            <motion.div
              id="scoreValue"
              className="relative text-emerald-600 font-extrabold"
              // variants={scoreVariants}
              initial="initial"
              // animate={isLast && hasScoreIncreased ? "pop" : "initial"}
              transition={{
                stiffness: 2000,
                damping: 5,
              }}
            >
              {user.score}
            </motion.div>
            {/* {isLast && hasScoreIncreased && (
              <div
                id="sparks"
                className="absolute w-[100px] h-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2]"
              >
                <Player
                  autoplay
                  src={lottieJson}
                  style={{ width: "100%", height: "100%" }}
                  speed={2}
                ></Player>
              </div>
            )} */}
          </div>
          {/* <SvgIconScoreLeaf className="w-[30px] h-auto relative top-[-3px]" /> */}
        </div>
      </div>
      <QuestionWrapper
        question={currentQuestion}
        handleNext={handleNext}
        selectedOptions={selectedOptions}
        handleOptionChange={handleOptionChange}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        cardDrivenProps={cardDrivenProps}
        setCardDrivenProps={setCardDrivenProps}
        direction={direction}
        setDirection={setDirection}
        userId={authUser?.user_id}
        gameId={game?.GameId}
      />

      <div className="mt-10 ">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="9824239573"
        />
      </div>

      {/* <div className="hidden md:block mt-10 max-w-fit">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="9763927184"
          style={{ width: "1200px", height: "150px" }}
        />
      </div> */}

      <QuestionTipModal />
    </div>
    </>
  );
};

export default GameScreen;
