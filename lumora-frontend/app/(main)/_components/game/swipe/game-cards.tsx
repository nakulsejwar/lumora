/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

import { useUserContext } from "@/store/userContext";
import { themeColors } from "@/lib/theme";
import { user as initialUser } from "@/app/api/user.api";
import { easeOutExpo } from "@/lib/easings.data";
import { CardSwipeDirection, IsDragOffBoundary } from "@/types/game.types";
import GameActionBtn from "../../game-action-btn";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { usePathname, useRouter } from "next/navigation";
import useNutrientsStore from "@/lib/hooks/use-nutrients-store";

import { useGameTipModal } from "@/lib/hooks/use-game-tip-modal";
import { GameTipModal } from "@/components/modals/game-tip-modal";
import { useGameStore } from "@/lib/hooks/use-game";
import { sendGTMEvent } from "@next/third-parties/google";
import { useQueryClient } from "@tanstack/react-query";
import GameCard from "./game-card";
import { Button } from "@/components/ui/button";
import { handleScore } from "@/lib/handleScore";
import { useCourseIdStore } from "@/lib/hooks/use-courseid";

const initialDrivenProps = {
  cardWrapperX: 0,
  buttonScaleBadAnswer: 1,
  buttonScaleGoodAnswer: 1,
  mainBgColor: themeColors.gameSwipe.neutral,
};

const GameCards = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useUserContext();
  const { game, setGame } = useGameStore();
  const { courseId } = useCourseIdStore();
  const { gamedata, updatedGameData, setGameData, setUpdatedGameData } =
    useGameDataStore();
  const gameTipModal = useGameTipModal();
  const pathname = usePathname();
  const updateNutrientsData = useNutrientsStore(
    (state) => state.updateNutrientsData
  );
  const clearStorage = useNutrientsStore((state) => state.clearLocalStorage);
  const { score } = user;
  const { questions: cards } = updatedGameData;

  const [direction, setDirection] = useState<CardSwipeDirection | "">("");
  const [swipeDirection, setSwipeDirection] = useState<CardSwipeDirection | "">(
    ""
  );
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);
  const [isDragging, setIsDragging] = useState(false);
  const authUserScores = queryClient.getQueryData(["currentAuthUserScores"]);
  const handleActionBtnOnClick = (btn: CardSwipeDirection) => {
    setDirection(btn);
  };

  useEffect(() => {
    if (["left", "right"].includes(direction)) {
      setUpdatedGameData({
        ...updatedGameData,
        questions: updatedGameData.questions.slice(0, -1),
      });
      setUser({
        score: handleScore({
          direction,
          score,
          type: "swipe",
          question:
            updatedGameData.questions[updatedGameData.questions.length - 1],
          updateNutrientsData,
        }),
        previousScore: score,
      });
      setDirection("");
    }
  }, [direction]);

  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeOutExpo,
        delay: cards.length === 10 ? 0.5 : 0,
      },
    },
    upcoming: {
      opacity: 0.5,
      y: 67,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: easeOutExpo,
        delay: cards.length === 10 ? 0.5 : 0,
      },
    },
    remainings: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    exit: {
      opacity: 0,
      x: direction === "left" ? -300 : 300,
      y: 40,
      rotate: direction === "left" ? -20 : 20,
      transition: { duration: 0.5, ease: easeOutExpo },
    },
  };

  return (
    <motion.div
      className={`flex p-5 min-h-screen h-full flex-col justify-center items-center overflow-hidden  ${
        isDragging ? "cursor-grabbing" : ""
      }`}
      style={{ backgroundColor: cardDrivenProps.mainBgColor }}
    >
      <button
        // href="/courses"
        id="close"
        onClick={() => {
          setUser(initialUser);
          clearStorage();
          router.push(courseId ? `/courses/${courseId}` : `/courses`);
        }}
        className="absolute top-[12px] right-[12px] w-[30px] h-auto z-50"
      >
        <X className="text-blue-600/60 w-full h-full" />
      </button>

      <div
        id="gameUIWrapper"
        className=" flex flex-col gap-5 md:gap-6 w-full items-center justify-center relative z-10 "
      >
        <h2 className="relative text-3xl text-center mb-10  ">
          <motion.button
            onClick={() => {
              gameTipModal.onOpen();
              sendGTMEvent({
                event: "game_tip_click",
                gameId: game.GameId,
                gameTitle: game.Title,
              });
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: 0 }}
            className=" "
          >
            {cards[0].question}
          </motion.button>{" "}
        </h2>
        <div
          id="cardsWrapper"
          className="w-full aspect-[80/112] md:aspect-[120/150] lg:aspect-[80/100] max-w-[280px] md:mb-[20px] relative z-10 "
        >
          <AnimatePresence onExitComplete={() => setDirection("")}>
            {cards &&
              cards.map((card, i) => {
                const isLast = i === cards.length - 1;
                const isUpcoming = i === cards.length - 2;
                return (
                  <motion.div
                    key={`card-${i}`}
                    id={`card-${card.id}`}
                    className={`relative bg-red-100`}
                    variants={cardVariants}
                    initial="remainings"
                    animate={
                      isLast
                        ? "current"
                        : isUpcoming
                        ? "upcoming"
                        : "remainings"
                    }
                    exit="exit"
                  >
                    <GameCard
                      data={card}
                      id={gamedata.questions.length - i}
                      setCardDrivenProps={setCardDrivenProps}
                      setIsDragging={setIsDragging}
                      isDragging={isDragging}
                      isLast={isLast}
                      setIsDragOffBoundary={setIsDragOffBoundary}
                      setDirection={setDirection}
                    />
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          id="actions"
          className="flex items-center justify-between w-full max-w-[280px] pt-2 md:mt-0 relative z-10"
        >
          <GameActionBtn
            direction="left"
            ariaLabel="swipe left"
            scale={cardDrivenProps.buttonScaleBadAnswer}
            isDragOffBoundary={isDragOffBoundary}
            onClick={() => handleActionBtnOnClick("left")}
          />
          <GameActionBtn
            direction="right"
            ariaLabel="swipe right"
            scale={cardDrivenProps.buttonScaleGoodAnswer}
            isDragOffBoundary={isDragOffBoundary}
            onClick={() => handleActionBtnOnClick("right")}
          />
        </motion.div>
      </div>

      <GameTipModal />
    </motion.div>
  );
};

export default GameCards;
