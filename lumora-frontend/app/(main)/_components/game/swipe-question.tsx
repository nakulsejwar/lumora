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
import {
  CardSwipeDirection,
  IsDragOffBoundary,
  Question,
} from "@/types/game.types";
import { useGameDataStore } from "@/lib/hooks/use-game-data";
import { usePathname, useRouter } from "next/navigation";
import useNutrientsStore from "@/lib/hooks/use-nutrients-store";

import { useGameTipModal } from "@/lib/hooks/use-game-tip-modal";
import { GameTipModal } from "@/components/modals/game-tip-modal";
import { useGameStore } from "@/lib/hooks/use-game";
import { sendGTMEvent } from "@next/third-parties/google";
import { useQueryClient } from "@tanstack/react-query";
import GameActionBtn from "../game-action-btn";
import SwipeCard from "./swipe-card";

const SwipeQuestion = ({
  question,
  isDragging,
  setIsDragging,
  cardDrivenProps,
  setCardDrivenProps,
  direction,
  setDirection,
}: {
  question: Question;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  cardDrivenProps: any;
  setCardDrivenProps: React.Dispatch<React.SetStateAction<any>>;
  direction: CardSwipeDirection | "";
  setDirection: React.Dispatch<React.SetStateAction<CardSwipeDirection | "">>;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useUserContext();
  const { game, setGame } = useGameStore();
  const { gamedata, setGameData } = useGameDataStore();
  const gameTipModal = useGameTipModal();
  const pathname = usePathname();
  const updateNutrientsData = useNutrientsStore(
    (state) => state.updateNutrientsData
  );
  const { score } = user;

  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);
  const authUserScores = queryClient.getQueryData(["currentAuthUserScores"]);
  const handleActionBtnOnClick = (btn: CardSwipeDirection) => {
    setDirection(btn);
  };

  // useEffect(() => {
  //   if (["left", "right"].includes(direction)) {
  //     setGameData({
  //       ...gamedata,

  //       questions: gamedata.questions.slice(0, -1),
  //     });
  //     setUser({
  //       score: handleScore({
  //         direction,
  //         score,
  //         cards: gamedata.questions,
  //         updateNutrientsData,
  //       }),
  //       previousScore: score,
  //     });
  //     setDirection("");
  //     setCardDrivenProps({
  //       ...cardDrivenProps,
  //       mainBgColor: themeColors.gameSwipe.neutral,
  //     });
  //   }
  // }, [direction]);

  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeOutExpo,
        delay: gamedata.questions.length === 10 ? 0.5 : 0,
      },
    },
    upcoming: {
      opacity: 0.5,
      y: 67,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: easeOutExpo,
        delay: gamedata.questions.length === 10 ? 0.5 : 0,
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
    <motion.div>
      <div
        id="gameUIWrapper"
        className=" flex flex-col gap-5 md:gap-6 w-full items-center justify-center relative z-10"
      >
        <div
          id="cardsWrapper"
          className="w-full aspect-[80/112] md:aspect-[120/150] lg:aspect-[80/100] max-w-[280px] md:mb-[20px] relative z-10"
        >
          <AnimatePresence>
            <motion.div
              key={`card-`}
              id={`card`}
              className={`relative `}
              variants={cardVariants}
              initial="remainings"
              animate={"current"}
              exit="exit"
            >
              <SwipeCard
                data={question.options[0]}
                id={2}
                setCardDrivenProps={setCardDrivenProps}
                setIsDragging={setIsDragging}
                isDragging={isDragging}
                isLast={false}
                setIsDragOffBoundary={setIsDragOffBoundary}
                setDirection={setDirection}
              />
            </motion.div>
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

export default SwipeQuestion;
